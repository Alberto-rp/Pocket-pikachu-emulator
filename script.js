// Load animations
let Anims = {};
fetch('./anims.json')
.then((response) => response.json())
.then((data) => {
    Anims = data;
    // EDIT ANIMATION
    Anims.edit = Anims.radioControl.radio1;
});

// Anim vars
let saved = null;
let clickedPixels = [];
let intervalAnim;
let animStatus = ''
let randomAnim;
let randomActivity;
let screenOff;
let throwBlocks = false;
let throwCandy = false;
let isWalking = false;
let throwTableAnim = '';
let avoidEatAfterWalk = false;
let isLateAwake = false;
let actionTimeOut = undefined; 
let auxiliarTimeout = undefined;
let auxiliarTimeout2 = undefined;
let auxiliarTimeout3 = undefined;
let coockieHadEating = document.cookie.split("; ").find((row) => row.startsWith("had_eating="))?.split("=")[1];
let coockieHasTakeBath = document.cookie.split("; ").find((row) => row.startsWith("had_take_bath="))?.split("=")[1];
let coockieHasBrushed = document.cookie.split("; ").find((row) => row.startsWith("has_brushed="))?.split("=")[1];
let coockieHasGoneSleep = document.cookie.split("; ").find((row) => row.startsWith("has_gone_sleep="))?.split("=")[1];
let isBrushing = false;
let stopPlaying = false;
let isAskingStudy = false;
let isDogTrick = false;
let isFastRC = false;
let avoidSleepGiftDev = false; //For development
const hasReach150 = (localStorage.getItem("hasReach150") != null)? true : false;
const hasReach300 = (localStorage.getItem("hasReach300") != null)? true : false;

// Steps
let pokeStatus = {};
pokeStatus.steps = (localStorage.getItem("steps") != null)? Number(localStorage.getItem("steps")) : 0;
pokeStatus.totalSteps = (localStorage.getItem("totalSteps") != null)? Number(localStorage.getItem("totalSteps")) : 0;
pokeStatus.watts = (localStorage.getItem("watts") != null)? Number(localStorage.getItem("watts")) : 50;
pokeStatus.friendshipLevel = (localStorage.getItem("friendshipLevel") != null)? Number(localStorage.getItem("friendshipLevel")) : 0;
pokeStatus.eatingtHours = (!hasReach300)? [10, 12, 18] : [12, 18];
pokeStatus.lickingHours = [15];
pokeStatus.playHours = [9, 10, 11, 13, 14, 16, 17];
pokeStatus.yoyoKiteHours = [16, 17];
pokeStatus.tvHours = (!hasReach300)? [18, 19] : [18, 19, 20];
pokeStatus.greetingHours = (!hasReach300)? [8, 12, 18] : [8, 12, 18, 19];
pokeStatus.bathHours = (!hasReach300)? [19] : [20];
pokeStatus.sleepHour = (!hasReach300)? 20 : 21;
pokeStatus.consecutiveSteps = 0;
pokeStatus.lastConected = (localStorage.getItem("lastConected") != null)? localStorage.getItem("lastConected") : new Date().toDateString();
pokeStatus.todayHasReachLimit150 = (document.cookie.split("; ").find((row) => row.startsWith("has_reach150_goal="))?.split("=")[1])? true : false;
pokeStatus.todayHasReachLimit300 = (document.cookie.split("; ").find((row) => row.startsWith("has_reach300_goal="))?.split("=")[1])? true : false;
pokeStatus.reachEnd = (localStorage.getItem("reachEnd") != null)? true : false;

// Fix Temporal
if(localStorage.getItem("initTamDate") == null){
    let auxDate = new Date();
    localStorage.setItem("initTamDate", `${auxDate.toDateString()} ${auxDate.getHours()}:00`);
}

// Watts
let wattsAux = {};
wattsAux.GivenCents = 0;
wattsAux.GivenDecs = 0;
wattsAux.GivenUnits = 0;
wattsAux.selectedUnitWatt = 'cent'
wattsAux.givenAmountWatts = 0

//Settings
let settings = {};
settings.relSelected = (localStorage.getItem("relDrop") != null)? localStorage.getItem("relDrop") : 'on';
settings.dificultySelected = (localStorage.getItem("dificultyLevel") != null)? localStorage.getItem("dificultyLevel") : "medium";
settings.dificultyLevels = {
    "easy" : {
        "walkAnims": {
            "toyCar": [250, 999],
            "bike": [500, 1490],
            "kart": [1000, 2249],
            "unicycle": [2250, 2999],
            "skateboard": [3000, 3999],
            "stilts": [4000],
        },
        "unlockAnims": [1500, 3000, 4500, 10000]
    },
    "medium" : {
        "walkAnims": {
            "toyCar": [2500, 9999],
            "bike": [5000, 14900],
            "kart": [10000, 22499],
            "unicycle": [22500, 29999],
            "skateboard": [30000, 39999],
            "stilts": [40000],
        },
        "unlockAnims": [15000, 30000, 45000, 100000]
    },
    "hard" : {
        "walkAnims": {
            "toyCar": [25000, 99999],
            "bike": [50000, 149000],
            "kart": [100000, 224999],
            "unicycle": [225000, 299999],
            "skateboard": [300000, 399999],
            "stilts": [400000],
        },
        "unlockAnims": [150000, 300000, 450000, 1000000]
    }
}

//Roulette
let roulete = {};
roulete.printBet = true;
roulete.gameStarted = false;
roulete.posibleStep = ['bet', 'try', 1, 2, 3];
roulete.selectedStep = roulete.posibleStep[0];
roulete.slot1 = ['seven', 'flower', 'pika', 'seven', 'fish', 'flower', 'seven', 'fish'];
roulete.slot2 = ['seven', 'fish', 'flower', 'pika', 'seven', 'fish', 'flower', 'pika'];
roulete.slot3 = ['seven', 'fish', 'flower', 'pika', 'fish', 'flower', 'pika', 'fish'];
roulete.randomWin = ['fish', 'fish', 'flower', 'pika', 'flower'];
roulete.randomWinSel = '';
roulete.selectedSlot1 = (localStorage.getItem("selectedSlot1") != null)? Number(localStorage.getItem("selectedSlot1")) : 0;
roulete.selectedSlot2 = (localStorage.getItem("selectedSlot2") != null)? Number(localStorage.getItem("selectedSlot2")) : 0;
roulete.selectedSlot3 = (localStorage.getItem("selectedSlot3") != null)? Number(localStorage.getItem("selectedSlot3")) : 0;
roulete.hasWin777 = (document.cookie.split("; ").find((row) => row.startsWith("has_win_777="))?.split("=")[1])? true : false;
roulete.intervalRoulette1 = undefined;
roulete.intervalRoulette2 = undefined;
roulete.intervalRoulette3 = undefined;
roulete.stopSlot1 = false;
roulete.stopSlot2 = false;
roulete.stopSlot3 = false;
roulete.forcedSlot1 = '';
roulete.forcedSlot2 = '';
roulete.forcedSlot3 = '';
roulete.totalLosses = 0;
roulete.hackSteps = 0;

document.addEventListener('DOMContentLoaded', () => {
    const createScreen = document.querySelector('.createScreen');
    const DisplayScreen = document.querySelector('.screen');

    // Info Version and Updates modal
    let infoModal = document.querySelector("#updateModal");
    let infoModalButton = document.querySelector("#closeModal");
    let currentVersion = document.querySelector('#updateModal .version').innerHTML;
    coockieInfoModal = document.cookie.split("; ").find((row) => row.startsWith(`Closed${currentVersion}=`))?.split("=")[1];
    
    if(!coockieInfoModal) {
        infoModal.showModal();
        infoModalButton.addEventListener('click', () => {
            // Declare cookie
            let now = new Date();
            now.setFullYear(now.getFullYear() + 1);
            document.cookie = `Closed${currentVersion}=true; expires="${now}"; path=/`;
        })
    }


    if(localStorage.getItem("InitTamagotchi") == null){
        restartTamagotchi(DisplayScreen);
    }else{

        // Update friendshipLevel if relDropdown is enabled and days have passed
        if(settings.relSelected == 'on'){
            let lastDate = new Date(pokeStatus.lastConected);
            let today = new Date();
            let daysPassed = Math.trunc((today - lastDate) / (1000 * 3600 * 24));

            if(daysPassed != 0){
                // The friendShip Level drops 100 points per day naturally
                let relDropped = daysPassed * -100;
                
                // The max is -1500, it can't drops more
                if(pokeStatus.friendshipLevel > -1500){
                    if((pokeStatus.friendshipLevel + relDropped) > -1500){
                        updateFriendshipLevel(relDropped, false, false);
                    }else {
                        // To avoid drop more than -1500
                        pokeStatus.friendshipLevel = -1500;
                        localStorage.setItem("friendshipLevel", pokeStatus.friendshipLevel)
                    }
                }
            }

        }

        //Update last-conected item
        pokeStatus.lastConected = new Date().toDateString();
        localStorage.setItem("lastConected", pokeStatus.lastConected);

        //Init Pantalla
        loadAnim(DisplayScreen, null, true);
    }
    

    /* DEV TOOLS */
    // Developer screen
    loadAnim(createScreen, null, true);
    if(window.location.href.indexOf('github.io') != -1 || window.location.href.indexOf('pokpik.life') != -1){
        document.querySelector('.developerScreen').classList.add('hide');
    }else{
        document.querySelector('.developerScreen').style.display = 'block';
    }

    //Drawing functionality
    createScreen.addEventListener('click', draw)

    function draw(event) {
        if(event.target.classList[0] == 'createScreen') return

        if(event.target.classList.contains('clicked')){
            event.target.classList.remove('clicked')
        }else{
            event.target.classList.add('clicked')
        }
    }

    //Saving Animation
    document.querySelector("#saveAnimation").addEventListener('click', () => {
        console.log('SAVED');
        saved = document.querySelectorAll('.createScreen .pixel');
        clickedPixels = [];
        let exitString = '[';
        saved.forEach((element, index) => {
            if(element.classList.contains('clicked')){
                clickedPixels.push(element.classList[1])
                exitString += `\"${element.classList[1]}\", `
            }
        });

        exitString = exitString.slice(0, -2);
        exitString += ']';

        // Output
        navigator.clipboard.writeText(exitString)
        console.log(exitString)
    })

    //Print Editing Animation
    document.querySelector("#printInit").addEventListener('click', () => {
        loadAnim(DisplayScreen, Anims.edit)
    })

    //EDIT
    //Load Animation to work with
    document.querySelector("#editPrint").addEventListener('click', () => {
        loadAnim(createScreen, Anims.edit)
    })

    //ERASER
    let eraserEvent = false;
    document.querySelector("#eraser").addEventListener('click', () => {
        eraserEvent = !eraserEvent;

        if(eraserEvent){
            createScreen.addEventListener('mouseover', erase)
            document.querySelector("#eraser").style.backgroundColor = 'red'
        }else{
            createScreen.removeEventListener('mouseover', erase)
            document.querySelector("#eraser").style.backgroundColor = ''
        }
    });

    function erase(event) {
        if(event.target.classList[0] == 'createScreen') return
        
        if(event.target.classList.contains('clicked')){
            event.target.classList.remove('clicked')
        }
    }

    function isiOS() {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)

    }

    //INIT TAMAGOTCHI / ENTER
    // var clockInterval;
    document.querySelector("#enter-button").addEventListener('click', () => {
        if(!pokeStatus.reachEnd){
            enterButton();  
        }else{
            if(document.querySelector('.walkCounter').innerHTML == ''){
                document.querySelector('.walkCounter').innerHTML = pokeStatus.steps;
                loadEnd();
            }else{
                //Show Record
                loadAnim(DisplayScreen, Anims.record.base);
                displayRecord(DisplayScreen);
            }
        }
    }); 
    function enterButton () {
        let timeStart = new Date();
        if(!isiOS()){
            window.navigator.vibrate(10);
        }
        if(animStatus == 'pokeball') {
            if(!isiOS()){
                window.navigator.vibrate([200, 700, 200]);
            }
            clearInterval(intervalAnim);
            clearAllTimeouts();
            restartTamagotchi(DisplayScreen, true)
        }else if(animStatus == 'gift'){
            if((isLateAwake || !(timeStart.getHours() >= pokeStatus.sleepHour && timeStart.getHours() <= 23 || timeStart.getHours() >= 0 && timeStart.getHours() < 8)) || avoidSleepGiftDev){
                if(wattsAux.selectedUnitWatt != 'give'){
                    let posibleUnits = ['cent', 'dec', 'unit', 'give'];
                    // Seleccionar la siguiente unidad
                    wattsAux.selectedUnitWatt = (posibleUnits.indexOf(wattsAux.selectedUnitWatt) < (posibleUnits.length - 1))? posibleUnits[posibleUnits.indexOf(wattsAux.selectedUnitWatt) + 1] : wattsAux.selectedUnitWatt
                }else if(wattsAux.selectedUnitWatt == 'give' && wattsAux.givenAmountWatts <= pokeStatus.watts){
                    console.log(`${wattsAux.givenAmountWatts} was given`);
                    clearInterval(intervalAnim);
                    clearAllTimeouts();
                    resetGivenWatts();
    
                    // Give present to Pikachu / Update friendship level
                    updateFriendshipLevel(wattsAux.givenAmountWatts, true, true);
                }
            }
        }else if(animStatus == 'game'){
            let {posibleStep, selectedStep, selectedSlot1, selectedSlot2, selectedSlot3, randomWinSel} = roulete; //Desestructuracion de objeto


            if(selectedStep == 1){
                selSlot1 = roulete.slot1[selectedSlot1];
                roulete.stopSlot1 = true;
                roulete.forcedSlot1 = '';
                if(roulete.totalLosses == 5){
                    roulete.forcedSlot1 = randomWinSel; //If it's necesary to force a victory
                }else if(roulete.hackSteps > 150 && !roulete.hasWin777){
                    roulete.forcedSlot1 = 'seven';
                }
            }
            if(selectedStep == 2 && roulete.stopSlot1){
                selSlot2 = roulete.slot2[selectedSlot2];
                roulete.stopSlot1 = true;
                roulete.stopSlot2 = true;
                roulete.forcedSlot2 = '';
                if(roulete.totalLosses == 5){
                    roulete.forcedSlot2 = randomWinSel; //If it's necesary to force a victory
                }else if(roulete.hackSteps > 150 && !roulete.hasWin777){
                    roulete.forcedSlot2 = 'seven';
                }
            }
            if(selectedStep == 3 && roulete.stopSlot2){
                selSlot3 = roulete.slot3[selectedSlot3];
                roulete.stopSlot1 = true;
                roulete.stopSlot2 = true;
                roulete.stopSlot3 = true;
                roulete.forcedSlot3 = '';
                if(roulete.totalLosses == 5){
                    roulete.forcedSlot3 = randomWinSel; //If it's necesary to force a victory
                }else if(roulete.hackSteps > 150 && !roulete.hasWin777){
                    roulete.forcedSlot3 = 'seven';
                    roulete.hackSteps += 1; //To avoid the hack to soon
                }
            }

            // Move foward the next step; Try step is managed in rouletteGame();
            if(selectedStep != 'try'){
                roulete.selectedStep = (posibleStep.indexOf(selectedStep) < (posibleStep.length - 1))? posibleStep[posibleStep.indexOf(selectedStep) + 1] : selectedStep
            }

        }else if(animStatus == 'settings'){
            switch (selectedSettingMenu) {
                case 'reset':
                    pokeStatus.steps = 0;
                    document.querySelector('.walkCounter').innerHTML = pokeStatus.steps;
                    localStorage.setItem("steps", pokeStatus.steps);
                    break;
            
                case 'relDrop':
                    // Show the actual setting selected
                    animStatus = 'settingsRel'
                    loadAnim(DisplayScreen, Anims.settingsRel[settings.relSelected])
                    break;

                case 'diffLevel':
                    // Show the actual difficulty selected
                    animStatus = 'settingsDiff'
                    loadAnim(DisplayScreen, Anims.settingsDiff[`${settings.dificultySelected}Selected`])
                    break;
            }
        }else if(animStatus == 'settingsRel'){
            settings.relSelected = settings.relSelected == 'off' ? 'on' : 'off';
            loadAnim(DisplayScreen, Anims.settingsRel[settings.relSelected])
            localStorage.setItem("relDrop", settings.relSelected);
        }else if(animStatus == 'settingsDiff'){
            console.log(`${settings.dificultySelected} difficulty selected`);
            loadAnim(DisplayScreen, Anims.settingsDiff[`${settings.dificultySelected}Selected`]);
            localStorage.setItem("dificultyLevel", settings.dificultySelected);
            let limit150 = settings.dificultyLevels[settings.dificultySelected]["unlockAnims"][0];
            let limit300 = settings.dificultyLevels[settings.dificultySelected]["unlockAnims"][1];

            if(pokeStatus.totalSteps < limit150){
                localStorage.removeItem('hasReach150');
                deleteCookies('has_reach150_goal');
            }
            if(pokeStatus.totalSteps < limit300){
                localStorage.removeItem('hasReach300');
                deleteCookies('has_reach300_goal');
            }
        }else if(animStatus != 'restart'){
            // Init screen (Timeouts to emulate analogic)
            //STANDAR START
            setTimeout(() => {
                document.querySelector('.walkCounter').innerHTML = pokeStatus.steps;
            }, 200);
            setTimeout(() => {
                if(animStatus == ''){
                    document.querySelector("#clockMenu").classList.add('selected')
                }
            }, 400);
    
            // Clear interval to switch off the screen in 60s
            clearInterval(screenOff);
    
            // Basic start
            setTimeout(() => {
                if(animStatus == ''){
                    stopPlaying = false;
                    randomAnim = Math.floor(Math.random() * (10 - 1 + 1) + 1); //1-10
                    randomActivity = Math.floor(Math.random() * (20 - 1 + 1) + 1); //1-20
                    coockieHadEating = document.cookie.split("; ").find((row) => row.startsWith("had_eating="))?.split("=")[1];
                    coockieHasBrushed = document.cookie.split("; ").find((row) => row.startsWith("has_brushed="))?.split("=")[1];
                    coockieHasGoneSleep = document.cookie.split("; ").find((row) => row.startsWith("has_gone_sleep="))?.split("=")[1];
                    coockieHasTakeBath = document.cookie.split("; ").find((row) => row.startsWith("had_take_bath="))?.split("=")[1];
                    basicAnim();
                }else{
                    if(animStatus != 'clock' && animStatus != 'gift' && animStatus != 'game'){ // | gift | game
                        let menuSelected = document.querySelector('.menuBar .selected').id
                        console.log(menuSelected)
                        switch (menuSelected) {
                            case "clockMenu": //CLOCK
                                clearInterval(intervalAnim);
                                clearAllTimeouts();
                                animStatus = 'clock'
                                console.log(animStatus)
                                document.querySelector(`#${menuSelected}`).classList.remove('selected')
                                clockFunc();
                                intervalAnim = setInterval(clockFunc, 500);
                                function clockFunc() {
                                    let timeStart = new Date();
                                    let hours = ((timeStart.getHours() + 24) % 12 || 0).toString() //Get 0 - 12 hours
                                    let minutes = timeStart.getMinutes().toString().split('') // Get minutes
                                    let pmState = (timeStart.getHours() > 12)? true : false; //Get PM or AM
        
                                    printHour(DisplayScreen, hours, minutes, pmState);
                                }
                                break;
                            case "giftMenu":
                                // Clean states
                                let timeStart = new Date();
                                clearInterval(intervalAnim);
                                clearAllTimeouts();
                                animStatus = 'gift'
                                console.log(animStatus)
                                document.querySelector(`#${menuSelected}`).classList.remove('selected')

                                // Avoid to turn off the screen during game
                                clearInterval(screenOff);

                                if(pokeStatus.friendshipLevel <= -1500){
                                    loadAnim(DisplayScreen, Anims.gift.whereIsPikachu)
                                }else{
                                    // Sleep
                                    if ((!isLateAwake && (timeStart.getHours() >= pokeStatus.sleepHour && timeStart.getHours() <= 23 || timeStart.getHours() >= 0 && timeStart.getHours() < 8)) && !avoidSleepGiftDev){
                                        loadAnim(DisplayScreen, Anims.gift.sleeping)
                                    }else{
                                        // Prepare Gift
                                        displayTotalWatts(DisplayScreen);
                                        intervalAnim = setInterval(SelectWatts, 500);
                                        function SelectWatts(){
                                            displayTotalWatts(DisplayScreen); //If not here doesn't clean the screen
                                            SelectWattsAmount(DisplayScreen, wattsAux.GivenCents, wattsAux.GivenDecs, wattsAux.GivenUnits, wattsAux.selectedUnitWatt)
                                        }
                                    }
                                }
                                break;
                            case "gameMenu":
                                // Clean states
                                clearInterval(intervalAnim);
                                clearAllTimeouts();
                                animStatus = 'game'
                                console.log(animStatus)
                                document.querySelector(`#${menuSelected}`).classList.remove('selected')

                                // Avoid to turn off the screen during game
                                clearInterval(screenOff);

                                // Init screen before interval
                                let {selectedSlot1, selectedSlot2, selectedSlot3} = roulete;
                                displayTotalWatts(DisplayScreen, 'game', true);

                                // Init game interval
                                intervalAnim = setInterval(initGame, 500);
                                function initGame(){
                                    displayTotalWatts(DisplayScreen, 'game'); //If not here doesn't clean the screen
                                    rouletteGame(DisplayScreen);
                                }
                                break;
                        }
                    }
                }
    
            }, 500);
    
    
            // APAGAR LA PANTALLA
            screenOff = setInterval(switchOff, 60000)
            function switchOff() {
                resetGivenWatts();
                clearInterval(intervalAnim);
                clearAllTimeouts();
                animStatus = ''
                isLateAwake = false;
                cleanStates();
                document.querySelector('.walkCounter').innerHTML = '';
                loadAnim(DisplayScreen, null, true);
                clearInterval(screenOff);
            }
        }
    }


    // BACK BUTTON
    let backMenusAllowed = ['clock', 'state', 'settings', 'game']
    document.querySelector("#back-button").addEventListener('click', () => {
        if(!isiOS()){
            window.navigator.vibrate(10);
        }
        if(backMenusAllowed.some(anim => anim == animStatus) && !(animStatus == 'game' && roulete.gameStarted) || animStatus == 'gift' && wattsAux.selectedUnitWatt == 'cent'){
            selectedSettingMenu = settingsMenus[1];
            roulete.selectedStep = roulete.posibleStep[0];
            clearInterval(intervalAnim);
            clearAllTimeouts();
            resetGivenWatts();
            document.querySelector("#clockMenu").classList.add('selected')

            // APAGAR LA PANTALLA AL MINUTO
            clearInterval(screenOff);

            screenOff = setInterval(switchOff, 60000)
            function switchOff() {
                resetGivenWatts();
                clearInterval(intervalAnim);
                clearAllTimeouts();
                animStatus = ''
                isLateAwake = false;
                cleanStates();
                document.querySelector('.walkCounter').innerHTML = '';
                loadAnim(DisplayScreen, null, true);
                clearInterval(screenOff);
            }

            basicAnim(false, false, true, avoidEatAfterWalk);

        }else if(animStatus == 'gift' && wattsAux.selectedUnitWatt != 'cent'){
            let posibleUnits = ['cent', 'dec', 'unit', 'give'];
            // Seleccionar la anterior unidad
            if(wattsAux.selectedUnitWatt != 'give'){
                wattsAux.selectedUnitWatt = (posibleUnits.indexOf(wattsAux.selectedUnitWatt) > 0)? posibleUnits[posibleUnits.indexOf(wattsAux.selectedUnitWatt) - 1] : wattsAux.selectedUnitWatt
            }else{
                wattsAux.selectedUnitWatt = 'cent'
            }
        }else if(animStatus == 'settingsRel'){
            animStatus = 'settings'
            loadAnim(DisplayScreen, Anims.settings.relDrop)
        }else if(animStatus == 'settingsDiff'){
            animStatus = 'settings'
            settings.dificultySelected = (localStorage.getItem("dificultyLevel") != null)? localStorage.getItem("dificultyLevel") : "medium";
            loadAnim(DisplayScreen, Anims.settings.diffLevel)
        }
    })

    // STATE BUTTON / FRIENDSHIP BUTTON
    let allowedAnims = ['stand', 'standMad', 'sleeping', 'yawnHappy', 'tongueAnim', 'happySteps', 'heartSmiles', 'writeLetter', 'flying', 'rollingBall', 'diving', 'backFlip', 'piano', 'standLike', 'standLove', 'left', 'brushTeeth', 'sandcastle', 'reading', 'watchTV', 'bathTime', 'buildingBlocks', 'licking', 'studying', 'flyKite', 'flyKiteFast', 'playingRC', 'playingRCfast', 'playingYoyo', 'playingHorn', 'walking', 'eating'];
    let menus = ['clockMenu', 'giftMenu', 'gameMenu'];

    document.querySelector("#state-button").addEventListener('click', () => {
        //Event Analitics
        gtag('event', 'stateButtonEvent', {
            'boton_id': 'stateButton',
            'friendship_level': pokeStatus.friendshipLevel,
            'total_steps': pokeStatus.totalSteps,
            'watts': pokeStatus.watts
        });

        if(!isiOS()){
            window.navigator.vibrate(10);
        }
        if(allowedAnims.some(anim => anim == animStatus)){
            cleanStates();
            animStatus = 'state'
            clearInterval(intervalAnim)
            clearAllTimeouts();
            displayState(DisplayScreen);
        }
    })

    // START BUTTON / SETTINGS
    let settingsMenus = ['reset', 'diffLevel', 'relDrop'];
    let selectedSettingMenu = settingsMenus[1]
    document.querySelector("#menu-button").addEventListener('click', () => {
        if(!isiOS()){
            window.navigator.vibrate(10);
        }
        if(allowedAnims.some(anim => anim == animStatus) && !pokeStatus.reachEnd) {
            cleanStates();
            animStatus = 'settings'
            clearInterval(intervalAnim)
            clearAllTimeouts();
            loadAnim(DisplayScreen, Anims.settings.diffLevel)
        }else if(animStatus == '' && !pokeStatus.reachEnd) {
            enterButton();
        }
    })

    // RIGHT BUTTON
    document.querySelector('#right-button').addEventListener('click', () => {
        if(!isiOS()){
            window.navigator.vibrate(10);
        }
        if(animStatus != '' && allowedAnims.some(anim => anim == animStatus)){
            let selected = menus.find(item => document.querySelector(`#${item}`).classList.contains('selected'))
            let nextMenu = (menus.indexOf(selected) < (menus.length - 1))? (menus.indexOf(selected) + 1) : menus.indexOf(selected)
            // console.log('right')
            document.querySelector(`#${selected}`).classList.remove('selected');
            document.querySelector(`#${menus[nextMenu]}`).classList.add('selected');
        }
    })

    // LEFT BUTTON
    document.querySelector('#left-button').addEventListener('click', () => {
        if(!isiOS()){
            window.navigator.vibrate(10);
        }
        if(animStatus != '' && allowedAnims.some(anim => anim == animStatus)){
            let selected = menus.find(item => document.querySelector(`#${item}`).classList.contains('selected'))
            let nextMenu = (menus.indexOf(selected) > 0)? (menus.indexOf(selected) - 1) : menus.indexOf(selected)
            // console.log('right')
            document.querySelector(`#${selected}`).classList.remove('selected');
            document.querySelector(`#${menus[nextMenu]}`).classList.add('selected');
        }
    })

    // TOP BUTTON
    document.querySelector('#top-button').addEventListener('click', () => {
        if(!isiOS()){
            window.navigator.vibrate(10);
        }
        if(animStatus == 'gift'){
            switch (wattsAux.selectedUnitWatt) {
                case "cent":
                    wattsAux.GivenCents = (wattsAux.GivenCents < 9)? (wattsAux.GivenCents + 1) : 0
                    break;
                case "dec":
                    wattsAux.GivenDecs = (wattsAux.GivenDecs < 9)? (wattsAux.GivenDecs + 1) : 0
                    break;
                case "unit":
                    wattsAux.GivenUnits = (wattsAux.GivenUnits < 9)? (wattsAux.GivenUnits + 1) : 0
                    break;
            }
        }else if(animStatus == 'settings') {
            let indexSelected = settingsMenus.indexOf(selectedSettingMenu);
            selectedSettingMenu = (indexSelected > 0)? settingsMenus[indexSelected - 1] : selectedSettingMenu;
            loadAnim(DisplayScreen, Anims.settings[selectedSettingMenu])
        }else if(animStatus == 'settingsDiff') {
            let {dificultyLevels, dificultySelected} = settings;
            const levels = Object.keys(dificultyLevels);
            let indexSelected = levels.indexOf(dificultySelected);
            settings.dificultySelected = (indexSelected > 0)? levels[indexSelected - 1] : dificultySelected;
            loadAnim(DisplayScreen, Anims.settingsDiff[settings.dificultySelected])
        }
    })

    // BOTTOM BUTTON
    document.querySelector('#bottom-button').addEventListener('click', () => {
        if(!isiOS()){
            window.navigator.vibrate(10);
        }
        if(animStatus == 'gift'){
            switch (wattsAux.selectedUnitWatt) {
                case "cent":
                    wattsAux.GivenCents = (wattsAux.GivenCents > 0)? (wattsAux.GivenCents - 1) : 9
                    break;
                case "dec":
                    wattsAux.GivenDecs = (wattsAux.GivenDecs > 0)? (wattsAux.GivenDecs - 1) : 9
                    break;
                case "unit":
                    wattsAux.GivenUnits = (wattsAux.GivenUnits > 0)? (wattsAux.GivenUnits - 1) : 9
                    break;
            }
        }else if(animStatus == 'settings') {
            let indexSelected = settingsMenus.indexOf(selectedSettingMenu);
            selectedSettingMenu = (indexSelected < 2)? settingsMenus[indexSelected + 1] : selectedSettingMenu;
            loadAnim(DisplayScreen, Anims.settings[selectedSettingMenu])
        }else if(animStatus == 'settingsDiff') {
            let {dificultyLevels, dificultySelected} = settings;
            const levels = Object.keys(dificultyLevels);
            let indexSelected = levels.indexOf(dificultySelected);
            settings.dificultySelected = (indexSelected < 2)? levels[indexSelected + 1] : dificultySelected;
            loadAnim(DisplayScreen, Anims.settingsDiff[settings.dificultySelected])
        }
    })

    //RESET BUTTON
    document.querySelector('#reset-button').addEventListener('click', () => {
        if(!isiOS()){
            window.navigator.vibrate(2000);
        }
        console.log(animStatus)
        if(animStatus != 'restart' && animStatus != 'pokeball'){
            restartTamagotchi(DisplayScreen);
        }
    })

    // Test Animation / test anim
    document.querySelector("#startAnim").addEventListener('click', () => {
        clearAllTimeouts();
        clearInterval(intervalAnim);
        randomAnim = Math.floor(Math.random() * (10 - 1 + 1) + 1); //1-10
        yawnAnim();
    })

    // ShowHelp Grid
    document.querySelector("#showGrid").addEventListener('click', () => {
        let pixels = document.querySelectorAll('.pixel .number');
        pixels.forEach((element, index) => {
            if(element.style.display == 'none' || element.style.display == ''){
                element.style.display = 'block'
            }else{
                element.style.display = 'none'
            }
        });
    })
    document.querySelector("#showGridVer").addEventListener('click', () => {
        let pixels = document.querySelectorAll('.pixel .numberVer');
        pixels.forEach((element, index) => {
            if(element.style.display == 'none' || element.style.display == ''){
                element.style.display = 'block'
            }else{
                element.style.display = 'none'
            }
        });
    })

    // Basic stand animation
    function basicAnim(avoidActivity=false, avoidSleep=false, avoidGreeting=false, avoidEat=false) {
        avoidSleep = (avoidSleep)? avoidSleep : avoidSleepGiftDev; //For development
        avoidActivity = (avoidActivity)? avoidActivity : stopPlaying;
        animStatus = 'stand'
        let startTime = new Date();
        let sleepCounter = 1
        console.log(randomAnim);
        console.log("start")
        
        if(pokeStatus.friendshipLevel <= -1500){ // If pikachu left he doesn't sleep or play
            animStatus = 'left'
            let showShock = 1
            animate();
            intervalAnim = setInterval(animate, 500);
            function animate() {
                if(showShock == 1){
                    loadAnim(DisplayScreen, Anims.standLeft)
                    showShock++
                }else {
                    showShock = 1
                    loadAnim(DisplayScreen, null, true);
                }
            }
        }else{
            // Sleep
            if (!avoidSleep && !isLateAwake && (startTime.getHours() >= pokeStatus.sleepHour && startTime.getHours() <= 23 ||
                startTime.getHours() >= 0 && startTime.getHours() < 8)){
                animStatus = 'sleeping';
                
                // Update the cookieValue after goinToSleep, to avoid error of multiple times going to sleep
                coockieHasGoneSleep = document.cookie.split("; ").find((row) => row.startsWith("has_gone_sleep="))?.split("=")[1];

                if((coockieHasGoneSleep != 'true' && startTime.getHours() == pokeStatus.sleepHour) || randomAnim <= 3) {
                    slepAnim = Anims.sleep.frontSleep;
                    slepAnim2 = Anims.sleep.frontSleep2;
                }else if(randomAnim >= 4 && randomAnim <= 6){
                    slepAnim = Anims.sleep.sideSleep;
                    slepAnim2 = Anims.sleep.sideSleep2;
                }else {
                    slepAnim = Anims.sleep.backSleep;
                    slepAnim2 = Anims.sleep.backSleep2;
                }

                if(startTime.getHours() == pokeStatus.sleepHour && coockieHasGoneSleep != 'true'){
                    loadAnim(DisplayScreen, Anims.sleep.goingToSleep)
                    auxiliarTimeout = setTimeout(() => {
                        loadAnim(DisplayScreen, Anims.sleep.enteringBed)
                    }, 2000);
                    auxiliarTimeout2 = setTimeout(() => {
                        // Start Sleeping
                        intervalAnim = setInterval(animate, 1200);

                        // Declare cookie
                        var now = new Date();
                        now.setTime(now.getTime() + 3600 * 1000); // Agregamos 1 hora en milisegundos
                        document.cookie = "has_gone_sleep=true; expires=" + now + "; path=/";
                        console.log("Cookie Sleep declared");
                    }, 3000);
                }else{
                    loadAnim(DisplayScreen, slepAnim)
                    intervalAnim = setInterval(animate, 1200);
                }

                function animate() {   
                    if(sleepCounter <= 1){
                        loadAnim(DisplayScreen, slepAnim2)
                        sleepCounter++
                    }else{
                        loadAnim(DisplayScreen, slepAnim)
                        sleepCounter = (sleepCounter < 2)? (sleepCounter + 1) : 1;
                    }
                }
            }else {
                // Eating -- eatingtHours = [12, 18]
                if( !avoidEat && pokeStatus.eatingtHours.some(elem => elem == startTime.getHours()) && coockieHasBrushed != 'true' && startTime.getMinutes() <= 30) {
                    if(coockieHadEating != 'true'){
                        eating();
                    }else if(coockieHasBrushed != 'true'){
                        brushTeeth();
                    }
                }else if(!avoidActivity && pokeStatus.lickingHours.some(elem => elem == startTime.getHours())){
                    licking();
                }else{
                    if(pokeStatus.friendshipLevel <= -500){ // If pikachu is mad he doesn't play
                        animStatus = 'standMad'
                        animate(true);
                        intervalAnim = setInterval(animate, 1000);
        
                        function animate() {
                            endTime = new Date();
                            var timeDiff = endTime - startTime;
                            timeDiff /= 1000;
                            secondsElapsed = Math.round(timeDiff)
                
                            if(secondsElapsed % 4 == 0 && secondsElapsed != 0){
                                loadAnim(DisplayScreen, Anims.standMad.extend)
                            }else {
                                loadAnim(DisplayScreen, Anims.standMad.stand)
                            }
                        }
                    }else{ //Friendship level OK
                        if(pokeStatus.bathHours.some(elem => elem == startTime.getHours()) && (coockieHasTakeBath != 'true' || coockieHasBrushed != 'true')){// Bath Time
                            if(coockieHasTakeBath != 'true'){
                                bathTime();
                            }else{
                                brushTeeth();
                            }
                        }else if(!avoidActivity && pokeStatus.yoyoKiteHours.some(elem => elem == startTime.getHours()) && randomAnim >= 4 && ((hasReach150 && randomAnim > 5) || hasReach300 || pokeStatus.todayHasReachLimit150)){
                            // YOYO / KITE
                            if(randomActivity <= 10 || !hasReach300){
                                flyKite();
                            }else {
                                playingYoyo();
                            }
                        }else if(!avoidActivity && pokeStatus.playHours.some(elem => elem == startTime.getHours()) && randomAnim >= 4){//PlayingTime
                            // Random activities
                            console.log("PlayingTime" + randomActivity)

                            if(randomActivity <= 7){
                                if(!hasReach300){
                                    sandcastle();
                                }else{
                                    study('maths');
                                }
                            }else if(randomActivity >= 8 && randomActivity <= 14){
                                if(!hasReach300){
                                    buildingBlocks();
                                }else{
                                    study('history');
                                }
                            }else if(randomActivity >= 15){
                                if(!hasReach300){
                                    reading();
                                }else{
                                    sandcastle();
                                }
                            }
                        }else if(!avoidActivity && pokeStatus.tvHours.some(elem => elem == startTime.getHours()) && randomAnim <= 4){//Watching TV
                            if(randomActivity <= 10 || !hasReach300){
                                watchTV();
                            }else {
                                playingRC();
                            }
                        }else{
                            // STAND ANIM
                            if(pokeStatus.friendshipLevel > -500 && pokeStatus.friendshipLevel <= 1500){ // OK status
                                animate(true);
                                intervalAnim = setInterval(animate, 1000);
                                
                                function animate() {
                                    // Check the time pased
                                    endTime = new Date();
                                    var timeDiff = endTime - startTime; //in ms
                                    timeDiff /= 1000;
                                    secondsElapsed = Math.round(timeDiff)
                                    animStatus = 'stand'
                        
                                    if(secondsElapsed % 4 == 0 && secondsElapsed != 0){
                                        loadAnim(DisplayScreen, Anims.standBasic.extend)
                                        // animStatus = 'extend'
                                    }else {
                                        loadAnim(DisplayScreen, Anims.standBasic.stand)
                                    }
                                    
                                }
                            }else if(pokeStatus.friendshipLevel > 1500){ // Like and love status
                                if(!avoidGreeting && pokeStatus.greetingHours.some(elem => elem == startTime.getHours())){
                                    let randomGreeting = Math.floor(Math.random() * (10 - 1 + 1) + 1); //1-10
                                    if(randomGreeting <= 7){
                                        yawnAnim();
                                    }else{
                                        heartSmiles();
                                    }
                                }else{
                                    if(pokeStatus.friendshipLevel <= 3000){
                                        standLike();                                
                                    }else{
                                        standLove();
                                    }
                                }
                            }

                        }
                    }
        
                }
    
            }
        }
    }

    //SHAKE WALK
    document.querySelector('#shake').addEventListener('click', () => {
        if(!isiOS()){
            window.navigator.vibrate(10);
        }
        let screenShaked = document.querySelector('.screenContainer, .buttonsContainer');
        let buttonShake = document.querySelector('#shake');
        pokeStatus.consecutiveSteps++

        // To avoid to the action until shake is over
        clearTimeout(actionTimeOut);
        
        // Shake the screen
        screenShaked.style.marginTop = '-15px';
        buttonShake.style.marginTop = '15px';
        setTimeout(() => {
            screenShaked.style.marginTop = '0px';
            buttonShake.style.marginTop = '0px';
            walk();
            if(animStatus == 'state') {
                displayState(DisplayScreen);
            }
        }, 250);

        // To stop walking anim
        if(isWalking){
            actionTimeOut = setTimeout(() => {
                clearInterval(intervalAnim);
                isWalking = false;
                pokeStatus.consecutiveSteps = 0;
                screenOff = setInterval(switchOff, 60000)
                walking(true);
                function switchOff() {
                    resetGivenWatts();
                    clearInterval(intervalAnim);
                    clearAllTimeouts();
                    animStatus = ''
                    isLateAwake = false;
                    cleanStates();
                    document.querySelector('.walkCounter').innerHTML = '';
                    loadAnim(DisplayScreen, null, true);
                    clearInterval(screenOff);
                }
            }, 1000);
        }

        // To start walking or make its action
        //['stand', 'standMad', 'sleeping', 'yawnHappy', 'tongueAnim', 'happySteps', 'heartSmiles', 'writeLetter', 'flying', 'rollingBall', 'diving', 'backFlip', 'piano', 'standLike', 'standLove', 'left', 'brushTeeth', 'sandcastle', 'reading', 'watchTV', 'bathTime', 'buildingBlocks', 'licking', 'studying', 'flyKite', 'flyKiteFast', 'playingRC', 'playingRCfast', 'playingYoyo', 'playingHorn', 'walking', 'eating'];
        let walkingAllowedAnims = ['stand', 'standMad', 'sandcastle', 'standLove', 'standLike', 'eating', 'bathTime', 'playingRC', 'playingRCfast', 'watchTV', 'reading', 'buildingBlocks'];
        if(pokeStatus.consecutiveSteps >= 20 && !isWalking && walkingAllowedAnims.some(anim => anim == animStatus)) {
            clearInterval(intervalAnim);
            clearAllTimeouts();
            isWalking = true;
            clearInterval(screenOff);
            switch (animStatus) {
                case 'eating':
                    avoidEatAfterWalk = true;
                break;
                case 'bathTime':
                    coockieHasTakeBath = 'true';
                    coockieHasBrushed = 'true';
                break;
            }
            walking();
        }else{
            if(animStatus == 'left'){
                actionTimeOut = setTimeout(() => {
                    if(pokeStatus.consecutiveSteps >= 20){
                        console.log("vuelve")
                        clearInterval(intervalAnim);
                        backFromLeft();
                    }
                    console.log(`${pokeStatus.consecutiveSteps} consecutive steps`)
                    pokeStatus.consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'stand') { // Make Pikachu look 
                actionTimeOut = setTimeout(() => {
                    console.log("EING?")
                    clearInterval(intervalAnim);
                    auxiliarTimeout = setTimeout(() => {
                        loadAnim(DisplayScreen, Anims.standBasic.look);
                    }, 500);
            
                    auxiliarTimeout2 = setTimeout(() => {
                        basicAnim(true);
                    }, 3000);
                    pokeStatus.consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'standMad') { // Make Pikachu look 
                actionTimeOut = setTimeout(() => {
                    console.log("EING?")
                    clearInterval(intervalAnim);
                    auxiliarTimeout = setTimeout(() => {
                        loadAnim(DisplayScreen, Anims.standMad.look);
                    }, 1000);
            
                    auxiliarTimeout2 = setTimeout(() => {
                        basicAnim();
                    }, 4000);
                    pokeStatus.consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'sandcastle'){
                actionTimeOut = setTimeout(() => {
                    clearInterval(intervalAnim);
                    sandcastle(true); //Fast digging
                    auxiliarTimeout = setTimeout(() => {
                        clearInterval(intervalAnim);
                        sandcastle();
                    }, 6000);
                    pokeStatus.consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'studying'){
                actionTimeOut = setTimeout(() => {
                    isAskingStudy = true;
                }, 2000);
            }else if(animStatus == 'playingYoyo'){
                actionTimeOut = setTimeout(() => {
                    isDogTrick = true;
                }, 500);
            }else if(animStatus == 'playingRC'){
                actionTimeOut = setTimeout(() => {
                    isFastRC = true;
                }, 500);
            }else if(animStatus == 'flyKite'){
                actionTimeOut = setTimeout(() => {
                    clearInterval(intervalAnim);
                    clearAllTimeouts();
                    loadAnim(DisplayScreen, null, true);
                    auxiliarTimeout = setTimeout(() => {
                        flyKite(true);
                    }, 500);
                }, 3000);
            }else if(animStatus == 'reading'){
                actionTimeOut = setTimeout(() => {
                    clearInterval(intervalAnim);
                    reading(true);//NextPage
                    auxiliarTimeout = setTimeout(() => {
                        clearInterval(intervalAnim);
                        reading();
                    }, 1100);
                    pokeStatus.consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'watchTV'){
                actionTimeOut = setTimeout(() => {
                    clearInterval(intervalAnim);
                    watchTV(true); //Jump
                    auxiliarTimeout = setTimeout(() => {
                        clearInterval(intervalAnim);
                        watchTV();
                    }, 3000);
                    pokeStatus.consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'brushTeeth'){
                actionTimeOut = setTimeout(() => {
                    clearInterval(intervalAnim);
                    brushTeeth(true); //Fast digging
                    auxiliarTimeout = setTimeout(() => {
                        clearInterval(intervalAnim);
                        brushTeeth();
                    }, 4000);
                    pokeStatus.consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'buildingBlocks'){
                actionTimeOut = setTimeout(() => {
                    throwBlocks = true;
                    stopPlaying = true;
                }, 1000);
            }else if(animStatus == 'licking'){
                actionTimeOut = setTimeout(() => {
                    throwCandy = true;
                    stopPlaying = true;
                }, 1000);
            }else if(animStatus == 'standLike'){
                actionTimeOut = setTimeout(() => {
                    console.log("EING?")
                    clearInterval(intervalAnim);
                    standLike(true);
                    pokeStatus.consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'standLove'){
                actionTimeOut = setTimeout(() => {
                    console.log("EING?")
                    clearInterval(intervalAnim);
                    standLove(true);
                    pokeStatus.consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'bathTime'){
                actionTimeOut = setTimeout(() => {
                    console.log("EING?")
                    clearInterval(intervalAnim);
                    clearAllTimeouts();
                    loadAnim(DisplayScreen, lookBathAnim);
                    pokeStatus.consecutiveSteps = 0;
                    auxiliarTimeout2 = setTimeout(() => {
                        bathTime();
                    }, 2000);
                }, 2500);
            }else if(animStatus == 'eating'){
                actionTimeOut = setTimeout(() => {
                    if(pokeStatus.consecutiveSteps >= 15 && throwTableAnim != ''){
                        clearInterval(intervalAnim);
                        eating(true);
                    }
                    pokeStatus.consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'sleeping'){
                actionTimeOut = setTimeout(() => {
                    if(pokeStatus.consecutiveSteps >= 15){
                        console.log("awake?")
                        let cStepsforNow = pokeStatus.consecutiveSteps;
                        clearInterval(intervalAnim);
                        loadAnim(DisplayScreen, Anims.sleep.enteringBed);
    
                        auxiliarTimeout = setTimeout(() => {
                            clearInterval(intervalAnim);
    
                            // If it's not shaked after awake more than 10 times, sleep again. if not wakes up
                            if(pokeStatus.consecutiveSteps - cStepsforNow < 10){
                                //To change the sleep position
                                randomAnim = Math.floor(Math.random() * (10 - 1 + 1) + 1); //1-10
                                basicAnim(true);
                            }else{
                                isLateAwake = true;
                                clearInterval(intervalAnim);
                                clearAllTimeouts();
                                loadAnim(DisplayScreen, Anims.sleep.goingToSleep);
                                auxiliarTimeout2 = setTimeout(() => {
                                    // Friendship level drops 200 if you wake up pikachu
                                    updateFriendshipLevel(-200, false, false);
                                    basicAnim(true, true, true, true);
                                }, 2000);
                            }
                            pokeStatus.consecutiveSteps = 0;
                        }, 4000);
                    }
                }, 1000);
            }else{
                // To avoid increise during Game or Gift menu, but allow walk in some anims
                pokeStatus.consecutiveSteps = 0;
            }
        }
    })

    /* ////////////////
        STAND STATE ANIMATIONS 
    //////////////////*/

    function standLike(look = false) {
        animStatus = 'standLike'
        console.log(animStatus)
        let animHits = 1

        if(!look){
            loadAnim(DisplayScreen, Anims.standLike.left)
            intervalAnim = setInterval(animate, 500);
        }else{
            loadAnim(DisplayScreen, Anims.standLike.lookLeft)
            auxiliarTimeout = setTimeout(() => {
                loadAnim(DisplayScreen, Anims.standLike.lookRight)
            }, 600);

            auxiliarTimeout2 = setTimeout(() => {
                loadAnim(DisplayScreen, Anims.standLike.happyStand1)
                intervalAnim = setInterval(animateStand, 2000);
            }, 1200);
        }
        
        function animate() {    
            if(animHits < 7){
                loadAnim(DisplayScreen, Anims.standLike.left)
            }else if(animHits == 7){
                loadAnim(DisplayScreen, Anims.standLike.backRight)
            }else if(animHits == 8){
                loadAnim(DisplayScreen, Anims.standLike.backLeft)
            }else if (animHits < 16){
                loadAnim(DisplayScreen, Anims.standLike.right)
            }else if(animHits == 16){
                loadAnim(DisplayScreen, Anims.standLike.backLeft)
            }else if(animHits == 17){
                loadAnim(DisplayScreen, Anims.standLike.backRight)
            }else{
                loadAnim(DisplayScreen, Anims.standLike.left)
                animHits = 0
            }
            animHits++
        }

        function animateStand() {
            if(animHits == 1){
                loadAnim(DisplayScreen, Anims.standLike.happyStand2)
            }else{
                loadAnim(DisplayScreen, Anims.standLike.happyStand1)
                animHits = 0
            }
            animHits++
        }
    }

    function standLove(look = false) {
        animStatus = 'standLove' //300ms 3S
        console.log(animStatus)
        let animHits = 1

        if(!look){
            loadAnim(DisplayScreen, Anims.standLove.tailRightUp)
            intervalAnim = setInterval(animate, 333);
        }else{
            intervalAnim = setInterval(greeting, 500);
        }
        
        function animate() {  
            if(animHits < 8){
                loadAnim(DisplayScreen, Anims.standLove.tailRightUp)
            }else if(animHits == 8){
                loadAnim(DisplayScreen, Anims.standLove.tailRightDown)
            }else if(animHits == 9){
                loadAnim(DisplayScreen, Anims.standLove.tailLeftDown)
            }else if(animHits >= 10 && animHits < 19){
                loadAnim(DisplayScreen, Anims.standLove.tailLeftUp)
            }else if(animHits == 19){
                loadAnim(DisplayScreen, Anims.standLove.tailLeftDown)
            }else if(animHits == 20){
                loadAnim(DisplayScreen, Anims.standLove.tailRightDown)
            }else if(animHits == 21){
                loadAnim(DisplayScreen, Anims.standLove.tailRightUp)
                animHits = 1
            }

            animHits++
        }

        function greeting() {
            if (animHits == 1 || animHits == 3){
                loadAnim(DisplayScreen, Anims.standLove.helloLeft)
            }else if(animHits == 2 || animHits == 4){
                loadAnim(DisplayScreen, Anims.standLove.helloRight)
            }else{
                clearInterval(intervalAnim);
                standLove();
            }

            animHits++
        }
    }

    // ComeBack from left Anim
    function backFromLeft() {
        animStatus = 'backFromLeft'
        let animHits = 1;
        console.log(animStatus)
        intervalAnim = setInterval(animate, 500);
        startTime = new Date();

        function animate() {
            if(animHits == 1 || animHits == 3){
                loadAnim(DisplayScreen, Anims.backFromLeft.fall);
            }
            if(animHits == 2 || animHits == 4){
                loadAnim(DisplayScreen, Anims.backFromLeft.hit);
            }
            if(animHits == 5 || animHits == 7){
                loadAnim(DisplayScreen, Anims.backFromLeft.dizzyRight);
            }  
            if(animHits == 6 || animHits == 8){
                loadAnim(DisplayScreen, Anims.backFromLeft.dizzyLeft);
            }
            if(animHits == 9){
                loadAnim(DisplayScreen, Anims.standMad.stand);
                pokeStatus.friendshipLevel = -1400;
                localStorage.setItem("friendshipLevel", pokeStatus.friendshipLevel);
                auxiliarTimeout = setTimeout(() => {
                    clearInterval(intervalAnim);
                    basicAnim(true, true, true, true);
                }, 1000);
            }  

            animHits++
        }
    }

    // Pokeball anim
    function pokeinit() {
        animStatus = 'pokeball'
        console.log(animStatus)
        let pokecounter = 1;
        intervalAnim = setInterval(animate, 250);

        // Declare cookie
        var now = new Date();
        now.setTime(now.getTime() + 3600 * 1000); // Agregamos 1 hora en milisegundos

        function animate() {
            // endTime = new Date();
            pokecounter++

            if(pokecounter <= 4 || pokecounter == 6 || pokecounter == 8){
                loadAnim(DisplayScreen, Anims.start.leftGiggle)
            }else if(pokecounter == 5 || pokecounter == 7){
                loadAnim(DisplayScreen, Anims.start.rightGigle)
            }else if(pokecounter == 12){
                pokecounter = 1;
            }
        }
    }

    /* ////////////////
        CELEBRATE ANIMATIONS 
    //////////////////*/

    // Tongue Anim
    function tongueAnim() {
        animStatus = 'tongueAnim'
        console.log(animStatus)
        intervalAnim = setInterval(animate, 250);
        startTime = new Date();
        auxiliarTimeout = setTimeout(() => {
            document.querySelector("#clockMenu").classList.add('selected')
        }, 500);

        function animate() {
            // Check the time pased
            endTime = new Date();
            var timeDiff = endTime - startTime; //in ms
            milisecondsElapsed = timeDiff.toFixed(1);


            loadAnim(DisplayScreen, Anims.tongueMad.start);
            if(milisecondsElapsed > 2000) loadAnim(DisplayScreen, Anims.tongueMad.tongue1);
            if(milisecondsElapsed > 2500) loadAnim(DisplayScreen, Anims.tongueMad.tongue2);
            if(milisecondsElapsed > 3000) loadAnim(DisplayScreen, Anims.tongueMad.tongue3);
            if(milisecondsElapsed > 4000) loadAnim(DisplayScreen, Anims.tongueMad.tongue2);
            if(milisecondsElapsed > 4500) loadAnim(DisplayScreen, Anims.tongueMad.tongue3);
            if(milisecondsElapsed > 5500) loadAnim(DisplayScreen, Anims.tongueMad.tongue2);
            if(milisecondsElapsed > 6000) loadAnim(DisplayScreen, Anims.tongueMad.tongue3);
            if(milisecondsElapsed > 7000) loadAnim(DisplayScreen, Anims.tongueMad.tongue2);
            if(milisecondsElapsed > 7500) loadAnim(DisplayScreen, Anims.tongueMad.start);
            if(milisecondsElapsed > 9500) {
                clearInterval(intervalAnim);
                basicAnim(true, false, true, true);
            }
        }
    }

    // Yawn Anim
    function yawnAnim() {
        clearInterval(intervalAnim);
        animStatus = 'yawnHappy'
        console.log(animStatus)
        animHits = 1;

        auxiliarTimeout = setTimeout(() => {
            document.querySelector("#clockMenu").classList.add('selected')
        }, 500);
        
        loadAnim(DisplayScreen, Anims.happy1.happyStand);
        intervalAnim = setInterval(animate, 500);

        function animate() {
            if(animHits == 3){
                loadAnim(DisplayScreen, Anims.happy1.happyStartScream);
            }else if(animHits == 4){
                loadAnim(DisplayScreen, Anims.happy1.scream1);
            }else if(animHits == 6){
                loadAnim(DisplayScreen, Anims.happy1.scream2);
            }else if(animHits == 9){
                loadAnim(DisplayScreen, Anims.happy1.scream1);
            }else if(animHits == 11){
                loadAnim(DisplayScreen, Anims.happy1.scream2);
            }else if(animHits == 14){
                loadAnim(DisplayScreen, Anims.happy1.scream1);
            }else if(animHits == 16){
                loadAnim(DisplayScreen, Anims.happy1.happyStartScream);
            }else if(animHits == 17){
                loadAnim(DisplayScreen, Anims.happy1.happyStand);
            }else if(animHits > 17){
                clearInterval(intervalAnim);
                // Para no jugar o saludar despues de un gift
                auxiliarTimeout = setTimeout(() => {
                    basicAnim(true, false, true, true);
                }, 1500);
            }
            animHits++
        }
    }

    function happySteps() {
        clearInterval(intervalAnim);
        animStatus = 'happySteps'
        console.log(animStatus)
        let animHits = 1
        intervalAnim = setInterval(animate, 1000);
        auxiliarTimeout = setTimeout(() => {
            document.querySelector("#clockMenu").classList.add('selected')
        }, 500);
        
        function animate() {
            
            if(animHits % 2 != 0 && animHits < 9){
                loadAnim(DisplayScreen, Anims.happy2.start)
            }else if(animHits == 2 || animHits == 6){
                loadAnim(DisplayScreen, Anims.happy2.rightStep)
            }else if(animHits == 4 || animHits == 8){
                loadAnim(DisplayScreen, Anims.happy2.leftStep)
            }else if(animHits == 9){
                loadAnim(DisplayScreen, Anims.happy2.start)
                clearInterval(intervalAnim);
                auxiliarTimeout2 = setTimeout(() => {
                    basicAnim(true, false, true, true);
                }, 2000);
            }
            animHits++
        }
    }

    function heartSmiles() {
        clearInterval(intervalAnim);
        animStatus = 'heartSmiles'
        console.log(animStatus)
        let animHits = 1

        loadAnim(DisplayScreen, Anims.heartSmiles.stand)
        intervalAnim = setInterval(animate, 1000);
        auxiliarTimeout = setTimeout(() => {
            document.querySelector("#clockMenu").classList.add('selected')
        }, 500);
        
        function animate() {
            if(animHits == 1 || animHits == 5){
                loadAnim(DisplayScreen, Anims.heartSmiles.loveRight)
            }else if(animHits == 2 || animHits == 4 || animHits == 6){
                loadAnim(DisplayScreen, Anims.heartSmiles.stand)
            }else if(animHits == 3){
                loadAnim(DisplayScreen, Anims.heartSmiles.loveLeft)
            }else{
                clearInterval(intervalAnim);
                auxiliarTimeout2 = setTimeout(() => {
                    basicAnim(true, false, true, true);
                }, 1000);
            }
            animHits++
        }
    }

    function writtingLetter() {
        clearInterval(intervalAnim);
        animStatus = 'writeLetter'
        console.log(animStatus)
        let animHits = 1

        loadAnim(DisplayScreen, Anims.letter.write1)
        intervalAnim = setInterval(animate, 600);

        auxiliarTimeout = setTimeout(() => {
            document.querySelector("#clockMenu").classList.add('selected')
        }, 500);
        
        auxiliarTimeout2 = setTimeout(() => {
            clearInterval(intervalAnim);
            loadAnim(DisplayScreen, Anims.letter.letter)
        }, 16000);

        auxiliarTimeout3 = setTimeout(() => {
            clearInterval(intervalAnim);
            basicAnim(true, false, true, true);
        }, 20000);
        
        function animate() {
            if(animHits % 2 == 0){
                loadAnim(DisplayScreen, Anims.letter.write1)
            }else{
                loadAnim(DisplayScreen, Anims.letter.write2)
            }
            animHits++
        }
    }

    function flying(finishEnter=false) {
        clearInterval(intervalAnim);
        animStatus = 'flying'
        console.log(animStatus)
        let animHits = 1
        
        if(!finishEnter){
            loadAnim(DisplayScreen, Anims.flying[`enter${animHits++}`])
            auxiliarTimeout = setTimeout(() => {
                document.querySelector("#clockMenu").classList.add('selected')
            }, 500);
        }else{
            loadAnim(DisplayScreen, Anims.flying[`flyAway${animHits++}`])
        }
        intervalAnim = setInterval(animate, 500);
        
        function animate() {
            if(!finishEnter){
                if(animHits <= 9){
                    loadAnim(DisplayScreen, Anims.flying[`enter${animHits}`])
                }else{
                    loadAnim(DisplayScreen, null, true);
                    clearInterval(intervalAnim);
                    auxiliarTimeout2 = setTimeout(() => {
                        flying(true);
                    }, 9000);
                }
            }else{
                if(animHits <= 18){
                    loadAnim(DisplayScreen, Anims.flying[`flyAway${animHits}`])
                }else{
                    loadAnim(DisplayScreen, null, true);
                    clearInterval(intervalAnim);
                    auxiliarTimeout2 = setTimeout(() => {
                        basicAnim(true, false, true, true);
                    }, 1000);
                }
            }
            animHits++
        }
    }

    function diving(finishEnter=false) {
        clearInterval(intervalAnim);
        animStatus = 'diving'
        console.log(animStatus)
        let animHits = 1
        
        loadAnim(DisplayScreen, Anims.diving[`diving${animHits++}`])
        auxiliarTimeout = setTimeout(() => {
            document.querySelector("#clockMenu").classList.add('selected')
        }, 500);

        intervalAnim = setInterval(animate, 1100);

        if(!finishEnter){
            auxiliarTimeout2 = setTimeout(() => {
                clearAllTimeouts();
                clearInterval(intervalAnim);
                diving(true);
            }, 35000);
        }
        
        function animate() {
            if(animHits >= 17){
                clearInterval(intervalAnim);
                clearAllTimeouts();
                auxiliarTimeout = setTimeout(() => {
                    basicAnim(true, false, true, true);
                }, 500);
            }else{
                loadAnim(DisplayScreen, Anims.diving[`diving${animHits++}`]);
                auxiliarTimeout3 = setTimeout(() => {
                    loadAnim(DisplayScreen, Anims.diving[`diving${animHits++}`]);
                }, 100);
                
                if(finishEnter && animHits > 5 && animHits < 12){
                    auxiliarTimeout2 = setTimeout(() => {
                        loadAnim(DisplayScreen, Anims.diving[`diving${animHits++}`]);
                    }, 200);
                }
            }

            if(!finishEnter){
                animHits = (animHits >= 4)? 1 : animHits;
            }   
        }
    }

    function rollingBall(finishEnter=false) {
        clearInterval(intervalAnim);
        animStatus = 'rollingBall'
        console.log(animStatus)
        let animHits = 1

        
        if(!finishEnter){
            loadAnim(DisplayScreen, Anims.rollingBall[`rollingLeft${animHits++}`])
            auxiliarTimeout = setTimeout(() => {
                document.querySelector("#clockMenu").classList.add('selected')
            }, 700);
        }else{
            loadAnim(DisplayScreen, Anims.rollingBall[`rollingRight${animHits++}`])
        }
        intervalAnim = setInterval(animate, 500);
        
        function animate() {
            if(!finishEnter){
                if(animHits > 18){
                    loadAnim(DisplayScreen, null, true);
                    clearAllTimeouts();
                    clearInterval(intervalAnim);
                    auxiliarTimeout2 = setTimeout(() => {
                        rollingBall(true);
                    }, 10000);
                }else{
                    loadAnim(DisplayScreen, Anims.rollingBall[`rollingLeft${animHits++}`]);
                }
            }else{
                if(animHits > 18){
                    loadAnim(DisplayScreen, null, true);
                    clearInterval(intervalAnim);
                    clearAllTimeouts();
                    auxiliarTimeout = setTimeout(() => {
                        basicAnim(true, false, true, true);
                    }, 6000);
                }else{
                    loadAnim(DisplayScreen, Anims.rollingBall[`rollingRight${animHits++}`]);
                }

            }  
        }
    }

    function playingHorn(finishEnter=false) {
        clearInterval(intervalAnim);
        animStatus = 'playingHorn'
        console.log(animStatus)
        let animHits = 1

        if(!finishEnter){
            loadAnim(DisplayScreen, Anims.horn[`hornLeft${animHits++}`])
            auxiliarTimeout = setTimeout(() => {
                document.querySelector("#clockMenu").classList.add('selected')
            }, 700);
        }else{
            loadAnim(DisplayScreen, Anims.horn[`hornRight${animHits++}`])
        }

        intervalAnim = setInterval(animate, 600);
        
        function animate() {
            if(!finishEnter){
                if(animHits > 23){
                    loadAnim(DisplayScreen, null, true);
                    clearAllTimeouts();
                    clearInterval(intervalAnim);
                    auxiliarTimeout2 = setTimeout(() => {
                        playingHorn(true);
                    }, 8000);
                }else{
                    loadAnim(DisplayScreen, Anims.horn[`hornLeft${animHits++}`]);
                }
            }else{
                if(animHits > 23){
                    loadAnim(DisplayScreen, null, true);
                    clearInterval(intervalAnim);
                    clearAllTimeouts();
                    auxiliarTimeout = setTimeout(() => {
                        basicAnim(true, false, true, true);
                    }, 6000);
                }else{
                    loadAnim(DisplayScreen, Anims.horn[`hornRight${animHits++}`]);
                }
            }  
        }
    }

    function backFlip() {
        clearInterval(intervalAnim);
        animStatus = 'backFlip'
        console.log(animStatus)
        let animHits = 0
        intervalAnim = setInterval(animate, 500);
        auxiliarTimeout = setTimeout(() => {
            document.querySelector("#clockMenu").classList.add('selected')
        }, 500);
        
        function animate() {
            
            if(animHits <= 2 || animHits == 8){
                loadAnim(DisplayScreen, Anims.backflip.stand)
            }else if(animHits == 3 || animHits == 7){
                loadAnim(DisplayScreen, Anims.backflip.charge)
            }else if(animHits == 4){
                loadAnim(DisplayScreen, Anims.backflip.jump1)
            }else if(animHits == 5){
                loadAnim(DisplayScreen, Anims.backflip.jump2)
            }else if(animHits == 6){
                loadAnim(DisplayScreen, Anims.backflip.jump3)
            }else if(animHits == 12){
                clearInterval(intervalAnim);
                basicAnim(true, false, true, true);
            }
            animHits++
        }
    }

    function playPiano() {
        clearInterval(intervalAnim);
        animStatus = 'piano'
        console.log(animStatus)
        let animHits = 1
        intervalAnim = setInterval(animate, 600);
        auxiliarTimeout = setTimeout(() => {
            document.querySelector("#clockMenu").classList.add('selected')
        }, 500);
        auxiliarTimeout2 = setTimeout(() => {
            clearInterval(intervalAnim);
            basicAnim(true, false, true, true);
        }, 18000);
        
        function animate() {
            
            if(animHits <= 1){
                loadAnim(DisplayScreen, Anims.piano.right)
            }else{
                loadAnim(DisplayScreen, Anims.piano.left)
                animHits = 0;
            }
            animHits++
        }
    }

    /* ////////////////
        PLAY AND ACTIONS ANIMS
    //////////////////*/

    // Eating Anims
    function eating(throwTable=false) {
        animStatus = 'eating'
        console.log(animStatus)
        if(!throwTable){
            let eatCounter = 1;
            let startAnim;
            let nomnom;
            let nomnom2;
            const ChopstickLimit = hasReach300;
            let randomAnimEat = Math.floor(Math.random() * (15 - 1 + 1) + 1); //1-15
            let randomLimit = (ChopstickLimit)? 5 : 7;

            if(randomAnimEat <= randomLimit && !pokeStatus.todayHasReachLimit300){
                //TOAST
                startAnim =  Anims.eating.eatingToast;
                nomnom = Anims.eating.nomnomToast
                nomnom2 =  Anims.eating.nomnomToast2
                throwTableAnim = 'Toast';
            }else if(randomAnimEat >= randomLimit+1 && ((!ChopstickLimit) || randomAnimEat <= 10) && !pokeStatus.todayHasReachLimit300){
                //ONIGIRI
                startAnim =  Anims.eating.eatingOnigiri;
                nomnom = Anims.eating.nonomOnigiri
                nomnom2 =  Anims.eating.nonomOnigiri2
                throwTableAnim = 'Onigiri';
            }else{
                //RICE
                startAnim =  Anims.eating.eatingChopsticks;
                nomnom = Anims.eating.nomnomChopsticks;
                nomnom2 =  Anims.eating.nomnomChopsticks2;
                throwTableAnim = '';
            }
            
            // Start animation
            intervalAnim = setInterval(animate, 500);
            
            // Declare ate cookie
            let now = new Date();
            now.setTime(now.getTime() + 3600 * 1000); // Agregamos 1 hora en milisegundos
            document.cookie = "had_eating=true; expires=" + now + "; path=/";
            console.log("Cookie Eating declared")
            
            function animate() {
                endTime = new Date();
                if(eatCounter <= 1){
                    loadAnim(DisplayScreen, startAnim)
                    eatCounter++
                }else if(eatCounter == 2 || eatCounter == 4){
                    loadAnim(DisplayScreen, nomnom)
                    eatCounter = (eatCounter >= 4)? 1 : (eatCounter + 1)
                }else if(eatCounter == 3){
                    loadAnim(DisplayScreen, nomnom2)
                    eatCounter++
                }
            }
        }else{
            loadAnim(DisplayScreen, Anims.eating[`angry${throwTableAnim}`]);
            auxiliarTimeout = setTimeout(() => {
                loadAnim(DisplayScreen, Anims.eating.angry2);
            }, 2000);
            auxiliarTimeout2 = setTimeout(() => {
                loadAnim(DisplayScreen, Anims.eating.angry3);
            }, 2750);
            auxiliarTimeout2 = setTimeout(() => {
                clearAllTimeouts();
                clearInterval(intervalAnim);
                updateFriendshipLevel(-200, false, false);
                basicAnim(true, true, true, true);
            }, 5250);
        }
    }

    // Walking anim
    function walking(stop) {
        animStatus = 'walking'
        console.log(animStatus)
        // To avoid play after walking
        randomAnim = 3;
        let walkCounter = 1;
        loadAnim(DisplayScreen, Anims.walk.stand)
        
        if(!stop){
            intervalAnim = setInterval(animate, 750);
        }else{
            auxiliarTimeout = setTimeout(() => {
                basicAnim(true, false, true, true);
            }, 2000);
        }
        
        function animate() {
            // audioShaking.play();
            if(walkCounter == 1){
                loadAnim(DisplayScreen, Anims.walk.walking1)
            }else if(walkCounter == 2 || walkCounter == 4){
                loadAnim(DisplayScreen, Anims.walk.stand)
                walkCounter = (walkCounter == 4)? 0 : walkCounter;
            }else if(walkCounter == 3){
                loadAnim(DisplayScreen, Anims.walk.walking2)
            }
            walkCounter++
        }
    }

    // Take a Bath
    let lookBathAnim;
    function bathTime() {
        animStatus = 'bathTime'
        console.log(animStatus)
        let bathCounter = 1;
        let bathAnim1;
        let bathAnim2;
        const BathLimit = hasReach300;

        if((!BathLimit) || (randomAnim <= 5 && !pokeStatus.todayHasReachLimit300)){
            //SHOWER
            bathAnim1 =  Anims.bath.shower1;
            bathAnim2 = Anims.bath.shower2;
            lookBathAnim =  Anims.bath.showerLook;
        }else if(((BathLimit) && randomAnim >= 6) || pokeStatus.todayHasReachLimit300){
            //BATH
            bathAnim1 =  Anims.bath.bath1;
            bathAnim2 = Anims.bath.bath2;
            lookBathAnim =  Anims.bath.bathLook;
        }
        
        loadAnim(DisplayScreen, bathAnim1)
        intervalAnim = setInterval(animate, 700);

        function animate() {
            if(bathCounter <= 1){
                loadAnim(DisplayScreen, bathAnim2)
            }else {
                loadAnim(DisplayScreen, bathAnim1)
                bathCounter = 0;
            }
            bathCounter++
        }

        // Declare cookie
        var time = new Date();
        time.setTime(time.getTime() + 3600 * 1000); // Agregamos 1 horas en milisegundos
        document.cookie = "had_take_bath=true; expires=" + time + "; path=/";
        console.log("Cookie Bath declared")
    }

    // Sandcastle anim
    function sandcastle(shake) {
        animStatus = 'sandcastle'
        console.log(animStatus)
        let sandCounter = 1;
        loadAnim(DisplayScreen, Anims.sandcastle.sand1)
        intervalAnim = (!shake)? setInterval(animate, 2000) : setInterval(animate, 500);

        function animate() {
            
            if(sandCounter <= 1){
                loadAnim(DisplayScreen, Anims.sandcastle.sand2)
            }else {
                loadAnim(DisplayScreen, Anims.sandcastle.sand1)
                sandCounter = 0;
            }
            sandCounter++
        }
    }

    // Reading
    function reading(shake) {
        animStatus = 'reading'
        console.log(animStatus)
        let readCounter = 1;
        
        if(!shake){
            loadAnim(DisplayScreen, Anims.reading.sand1)
            intervalAnim = setInterval(animate, 800);
        }else{
            loadAnim(DisplayScreen, Anims.reading.nextPage)
        }

        function animate() {
            
            if(readCounter <= 1){
                loadAnim(DisplayScreen, Anims.reading.sand2)
            }else {
                loadAnim(DisplayScreen, Anims.reading.sand1)
                readCounter = 0;
            }
            readCounter++
        }
    }

    // Watching TV
    function watchTV(shake) {
        animStatus = 'watchTV'
        console.log(animStatus)
        let watchCounter = 1;
        loadAnim(DisplayScreen, Anims.watchTV.stand1)
        intervalAnim = (!shake)? setInterval(animate, 1000) : setInterval(animate, 800);

        function animate() {
            
            if(watchCounter == 1){
                loadAnim(DisplayScreen, (!shake)? Anims.watchTV.stand2 : Anims.watchTV.jump)
            }else {
                loadAnim(DisplayScreen, Anims.watchTV.stand1)
                watchCounter = 0;
            }
            watchCounter++
        }
    }

    // Lollypop / Icecream anim
    function licking() {
        animStatus = 'licking'
        console.log(animStatus)
        let animHits = 1;
        let lick1;
        let lick2;
        let throwCandyAnim;
        const LickLimit = hasReach300;

        if((!LickLimit) || (randomAnim <= 5 && !pokeStatus.todayHasReachLimit300)){
            //LOLLYPOP
            lick1 =  Anims.licking.lollypop1;
            lick2 = Anims.licking.lollypop2;
            throwCandyAnim =  Anims.licking.lollypopFall;
        }else if(((LickLimit) && randomAnim >= 6) || pokeStatus.todayHasReachLimit300){
            //ICECREAM
            lick1 =  Anims.licking.icecream1;
            lick2 = Anims.licking.icecream2;
            throwCandyAnim =  Anims.licking.icecreamFall;
        }

        loadAnim(DisplayScreen, lick1)
        intervalAnim = setInterval(animate, 1000);
        
        function animate() {
            if(throwCandy){
                clearInterval(intervalAnim);
                loadAnim(DisplayScreen, throwCandyAnim)
                auxiliarTimeout = setTimeout(() => {
                    updateFriendshipLevel(-30, false, false);
                    randomAnim = Math.floor(Math.random() * (10 - 1 + 1) + 1); //1-10
                    throwCandy = false;
                    basicAnim(true, false, true, true);
                }, 3000);
            }else if(animHits % 2 == 0){
                loadAnim(DisplayScreen, lick1)
            }else{
                loadAnim(DisplayScreen, lick2)
            }
            animHits++
        }
    }

    // Study
    function study(subject) {
        animStatus = 'studying'
        console.log(animStatus)
        let studyStand = Anims.study.studyStand;
        let studyAsk;
        let studyAnswer;
        let intervalTime = 2000; 
        // Include in the future English or Sleeping
        // const studyLimit = (localStorage.getItem("hasReach450") != null)? true : false;

        switch (subject) {
            case 'history':
                studyAsk = Anims.study.studyAskHistory;
                studyAnswer =  Anims.study.studyAnswerHistory;
            break;
            case 'maths':
                studyAsk = Anims.study.studyAskMaths;
                studyAnswer =  Anims.study.studyAnswerMaths;
                intervalTime = 3500;
            break;
        }

        loadAnim(DisplayScreen, studyStand)
        intervalAnim = setInterval(animate, 1000);
        
        function animate() {
            if(!isAskingStudy){
                loadAnim(DisplayScreen, studyStand)
            }else {
                clearInterval(intervalAnim);
                loadAnim(DisplayScreen, studyAsk)
                auxiliarTimeout = setTimeout(() => {
                    loadAnim(DisplayScreen, studyStand)
                    auxiliarTimeout2 = setTimeout(() => {
                        loadAnim(DisplayScreen, studyAnswer)
                        auxiliarTimeout3 = setTimeout(() => {
                            loadAnim(DisplayScreen, studyStand)
                            isAskingStudy = false;
                            study(subject);
                        }, intervalTime);
                    }, 1500);
                }, 2500);
            }
        }
    }

    //Flying Kite
    function flyKite(isFast=false) {
        clearInterval(intervalAnim);
        animStatus = (!isFast)? 'flyKite' : 'flyKiteFast';
        console.log(animStatus)
        let animHits = 1
        let direction = 'Left';
        let comeBack = (!isFast)? 8000 : 3000;
        let limit = (!isFast)? 23 : 8;
        let fast = (isFast)? 'Fast' : '';

        loadAnim(DisplayScreen, Anims.flyingKite[`kite${direction}${fast}${animHits++}`])
        intervalAnim = setInterval(animate, 600);
        
        function animate() {
            if(animHits <= limit){
                loadAnim(DisplayScreen, Anims.flyingKite[`kite${direction}${fast}${animHits++}`])
            }else{
                clearInterval(intervalAnim);
                loadAnim(DisplayScreen, null, true);
                animHits = 1;
                direction = (direction == 'Left')? 'Right' : 'Left';
                if(isFast) limit = (direction == 'Left')? 8 : 9;
                auxiliarTimeout = setTimeout(() => {
                    intervalAnim = setInterval(animate, 600);
                }, comeBack);
            }
        }
    }

    //Playing with RC
    function playingRC(isFast=false) {
        clearInterval(intervalAnim);
        animStatus = (!isFast)? 'playingRC' : 'playingRCfast';
        console.log(animStatus)
        let animHits = 1
        let comeBack = 2400;
        let speed = 800;
        
        loadAnim(DisplayScreen, Anims.radioControl[`radio${animHits++}`])
        intervalAnim = setInterval(animate, speed);
        
        function animate() {
            if(isFastRC){
                comeBack = 1200;
                speed = 400;
                isFastRC = false;
            }
            if(animHits != 5 && animHits != 10){
                loadAnim(DisplayScreen, Anims.radioControl[`radio${animHits++}`])
            }else{
                clearInterval(intervalAnim);
                loadAnim(DisplayScreen, Anims.radioControl[`radio${animHits++}`])
                if(animHits >= 10) animHits = 1;
                auxiliarTimeout = setTimeout(() => {
                    if(isFastRC){
                        comeBack = 1200;
                        speed = 400;
                        isFastRC = false;
                    }
                    intervalAnim = setInterval(animate, speed);
                }, comeBack);
            }
        }
    }

    //Playing with yoyo
    function playingYoyo() {
        clearInterval(intervalAnim);
        animStatus = 'playingYoyo'
        console.log(animStatus)
        let animHits = 1
        let sum = 1;
        let trick = '';

        loadAnim(DisplayScreen, Anims.yoyo[`yoyo${trick}${animHits++}`]);
        intervalAnim = setInterval(animate, 400);
        
        function animate() {
            if(!isDogTrick || animHits != 1){
                loadAnim(DisplayScreen, Anims.yoyo[`yoyo${trick}${animHits}`]);
                if(animHits == 2 && sum == -1 && trick == 'Dog') trick = '';
            }else if(animHits == 1){
                loadAnim(DisplayScreen, Anims.yoyo[`yoyoDog${animHits}`]);
            }
            if(animHits == 3) sum = -1;
            if(animHits == 1){
                clearInterval(intervalAnim);
                auxiliarTimeout = setTimeout(() => {
                    animHits = 1
                    sum = 1;
                    if(isDogTrick){
                        trick = 'Dog';
                        isDogTrick = false;
                    }
                    loadAnim(DisplayScreen, Anims.yoyo[`yoyo${trick}${animHits++}`]);
                    intervalAnim = setInterval(animate, 400);
                }, 1000);
            }
            animHits += sum;
        }
    }

    // BuildingBlocks anim
    function buildingBlocks() {
        animStatus = 'buildingBlocks'
        console.log(animStatus)
        let buildCounter = 1;
        let shakeCounter = 1;
        loadAnim(DisplayScreen, Anims.buildingBlocks.hold)
        intervalAnim = setInterval(animate, 1200);
        
        function animate() {
            
            if(buildCounter <= 1){
                loadAnim(DisplayScreen, Anims.buildingBlocks.try)
            }else if(buildCounter == 2) {
                loadAnim(DisplayScreen, Anims.buildingBlocks.holdTry)
                clearInterval(intervalAnim);
                intervalAnim = setInterval(shaking, 125);
                buildCounter = 0;
            }

            buildCounter++
        }

        function shaking() {
            if(shakeCounter % 2 == 0 && shakeCounter < 9 || throwBlocks && shakeCounter % 2 == 0 && shakeCounter < 18){
                loadAnim(DisplayScreen, Anims.buildingBlocks.shake)
            }else if(shakeCounter < 9 || throwBlocks && shakeCounter < 18){
                loadAnim(DisplayScreen, Anims.buildingBlocks.holdTry)
            }else if(!throwBlocks){
                loadAnim(DisplayScreen, Anims.buildingBlocks.holdTry)
                clearInterval(intervalAnim);
                shakeCounter = 0;
                auxiliarTimeout = setTimeout(() => {
                    loadAnim(DisplayScreen, Anims.buildingBlocks.hold)
                    intervalAnim = setInterval(animate, 1200);
                }, 1200);
            }else{
                clearInterval(intervalAnim);
                auxiliarTimeout = setTimeout(() => {
                    loadAnim(DisplayScreen, Anims.buildingBlocks.fall)
                    shakeCounter = 0;
                    throwBlocks = false;
                    randomAnim = 5;
                }, 1000);
                auxiliarTimeout2 = setTimeout(() => {
                    updateFriendshipLevel(-30, false, false);
                    randomAnim = Math.floor(Math.random() * (10 - 1 + 1) + 1); //1-10
                    basicAnim(true, false, true, true);
                }, 4000);

            }
            shakeCounter++
        }
    }

    // Brush teeth anim
    function brushTeeth(shake) {
        animStatus = 'brushTeeth'
        console.log(animStatus)
        let animCounter = 1;
        loadAnim(DisplayScreen, Anims.brushTeeth.brush1)
        intervalAnim = (!shake)? setInterval(animate, 1500) : setInterval(animate, 500);

        // Declare cookie
        var now = new Date();
        now.setTime(now.getTime() + 3600 * 1000); // Agregamos 1 hora en milisegundos
        document.cookie = "has_brushed=true; expires=" + now + "; path=/";
        console.log("Cookie bushTeeth declared")

        function animate() {
            // endTime = new Date();
            
            if(animCounter <= 1){
                loadAnim(DisplayScreen, Anims.brushTeeth.brush2)
            }else {
                loadAnim(DisplayScreen, Anims.brushTeeth.brush1)
                animCounter = 0;
            }
            animCounter++
        }
    }

    /* ////////////////
        LOGIC FUNCTIONS
    //////////////////*/

    function restartTamagotchi (DisplayScreen, enterclicked) {
        animStatus = 'restart';
        clearInterval(intervalAnim);
        clearAllTimeouts();
        if(!enterclicked){
            document.querySelector("#clockMenu").classList.add('selected')
            document.querySelector("#giftMenu").classList.add('selected')
            document.querySelector("#gameMenu").classList.add('selected')
            document.querySelector('.walkCounter').innerHTML = 88888;
            loadAnim(DisplayScreen, null, true, true);

            // Clear the localStorage
            let initDate = new Date();
            localStorage.clear();
            pokeStatus.steps = 0;
            pokeStatus.totalSteps = 0;
            pokeStatus.watts = 50;
            pokeStatus.friendshipLevel = 0;
            isLateAwake = true;
            settings.relSelected = 'on';
            settings.dificultySelected = 'medium';
            pokeStatus.reachEnd = false;
            localStorage.setItem("initTamDate", `${initDate.toDateString()} ${initDate.getHours()}:00`);
            localStorage.setItem("watts", pokeStatus.watts);
            localStorage.setItem("friendshipLevel", pokeStatus.friendshipLevel);
            localStorage.setItem("relDrop", settings.relSelected);

            //Remove all the cookies
            deleteCookies();
            
    
            setTimeout(() => {
                cleanStates();
                document.querySelector('.walkCounter').innerHTML = '';
                // localStorage.setItem("InitTamagotchi", true)
                loadAnim(DisplayScreen, null, true);
                pokeinit();
            }, 3000);

        }else{
            setTimeout(() => {
                loadAnim(DisplayScreen, Anims.start.pop1)
            }, 200);
            setTimeout(() => {
                loadAnim(DisplayScreen, Anims.start.pop2)
            }, 1000);
            setTimeout(() => {
                loadAnim(DisplayScreen, null, true);
            }, 1500);
            setTimeout(() => {
                localStorage.setItem("InitTamagotchi", true)
                document.querySelector('.walkCounter').innerHTML = pokeStatus.steps;
                document.querySelector("#clockMenu").classList.add('selected')
                basicAnim(true, true, false, true);
            }, 3000);
        }
    }

    // FRIENDSHIP LEVEL UPDATE SYSTEM
    function updateFriendshipLevel(amount, isGift, isAnim){
        pokeStatus.friendshipLevel = (localStorage.getItem("friendshipLevel") != null)? Number(localStorage.getItem("friendshipLevel")) : pokeStatus.friendshipLevel;
        let originalFrienship = pokeStatus.friendshipLevel;

        // If ammount is 0, friendship level drops by 100
        if(Number(amount) == 0){
            pokeStatus.friendshipLevel -= 100;
        }else{
            pokeStatus.friendshipLevel += Number(amount);
        }

        localStorage.setItem("friendshipLevel", pokeStatus.friendshipLevel)
        console.log(`Friendship level updated: ${pokeStatus.friendshipLevel}`);
        
        if(isGift) {
            pokeStatus.watts -= Number(amount);
            localStorage.setItem("watts", pokeStatus.watts)
        }

        if(isAnim){
            clearInterval(intervalAnim);
            clearAllTimeouts();
            resetGivenWatts();
            let friendShipStatus = '';
            let randomAnimGift = Math.floor(Math.random() * (10 - 1 + 1) + 1); //1-10

            if(originalFrienship <= -1500){
                friendShipStatus = 'left'
            }else if(originalFrienship > -1500 && originalFrienship <= -500){
                friendShipStatus = 'mad'
            }else if(originalFrienship > -500 && originalFrienship <= 1500){
                friendShipStatus = 'ok'
            }else if(originalFrienship > 1500 && originalFrienship <= 3000){
                friendShipStatus = 'likes'
            }else if(originalFrienship > 3000){
                friendShipStatus = 'loves'
            }

            if(amount == 0){
                tongueAnim();
            }else if(amount > 0 && amount < 100){
                yawnAnim();
            }else if(amount >= 100 && amount < 300){
                happySteps();
            }else if(amount >= 300 && amount < 400){
                if(randomAnimGift >= 5) {
                    heartSmiles();
                }else {
                    backFlip();
                }
            }else if(amount >= 400 && amount < 500){
                if(randomAnimGift <= 4 || friendShipStatus == 'mad'){
                    heartSmiles();
                }else if(randomAnimGift > 4 && randomAnimGift <= 8){
                    backFlip();
                }else{
                    writtingLetter();
                }
            }else if(amount >= 500 && amount < 700){
                if(randomAnimGift <= 3){
                    heartSmiles();
                }else if(randomAnimGift > 3 && randomAnimGift <= 6){
                    backFlip();
                }else{
                    writtingLetter();
                }
            }else if(amount >= 700 && amount < 800){
                if(randomAnimGift <= 4){
                    rollingBall();
                }else if(randomAnimGift > 4 && randomAnimGift <= 8){
                    diving();
                }else{
                    flying();
                }
            }else if(amount >= 800 && amount < 899){
                if(randomAnimGift <= 3){
                    playPiano();
                }else if(randomAnimGift > 3 && randomAnimGift <= 6){
                    flying();
                }else if(randomAnimGift > 6 && randomAnimGift <= 8){
                    diving();
                }else{
                    rollingBall();
                }
            }else if(amount >= 900){
                console.log(randomAnimGift)
                if( [1,2].includes(randomAnimGift) ){
                    playPiano();
                }else if( [3,4].includes(randomAnimGift) ){
                    flying();
                }else if( [5,6].includes(randomAnimGift) ){
                    diving();
                }else if( [7,8].includes(randomAnimGift) ){
                    rollingBall();
                }else{
                    playingHorn();
                }
            }
        }
    }    
})

/* ////////////////
AUX FUNCS
//////////////////*/
function clearAllTimeouts() {
    clearTimeout(actionTimeOut);
    clearTimeout(auxiliarTimeout);
    clearTimeout(auxiliarTimeout2);
}

function resetGivenWatts() {
    wattsAux.GivenCents = 0;
    wattsAux.GivenDecs = 0;
    wattsAux.GivenUnits = 0;
    wattsAux.selectedUnitWatt = 'cent'
}

function resetRoulette() {
    clearAllTimeouts();
    clearTimeout(roulete.intervalRoulette1)
    clearTimeout(roulete.intervalRoulette2)
    clearTimeout(roulete.intervalRoulette3)
    roulete.selectedStep = roulete.posibleStep[0];
    roulete.stopSlot1 = false;
    roulete.stopSlot2 = false;
    roulete.stopSlot3 = false;
    roulete.printBet = false;
    roulete.gameStarted = false;
}

function restartGame(screen) {
    intervalAnim = setInterval(initGame, 500);
    displayTotalWatts(screen, 'game');
    function initGame(){
        displayTotalWatts(screen, 'game');
        rouletteGame(screen);
    }
}

function cleanStates() {
    document.querySelector("#clockMenu").classList.remove('selected')
    document.querySelector("#giftMenu").classList.remove('selected')
    document.querySelector("#gameMenu").classList.remove('selected')
}

function deleteCookies(specific=false) {
    if(specific){
        document.cookie = specific + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }else{
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            if(cookie.indexOf("ClosedVer") == -1){
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
                // Establece la fecha de expiración a una fecha pasada
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
        }
    }
}

// CARGA DE ANIMACIONES
function loadAnim(screen, anim, clear, full){
    screen.innerHTML = '';
    let j = 1;
    let k = 30;
    for(i = 0; i < 1080; i++){
        let newDiv = document.createElement("div");
        if(screen.classList[0] == "createScreen"){
            k = (j == 37)? --k : k;
            j = (j == 37)? 1 : j;
            newDiv.innerHTML = `<span class='number'>${j++}</span><span class='numberVer'>${k}</span>`
        }
        newDiv.classList.add('pixel');
        newDiv.classList.add(`num-${i}`);
        
        // Se puede sumar o restar a la i de abajo para mover a izq o der
        // Si la i se suma con 36 se mueve una fila arriba todo
        // Crear otra func con mas de una anim de entrada y mas de un some / clock / game
        if(!clear && anim.some(elem => elem == `num-${i}`) || full){
            newDiv.classList.add('clicked');
        }

        screen.appendChild(newDiv)
    }
}

function loadLocatedAnim(screen, anim){
    for(i = 0; i < 1080; i++){
        if(anim.some(elem => elem == `num-${i}`)){
            screen.querySelector(`.num-${i}`).classList.add('clicked');
        }
    }
}

/* ////////////////
LOGIC AND BET FUNCS
//////////////////*/

function walk() {
    // Update steps
    let stepsToConvert = (localStorage.getItem("stepsToConvert") != null)? Number(localStorage.getItem("stepsToConvert")) : 0
    // let hasReach300 = (localStorage.getItem("hasReach300") != null)? true : false;
    let limit150 = settings.dificultyLevels[settings.dificultySelected]["unlockAnims"][0];
    let limit300 = settings.dificultyLevels[settings.dificultySelected]["unlockAnims"][1];
    let limit450 = settings.dificultyLevels[settings.dificultySelected]["unlockAnims"][2];
    let limitMil = settings.dificultyLevels[settings.dificultySelected]["unlockAnims"][3];
    
    // Update totalSteps
    if(pokeStatus.totalSteps < limitMil){
        pokeStatus.steps = (pokeStatus.steps < 99999)? (pokeStatus.steps + 1) : 99999;
        pokeStatus.totalSteps += 1
        stepsToConvert++
        roulete.hackSteps += 1;
        
        // Update Watts
        if(stepsToConvert == 20){
            localStorage.setItem("stepsToConvert", 0);
            pokeStatus.watts++
            localStorage.setItem("watts", pokeStatus.watts)
        }else{
            localStorage.setItem("stepsToConvert", stepsToConvert);
        }
        
        localStorage.setItem("steps", pokeStatus.steps);
        localStorage.setItem("totalSteps", pokeStatus.totalSteps);
        
        if(animStatus != ''){
            document.querySelector('.walkCounter').innerHTML = pokeStatus.steps;
        }

        // Reach 150 Limit
        if(pokeStatus.totalSteps > limit150 && !hasReach150){
            var now = new Date();
            now.setTime(now.getTime() + 86400 * 1000); // Agregamos 1 día en milisegundos
            document.cookie = "has_reach150_goal=true; expires=" + now + "; path=/";
            localStorage.setItem("hasReach150", 1);
            pokeStatus.todayHasReachLimit150 = true;
        }

        // Reach 300 Limit
        if(pokeStatus.totalSteps > limit300 && !hasReach300){
            var now = new Date();
            now.setTime(now.getTime() + 86400 * 1000); // Agregamos 1 día en milisegundos
            document.cookie = "has_reach300_goal=true; expires=" + now + "; path=/";
            localStorage.setItem("hasReach300", 1);
            pokeStatus.todayHasReachLimit300 = true;
        }

        // Reach End / Celebrate the million
        if(pokeStatus.totalSteps == limitMil){
            animStatus = '';
            loadEnd();
        }
    }
}

function loadEnd() {
    let limitMil = settings.dificultyLevels[settings.dificultySelected]["unlockAnims"][3];
    let animSel = '';
    switch (limitMil) {
        case 10000:
            animSel = 'tenKsteps';
            break;
        case 100000:
            animSel = 'hundredKsteps';
            break;
        case 1000000:
            animSel = 'milliomSteps';
            break;
    }
    const DisplayScreen = document.querySelector('.screen');
    clearAllTimeouts();
    clearInterval(intervalAnim);
    pokeStatus.reachEnd = true;
    localStorage.setItem("reachEnd", true);
    document.querySelector("#clockMenu").classList.remove('selected');
    loadAnim(DisplayScreen, Anims.finalScreen[animSel]);
}

function printHour(screen, hours, minutes, pmState){
    screen.innerHTML = '';
    let decen = (minutes.length > 1)? minutes[0] : 0
    let units = (minutes.length > 1)? minutes[1] : minutes[0]
    let hourState = (pmState)? 1 : 0;
    let miliseconds = new Date().getMilliseconds();

    for(i = 0; i < 1080; i++){
        let newDiv = document.createElement("div");
        newDiv.classList.add('pixel');
        newDiv.classList.add(`num-${i}`);

        //  Dots
        if(miliseconds <= 500){
            if(Anims.clock.dots.some(elem => elem == `num-${i}`)){
                newDiv.classList.add('clicked');
            }
        }


        // Hours
        if(Anims.clock.hours[hours].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        
        // Minutes Decen
        if(Anims.clock.minutesDecen[decen].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }

        // Minutes Unit
        if(Anims.clock.minutesUnit[units].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }

        // AM/PM
        if(Anims.clock.amPm[hourState].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }

        // Alarm
        if(Anims.clock.alarmOff.some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        

        screen.appendChild(newDiv)
    }
}

function displayState(screen) {
    let totalStepArray = pokeStatus.totalSteps.toString().split('').reverse();
    let currentState = '';
    screen.innerHTML = '';

    /* Calcular el state */
    if(pokeStatus.friendshipLevel <= -1500){
        currentState = 'left'
    }else if(pokeStatus.friendshipLevel > -1500 && pokeStatus.friendshipLevel <= -500){
        currentState = 'mad'
    }else if(pokeStatus.friendshipLevel > -500 && pokeStatus.friendshipLevel <= 1500){
        currentState = 'ok'
    }else if(pokeStatus.friendshipLevel > 1500 && pokeStatus.friendshipLevel <= 3000){
        currentState = 'likes'
    }else if(pokeStatus.friendshipLevel > 3000){
        currentState = 'loves'
    }


    for(i = 0; i < 1080; i++){
        let newDiv = document.createElement("div");
        newDiv.classList.add('pixel');
        newDiv.classList.add(`num-${i}`);


        // State
        if(Anims.status[currentState].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }


        /* Total Steps */
        // Unit
        if(Anims.totalSteps.unit[totalStepArray[0]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        // Decen
        if(totalStepArray.length >= 2 && Anims.totalSteps.dec[totalStepArray[1]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        // cent
        if(totalStepArray.length >= 3 && Anims.totalSteps.cent[totalStepArray[2]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        // mil
        if(totalStepArray.length >= 4 && Anims.totalSteps.mil[totalStepArray[3]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        // milDec
        if(totalStepArray.length >= 5 && Anims.totalSteps.milDec[totalStepArray[4]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        // milcent
        if(totalStepArray.length == 6 && Anims.totalSteps.milcent[totalStepArray[5]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
    
        screen.appendChild(newDiv)
    }
}

// Display Record Hours
function displayRecord(screen) {
    let totalHoursArray = calculatePastHours().toString().split('').reverse();
    screen.innerHTML = '';

    for(i = 0; i < 1080; i++){
        let newDiv = document.createElement("div");
        newDiv.classList.add('pixel');
        newDiv.classList.add(`num-${i}`);

        // State
        if(Anims.record.base.some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }

        /* Total Hours */
        // Unit
        if(Anims.record.unit[totalHoursArray[0]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        // Decen
        if(totalHoursArray.length >= 2 && Anims.record.dec[totalHoursArray[1]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        // cent
        if(totalHoursArray.length >= 3 && Anims.record.cent[totalHoursArray[2]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        // mil
        if(totalHoursArray.length >= 4 && Anims.record.mil[totalHoursArray[3]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        // milDec
        if(totalHoursArray.length >= 5 && Anims.record.milDec[totalHoursArray[4]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
    
        screen.appendChild(newDiv)
    }
}

// PRESENT WATTS
function displayTotalWatts(screen, menu='gift', initialize=false, win='') {
    let totalWattsArray = pokeStatus.watts.toString().split('').reverse();
    let {slot1, slot2, slot3, selectedSlot1, selectedSlot2, selectedSlot3} = roulete;
    screen.innerHTML = '';

    for(i = 0; i < 1080; i++){
        let newDiv = document.createElement("div");
        newDiv.classList.add('pixel');
        newDiv.classList.add(`num-${i}`);

        /* Watts */
        // Unit
        if(Anims.watts.unit[totalWattsArray[0]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        // Decen
        if(totalWattsArray.length >= 2 && Anims.watts.dec[totalWattsArray[1]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        // cent
        if(totalWattsArray.length >= 3 && Anims.watts.cent[totalWattsArray[2]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }
        // mil
        if(totalWattsArray.length >= 4 && Anims.watts.mil[totalWattsArray[3]].some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }

        // Base Screen of gift and game
        if(menu == 'gift'){
            if(Anims.gift.base.some(elem => elem == `num-${i}`)){
                newDiv.classList.add('clicked');
            }
        }else if(menu == 'game'){
            if(Anims.game.base.some(elem => elem == `num-${i}`)){
                newDiv.classList.add('clicked');
            }
            // Slot1
            if(Anims.game.roulette1[slot1[selectedSlot1]][slot1[selectedSlot1]].some(elem => elem == `num-${i}`)){
                newDiv.classList.add('clicked');
            }
            // Slot2
            if(Anims.game.roulette2[slot2[selectedSlot2]][slot2[selectedSlot2]].some(elem => elem == `num-${i}`)){
                newDiv.classList.add('clicked');
            }
            // Slot3
            if(Anims.game.roulette3[slot3[selectedSlot3]][slot3[selectedSlot3]].some(elem => elem == `num-${i}`)){
                newDiv.classList.add('clicked');
            }
        }

        // bet game text
        if(menu == 'game' && initialize){
            if(Anims.game.bet.some(elem => elem == `num-${i}`)){
                newDiv.classList.add('clicked');
            }
        }

        //showWin
        if(menu == 'game' && win != ''){
            if(Anims.game[`win${win}`].some(elem => elem == `num-${i}`)){
                newDiv.classList.add('clicked');
            }
        }
    
        screen.appendChild(newDiv)
    }
}

// let {printBet} = roulete.printBet;
let printGive = true;
function SelectWattsAmount(screen, cents, decs, units, currentSelected) {
    wattsAux.givenAmountWatts = Number(`${wattsAux.GivenCents}${wattsAux.GivenDecs }${wattsAux.GivenUnits}`)
    for(i = 0; i < 1080; i++){
        if(printGive && currentSelected == 'unit' || currentSelected != 'unit'){
            if(Anims.givenWatts.unit[units].some(elem => elem == `num-${i}`)){
                screen.querySelector(`.num-${i}`).classList.add('clicked');
            }
        }

        if(printGive && currentSelected == 'dec' || currentSelected != 'dec'){
            if(Anims.givenWatts.dec[decs].some(elem => elem == `num-${i}`)){
                screen.querySelector(`.num-${i}`).classList.add('clicked');
            }
        }

        if(printGive && currentSelected == 'cent' || currentSelected != 'cent'){
            if(Anims.givenWatts.cent[cents].some(elem => elem == `num-${i}`)){
                screen.querySelector(`.num-${i}`).classList.add('clicked');
            }
        }

        if(printGive && currentSelected == 'give'){
            if(wattsAux.givenAmountWatts <= pokeStatus.watts){
                if(Anims.gift.give.some(elem => elem == `num-${i}`)){
                    screen.querySelector(`.num-${i}`).classList.add('clicked');
                }    
            }else{
                if(Anims.gift.notEnouff.some(elem => elem == `num-${i}`)){
                    screen.querySelector(`.num-${i}`).classList.add('clicked');
                }
                auxiliarTimeout = setTimeout(() => {
                    wattsAux.selectedUnitWatt = 'cent'
                }, 500);    
            }
        }
    }

    printGive = !printGive;
}

let {printBet} = roulete.printBet;
function rouletteGame(screen) {
    let breakLoop = false;
    let selectedSlot1 = roulete.slot1[roulete.selectedSlot1];
    let selectedSlot2 = roulete.slot2[roulete.selectedSlot2];
    let selectedSlot3 = roulete.slot3[roulete.selectedSlot3];

    for(i = 0; i < 1080 && !breakLoop; i++){

        // Bet text
        if(printBet && roulete.selectedStep == 'bet' || roulete.selectedStep != 'bet' && pokeStatus.watts >= 5){
            if(Anims.game.bet.some(elem => elem == `num-${i}`)){
                screen.querySelector(`.num-${i}`).classList.add('clicked');
            }
        }

        //The initial slots are printing in the displayTotalWatts function
        
        if(roulete.selectedStep == 'try'){ //&& miliseconds <= 500
            if(pokeStatus.watts < 5){
                if(Anims.game.notEnouff.some(elem => elem == `num-${i}`)){
                    screen.querySelector(`.num-${i}`).classList.add('clicked');
                }
                auxiliarTimeout = setTimeout(() => {
                    roulete.selectedStep = roulete.posibleStep[0]; //Select step bet again
                }, 500);    
            }else{
                // Pay the bet
                pokeStatus.watts -= 5;
                localStorage.setItem("watts", pokeStatus.watts)
                
                // Start the Game
                roulete.selectedStep = roulete.posibleStep[2]; //Select slot 1
                roulete.gameStarted = true;
                breakLoop = true;
            }
        }
    }

    printBet = !printBet;

    // Inicio del juego
    if(roulete.gameStarted){
        console.log("Start Game")
        stopPlaying = true; // P stops play (To hope a present?)
        roulete.randomWinSel = roulete.randomWin[Math.floor(Math.random() * (5 - 1 + 1))];
        let auxArray = ['Come', '', 'Gone'];
        let counter = 2; //Start in 2 cause the first item is exiting
        let counter2 = 2; //Start in 2 cause the first item is exiting
        let counter3 = 2; //Start in 2 cause the first item is exiting
        let endgame = false;

        // Stop the initGame() interval
        clearInterval(intervalAnim);
        clearAllTimeouts();

        // Init the screen:
        displayTotalWatts(screen, 'game', true);
        
        // Main roulette intervals
        roulete.intervalRoulette1 = setInterval(initSlot1, 166); //166
        roulete.intervalRoulette2 = setInterval(initSlot2, 170); //170
        roulete.intervalRoulette3 = setInterval(initSlot3, 174); //174

        function initSlot1(){
            cleanSlot(1);

            // Update the selected slot
            selectedSlot1 = roulete.slot1[roulete.selectedSlot1];

            // Print the item or the item exiting (never item come)
            for(i = 0; i < 1080; i++){
                if(Anims.game.roulette1[selectedSlot1][`${selectedSlot1}${auxArray[counter]}`].some(elem => elem == `num-${i}`)){
                    screen.querySelector(`.num-${i}`).classList.add('clicked');
                }
            }

            // Stop the slot
            if(roulete.stopSlot1 && auxArray[counter] == '' && (roulete.forcedSlot1 == '' || roulete.forcedSlot1 == selectedSlot1)){
                clearInterval(roulete.intervalRoulette1);
                localStorage.setItem("selectedSlot1", roulete.selectedSlot1)
            }

            // If the main item is exiting, print the next item coming
            if(counter == 2){
                let {selectedSlot1, slot1} = roulete;

                // Check the next item; if end of array return to element 0
                let selectedNextSlot1 = (selectedSlot1 != slot1.length - 1)? slot1[roulete.selectedSlot1 + 1] : slot1[0];

                // Print the next item coming (never the item or the item exiting)
                for(i = 0; i < 1080; i++){
                    if(Anims.game.roulette1[selectedNextSlot1][`${selectedNextSlot1}${auxArray[0]}`].some(elem => elem == `num-${i}`)){
                        screen.querySelector(`.num-${i}`).classList.add('clicked');
                    }
                }

                //Selecciona el siguiente slot
                roulete.selectedSlot1 = (selectedSlot1 != slot1.length - 1)? (selectedSlot1 + 1) : 0;
                counter = 1;
            }else{
                counter++
            }
        }

        function initSlot2(){
            cleanSlot(2);

            // Update the selected slot
            selectedSlot2 = roulete.slot2[roulete.selectedSlot2];

            // Print the item or the item exiting (never item come)
            for(i = 0; i < 1080; i++){
                if(Anims.game.roulette2[selectedSlot2][`${selectedSlot2}${auxArray[counter2]}`].some(elem => elem == `num-${i}`)){
                    screen.querySelector(`.num-${i}`).classList.add('clicked');
                }
            }

            // Stop the slot
            if(roulete.stopSlot2 && auxArray[counter2] == '' && (roulete.forcedSlot2 == '' || roulete.forcedSlot2 == selectedSlot2)){
                clearInterval(roulete.intervalRoulette2);
                localStorage.setItem("selectedSlot2", roulete.selectedSlot2)
            }

            // If the main item is exiting, print the next item coming
            if(counter2 == 2){
                let {selectedSlot2, slot2} = roulete;

                // Check the next item; if end of array return to element 0
                let selectedNextSlot2 = (selectedSlot2 != slot2.length - 1)? slot2[roulete.selectedSlot2 + 1] : slot2[0];

                // Print the next item coming (never the item or the item exiting)
                for(i = 0; i < 1080; i++){
                    if(Anims.game.roulette2[selectedNextSlot2][`${selectedNextSlot2}${auxArray[0]}`].some(elem => elem == `num-${i}`)){
                        screen.querySelector(`.num-${i}`).classList.add('clicked');
                    }
                }

                //Selecciona el siguiente slot
                roulete.selectedSlot2 = (selectedSlot2 != slot2.length - 1)? (selectedSlot2 + 1) : 0;
                counter2 = 1;
            }else{
                counter2++
            }
        }

        function initSlot3(){
            cleanSlot(3);

            // Update the selected slot
            selectedSlot1 = roulete.slot1[roulete.selectedSlot1];
            selectedSlot2 = roulete.slot2[roulete.selectedSlot2];
            selectedSlot3 = roulete.slot3[roulete.selectedSlot3];

            // Print the item or the item exiting (never item come)
            for(i = 0; i < 1080; i++){
                if(Anims.game.roulette3[selectedSlot3][`${selectedSlot3}${auxArray[counter3]}`].some(elem => elem == `num-${i}`)){
                    screen.querySelector(`.num-${i}`).classList.add('clicked');
                }
            }

            // Stop the slot && avoid seven if the cookie is declared and the other slot are in seven
            if(roulete.stopSlot3 && auxArray[counter3] == '' 
                && (roulete.forcedSlot3 == '' || roulete.forcedSlot3 == selectedSlot3) 
                && (!roulete.hasWin777 || ((roulete.hasWin777 && selectedSlot3 != 'seven') 
                || (roulete.hasWin777 && (selectedSlot1 != 'seven' || selectedSlot2 != 'seven'))))){

                // End of the game
                endgame = true;
                clearInterval(roulete.intervalRoulette3);
                localStorage.setItem("selectedSlot3", roulete.selectedSlot3)
                showResults(screen);
            }

            // If the main item is exiting, print the next item coming
            if(counter3 == 2 && !endgame){
                let {selectedSlot3, slot3} = roulete;

                // Check the next item; if end of array return to element 0
                let selectedNextSlot3 = (selectedSlot3 != slot3.length - 1)? slot3[roulete.selectedSlot3 + 1] : slot3[0];

                // Print the next item coming (never the item or the item exiting)
                for(i = 0; i < 1080; i++){
                    if(Anims.game.roulette3[selectedNextSlot3][`${selectedNextSlot3}${auxArray[0]}`].some(elem => elem == `num-${i}`)){
                        screen.querySelector(`.num-${i}`).classList.add('clicked');
                    }
                }

                //Selecciona el siguiente slot
                roulete.selectedSlot3 = (selectedSlot3 != slot3.length - 1)? (selectedSlot3 + 1) : 0;
                counter3 = 1;
            }else if(!endgame){
                counter3++
            }
        }

        function cleanSlot(slot) {
            for(i = 0; i < 1080; i++){
                if(Anims.game[`cleanerSlot${slot}`].some(elem => elem == `num-${i}`)){
                        screen.querySelector(`.num-${i}`).classList.remove('clicked');
                }
            }
        }
    }
}

function showResults(screen) {
    let {selectedSlot1, selectedSlot2, selectedSlot3, slot1, slot2, slot3} = roulete;

    if(slot1[selectedSlot1] == slot2[selectedSlot2] && slot2[selectedSlot2] == slot3[selectedSlot3]){
        //Win
        let amount = 0;
        let anim = amount
        let intervalSpeed = 200;
        roulete.totalLosses = 0;
        
        switch (slot1[selectedSlot1]) {
            case 'fish':
            case 'flower':
                amount = 30;
                break;
            case 'pika':
                amount = 50;
                break;
            case 'seven':
                amount = 500;
                intervalSpeed = 100;
                var now = new Date();
                now.setTime(now.getTime() + 21600 * 1000); // Agregamos 6 horas en milisegundos
                document.cookie = "has_win_777=true; expires=" + now + "; path=/";
                roulete.hasWin777 = true;
                    break;
        }

        anim = amount;
        intervalAnim = setInterval(increase, intervalSpeed);

        function increase() {
            amount -= 10;
            pokeStatus.watts += 10;
            displayTotalWatts(screen, 'game', false, anim);

            if(amount == 0){
                clearInterval(intervalAnim);
                localStorage.setItem("watts", pokeStatus.watts);
                resetRoulette();
                restartGame(screen);
            }
        }
    }else{
        //Loose
        roulete.totalLosses += 1;
        resetRoulette();
        restartGame(screen);
    }
}

// Preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    preloader.style.display = 'none';
});

function calculatePastHours() {
  const Start = new Date((localStorage.getItem("initTamDate") != null)? localStorage.getItem("initTamDate") : new Date().toDateString());
  const End = new Date();  
  const MilisecondDiff = End.getTime() - Start.getTime();

  //Convert to Hours miliseconds:
  const MilisecondsPerHour = 1000 * 60 * 60;
  const pastHours = MilisecondDiff / MilisecondsPerHour;

  return pastHours.toFixed(0);
}

