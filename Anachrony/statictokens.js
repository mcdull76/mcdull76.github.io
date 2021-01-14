class StaticToken extends PIXI.Sprite {

    constructor(texture, icon, name, pos, status, counter, limit) {
        super(texture);

        this.limit = limit;

        this.icon = icon;

        this.name = name;
        this.x = pos.x;
        this.y = pos.y;
        this.counter = counter;
        this.number = status;
        this.interactive = false;
        if (this.number === 0) this.alpha=0;
        this.targetAlpha = 0;
        this.delta = 0;

        this.text = new PIXI.Text(this.number.toString(),{fontFamily : 'Arial',stroke: 'black', strokeThickness:5, fontSize: 32, fontWeight : 'bolder', fill : 0xffffff, align : 'center'});
        this.text.anchor = {x:.5, y:.5};
        //this.text.visible = counter;


        this.addChild(this.text);

        this.on('pointerdown',this.add);

        this.tokenChanger = () => {
            this.alpha += this.delta;
            if (Math.abs(this.targetAlpha - this.alpha) < Math.abs(this.delta)) {
                this.alpha = this.targetAlpha;
                automa.ticker.remove(this.tokenChanger);
            }
        }

        this.getAttention = () => {
            if( this.icon.scale.x >= 2.2 && this.delta > 0) {
                this.delta = -0.05;
            } else if( this.icon.scale.x < 1.2 && this.delta <= 0) {
                this.delta = 0.01;
            }
            this.icon.scale.set( this.icon.scale.x + this.delta );
        }
    }

    attentionOn() {
        this.icon.scale.set(1.2);
        this.delta = 0.01;
        automa.ticker.add(this.getAttention);
        this.icon.visible = true;
    }

    attentionOff() {
        automa.ticker.remove(this.getAttention);
        this.icon.visible = false;
    }

    toogle() {
        if (this.number === 0) {
            this.targetAlpha = 0;
            this.delta = -1/global_steps;
        } else {
            this.targetAlpha = 1;
            this.delta = 1/global_steps;
        }
        automa.ticker.add(this.tokenChanger);
    }

    add() {
        if (this.number !== this.limit)  this.set(this.number +1);
    }

    remove() {
        if (this.number > 0) this.set(this.number-1);
    }

   set(value) {
        if ( this.number*value===0 && this.number!==value)
        {
            this.number = value;
            this.toogle();
        }
        else this.number = value;
        this.text.visible = (this.number > 0) && this.counter;
        this.text.text=this.number.toString();
    }

}


class WorkerToken extends StaticToken {

    constructor(texture, name, pos, status) {
        super(texture, 0, name, pos,status, true, 25);

        this.text.x = 40;
        this.text.y = 95;

        this.tokenChanger = () => {
            this.alpha += this.delta;
            if (Math.abs(this.targetAlpha - this.alpha) < Math.abs(this.delta)) {
                this.alpha = this.targetAlpha;
                automa.ticker.remove(this.tokenChanger);
                Board.prototype.validateWorkers();
            }
        }
    }

    set(value){
        StaticToken.prototype.set.call(this,value);
        Board.prototype.checkIfReady(this);
    }
}

class ResourceToken extends StaticToken {

    constructor(texture, name, pos, status) {
        super(texture, 0, name, pos, status, true, 25);

        this.text.x = 26;
        this.text.y = 67;

        this.tokenChanger = () => {
            this.alpha += this.delta;
            if (Math.abs(this.targetAlpha - this.alpha) < Math.abs(this.delta)) {
                this.alpha = this.targetAlpha;
                automa.ticker.remove(this.tokenChanger);
                Board.prototype.validateResources();
            }
        }
   }

    set(value){
        StaticToken.prototype.set.call(this,value);
        Board.prototype.checkIfReady(this);
    }

}

class ParadoxToken extends StaticToken {

    constructor(texture, pos, status) {
        super(texture, 0, "Paradox", pos, status, false, 1);

        this.tokenChanger = () => {
            this.alpha += this.delta;
            if (Math.abs(this.targetAlpha - this.alpha) < Math.abs(this.delta)) {
                this.alpha = this.targetAlpha;
                automa.ticker.remove(this.tokenChanger);
                Board.prototype.validateParadoxes();
            }
        }
    }
}

class RainbowFrame extends PIXI.Sprite {
    constructor(texture, pos) {

        super(texture);

        this.x = pos.x;
        this.y = pos.y;

        this.visible = true;

        this.hueCounter = 0;
        this.totalCount = 360;

        this.rainbowEffect = () => {

            this.hueCounter += this.delta;

            if( this.hueCounter >= this.totalCount ) {
                this.hueCounter = 0;
            }

            let colorArray = hsvToRGB2( this.hueCounter / this.totalCount * 360, 1, 1);
            let color = colorArray[0] * 65536 + colorArray[1] * 256 + colorArray[2];
            this.tint = color;
        }

    }



    attentionOn() {
        this.delta = 2;
        automa.ticker.add(this.rainbowEffect);

    }

    attentionOff() {
        automa.ticker.remove(this.rainbowEffect);
        this.tint = 0xFFFFFF;
        this.hueCounter = 0;
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
