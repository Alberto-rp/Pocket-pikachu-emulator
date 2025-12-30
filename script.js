// Load animations
let Anims = {};
fetch('./anims.json')
.then((response) => response.json())
.then((data) => {
    Anims = data;
    // EDIT ANIMATION
    Anims.edit = Anims.diving.diving2;
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
let avoidSleepGiftDev = false; //For development

// Steps
let pokeStatus = {};
pokeStatus.steps = (localStorage.getItem("steps") != null)? Number(localStorage.getItem("steps")) : 0;
pokeStatus.totalSteps = (localStorage.getItem("totalSteps") != null)? Number(localStorage.getItem("totalSteps")) : 0;
pokeStatus.watts = (localStorage.getItem("watts") != null)? Number(localStorage.getItem("watts")) : 50;
pokeStatus.friendshipLevel = (localStorage.getItem("friendshipLevel") != null)? Number(localStorage.getItem("friendshipLevel")) : 0;
pokeStatus.eatingtHours = [10, 12, 16, 18];
pokeStatus.playHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
pokeStatus.tvHours = [13, 14, 15, 16, 17, 18, 19];
pokeStatus.consecutiveSteps = 0;
pokeStatus.lastConected = (localStorage.getItem("lastConected") != null)? localStorage.getItem("lastConected") : new Date().toDateString();

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
roulete.hasWin777 = document.cookie.split("; ").find((row) => row.startsWith("has_win_777="))?.split("=")[1];
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
    // const audioShake = document.querySelector('#shakeAudio');
    // const audioShaking = document.querySelector('#shakingAudio');

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
    document.querySelector("#enter-button").addEventListener('click', enterButton); 
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
            if((isLateAwake || !(timeStart.getHours() >= 20 && timeStart.getHours() <= 23 || timeStart.getHours() >= 0 && timeStart.getHours() < 8)) || avoidSleepGiftDev){
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
                }else if(roulete.hackSteps > 150){
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
                }else if(roulete.hackSteps > 150){
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
                }else if(roulete.hackSteps > 150 && roulete.hasWin777 != 'true'){
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
            }
        }else if(animStatus == 'settingsRel'){
            settings.relSelected = settings.relSelected == 'off' ? 'on' : 'off';
            loadAnim(DisplayScreen, Anims.settingsRel[settings.relSelected])
            localStorage.setItem("relDrop", settings.relSelected);
        }else if(animStatus != 'restart'){
            // Init screen (Timeouts to emulate analogic)
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
                                    if ((!isLateAwake && (timeStart.getHours() >= 20 && timeStart.getHours() <= 23 || timeStart.getHours() >= 0 && timeStart.getHours() < 8)) && !avoidSleepGiftDev){
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
        }
    })

    // STATE BUTTON / FRIENDSHIP BUTTON
    let allowedAnims = ['stand', 'standMad', 'sleeping', 'yawnHappy', 'tongueAnim', 'happySteps', 'heartSmiles', 'writeLetter', 'flying', 'diving', 'backFlip', 'piano', 'standLike', 'standLove', 'left', 'brushTeeth', 'sandcastle', 'reading', 'watchTV', 'bathTime', 'buildingBlocks', 'lollypop', 'walking', 'eating'];
    let menus = ['clockMenu', 'giftMenu', 'gameMenu'];

    document.querySelector("#state-button").addEventListener('click', () => {
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
    let settingsMenus = ['reset', 'sound', 'relDrop'];
    let selectedSettingMenu = settingsMenus[1]
    document.querySelector("#menu-button").addEventListener('click', () => {
        if(!isiOS()){
            window.navigator.vibrate(10);
        }
        if(allowedAnims.some(anim => anim == animStatus)){
            cleanStates();
            animStatus = 'settings'
            clearInterval(intervalAnim)
            clearAllTimeouts();
            loadAnim(DisplayScreen, Anims.settings.sound)
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
        diving();
    })

    // Basic stand animation
    function basicAnim(avoidActivity=false, avoidSleep=false, avoidGreeting=false, avoidEat=false) {
        avoidSleep = avoidSleepGiftDev; //For development
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
            if (!avoidSleep && !isLateAwake && (startTime.getHours() >= 20 && startTime.getHours() <= 23 ||
                startTime.getHours() >= 0 && startTime.getHours() < 8)){
                animStatus = 'sleeping';
                
                // Update the cookieValue after goinToSleep, to avoid error of multiple times going to sleep
                coockieHasGoneSleep = document.cookie.split("; ").find((row) => row.startsWith("has_gone_sleep="))?.split("=")[1];

                if((coockieHasGoneSleep != 'true' && startTime.getHours() == 20) || randomAnim <= 3) {
                    slepAnim = Anims.sleep.frontSleep;
                    slepAnim2 = Anims.sleep.frontSleep2;
                }else if(randomAnim >= 4 && randomAnim <= 6){
                    slepAnim = Anims.sleep.sideSleep;
                    slepAnim2 = Anims.sleep.sideSleep2;
                }else {
                    slepAnim = Anims.sleep.backSleep;
                    slepAnim2 = Anims.sleep.backSleep2;
                }

                if(startTime.getHours() == 20 && coockieHasGoneSleep != 'true'){
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
                // if avoid Sleep, limpiar cookie de acostarse
                // Eating
                //eatingtHours = [10, 12, 16, 18]
                if( !avoidEat && pokeStatus.eatingtHours.some(elem => elem == startTime.getHours()) && coockieHasBrushed != 'true' && startTime.getMinutes() <= 30) {
                    if(coockieHadEating != 'true'){ // && startTime.getMinutes() <= 30
                        eating();
                    }else if(coockieHasBrushed != 'true'){ //cockie tooth
                        brushTeeth();
                    }
                }else{
                    if(pokeStatus.friendshipLevel <= -500){ // If pikachu is mad he doesn't play
                        animStatus = 'standMad'
                        animate(true);
                        intervalAnim = setInterval(animate, 1000);
        
                        function animate() {
                            // Check the time pased
                            endTime = new Date();
                            var timeDiff = endTime - startTime; //in ms
                            timeDiff /= 1000;
                            secondsElapsed = Math.round(timeDiff)
                
                            if(secondsElapsed % 4 == 0 && secondsElapsed != 0){
                                loadAnim(DisplayScreen, Anims.standMad.extend)
                                // animStatus = 'extend'
                            }else {
                                loadAnim(DisplayScreen, Anims.standMad.stand)
                            }
                        }
    
                    }else{ //Friendship level OK
                        console.log(randomAnim);
                        if(startTime.getHours() == 19 && (coockieHasTakeBath != 'true' || coockieHasBrushed != 'true')){// Bath Time
                            if(coockieHasTakeBath != 'true'){
                                bathTime();
                            }else{
                                brushTeeth();
                            }
                        }else if(!avoidActivity && pokeStatus.playHours.some(elem => elem == startTime.getHours()) && randomAnim > 5){//PlayingTime
                            // Random activities
                            console.log("PlayingTime" + randomActivity)
                            
                            if(randomActivity >= 1 && randomActivity <= 7){
                                sandcastle();
                            }else if(randomActivity >= 8 && randomActivity <= 14){
                                buildingBlocks();
                            }else if(randomActivity >= 15 && randomActivity <= 18){
                                reading();
                            }else{
                                lollypop();
                            }
                        }else if(!avoidActivity && pokeStatus.tvHours.some(elem => elem == startTime.getHours()) && randomAnim <= 2){//Watching TV
                            watchTV();
                        }else{
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
                                if(!avoidGreeting && startTime.getHours() == 8){
                                    yawnAnim()
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
        let walkingAllowedAnims = ['stand', 'standMad', 'sandcastle', 'standLove', 'standLike', 'eating', 'bathTime']
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
            }else if(animStatus == 'lollypop'){
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
                    loadAnim(DisplayScreen, Anims.shower.look);
                    pokeStatus.consecutiveSteps = 0;
                    auxiliarTimeout = setTimeout(() => {
                        basicAnim();
                    }, 3000);
                }, 1000);
            }else if(animStatus == 'eating'){
                actionTimeOut = setTimeout(() => {
                    console.log("Throw Table")
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
        animStatus = 'yawnHappy'
        console.log(animStatus)
        clearInterval(intervalAnim);
        intervalAnim = setInterval(animate, 500);
        startTime = new Date();
        auxiliarTimeout = setTimeout(() => {
            document.querySelector("#clockMenu").classList.add('selected')
        }, 500);

        function animate() {
            // Check the time pased
            endTime = new Date();
            var timeDiff = endTime - startTime; //in ms
            timeDiff /= 1000;
            secondsElapsed = timeDiff.toFixed(1);

            loadAnim(DisplayScreen, Anims.happy1.happyStand);
            if(secondsElapsed > 1.0) loadAnim(DisplayScreen, Anims.happy1.happyStartScream);
            if(secondsElapsed > 2.0) loadAnim(DisplayScreen, Anims.happy1.scream1);
            if(secondsElapsed > 3.0) loadAnim(DisplayScreen, Anims.happy1.scream2);
            if(secondsElapsed > 4.5) loadAnim(DisplayScreen, Anims.happy1.scream1);
            if(secondsElapsed > 5.5) loadAnim(DisplayScreen, Anims.happy1.scream2);
            if(secondsElapsed > 7.0) loadAnim(DisplayScreen, Anims.happy1.scream1);
            if(secondsElapsed > 7.5) loadAnim(DisplayScreen, Anims.happy1.happyStartScream);
            if(secondsElapsed > 8.0) loadAnim(DisplayScreen, Anims.happy1.happyStand);
            if(secondsElapsed > 9.0) {
                clearInterval(intervalAnim);
                // Para no jugar o saludar despues de un gift
                basicAnim(true, false, true, true);
            }
            
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
    function eating() {
        animStatus = 'eating'
        console.log(animStatus)
        const BreadHours = [10];
        let eatCounter = 1;
        let startAnim;
        let nomnom;
        let nomnom2;
        intervalAnim = setInterval(animate, 500);
        
        var now = new Date();
        
        if(BreadHours.some(elem => elem == now.getHours()) || randomAnim >= 5){
            startAnim =  Anims.eating.breakfast1;
            nomnom = Anims.eating.nomnom
            nomnom2 =  Anims.eating.nomnom2
        }else{
            startAnim =  Anims.eating.eatingOnigiri;
            nomnom = Anims.eating.nonomOnigiri
            nomnom2 =  Anims.eating.nonomOnigiri2
        }
        
        // Declare cookie
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

            //eatingtHours = [10, 12, 16, 18]
            if(!pokeStatus.eatingtHours.some(elem => elem == endTime.getHours())) {
                clearInterval(intervalAnim);
                basicAnim(true);
            }
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
    function bathTime() {
        animStatus = 'bathTime'
        console.log(animStatus)
        let bathCounter = 1;
        loadAnim(DisplayScreen, Anims.shower.stand1)
        intervalAnim = setInterval(animate, 700);

        function animate() {
            
            if(bathCounter <= 1){
                loadAnim(DisplayScreen, Anims.shower.stand2)
            }else {
                loadAnim(DisplayScreen, Anims.shower.stand1)
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

    // Lollypop anim
    function lollypop() {
        animStatus = 'lollypop'
        console.log(animStatus)
        let animHits = 1;
        loadAnim(DisplayScreen, Anims.lollypop.lick1)
        intervalAnim = setInterval(animate, 1000);
        
        function animate() {
            if(throwCandy){
                clearInterval(intervalAnim);
                loadAnim(DisplayScreen, Anims.lollypop.fall)
                auxiliarTimeout = setTimeout(() => {
                    updateFriendshipLevel(-30, false, false);
                    randomAnim = Math.floor(Math.random() * (10 - 1 + 1) + 1); //1-10
                    throwCandy = false;
                    basicAnim(true, false, true, true);
                }, 3000);
            }else if(animHits % 2 == 0){
                loadAnim(DisplayScreen, Anims.lollypop.lick1)
            }else{
                loadAnim(DisplayScreen, Anims.lollypop.lick2)
            }

            animHits++
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

            // Clear the stored data
            localStorage.clear();
            pokeStatus.steps = 0;
            pokeStatus.totalSteps = 0;
            pokeStatus.watts = 50;
            pokeStatus.friendshipLevel = 0;
            isLateAwake = true;
            settings.relSelected = 'on';
            localStorage.setItem("watts", pokeStatus.watts);
            localStorage.setItem("friendshipLevel", pokeStatus.friendshipLevel);
            localStorage.setItem("relDrop", settings.relSelected);
    
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
            randomAnim = Math.floor(Math.random() * (10 - 1 + 1) + 1); //1-10

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
                if(randomAnim > 3 || friendShipStatus == 'mad') {
                    heartSmiles();
                }else {
                    backFlip();
                }
            }else if(amount >= 400 && amount < 500){
                if(randomAnim <= 4 || friendShipStatus == 'mad'){
                    heartSmiles();
                }else if(randomAnim > 4 && randomAnim <= 8){
                    backFlip();
                }else{
                    writtingLetter();
                }
            }else if(amount >= 500 && amount < 700){
                if(randomAnim <= 3){
                    heartSmiles();
                }else if(randomAnim > 3 && randomAnim <= 6){
                    backFlip();
                }else{
                    writtingLetter();
                }
            }else if(amount >= 700 && amount < 800){
                if(randomAnim <= 4){
                    flying();
                    //rollingBall
                }else if(randomAnim > 4 && randomAnim <= 8){
                    diving();
                }else{
                    flying();
                }
            }else if(amount >= 800 && amount < 998){
                if(randomAnim <= 4){
                    playPiano();
                }else if(randomAnim > 4 && randomAnim <= 8){
                    flying();
                }else{
                    diving();
                }
            }else{
                if(friendShipStatus == 'mad') {
                    flying();
                }else if(friendShipStatus == 'ok'){
                    playPiano();
                }else if(friendShipStatus == 'likes'){
                    diving();
                }else if(friendShipStatus == 'loves'){
                    diving();
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

// CARGA DE ANIMACIONES
function loadAnim(screen, anim, clear, full){
    screen.innerHTML = '';
    for(i = 0; i < 1080; i++){
        let newDiv = document.createElement("div");
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

//Carga de animaciones experimental (requiere eliminar todos los metodos antiguos like yawn)
/*let previusAnim = '';
function loadAnim(screen, anim, clear, full){
    if(previusAnim != '' && previusAnim.classList[0] == screen.classList[0] && !clear && !full){
        previusAnim = screen;
        for(i = 0; i < 1080; i++){
            if(previusAnim.childNodes[i].classList.contains('clicked') && !(anim.some(elem => elem == `num-${i}`))){
                previusAnim.childNodes[i].classList.add('halfClicked')
            }
            //console.log(previusAnim.childNodes[i].classList)
        }
        screen = previusAnim;
        auxiliarTimeout = setTimeout(() => {
            printAnim();
        }, 50);
    }else{
        printAnim();
    }

    function printAnim() {
        screen.innerHTML = '';
        for(i = 0; i < 1080; i++){
            let newDiv = document.createElement("div");
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
        previusAnim = screen;
    }
}
*/

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
    pokeStatus.steps = (pokeStatus.steps < 99999)? (pokeStatus.steps + 1) : 0;
    let stepsToConvert = (localStorage.getItem("stepsToConvert") != null)? Number(localStorage.getItem("stepsToConvert")) : 0
    stepsToConvert++
    roulete.hackSteps += 1;

    // Update totalSteps
    if(pokeStatus.totalSteps < 999999){
        pokeStatus.totalSteps += 1
    }else{
        // Celebrate the million
        pokeStatus.totalSteps = 0;
    }

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
                && (roulete.hasWin777 != 'true' || ((roulete.hasWin777 == 'true' && selectedSlot3 != 'seven') 
                || (roulete.hasWin777 == 'true' && (selectedSlot1 != 'seven' || selectedSlot2 != 'seven'))))){

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

