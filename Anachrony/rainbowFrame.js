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
