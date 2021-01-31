const modalS = document.getElementById("myModal2");

const actionNames = {
    "B01.png": "Construct Life Support",
    "B02.png": "Time Travel",
    "B04.png": "Construct Superproject",
    "B05.png": "Remove Anomaly",
    "B06.png": "Recruit Genius / Research",
    "B07.png": "Construct Factory",
    "B10.png": "Recruit",
    "B11.png": "Construct Lab",
    "B12.png": "Mine",
    "B13.png": "Construct Power Plant",
    "B14.png": "Research",
    "C01A.png": "Reboot",
    "C01B.png": "Score (Autoleap)",
    "C02A.png": "Score",
    "C02B.png": "Score and Energy Pack",
    "C03A.png": "Energy Pack",
    "C03B.png": "Energy Pack (Autoleap)",
    "C04A.png": "Assimilate",
    "C04B.png": "Assimilate and Score",
    "C05A.png": "Extract",
    "C05B.png": "Efficient Extract",
    "C06A.png": "Power Pack",
    "C06B.png": "Power Pack (Autoleap)",
    "C07A.png": "Level 1 Experiment",
    "C07B.png": "Level 1 Experiment",
    "C08A.png": "Level 2 Experiment",
    "C08B.png": "Level 2 Experiment",
    "C09A.png": "Adventure",
    "C09B.png": "Adventure and Score",
    "C10A.png": "Adventure",
    "C10B.png": "Adventure and Energy Pack",
    "C11A.png": "Acquire Guardian (Autoleap)",
    "C11B.png": "Acquire Guardian and Score (Autoleap)",
    "C12A.png": "Hypersync or Time Travel",
    "C12B.png": "Hypersync (Autoleap)",
    "C13A.png": "Hypersync",
    "C13B.png": "Hypersync and Score",
    "C14A.png": "Assimilate and Flux Pack",
    "C14B.png": "Assimilate, Score and Flux Pack"
};

const actionNeedExosuit = {
    "B01.png": true,
    "B02.png": false,
    "B04.png": true,
    "B05.png": false,
    "B06.png": true,
    "B07.png": true,
    "B10.png": true,
    "B11.png": true,
    "B12.png": true,
    "B13.png": true,
    "B14.png": true,
    "C01A.png": false,
    "C01B.png": false,
    "C02A.png": false,
    "C02B.png": false,
    "C03A.png": false,
    "C03B.png": false,
    "C04A.png": true,
    "C04B.png": true,
    "C05A.png": true,
    "C05B.png": true,
    "C06A.png": false,
    "C06B.png": false,
    "C07A.png": false,
    "C07B.png": false,
    "C08A.png": false,
    "C08B.png": false,
    "C09A.png": true,
    "C09B.png": true,
    "C10A.png": true,
    "C10B.png": true,
    "C11A.png": true,
    "C11B.png": true,
    "C12A.png": true,
    "C12B.png": true,
    "C13A.png": true,
    "C13B.png": true,
    "C14A.png": true,
    "C14B.png": true
};


const options =
    {   "t2":[13,12,8,10,14],
        "t3":[1,2,3,4,5],
        "t4":[7,8,12,11,6],
        "t5":[10,14,13,9],
        "rn":[0,1,2,3,4,5],
        "ru":[0,1,2,3,4,5],
        "rg":[0,1,2,3,4,5],
        "rt":[0,1,2,3,4,5],
        "wg":[0,1,2,3,4,5],
        "wa":[0,1,2,3,4,5],
        "we":[0,1,2,3,4,5],
        "ws":[0,1,2,3,4,5],
        "bp":[0,1,2,3],
        "bf":[0,1,2,3],
        "bh":[0,1,2,3],
        "bl":[0,1,2,3],
        "ba":[0,1,2,3],
        "bs":[0,1,2,3],
        "exo":[0,1,2,3,4,5,6],
        "xt":[0,1,2,3,4,5,6],
        "hc":[0,1,2,3,4,5,6,7],
        "hs":[0,1,2,3,4,5,6,7],
        "ht":[0,1,2,3,4,5,6,7],
        "background":["BG-TheWorld", "BG-Chronossus"],
        "s1": Object.keys( actionNeedExosuit ),
        "s2": Object.keys( actionNeedExosuit ),
        "s3": Object.keys( actionNeedExosuit )
    };


const stateNames =
    {   1: getText("B01.png"),
        2: getText("B02.png"),
        3: getText("C02A.png"),
        4: getText("B04.png"),
        5: getText("B05.png"),
        6: getText("B06.png"),
        7: getText("B07.png"),
        8: getText("C01A.png"),
        9: getText("C03A.png"),
        10: getText("B10.png"),
        11: getText("B11.png"),
        12: getText("B12.png"),
        13: getText("B13.png"),
        14: getText("B14.png")
    };

const PREPARATION_PHASE = 1, PARADOX_PHASE = 2, POWER_UP_PHASE = 3, WARP_PHASE = 4, ACTION_ROUNDS = 5, CLEAN_UP_PHASE = 6;

const phaseNames = {};
for( let i = 1; i <= 6; i++ ) {
    phaseNames[i] = getText("txt_phase"+1);
}
/*
phaseNames[PREPARATION_PHASE] = "Preparation Phase";
phaseNames[PARADOX_PHASE] = "Paradox Phase";
phaseNames[POWER_UP_PHASE] = "Power Up Phase";
phaseNames[WARP_PHASE] = "Warp Phase";
phaseNames[ACTION_ROUNDS] = "Action Rounds";
phaseNames[CLEAN_UP_PHASE] = "Clean Up Phase";
*/

/*
let skipReboot = false;
function toggleSkipReboot() {
    // advance token if it is at Reboot
    for (var i = 0; i < tokens.length; i++) {
        if( tokens[i].state.name === 9 ) {
            tokens[i].advance();
        }

    }
    // update the board graphic
    advancePath.visible = skipReboot;
    normalPath.visible = ! skipReboot;

    // set the correct token stateTransition
    if( skipReboot ) {
        states[8].setNext( states[10] );
    } else {
        states[8].setNext( states[9] );
    }

}
*/

function keySelected() {
    const selector1 = document.getElementById("Key");
    const selector2 = document.getElementById("Value");
    selector1.disabled = true;
    const selected = selector1.value;
    if (selected==="points" || selected==="water") 
        for (let j=0; j<=50; j++) {
            const opt = document.createElement('option');
            opt.value = j.toString();
            opt.innerHTML = j.toString();
            selector2.appendChild(opt);
        }
    else options[selected].forEach(element => { const opt = document.createElement('option');
        opt.value = element;
        if (selected.charAt(0) === "t") {
            opt.innerHTML = stateNames[parseInt(element)];
        } else if (selected.charAt(0) === "s") {
            opt.innerHTML = getText(element);
        } else {
            opt.innerHTML = element;
        }
        selector2.appendChild(opt);
        } );
    selector2.disabled = false;
}

let minActionNum = 3;

function valueSelected() {
    const selector1 = document.getElementById("Key");
    const selector2 = document.getElementById("Value");
    switch(selector1.value) {
        case "points":
            points.set(parseInt(selector2.value));
            break;
        case "rn":
            neutroniumToken.set(parseInt(selector2.value));
            break;
        case "ru":
            uraniumToken.set(parseInt(selector2.value));
            break;
        case "rg":
            goldToken.set(parseInt(selector2.value));
            break;
        case "rt":
            titaniumToken.set(parseInt(selector2.value));
            break;
        case "wg":
            geniusToken.set(parseInt(selector2.value));
            break;
        case "wa":
            adminToken.set(parseInt(selector2.value));
            break;
        case "we":
            engineerToken.set(parseInt(selector2.value));
            break;
        case "ws":
            scientistToken.set(parseInt(selector2.value));
            break;
        case "hc":
            btCircleCounter.set(parseInt(selector2.value));
            break;
        case "ht":
            btTriangleCounter.set(parseInt(selector2.value));
            break;
        case "hs":
            btSquareCounter.set(parseInt(selector2.value));
            break;
        case "bp":
            powerPlantBack.editModeSet(parseInt(selector2.value));
            break;
        case "bf":
            factoryBack.editModeSet(parseInt(selector2.value));
            break;
        case "bl":
            labBack.editModeSet(parseInt(selector2.value));
            break;
        case "bh":
            habitatBack.editModeSet(parseInt(selector2.value));
            break;
        case "ba":
//            anomalyBack.set(parseInt(selector2.value));
            anomaly.editModeSet(parseInt(selector2.value));
            break;
        case "bs":
            superProjectBack.editModeSet(parseInt(selector2.value));
            break;
        case "exo":
            exoSuitBack.set(parseInt(selector2.value));
            break;
        case "xt":
            timetravelToken.set(parseInt(selector2.value));
            break;
        case "t2":  // numbertoken
        case "t3":
        case "t4":
        case "t5":
            const tokenNumber =  parseInt(selector1.value.charAt(1)) - 2;
            let loopCount = 0;
            while (parseInt(selector2.value)!==tokens[tokenNumber].state.name) {
                tokens[tokenNumber].advance();
                if( loopCount > tokens[tokenNumber].stateTransition.size ) break; // avoid infinite loop
                loopCount += 1;
            }
            break;
        case "s1":
            // also need to update the option list!!
            const slotNumber =  parseInt(selector1.value.charAt(1)) - 1;
            const actionIndex = defaultActionTextures.indexOf(selector2.value);
            states[8].setAction( loader.resources["images/ActionTiles.png"].textures[selector2.value], defaultActionTexturePos[7],  )
            stateNames[8] = getText(selector2.value);
        case "s2":
        case "s3":
            break;
        case "background":
        debugger;
            board.texture = loader.resources["images/" + selector2.value + ".png"].texture;
            break;
        default:
            break;
    }

    // Variable Anomaly
    if( document.getElementById("VarAnomalies").checked ) {
        if( ! VarAnomalies ) {
            const tempVP = [], tempVPTexture = [];
            for( let i = 1; i <= 4; i++ ) {
                tempVP.push( -i );
                tempVPTexture.push( loader.resources["images/VictoryPointTokenNeg" + i + ".png"].texture );
            }
            anomaly.updateSLP( tempVP, tempVPTexture, loader.resources["images/VPHightlighter.png"].texture );
        }
    } else {
        if( VarAnomalies ) {
            anomaly.updateSLP( [-2], [loader.resources["images/VictoryPointTokenNeg2.png"].texture], loader.resources["images/VPHightlighter.png"].texture );
        }
    }
    VarAnomalies = document.getElementById("VarAnomalies").checked;
 
 /*
    // skip Reboot
    if( skipReboot !== document.getElementById("skipReboot").checked ) {
        skipReboot = !skipReboot;
        toggleSkipReboot();
    }
*/

    minActionNum = parseInt(document.getElementById("MinActionValue").value);

    modalS.style.display = 'none';
}

function editRequested(){
    const selector1 = document.getElementById("Key");
    const selector2 = document.getElementById("Value");
    selector1.disabled = false;
    selector2.disabled = true;
    while (selector2.options.length > 0) {
        selector2.options.remove(0);
    }
    selector1.value='none';
    modalS.style.display = "block";
}


let boardFadeOut = true;
function toggleTextPanel() {
    automa.ticker.add( textPanelFadeInOut );
/*
    if( boardFadeOut ) { 
        automa.ticker.add( textPanelFadeInOut );
    } else {

    }
    board.visible = (! board.visible);
    bottomPanelTop.visible = (! bottomPanelTop.visible);
    //backdropTop.visible = (! backdropTop.visible);
*/
}

function scrollTextUp() {

}

function scrollTextDown() {

}

function scrollTextSetY( delta ) {

}

function scrollTextOff() {

}

function scollTextReset() {

}

function textPanelFadeInOut() {
    let delta = -0.01;
    if( ! boardFadeOut ) {
        board.visible = true;
        textPanelEnlargeBTN.visible = true;
        scrollUpBTN.visible = false;
        scrollDownBTN.visible = false;
        delta = +0.01;
    }

    board.alpha += delta;
    bottomPanelTop.alpha += delta;
    textPanelEnlargeBTN.alpha += delta;

    if( boardFadeOut ) {
        if( board.alpha < 0 ) {
            board.visible = false;
            automa.ticker.remove( textPanelFadeInOut );
            boardFadeOut = (! boardFadeOut);
            textPanelShrinkBTN.visible = true;
            textPanelEnlargeBTN.visible = false;
            scrollUpBTN.visible = true;
            scrollDownBTN.visible = true;
        }
    } else {
        if( board.alpha > 1 ) {
            automa.ticker.remove( textPanelFadeInOut );
            boardFadeOut = (! boardFadeOut);
        }

    }
}


