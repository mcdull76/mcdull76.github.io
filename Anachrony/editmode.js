const modalS = document.getElementById("myModal2");
const options =
    {   "t2":[5,6,7,8,9,10,11,12],
        "t3":[1,2,3,4],
        "t4":[5,6,7,8,9,10,11,12],
        "t5":[5,6,7,8,9,10,11,12],
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
        "background":["BG-TheWorld", "BG-Chronossus"]
    };

const stateNames =
    {   1: "Construct Habitat",
        2: "Time Travel",
        3: "Construct Superproject",
        4: "Remove Anomaly",
        5: "Mine",
        6: "Construct Power Plant",
        7: "Recruit",
        8: "Construct Factory",
        9: "Reboot",
        10: "Recruit Genius / Research",
        11: "Construct Lab",
        12: "Research"};

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

function keySelected(){
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
            if (skipReboot) {
                if( parseInt(element) !== 9 ) {
                    opt.innerHTML = stateNames[parseInt(element)];
                }
            } else {
                opt.innerHTML = stateNames[parseInt(element)];
            }
        } else {
            opt.innerHTML = element;
        }
        selector2.appendChild(opt);
        } );
    selector2.disabled = false;
}

let minActionNum = 3;

function valueSelected(){
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
            while (parseInt(selector2.value)!==tokens[tokenNumber].state.name) {
                tokens[tokenNumber].advance();
                if( tokens[tokenNumber].state.name === parseInt(selector2.value) + 1) break; // avoid infinite loop
            }
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
 
    // skip Reboot
    if( skipReboot !== document.getElementById("skipReboot").checked ) {
        skipReboot = !skipReboot;
        toggleSkipReboot();
    }

    minActionNum = parseInt(document.getElementById("MinActionValue").value);

    modalS.style.display = 'none'
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