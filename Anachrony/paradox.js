/*
	Paradox
	Variable Anomaleies
*/


class Paradox {

	constructor() {
        this.maxParadox = 3;
//		this.paradoxCount = 0;
		this.paradoxTokens = [];

		const paradoxPositions = [{x: 1345, y: 521}, {x: 1417, y: 672}, {x: 1345, y: 660}];
		
        for (let j = 1; j <= this.maxParadox; j++) {
             const newToken = new ParadoxToken(PIXI.Texture.from('images/paradox90.png'), paradoxPositions[j - 1], 0);
             if (j === 2) newToken.angle = 180;
             this.paradoxTokens.push(newToken);
        }

	}

	init(pixiParent) {
        for (let i = 0; i < this.paradoxTokens.length; i++) {
             pixiParent.addChild(this.paradoxTokens[i]);
        }
	}

	rollParadoxDice() {
		const paradoxDieValue = [0, 1, 1, 1, 1, 2];
		return paradoxDieValue[Math.floor(Math.random() * 6)];
	}

	activateTokens() {
        for (let i = 0; i < this.paradoxTokens.length; i++) {
            this.paradoxTokens[i].interactive = true;
        }		
	}

	deactivateTokens() {
        for (let i = 0; i < this.paradoxTokens.length; i++) {
            this.paradoxTokens[i].interactive = false;
        }				
	}

    add() {
        if( this.paradoxCount() < this.maxParadox ) {
            this.paradoxTokens[ this.paradoxCount() ].add();
        }
    }

    paradoxCount() {
        let rv = 0;
        for (let i = 0; i < this.paradoxTokens.length; i++) {
            if ( this.paradoxTokens[i].number > 0 ) rv++; 
        }               
        return rv;
    }

	isFull() {
        return (this.paradoxCount() >= this.maxParadox);
	}

	emptyAll() {
        for (let i = 0; i < this.paradoxTokens.length; i++) {
        	this.paradoxTokens[i].remove();
        }						
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




