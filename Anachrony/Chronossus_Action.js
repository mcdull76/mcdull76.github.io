/*
    All Chronossus related Action

    All action function are linked to the texture id
*/

const PERFORM_ACTION = 0, SPACE_FREE = 1, SPACE_OCCUPIED = 2, CHECK_IF_READY = 3, ACCEPT_ACTION = 4, SPACE_OCCUPIED_2 = 5;

function construction( structure, structureName, status ) {
    switch (status) {
        case PERFORM_ACTION:
            // ask if space is free
            actionText.text += getText("ca_A01", [structureName]);
            reminder.text = getText("ca_R01");
            structure.attentionOn();
            button0.visible = true;
            button0.label.text = getText("txt_BTN0_01");
            button0.settings.onTap = () => spaceFree();
            button1.label.text = getText("txt_BTN1_05");
            button1.settings.onTap = () => spaceOccupied();
            break;
        case SPACE_FREE:
        reminder.text = "Place Exosuit!\n";
        exoSuitBack.remove();
        button0.visible = false;
            button1.visible = true;
            structure.attentionOff();
            if (structure.number < structure.limit) {
                // Need to insert code to ask for construction VP
                reminder.text = "Take a " + structureName + " with higher VP";
                structure.add(1);
                button1.visible = false;
            } else {
                actionText.text += "max. " + structureName + " reached. ";
                failedAction();
            }
            break;
        case SPACE_OCCUPIED:
            structure.attentionOff();
            genericSpaceOccupied();
            failedAction();
            break;
        case CHECK_IF_READY:
            button1.label.text = "Continue";
            button1.settings.onTap = () => acceptAction();
            button1.visible = true;
            break;
        case ACCEPT_ACTION:
            icons.forEach(icon => icon.visible = false);

            reminder.text = "";
            actionText.text += structureName + " x" + structure.number + "; total " + structure.getTotalVP() + " VP. ";
            genericAcceptAction();
            break;

    }        
} 

    function genericAcceptAction() {
        actionText.text += "\n";
        reminder.text = "";

        if(! passing) {
//            tokens[dice - 2].state.performAction( ACCEPT_ACTION );
            tokens[dice - 2].advance();
        }

//        action = 0;
        button1.visible = true;
        button1.label.text = 'Next Bot Action';
//        actionText.text = "";
        button1.settings.onTap = () => button1Pressed();
//        if (botActions >= minActionNum) button2.enable();
        if (exoSuitBack.number === 0) {
            if (passing) {
                reminder.text = "Click \"next Phase\"\nwhen you are done.";                
                passing = false;
                button1.disable();
                button2.enable();
            }
        }
    }

function genericSpaceOccupied() {
    actionText.text += "Lack of free space, discards an Exosuit. ";
    exoSuitBack.remove();
}

    function B01( parentBoard, fromState, status ) {
        construction( habitatBack, "Life Support", status );
/*        
        switch (status) {
            case PERFORM_ACTION:
                // ask if space is free
                actionText.text += "CONSTRUCT\nLIFE SUPPORT\n";
                habitatBack.attentionOn();
                button0.visible = true;
                button0.label.text = "Construct Spot\nFree";
                button0.settings.onTap = () => spaceFree();
                button1.label.text = "Construct Spot\nOccupied";
                button1.settings.onTap = () => spaceOccupied();
                break;
            case SPACE_FREE:
                habitatBack.attentionOff();
                if (habitatBack.number < habitatBack.limit) {
                    // Need to insert code to ask for construction VP
                    actionText.text += "Take Life Support\n";
                    habitatBack.add(1);
                    button1.visible = false;
                } else {
                    actionText.text += "max. Life Support\nreached\n";
                    failedAction();
                }
                break;
            case SPACE_OCCUPIED:
                habitatBack.attentionOff();
                failedAction();

        }
*/
    }

    // Time Travel
    function B02( parentBoard, fromState, status ) {
        switch (status) {
            case PERFORM_ACTION:
                // Time travel
                actionText.text += "TIME TRAVEL. "
                if (timetravelToken.state === 6) {
                    actionText.text += "Time travel maxed\n";
                    failedAction();
                } else {
                    if( warptileNumber < maxWarpTile) {
                        // indexOfMaxValue will return 1+ as 0 is handled by the prevous if statement
                        let indexOfMaxValue = warpTokensLog.indexOf(Math.max(...warpTokensLog));
                        if( indexOfMaxValue < era.number - 1 ) {
                            // have warp tile in the past
                            actionText.text += "Remove Warp tile from Era " + (indexOfMaxValue + 1) + " ";
                            warpTokensLog[indexOfMaxValue] -= 1;
                            warptileNumber += 1;
                            actionText.text += "and advanced time travel ";
                            timetravelToken.advance();
                            actionText.text += "(" + timeTravelPoints[timetravelToken.state] + " VP). ";
                        } else {
                            actionText.text += "No Warp tile in the past. ";
                            failedAction();
                        }
                    } else {
                        actionText.text += "No Warp tile. ";
                        failedAction();
                    }
                }
                button1.label.text = "Continue";
                button1.settings.onTap = () => acceptAction();
                break;
            case SPACE_FREE:
                break;
            case SPACE_OCCUPIED:
                break;
            case ACCEPT_ACTION:
                genericAcceptAction();
                break;
        }
    }

    // Superproject
    function B04( parentBoard, fromState, status ) {
        switch (status) {
            case PERFORM_ACTION:
                construction( superProjectBack, "Superproject", PERFORM_ACTION );
                break;
            case SPACE_FREE:
                reminder.text = "Place Exosuit!\n";
                exoSuitBack.remove();
                button0.visible = false;
                button1.visible = true;
                superProjectBack.attentionOff();
                if( superProjectBack.number < superProjectBack.limit ) {
                    // get most breakthrough shape array and the max count of that shape(s)
                    let maxValue = 0;
                    let maxIndexArray = [];
                    for( i = researchCounter.length - 1; i >= 0; i-- ) {
                        if ( researchCounter[i].number > maxValue ) {
                            maxIndexArray = [];
                            maxIndexArray.push(i);
                            maxValue = researchCounter[i].number
                        } else if ( researchCounter[i].number === maxValue ) {
                            maxIndexArray.push(i);
                        }
                    }
                    // remove breakthrough and perform action
                    if( maxValue === 0 ) {
                        actionText.text += "No Breakthrough. ";
                        failedAction();
                    } else {
                        let randomShape = maxIndexArray[ Math.floor(Math.random() * maxIndexArray.length) ];
                        researchCounter[ randomShape ].decrease(1);
                        actionText.text += "Remove a " + researchItem[randomShape] + " Breakthrough ";

                        let breakthroughCount = 0;
                        for( i = 0; i < researchCounter.length; i++ ) {
                            breakthroughCount += researchCounter[i].number;
                        }
                        if( breakthroughCount === 0 ) {
                            for( i = 0; i < researchCounter.length; i++ ) {
                                researchCounter[i].visible = false;
                            }
                            breakthroughBack.visible = false;
                        }

                        reminder.text = "Take Superproject\n";
                        actionText.text += "and take Superproject ";
                        superProjectBack.add(1);
                        button1.visible = false;
                    }
                } else {
                    actionText.text += "maximun Superproject reached. ";
                    failedAction();
                }
                break;
            case SPACE_OCCUPIED:
                superProjectBack.attentionOff();
                genericSpaceOccupied();
                failedAction();
                break;
            case CHECK_IF_READY:
                reminder.text = "";
                button1.label.text = "Continue";
                button1.settings.onTap = () => acceptAction();
                button1.visible = true;
                break;
            case ACCEPT_ACTION:
                genericAcceptAction();
                break;
        }
    }

    // Remove Anomaly
    function B05( parentBoard, fromState, status ) {
        switch (status) {
            case PERFORM_ACTION:
                // Remove Anomaly
                if (anomaly.number === 0) {
                    actionText.text += "No Anomalies. ";
                    failedAction();
                } else if ( neutroniumToken.number >= 1 ||
                    uraniumToken.number + goldToken.number + titaniumToken.number >= 2) {
                    actionText.text += "Chronobot removed Anomaly by discards: ";

                    let removedResource = 0;

                    let resourcesToBeRemove = [];
                    let maxCount = 0, tempNumber = 0;

                    while ( removedResource < 2 ) {
                        for( var i = 0; i < resourcesTokens.length; i++ ) {
                            tempNumber = resourcesTokens[i].number;
                            //each Neutronium cube is equal to 2 non-Neutronium cubes when calculating priority and discarding
                            if ( resourcesTokens[i] === neutroniumToken ) {
                                tempNumber += tempNumber; 
                            }
                            if( tempNumber > maxCount ) {
                                resourcesToBeRemove = [];
                                resourcesToBeRemove.push( resourcesTokens[i] );
                                maxCount = tempNumber;
                            } else if( tempNumber === maxCount ) {
                                if (!( removedResource > 0 && resourcesTokens[i] === neutroniumToken )) {
                                    //exclude Neutronium
                                    resourcesToBeRemove.push( resourcesTokens[i] );
                                }
                            }
                        }

                        let discardResource = resourcesToBeRemove[ resourcesToBeRemove.length - 1 ];

                        discardResource.remove();
                        removedResource += 1;

                        if( removedResource > 1 ) {
                            actionText.text += " and "
                        }

                        actionText.text += discardResource.name + "";

                        if ( discardResource === neutroniumToken ) {
                            removedResource += 1;
                        }
                    }

                    anomaly.remove();
                } else {
                    actionText.text += "No Ressources to remove Anomaly. ";
                    failedAction();
                }
                button1.label.text = "Continue";
                button1.settings.onTap = () => acceptAction();
                break;
            case SPACE_FREE:
                break;
            case SPACE_OCCUPIED:
                break;
            case ACCEPT_ACTION:
                genericAcceptAction();
                break;
        }
    }

    // Recruit Genius / Research
    function B06( parentBoard, fromState, status, kwargs ) {
        switch (status) {
            case PERFORM_ACTION:
                /*
                When using the Recruit Genius/Research Action, perform a Recruit Action only if a Genius is available.
                If no Genius is available, perform a Research Action instead.
                */
                actionText.text += "Recruit Genius. "
                reminder.text = "Any Genius available"
                button0.label.text = "Have Genius";
                button0.settings.onTap = () => spaceFree();
                button0.visible = true;
                button1.label.text = "Genius Not available";
                button1.settings.onTap = () => B06( parentBoard, fromState, SPACE_OCCUPIED_2, kwargs );
                break;
            case SPACE_FREE:
                reminder.text = "Place Exosuit!\n";
                exoSuitBack.remove();
                button0.visible = false;
                button1.visible = true;
                // Recurit Genius / Research
                geniusWorkerFrame.attentionOn();
                reminder.text += "Take Genius by tapping on board\n";
                geniusToken.interactive = true;
                button1.label.text = "All Spot Occupied";
                button1.settings.onTap = () => spaceOccupied();
                break;
            case SPACE_OCCUPIED:
                geniusWorkerFrame.attentionOff();
                genericSpaceOccupied();
                failedAction();
                break;
            case CHECK_IF_READY:
                actionText.text += "took " + target.name;
                geniusWorkerFrame.attentionOff();
                geniusToken.interactive = false;
                //+1vp
                points.increase(1);
                actionText.text += " and gained 1 VP.\n"

                button1.label.text="Continue";
                button1.settings.onTap = () => acceptAction();
                break;
            case SPACE_OCCUPIED_2:
                actionText.text += "No Genius availabe, try to perform ";
                B14( parentBoard, fromState, PERFORM_ACTION );
                break;
            case ACCEPT_ACTION:
                genericAcceptAction();
                break;

        }

    }

    function B07( parentBoard, fromState, status ) {
        construction( factoryBack, "Factory", status );
    }
    
    // Recruit
    function B10( parentBoard, fromState, status, kwargs ) {
        switch (status) {
            case PERFORM_ACTION:
                // Recruit
                actionText.text += "Recruit Action. ";
                reminder.text = "Any space at\nRecruit or\nWorld Council?";
                button0.visible = true;
                button0.label.text = "Have Free\nSpace";
                button0.settings.onTap = () => spaceFree();
                button1.label.text = "All Space\nOccupied";
                button1.settings.onTap = () => spaceOccupied();
                break;
            case SPACE_FREE:
                reminder.text = "Place Exosuit!\n";
                exoSuitBack.remove();
                button0.visible = false;
                // Recurit
                geniusWorkerFrame.attentionOn();
                workersFrame.attentionOn();
                reminder.text = "Take Worker by\ntapping on board\n";
                adminToken.interactive = true;
                engineerToken.interactive = true;
                scientistToken.interactive = true;
                geniusToken.interactive = true;
//                button1.label.text = "No Worker\nAvailable";
//                button1.settings.onTap = () => spaceOccupied();
                button1.visible = false;
               break;
            case SPACE_OCCUPIED:
                geniusWorkerFrame.attentionOff();
                workersFrame.attentionOff();
                genericSpaceOccupied();
                failedAction();
                break;
            case CHECK_IF_READY:
                actionText.text += "Took " + kwargs["target"].name;
                reminder.text = "";
                geniusWorkerFrame.attentionOff();
                workersFrame.attentionOff();
                adminToken.interactive = false;
                engineerToken.interactive = false;
                scientistToken.interactive = false;
                geniusToken.interactive = false;
                //+1vp
                points.increase(1);
                actionText.text += " and gained 1 VP. "

                button1.label.text="Continue";
                button1.settings.onTap = () => acceptAction();
                button1.visible = true;
                break;
            case ACCEPT_ACTION:
                geniusWorkerFrame.attentionOff();
                workersFrame.attentionOff();
                genericAcceptAction();
                break;
        }
    }
    
    // Construct LAB
    function B11( parentBoard, fromState, status ) {
        construction( labBack, "Lab", status );
    }
    
function validateResources() {
    alert("warning! some code is calling validateResources");
/*
    if (neutroniumToken.number>0 && uraniumToken.number>0 && goldToken.number>0 && titaniumToken.number>0) {
        neutroniumToken.remove();
        uraniumToken.remove();
        goldToken.remove();
        titaniumToken.remove();
        points.increase(5);
        actionText.text += "Complete Resource Set, gain 5 VP\n";
    }
*/
}

    // Mine
    function B12( parentBoard, fromState, status, kwargs ) {
        switch (status) {
            case PERFORM_ACTION:
                // Mine
                actionText.text += "Mine Action. ";
                reminder.text = "Any space at\nMine or\nWorld Council?";
                button0.visible = true;
                button0.label.text = "Mine Spot\nFree";
                button0.settings.onTap = () => spaceFree();
                button1.label.text = "Mine Spot\nOccupied";
                button1.settings.onTap = () => spaceOccupied();
                break;
            case SPACE_FREE:
                reminder.text = "Place Exosuit!\n";
                exoSuitBack.remove();
                button0.visible = false;
                // Mine
                resourcesFrame.attentionOn();
                reminder.text = "Take 2 Resources by\ntapping on board\n";
                neutroniumToken.interactive = true;
                uraniumToken.interactive = true;
                goldToken.interactive = true;
                titaniumToken.interactive = true;
                selectResources = 0;

                /*
                button1.label.text="Continue (2)";
                button1.visible = true;
                button1.settings.onTap = () => acceptAction();                  
                */
                button1.visible = false;
                break;
            case SPACE_OCCUPIED:
                resourcesFrame.attentionOff();
                genericSpaceOccupied();
                failedAction();
                break;
            case CHECK_IF_READY:
//                if ( ! this.setCollectionComplete ) {
                if( selectResources === 0 ) {
                    actionText.text += "Chronossue took";
                } else {
                    actionText.text += " and"
                }
                    actionText.text += " a " + kwargs["target"].name;
                    selectResources +=1;
//                }
                if (selectResources === 1) {
                    reminder.text = "Please take one\n more resource";
                    button1.label.text="Out of\nresource";
                    button1.visible = true;
                    button1.settings.onTap = () => acceptAction();                  
                } else if (selectResources >= 2) {
                    reminder.text = "";
                    actionText.text += ". ";

                    resourcesFrame.attentionOff();
                    neutroniumToken.interactive = false;
                    uraniumToken.interactive = false;
                    goldToken.interactive = false;
                    titaniumToken.interactive = false;
                    button1.label.text="Continue";
                    button1.visible = true;
                    button1.settings.onTap = () => acceptAction();
                }
                break;
            case ACCEPT_ACTION:
                if (neutroniumToken.number>0 && uraniumToken.number>0 && goldToken.number>0 && titaniumToken.number>0) {
                    neutroniumToken.remove();
                    uraniumToken.remove();
                    goldToken.remove();
                    titaniumToken.remove();
                    points.increase(5);
                    actionText.text += "Complete Resource Set, gain 5 VP. ";
                }
//                ac.text += ".\n";
                genericAcceptAction();
                break;
        }

    }

    // Power Plant
    function B13( parentBoard, fromState, status ) {
        construction( powerPlantBack, "Power Plant", status );
    }

    // Research
    function B14( parentBoard, fromState, status ) {
        switch (status) {
            case PERFORM_ACTION:
                // Research
                actionText.text += "RESEARCH action. ";
                button0.visible = true;
                button0.label.text = "Research Spot Free";
                button0.settings.onTap = () => B14( parentBoard, fromState, SPACE_FREE );
                button1.label.text = "Research Spot Occupied";
                button1.settings.onTap = () => B14( parentBoard, fromState, SPACE_OCCUPIED );
                break;
            case SPACE_FREE:
                reminder.text = "Place Exosuit!\n";
                exoSuitBack.remove();
                button0.visible = false;

                let researchDice = Math.floor(Math.random() * 3);
                actionText.text += "Roll the research die and take the " + researchItem[researchDice] + " Breakthrough Token.";
                researchCounter[researchDice].increase(1);

                for ( i = 0; i < researchCounter.length; i++ ) {
                    researchCounter[i].visible = true;
                }

                breakthroughBack.visible = true;

                button1.label.text = "Continue";
                button1.settings.onTap = () => acceptAction();                  
                break;
            case SPACE_OCCUPIED:
                genericSpaceOccupied();
                failedAction();
                break;
            case ACCEPT_ACTION:
                genericAcceptAction();
                break;
        }
    }
    
    // Reboot
    function C01A( parentBoard, fromState, status ) {
        switch (status) {
            case PERFORM_ACTION:
        // Reboot
        actionText.text += "REBOOT. ";
        button1.label.text = "Continue";
        button1.settings.onTap = () => acceptAction();        
                 break;
            case SPACE_FREE:
                break;
            case SPACE_OCCUPIED:
                break;
            case ACCEPT_ACTION:
                genericAcceptAction();
                break;
        }
   }

    function C02A( parentBoard, fromState, status ) {
        switch (status) {
            case PERFORM_ACTION:
                // Gain 2 VP
                actionText.text += "Gained 2 VP. ";
                points.increase(2);
                button0.visible = false;
                button1.label.text = "Continue";
                button1.settings.onTap = () => acceptAction();      
                break;
            case SPACE_FREE:
                break;
            case SPACE_OCCUPIED:
                break;
            case ACCEPT_ACTION:
                genericAcceptAction();
                break;
        }
    }

    function C03A( parentBoard, fromState, status ) {
        switch (status) {
            case PERFORM_ACTION:
                // Gain Energy Core
                actionText.text += "Gained one Energy Core. "
                energyCore.increase(1);
                button0.visible = false;
                button1.label.text = "Continue";
                button1.settings.onTap = () => acceptAction();      
                break;
            case SPACE_FREE:
                break;
            case SPACE_OCCUPIED:
                break;
            case ACCEPT_ACTION:
                genericAcceptAction();
                break;
        }
    }

    // Gain Energie Core then Auto Leap
    function C03B( parentBoard, fromState, status ) {
        switch (status) {
            case PERFORM_ACTION:
                // Gain Energy Core
                actionText.text += "Gained one Energy Core. "
                energyCore.increase(1);

                // auto leap, so botAction -1
                genericAcceptAction();
                botActions -= 1;
                actionText.text += getInfoTextlead() + "Autoleap Action: ";
                performAction();                
                break;
            case SPACE_FREE:
                break;
            case SPACE_OCCUPIED:
                break;
            case ACCEPT_ACTION:
                break;
        }
    }


// TEMPLATE FOR COPY
/*
    function C03B( parentBoard, fromState, status ) {
        switch (status) {
            case PERFORM_ACTION:
                break;
            case SPACE_FREE:
                break;
            case SPACE_OCCUPIED:
                break;
            case ACCEPT_ACTION:
                break;
        }
    }
*/