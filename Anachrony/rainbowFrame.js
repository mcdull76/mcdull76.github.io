/*
    Rainframe

    Tint the sprite from Red to Blue and then Blue to Red

    v.1.0: Chnage the effect: White to Red in 1s, then Red to White in 0.5s

*/

class RainbowFrame extends PIXI.Sprite {
    constructor(texture, pos) {

        super(texture);

        this.x = pos.x;
        this.y = pos.y;

        this.visible = true;

        this.hCounter = 0; //hue counter
        this.hMax = 360;

        this.sCounter = 0; //saturation counter
        this.sMax = 1;

        this.settings = {};

        this.rainbowEffect = () => {
            this.delta = 0.5;

            if( this.hCounter < this.hMax ) {
                this.hCounter += delta;
            } else {
                this.hCounter = 0;
            }

            let colorArray = hsvToRGB2( this.hCounter, 1, 1);
            let color = colorArray[0] * 65536 + colorArray[1] * 256 + colorArray[2];
            this.tint = color;
        }

    }

    attentionOn() {
        this.delta = 1 / (global_steps *2);
        automa.ticker.add(this.rainbowEffect);

    }

    attentionOff() {
        automa.ticker.remove(this.rainbowEffect);
        this.tint = 0xFFFFFF;
        this.sCounter = 0;
    }

    attention( value ) {
        if( value ) {
            this.attentionOn();
        } else {
            this.attentionOff();
        }
    }

}

class WhiteRedRainbowFrame extends RainbowFrame {
    constructor( texture, pos ) {
        super(texture, pos);

        this.rainbowEffect = () => {
            if( this.sCounter >= this.sMax && this.delta > 0 ) {
                this.delta = -1 / global_steps;
            } else if ( this.sCounter < 0 && this.delta < 0 ) {
                this.delta = 1 / (global_steps * 2);
            }

            this.sCounter += this.delta;

            let colorArray = hsvToRGB2( 0, this.sCounter, 1);
            let color = colorArray[0] * 65536 + colorArray[1] * 256 + colorArray[2];
            this.tint = color;        
        }
    }

}


/*
    tint the sprite from RGBsource to RBGtarget, then RGBtarget to RGBsource...loop forever
*/
class colorChangingSpirit extends PIXI.Sprite {
    constructor(texture, pos, rgbSource, rgbTarget, steps) {

        super(texture);

        this.position = pos;
        this.visible = true;

        this.steps = steps;
        this.stepCount = 0;

        this.sourceRGB = rgbSource;
        this.sourceHSL = rgbToHsl( rgbSource[0], rgbSource[1], rgbSource[2] );

        this.hslDelta = this.getHslDelta( rgbSource, rgbTarget);

        this.tint = this.toSpriteColor( rgbSource );

        this.delta = Math.PI / steps;

        this.on( "pointerover", this.attentionOn );
        this.on( "pointerout", this.attentionOff );

        this.colorChange = () => {
            this.stepCount += 1;
            if( this.stepCount > this.steps ) {
                this.stepCount = 0;
            }

            let h = this.sourceHSL[0] + this.hslDelta[0] * Math.sin( this.delta * this.stepCount );
            let s = this.sourceHSL[1] + this.hslDelta[1] * Math.sin( this.delta * this.stepCount );
            let l = this.sourceHSL[2] + this.hslDelta[2] * Math.sin( this.delta * this.stepCount );
            this.tint = this.toSpriteColor( hslToRgb( h, s, l ) );
        }

    }

    attentionOn() {
        this.stepCount = 0;
        automa.ticker.add( this.colorChange );

    }

    attentionOff() {
        automa.ticker.remove( this.colorChange );
        this.tint = this.toSpriteColor( this.sourceRGB );
    }


    toSpriteColor( rgb ) {
        return Math.round(rgb[0]) * 65536 + Math.round(rgb[1]) * 256 + Math.round(rgb[2]);
    }

    getHslDelta( RGBsource, RGBtarget ) {
        const sourceHSL = rgbToHsl( RGBsource[0], RGBsource[1], RGBsource[2] );
        const targetHSL = rgbToHsl( RGBtarget[0], RGBtarget[1], RGBtarget[2] );

        const HslDelta = [];
        for( let i = 0; i < sourceHSL.length; i++ ) {
            HslDelta.push( targetHSL[i] - sourceHSL[i] );
        }
        return HslDelta;
    }

}


function hsvToRGB2(hue, saturation, value) {
    var hi;
    var f;
    var p;
    var q;
    var t;

    while (hue < 0) {
    hue += 360;
    }
    hue = hue % 360;

    saturation = saturation < 0 ? 0
    : saturation > 1 ? 1
    : saturation;

    value = value < 0 ? 0
    : value > 1 ? 1
    : value;

    value *= 255;
    hi = (hue / 60 | 0) % 6;
    f = hue / 60 - hi;
    p = value * (1 -           saturation) | 0;
    q = value * (1 -      f  * saturation) | 0;
    t = value * (1 - (1 - f) * saturation) | 0;
    value |= 0;

    switch (hi) {
    case 0:
      return [value, t, p];
    case 1:
      return [q, value, p];
    case 2:
      return [p, value, t];
    case 3:
      return [p, q, value];
    case 4:
      return [t, p, value];
    case 5:
      return [value, p, q];
    }
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, l ];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r * 255, g * 255, b * 255 ];
}
