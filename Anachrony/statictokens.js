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
        this.text.x = Math.floor( this.width / 2 );
        this.text.y = Math.floor( this.height - (this.text.height / 2) );
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

/*
    scores: array of avaiable scores in asc order
    scoresTextures: array of texture matching the vp array index
    align: vps align along which side
*/
const TOP_LEFT = 0, TOP_RIGHT = 1, BOTTOM_LEFT = 2, BOTTOM_RIGHT = 3, IS_BOTTOM = 2, IS_RIGHT = 1;
const HORIZONTAL = true, VERTICAL = false;

class TokenWithScores extends StaticToken {
    constructor(texture, icon, name, pos, status, counter, limit, highlighterTexture ) {

        super(texture, icon, name, pos, status, counter, limit);

        // setup everything as right alignment from right to left, then top down.
        // then adjust the coordinate afterward if alignment or direction is not the same as default.

        this.scores;
        this.scoreTextures;
        this.scoreIconPositions = [];
        this.scoreIconTransitions = [];

        this.slp;
        this.highlighterTexture = highlighterTexture;

    }

    /*
        initialize the object after all texture loaded
    */
    init(scores, scoreTextures, align=TOP_LEFT, alignDirection = HORIZONTAL) {
        this.scores = scores;
        this.scoreTextures = scoreTextures;


        generateIconPositions( this.texture, scoreTextures, this.limit, this.scoreIconPositions, align, alignDirection );
        for( let i = 0; i < this.scoreIconPositions.length; i++ ) {
            let tempTransition = {};
            if( i+1 === this.scoreIconPositions.length ) {
                tempTransition[i] = 0;
            } else {
                tempTransition[i] = i+1;
            }
            this.scoreIconTransitions.push( {...tempTransition} );
        }

        this.vp = [];
        this.vpIcon = [];

    }

    addScore(score, texture) {
        if( this.vpIcon.length < this.limit ) {
            let st =  new SlideToken( texture, this.vpIcon.length, this.scoreIconPositions, this.scoreIconTransitions );
            this.vpIcon.push( st );
            this.addChild( st );
            this.vp.push( score );            
        }
    }

    getTotalVP() {
        let vp = 0;
        for( let i = 0; i < this.vp.length; i++ ) {
            vp += this.vp[i];
        }
        return vp;
    }

    bubbleSort() {
        for( let j = 0; j < this.vp.length; j++ ) {

            for( let i = 0; i < this.vp.length - 1; i++ ) {
                if( this.vp[i] > this.vp[i+1] ) {
                    let tempVp = this.vp[i+1];
                    this.vp[i+1] = this.vp[i];
                    this.vp[i] = tempVp;

                    this.vpIcon[i+1].set(i);
                    this.vpIcon[i].set(i+1);

                    let tempVpIcon = this.vpIcon[i+1];
                    this.vpIcon[i+1] = this.vpIcon[i];
                    this.vpIcon[i] = tempVpIcon;
                }
            }
        }
    }


    add() {
        this.getVPfromSLP();
        super.add();
    }

    setVPfromSLP(tws, selectedVP) {
        if( tws.slp instanceof ScoreListPanel ) tws.slp.visible( false );
        let currentVP = selectedVP;
        tws.addScore( currentVP, tws.scoreTextures[tws.getScoreIndex(currentVP)] );

        tws.bubbleSort();
        Board.prototype.checkIfReady(tws);
    }

    getVPfromSLP() {
        if( this.slp instanceof ScoreListPanel ) {
            this.slp.visible( true );
        } else {
            this.slp = new ScoreListPanel( this, this.texture.frame, this.scores, this.scoreTextures, this.highlighterTexture, this.setVPfromSLP );
        }
        this.slp.attentionOn();
    }

    getScoreIndex( score ) {
        for( let i = 0; i < this.scores.length; i++ ) {
            if( this.scores[i] === score ) return i;
        }
    }

    remove() {
        if( this.number > 0 ) {
            this.removeLowestVP();
            super.remove();
        }
    }

    editModeSet(value) {
        if( value > this.number ) {
            // increasing
            for( let i = 0; i < (value - this.number); i++) {
                const randomVPIndex = Math.floor(Math.random() * this.scores.length);
                this.addScore( this.scores[randomVPIndex], this.scoreTextures[randomVPIndex] );
                this.bubbleSort();                
            }
        } else {
            // decreasing 
            for( let i = 0; i < (this.number - value); i++) {
                this.removeLowestVP();
            }
        }
        super.set(value);
    }

    removeLowestVP() {
        this.vp[0] = 99;
        this.vpIcon[0].fadeOut();
        this.bubbleSort();
        if( this.vp[this.vp.length-1] === 99 ) {
            this.removeChild( this.vpIcon[this.vp.length-1] );          
            this.vp.pop();
            this.vpIcon.pop();          
        }
    }

    belowLimit() {
        return (this.number < this.limit);
    }


    updateSLP( newIcons, newIconTextures, newHLTexture ) {
        this.scores = newIcons;
        this.scoreTextures = newIconTextures;
        this.highlighterTexture = newHLTexture;

        if( this.slp instanceof ScoreListPanel ) {
            this.slp.setScoreList( newIcons, newIconTextures, newHLTexture, this.setVPfromSLP );
        } else {
            this.slp = new ScoreListPanel( this, this.texture.frame, newIcons, newIconTextures, newHLTexture, this.setVPfromSLP );
        }
    }

}

/*
    create a rectangle in sizeRect with semi-transparent white background,
    layout the availbe score icons,
    a call back function after user click on it.
*/
class ScoreListPanel {
    constructor( parentSprite, sizeRect, icons, iconsTexture, highlighterTexture, callBack = function() {} ) {
        this.parentSprite = parentSprite;
        this.sizeRect = sizeRect;

        const blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = 3;

        this.bkground = new PIXI.Sprite( parentSprite.texture );
        this.bkground.width = sizeRect.width;
        this.bkground.height = sizeRect.height;
        this.bkground.alpha = 1;
        this.bkground.filters = [ blurFilter ];
        this.bkground.tint = 0xAAAAAA;
        this.bkground.zIndex = 100;

        this.buttonLayer = new PIXI.Container();
        this.buttonLayer.width = sizeRect.width;
        this.buttonLayer.height = sizeRect.height;
        this.buttonLayer.visible = true;
        this.buttonLayer.zIndex = 200;

        parentSprite.sortableChildren = true;
        parentSprite.addChild( this.bkground );
        parentSprite.addChild( this.buttonLayer );

        this.highlighter = [];
        this.scoreList = [];
        this.setScoreList( icons, iconsTexture, highlighterTexture, callBack );
    }

    setScoreList( newIcons, newIconTextures, newHLTexture, callBack = function() {} ) {
        if( this.highlighter.length > 0 || this.scoreList.length > 0 ) this.empltyScoreList();

        const positionArray = [];
        generateIconPositions( this.bkground.texture, newIconTextures, newIcons.length, positionArray, newHLTexture );
        for( let i = 0; i < newIcons.length; i++ ) {

            const tempHighlightIcon = new WhiteRedRainbowFrame( newHLTexture, positionArray[i] );
            tempHighlightIcon.anchor = {x:0.5, y:0.5};
            this.buttonLayer.addChild( tempHighlightIcon );
            this.highlighter.push( tempHighlightIcon );

            const tempIcon = new PIXI.Sprite( newIconTextures[i] );
            tempIcon.anchor = {x:0.5, y:0.5};
            tempIcon.x = positionArray[i].x;
            tempIcon.y = positionArray[i].y;
            tempIcon.interactive = true;
            const tempParent = this.parentSprite; // cannot pass object with "this" as funciton parameter, need to convert this to a parameter without the word "this"
            tempIcon.click = function() { callBack( tempParent, newIcons[i] ); }
            this.buttonLayer.addChild( tempIcon );
            this.scoreList.push( tempIcon );
        }        


    }

    empltyScoreList() {
        while( this.highlighter.length > 0 ) {
            const tempHighlightIcon = this.highlighter.pop();
            this.buttonLayer.removeChild( tempHighlightIcon );
        }

        while( this.scoreList.length > 0 ) {
            const tempIcon = this.scoreList.pop();
            this.buttonLayer.removeChild( tempIcon );
        }
    }

    attentionOn() {
        for( let i = 0; i < this.highlighter.length; i++ ) {
            this.highlighter[i].attentionOn();
        }
    }

    attentionOff() {
        for( let i = 0; i < this.highlighter.length; i++ ) {
            this.highlighter[i].attentionOff();
        }
    }

    visible( value ) {
        this.bkground.visible = value;
        this.buttonLayer.visible = value;
        if( value ) {
            this.attentionOn();
        } else {
            this.attentionOff();
        }
    }
}


function generateIconPositions( bsaeTexture, iconTextures, limit, resultPosArray=[], align=TOP_LEFT, alignDirection=HORIZONTAL ) {
   let baseTextureRect = getTextureRect(bsaeTexture);

    let targetIconRect = {width:0, height:0};
    for( let i = 0; i < iconTextures.length; i++ ) {
        let tempRect = getTextureRect(iconTextures[i]);
        if(tempRect.width > targetIconRect.width) targetIconRect.width = tempRect.width;
        if(tempRect.height > targetIconRect.height) targetIconRect.height = tempRect.height;
    }

    if( !alignDirection ) { // NOT Horizontal
        flipXYCoordinate(baseTextureRect);
        flipXYCoordinate(targetIconRect);
    }

    let rowCount = 1;
    let columnCount = limit;
    let fitted = false;

    // min margin is 4 each size
    while(!fitted) {
        if( (targetIconRect.width + 8) * columnCount <= baseTextureRect.width ) {
            fitted = true;
        } else {
            columnCount -= 1;
            if( (rowCount * columnCount) < limit ) {
                rowCount += 1;
            }
        }
    }

    let gap = [];
    let remainLength = baseTextureRect.width - (targetIconRect.width * columnCount);

    for( let i = columnCount + 1; i > 0; i--) {
        let tempGap = 0;
        if( remainLength > 0 ) {
            if( i % 2 === 0 ) {
                tempGap = Math.ceil( remainLength / i );
            } else {
                tempGap = Math.floor( remainLength / i );
            }
            if( tempGap > (targetIconRect.width / 4) ) {
                tempGap = Math.ceil(targetIconRect.width / 4);
            }                
        }
        gap[i-1] = tempGap;
        remainLength -= tempGap;
    }


    let currentColumn = 1, currentRow = 1;
    let currentPos = { x: Math.floor(targetIconRect.width / 2), y: Math.floor(targetIconRect.height / 2) };
    for( let j = 0; j < rowCount; j++ ) {
        currentPos.y += gap[j];
        for( let i = 0; i < limit && i < columnCount; i++ ) {
            currentPos.x += gap[i];
            resultPosArray.push( {...currentPos} );
            currentPos.x += targetIconRect.width;
        }
        currentPos.y += targetIconRect.height;
        currentPos.x = Math.floor(targetIconRect.height / 2);
    }

    if( !alignDirection ) { // NOT Horizontal
        for( var i = 0; i < resultPosArray.length; i++ ) {
            flipXYCoordinate( resultPosArray[i] );
        }
    }

    if( align & IS_BOTTOM ) { // align to bottom, recalculate .y
        for( var i = 0; i < resultPosArray.length; i++ ) {
            resultPosArray[i].y = baseTextureRect.height - resultPosArray[i].y;
        }
    }

    if( align & IS_RIGHT ) { // align to right, recalculate .x
        for( var i = 0; i < resultPosArray.length; i++ ) {
            resultPosArray[i].x = baseTextureRect.width - resultPosArray[i].x;
        }
    }
    return resultPosArray;
}

function getTextureRect(texture) {
    if(texture.noFrame) {
        return {width: texture.width, height: texture.height};
    } else {
        return {width: texture.frame.width, height: texture.frame.height};
    } 
}

function flipXYCoordinate(rect) {
    let tempX = rect.x;
    rect.x = rect.y;
    rect.y = tempX;
}