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
        super(texture, name, pos,status, true, 25);

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
        super(texture, name, pos, status, true, 25);

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
        super(texture, "Paradox", pos, status, true, 25);

        this.counter = false;

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


