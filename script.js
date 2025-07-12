// Load animations
var Anims = {hours: [], minutesDecen: [], minutesUnit: []};
fetch('./anims.json')
.then((response) => response.json())
.then((data) => {
    Anims = data;
    // EDIT ANIMATION
    Anims.edit = Anims.standLike.happyStand1;
});

// Anim vars
var saved = null;
var clickedPixels = [];
var intervalAnim;
var animStatus = ''
var randomAnim;
var throwBlocks = false;

// Steps
var steps = (localStorage.getItem("steps") != null)? Number(localStorage.getItem("steps")) : 0;
var totalSteps = (localStorage.getItem("totalSteps") != null)? Number(localStorage.getItem("totalSteps")) : 0;
var watts = (localStorage.getItem("watts") != null)? Number(localStorage.getItem("watts")) : 500;
var friendshipLevel = (localStorage.getItem("friendshipLevel") != null)? Number(localStorage.getItem("friendshipLevel")) : 0;
var eatingtHours = [10, 12, 13, 18]
var playHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

// Watts
var GivenCents = 0;
var GivenDecs = 0;
var GivenUnits = 0;
var selectedUnitWatt = 'cent'
var givenAmountWatts = 0
var coockieHadBreakfast = document.cookie.split("; ").find((row) => row.startsWith("had_breakfast="))?.split("=")[1];
var coockieHasBrushed = document.cookie.split("; ").find((row) => row.startsWith("has_brushed="))?.split("=")[1];
var coockieHasGoneSleep = document.cookie.split("; ").find((row) => row.startsWith("has_gone_sleep="))?.split("=")[1];


document.addEventListener('DOMContentLoaded', () => {
    const createScreen = document.querySelector('.createScreen');
    const DisplayScreen = document.querySelector('.screen');


    if(localStorage.getItem("InitTamagotchi") == null){
        restartTamagotchi(DisplayScreen);
    }else{
        //Init Pantalla
        loadAnim(DisplayScreen, null, true);
    }
    

    /* DEV TOOLS */
    // Developer screen
    loadAnim(createScreen, null, true);
    if(window.location.href.indexOf('github.io') != -1 || window.location.href.indexOf('pokpik.life') != -1){
        document.querySelector('.developerScreen').classList.add('hide');
        document.body.style.zoom = "90%";
    }

    //Drawing functionality
    function draw(event) {
        if(event.target.classList[0] == 'createScreen') return
        event.target.classList.contains('clicked')
        if(event.target.classList.contains('clicked')){
            event.target.classList.remove('clicked')
        }else{
            event.target.classList.add('clicked')
        }
    }

    createScreen.addEventListener('click', draw)

    //Saving Animation
    document.querySelector("#saveAnimation").addEventListener('click', () => {
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
        // console.log(clickedPixels)
        navigator.clipboard.writeText(exitString)
        console.log(exitString)
    })

    //Saving
    document.querySelector("#saveDraw").addEventListener('click', () => {
        console.log('SAVED')
        saved = document.querySelectorAll('.createScreen .pixel')
    })

    //Print
    document.querySelector("#printDraw").addEventListener('click', () => {
        DisplayScreen.innerHTML = '';
        saved.forEach(element => {
            let newDiv = element.cloneNode(true)
            DisplayScreen.appendChild(newDiv);
        });
    })

    //PrintHello
    document.querySelector("#printInit").addEventListener('click', () => {
        loadAnim(DisplayScreen, Anims.edit)
    })

    //EDIT
    //Load Animation to work with
    document.querySelector("#editPrint").addEventListener('click', () => {
        loadAnim(createScreen, Anims.edit)
    })

    //INIT TAMAGOTCHI / ENTER
    // var clockInterval;
    var screenOff;
    document.querySelector("#enter-button").addEventListener('click', () => {
        if(animStatus == 'pokeball') {
            clearInterval(intervalAnim);
            restartTamagotchi(DisplayScreen, true)
        }else if(animStatus == 'gift'){
            if(selectedUnitWatt != 'give'){
                let posibleUnits = ['cent', 'dec', 'unit', 'give'];
                // Seleccionar la siguiente unidad
                selectedUnitWatt = (posibleUnits.indexOf(selectedUnitWatt) < (posibleUnits.length - 1))? posibleUnits[posibleUnits.indexOf(selectedUnitWatt) + 1] : selectedUnitWatt
            }else if(selectedUnitWatt == 'give' && givenAmountWatts <= watts){
                console.log(`${givenAmountWatts} was given`);
                clearInterval(intervalAnim);
                clearAllTimeouts();
                resetGivenWatts();

                // Give present to Pikachu / Update friendship level
                updateFriendshipLevel(givenAmountWatts, true, true);
            }
        }else if(animStatus == 'settings'){
            if(selectedMenu == 'reset'){
                steps = 0;
                document.querySelector('.walkCounter').innerHTML = steps;
                localStorage.setItem("steps", steps);
            }
        }else{
            // Init screen (Timeouts to emulate analogic)
            setTimeout(() => {
                document.querySelector('.walkCounter').innerHTML = steps;
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
                    randomAnim = Math.floor(Math.random() * (10 - 1 + 1) + 1); //1-10
                    coockieHadBreakfast = document.cookie.split("; ").find((row) => row.startsWith("had_breakfast="))?.split("=")[1];
                    coockieHasBrushed = document.cookie.split("; ").find((row) => row.startsWith("has_brushed="))?.split("=")[1];
                    coockieHasGoneSleep = document.cookie.split("; ").find((row) => row.startsWith("has_gone_sleep="))?.split("=")[1];
                    basicAnim();
                }else{
                    if(animStatus != 'clock' && animStatus != 'gift'){ // | gift | game
                        let menuSelected = document.querySelector('.menuBar .selected').id
                        console.log(menuSelected)
                        switch (menuSelected) {
                            case "clockMenu": //CLOCK
                                // basicAnim('stop', true);
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
                                // basicAnim('stop', true);
                                let timeStart = new Date();
                                clearInterval(intervalAnim);
                                clearAllTimeouts();
                                animStatus = 'gift'
                                console.log(animStatus)
                                document.querySelector(`#${menuSelected}`).classList.remove('selected')

                                if(friendshipLevel <= -1500){
                                    loadAnim(DisplayScreen, Anims.gift.whereIsPikachu)
                                }else{
                                    // Sleep
                                    if (timeStart.getHours() >= 20 && timeStart.getHours() <= 23 || timeStart.getHours() >= 0 && timeStart.getHours() < 7){
                                        loadAnim(DisplayScreen, Anims.gift.sleeping)
                                    }else{
                                        // Prepare Gift
                                        displayTotalWatts(DisplayScreen);
                                        intervalAnim = setInterval(SelectWatts, 500);
                                        function SelectWatts(){
                                            displayTotalWatts(DisplayScreen); //If not here doesn't clean the screen
                                            SelectWattsAmount(DisplayScreen, GivenCents, GivenDecs, GivenUnits, selectedUnitWatt)
                                        }
                                    }
                                }
                                break;
                        
                            default:
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
                animStatus = ''
                cleanStates();
                document.querySelector('.walkCounter').innerHTML = '';
                loadAnim(DisplayScreen, null, true);
                clearInterval(screenOff);
            }
        }
    })


    // BACK BUTTON
    let backMenusAllowed = ['clock', 'state', 'settings']
    document.querySelector("#back-button").addEventListener('click', () => {
        if(backMenusAllowed.some(anim => anim == animStatus) || animStatus == 'gift' && selectedUnitWatt == 'cent'){
            selectedMenu = posibleMenus[1]
            clearInterval(intervalAnim);
            clearAllTimeouts();
            resetGivenWatts();
            document.querySelector("#clockMenu").classList.add('selected')
            basicAnim(false, false, true);
        }else if(animStatus == 'gift' && selectedUnitWatt != 'cent'){
            let posibleUnits = ['cent', 'dec', 'unit', 'give'];
            // Seleccionar la anterior unidad
            if(selectedUnitWatt != 'give'){
                selectedUnitWatt = (posibleUnits.indexOf(selectedUnitWatt) > 0)? posibleUnits[posibleUnits.indexOf(selectedUnitWatt) - 1] : selectedUnitWatt
            }else{
                selectedUnitWatt = 'cent'
            }
        }
    })

    // STATE BUTTON / FRIENDSHIP BUTTON
    let allowedAnims = ['stand', 'standMad', 'standLike', 'left', 'brushTeeth', 'sandcastle', 'buildingBlocks', 'breakfast'];
    let menus = ['clockMenu', 'giftMenu', 'gamblingMenu'];

    document.querySelector("#state-button").addEventListener('click', () => {
        if(allowedAnims.some(anim => anim == animStatus)){
            cleanStates();
            animStatus = 'state'
            clearInterval(intervalAnim)
            clearAllTimeouts();
            displayState(DisplayScreen);
        }
    })

    // START BUTTON / SETTINGS
    let posibleMenus = ['reset', 'sound', 'time'];
    let selectedMenu = posibleMenus[1]
    document.querySelector("#menu-button").addEventListener('click', () => {
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
        if(animStatus == 'gift'){
            switch (selectedUnitWatt) {
                case "cent":
                    GivenCents = (GivenCents < 9)? (GivenCents + 1) : GivenCents
                    break;
                case "dec":
                    GivenDecs = (GivenDecs < 9)? (GivenDecs + 1) : GivenDecs
                    break;
                case "unit":
                    GivenUnits = (GivenUnits < 9)? (GivenUnits + 1) : GivenUnits
                    break;
            }
        }else if(animStatus == 'settings') {
            let indexSelected = posibleMenus.indexOf(selectedMenu);
            selectedMenu = (indexSelected > 0)? posibleMenus[indexSelected - 1] : selectedMenu;
            loadAnim(DisplayScreen, Anims.settings[selectedMenu])
        }
    })

    // BOTTOM BUTTON
    document.querySelector('#bottom-button').addEventListener('click', () => {
        if(animStatus == 'gift'){
            switch (selectedUnitWatt) {
                case "cent":
                    GivenCents = (GivenCents > 0)? (GivenCents - 1) : GivenCents
                    break;
                case "dec":
                    GivenDecs = (GivenDecs > 0)? (GivenDecs - 1) : GivenDecs
                    break;
                case "unit":
                    GivenUnits = (GivenUnits > 0)? (GivenUnits - 1) : GivenUnits
                    break;
            }
        }else if(animStatus == 'settings') {
            let indexSelected = posibleMenus.indexOf(selectedMenu);
            selectedMenu = (indexSelected < 2)? posibleMenus[indexSelected + 1] : selectedMenu;
            loadAnim(DisplayScreen, Anims.settings[selectedMenu])
        }
    })

    //RESET BUTTON
    document.querySelector('#reset-button').addEventListener('click', () => {
        restartTamagotchi(DisplayScreen);
    })

    // Test Animation
    document.querySelector("#startAnim").addEventListener('click', () => {
        // buildingBlocks();
        standLike();
    })

    // Basic stand animation
    function basicAnim(avoidActivity=false, avoidSleep=false, avoidGreeting=false) {
        animStatus = 'stand'
        let startTime = new Date();
        let sleepCounter = 1
        console.log(randomAnim);
        console.log("start")
        
        if(friendshipLevel <= -1500){ // If pikachu left he doesn't sleep or play
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
            if (!avoidSleep && startTime.getHours() >= 20 && startTime.getHours() <= 23 ||
                startTime.getHours() >= 0 && startTime.getHours() < 7){

                    if(startTime.getHours() == 20 || randomAnim >= 5) {
                        slepAnim = Anims.sleep.frontSleep;
                        slepAnim2 = Anims.sleep.frontSleep2;
                    }else {
                        slepAnim = Anims.sleep.sideSleep;
                        slepAnim2 = Anims.sleep.sideSleep2;
                    } 

                if(startTime.getHours() == 20 && coockieHasGoneSleep != 'true'){
                    // Declare cookie
                    var now = new Date();
                    now.setTime(now.getTime() + 3600 * 1000); // Agregamos 1 hora en milisegundos
                    document.cookie = "has_gone_sleep=true; expires=" + now + "; path=/";
                    console.log("Cookie Sleep declared");

                    loadAnim(DisplayScreen, Anims.sleep.goingToSleep)
                    auxiliarTimeout = setTimeout(() => {
                        loadAnim(DisplayScreen, Anims.sleep.enteringBed)
                    }, 2000);
                    auxiliarTimeout2 = setTimeout(() => {
                        intervalAnim = setInterval(animate, 1200);
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
                // Breakfast
                //eatingtHours = [10, 12, 18]
                if( eatingtHours.some(elem => elem == startTime.getHours()) && coockieHasBrushed != 'true') {
                    if(coockieHadBreakfast != 'true' && startTime.getMinutes() <= 30){
                        breakFast();
                    }else if(coockieHasBrushed != 'true'){ //cockie tooth
                        brushTeeth();
                    }
                }else{ //Hacer aqui comprobacion cookie brushTeeth
                    if(friendshipLevel <= -500){ // If pikachu is mad he doesn't play
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
                        if(!avoidActivity && playHours.some(elem => elem == startTime.getHours()) && randomAnim > 5){
                            if(randomAnim >= 5 && randomAnim <= 7){
                                sandcastle();
                            }else{
                                buildingBlocks();
                            }
                        }else{
                            if(friendshipLevel > -500 && friendshipLevel <= 1500){ // OK status
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
                            }else if(friendshipLevel > 1500){ // Like status
                                if(!avoidGreeting){
                                    yawnAnim(true)
                                }else{
                                    standLike();                                
                                }
                            }

                        }
                    }
        
                }
    
            }
        }
    }

    //SHAKE WALK
    var actionTimeOut = undefined; //Prevent start the animation until stop shaking
    var consecutiveSteps = 0
    var auxiliarTimeout = undefined;
    var auxiliarTimeout2 = undefined;

    document.querySelector('#shake').addEventListener('click', () => {
        let startTime = new Date();
        let screenShaked = document.querySelector('.screenContainer');
        let buttons = document.querySelector('.buttonsContainer');
        consecutiveSteps++

        clearTimeout(actionTimeOut);
        
        // Shake the screen
        screenShaked.style.marginTop = '-15px';
        buttons.style.marginTop = '35px';
        setTimeout(() => {
            screenShaked.style.marginTop = '0px';
            buttons.style.marginTop = '20px';
            walk();
            if(animStatus == 'state') {
                displayState(DisplayScreen);
            }
            if(animStatus == 'gift') {
                displayTotalWatts(DisplayScreen);
            }
        }, 250);
        
        if(animStatus == 'left'){
            actionTimeOut = setTimeout(() => {
                if(consecutiveSteps >= 20){
                    console.log("vuelve")
                    clearInterval(intervalAnim);
                    backFromLeft();
                }
                console.log(`${consecutiveSteps} consecutive steps`)
                consecutiveSteps = 0;
            }, 1000);
        }else if (startTime.getHours() >= 7 && startTime.getHours() < 20) { //Prevent during sleeping
            if(animStatus == 'stand') { // Make Pikachu look 
                actionTimeOut = setTimeout(() => {
                    console.log("EING?")
                    // basicAnim('stop', true);
                    clearInterval(intervalAnim);
                    auxiliarTimeout = setTimeout(() => {
                        loadAnim(DisplayScreen, Anims.standBasic.look);
                    }, 500);
            
                    auxiliarTimeout2 = setTimeout(() => {
                        basicAnim(true);
                    }, 3000);
                    consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'standMad') { // Make Pikachu look 
                actionTimeOut = setTimeout(() => {
                    console.log("EING?")
                    // basicAnim('stop', true);
                    clearInterval(intervalAnim);
                    auxiliarTimeout = setTimeout(() => {
                        loadAnim(DisplayScreen, Anims.standMad.look);
                    }, 1000);
            
                    auxiliarTimeout2 = setTimeout(() => {
                        basicAnim();
                    }, 4000);
                    consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'sandcastle'){
                actionTimeOut = setTimeout(() => {
                    clearInterval(intervalAnim);
                    sandcastle(true); //Fast digging
                    auxiliarTimeout = setTimeout(() => {
                        clearInterval(intervalAnim);
                        sandcastle();
                    }, 6000);
                    consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'brushTeeth'){
                actionTimeOut = setTimeout(() => {
                    clearInterval(intervalAnim);
                    brushTeeth(true); //Fast digging
                    auxiliarTimeout = setTimeout(() => {
                        clearInterval(intervalAnim);
                        brushTeeth();
                    }, 4000);
                    consecutiveSteps = 0;
                }, 1000);
            }else if(animStatus == 'buildingBlocks'){
                actionTimeOut = setTimeout(() => {
                    throwBlocks = true;
                }, 1000);
            }else if(animStatus == 'standLike'){
                actionTimeOut = setTimeout(() => {
                    console.log("EING?")
                    clearInterval(intervalAnim);
                    standLike(true);
                    // auxiliarTimeout = setTimeout(() => {
                    // }, 1000);
                    consecutiveSteps = 0;
                }, 1000);
            }
        }else{
            console.log("Pikachu is sleeping")
            consecutiveSteps = 0;
        }

    })

    /* CELEBRATE ANIMATIONS */
    // Yawn Anim
    function yawnAnim(likeOrLove = false) {
        animStatus = 'yawnHappy'
        console.log(animStatus)
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
                if(!likeOrLove){
                    // Para no jugar despues de un gift
                    basicAnim(true);
                }else{
                    // Para no volver a saludar
                    basicAnim(true, false , true);
                }
            }
            
        }
    }

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

    function happySteps() {
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
                    basicAnim(true);
                }, 2000);
            }
            animHits++
        }
    }

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
                basicAnim(true);
            }
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
                friendshipLevel = -1400;
                localStorage.setItem("friendshipLevel", friendshipLevel);
                auxiliarTimeout = setTimeout(() => {
                    clearInterval(intervalAnim);
                    basicAnim(true, true);
                }, 1000);
            }  

            animHits++
        }
    }

    // Breakfast Anim
    function breakFast() {
        animStatus = 'breakfast'
        console.log(animStatus)
        let eatCounter = 1;
        intervalAnim = setInterval(animate, 500);

        // Declare cookie
        var now = new Date();
        now.setTime(now.getTime() + 3600 * 1000); // Agregamos 1 hora en milisegundos
        document.cookie = "had_breakfast=true; expires=" + now + "; path=/";
        console.log("Cookie Breakfast declared")

            function animate() {
                endTime = new Date();
    
                if(eatCounter <= 1){
                    loadAnim(DisplayScreen, Anims.breakfast.breakfast1)
                    eatCounter++
                }else if(eatCounter == 2 || eatCounter == 4){
                    loadAnim(DisplayScreen, Anims.breakfast.nomnom)
                    eatCounter = (eatCounter >= 4)? 1 : (eatCounter + 1)
                }else if(eatCounter == 3){
                    loadAnim(DisplayScreen, Anims.breakfast.nomnom2)
                    eatCounter++
                }
    
                //eatingtHours = [10, 12, 18]
                if(!eatingtHours.some(elem => elem == endTime.getHours())) {
                    clearInterval(intervalAnim);
                    basicAnim(true);
                }
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
                }, 1000);
                auxiliarTimeout2 = setTimeout(() => {
                    updateFriendshipLevel(-30, false, false);
                    randomAnim = Math.floor(Math.random() * (10 - 1 + 1) + 1); //1-10
                    basicAnim(true);
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

    function restartTamagotchi (DisplayScreen, enterclicked) {
        if(!enterclicked){
            if(animStatus != ''){
                clearInterval(intervalAnim);
                clearAllTimeouts();
                animStatus = '';
            }
            document.querySelector("#clockMenu").classList.add('selected')
            document.querySelector("#giftMenu").classList.add('selected')
            document.querySelector("#gamblingMenu").classList.add('selected')
            document.querySelector('.walkCounter').innerHTML = 88888;
            loadAnim(DisplayScreen, null, true, true);

            // Clear the stored data
            localStorage.clear();
            steps = 0;
            totalSteps = 0;
            watts = 500;
            friendshipLevel = 0;
            localStorage.setItem("watts", watts);
            localStorage.setItem("friendshipLevel", friendshipLevel);
    
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
                document.querySelector('.walkCounter').innerHTML = steps;
                document.querySelector("#clockMenu").classList.add('selected')
                basicAnim(true, true);
            }, 3000);
        }
    }

    //TEST PEDOMETER
    /*window.addEventListener("deviceorientation", handleOrientation);
	function handleOrientation(event) {
		if(Math.round(event.alpha) > 250){
            walk();
            if(animStatus == 'state') {
                displayState(DisplayScreen);
            }
        }

        document.querySelector('#salida').value = `${Math.round(event.alpha)} // ${Math.round(event.beta)} // ${Math.round(event.gamma)}`;	
	}*/

    // FRIENDSHIP LEVEL UPDATE SYSTEM
    function updateFriendshipLevel(amount, isGift, isAnim){
        friendshipLevel = (localStorage.getItem("friendshipLevel") != null)? Number(localStorage.getItem("friendshipLevel")) : friendshipLevel;

        // If ammount is 0, friendship level drops by 100
        if(Number(amount) == 0){
            friendshipLevel -= 100;
        }else{
            friendshipLevel += Number(amount);
        }

        localStorage.setItem("friendshipLevel", friendshipLevel)
        console.log(`Friendship level updated: ${friendshipLevel}`);
        
        if(isGift) {
            watts -= Number(amount);
            localStorage.setItem("watts", watts)
        }

        if(isAnim){
            clearInterval(intervalAnim);
            clearAllTimeouts();
            resetGivenWatts();

            if(amount == 0){
                tongueAnim();
            }else if(amount > 0 && amount < 100){
                yawnAnim();
            }else if(amount >= 100){
                happySteps();
            }
        }
    }

    // Aux funcs
    function clearAllTimeouts() {
        clearTimeout(actionTimeOut);
        clearTimeout(auxiliarTimeout);
        clearTimeout(auxiliarTimeout2);
    }

    function resetGivenWatts() {
        GivenCents = 0;
        GivenDecs = 0;
        GivenUnits = 0;
        selectedUnitWatt = 'cent'
    }

})

function walk() {
    // Update steps
    steps = (steps < 99999)? (steps + 1) : 0;
    let stepsToConvert = (localStorage.getItem("stepsToConvert") != null)? Number(localStorage.getItem("stepsToConvert")) : 0
    stepsToConvert++

    // Update totalSteps
    if(totalSteps < 999999){
        totalSteps += 1
    }else{
        // Celebrate the million
        totalSteps = 0;
    }

    // Update Watts
    if(stepsToConvert == 20){
        localStorage.setItem("stepsToConvert", 0);
        watts++
        localStorage.setItem("watts", watts)
    }else{
        localStorage.setItem("stepsToConvert", stepsToConvert);
    }

    localStorage.setItem("steps", steps);
    localStorage.setItem("totalSteps", totalSteps);

    if(animStatus != ''){
        document.querySelector('.walkCounter').innerHTML = steps;
    }
}

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
    let totalStepArray = totalSteps.toString().split('').reverse();
    let currentState = '';
    screen.innerHTML = '';

    /* Calcular el state */
    if(friendshipLevel <= -1500){
        currentState = 'left'
    }else if(friendshipLevel > -1500 && friendshipLevel <= -500){
        currentState = 'mad'
    }else if(friendshipLevel > -500 && friendshipLevel <= 1500){
        currentState = 'ok'
    }else if(friendshipLevel > 1500 && friendshipLevel <= 3000){
        currentState = 'likes'
    }else if(friendshipLevel > 3000){
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
function displayTotalWatts(screen) {
    let totalWattsArray = watts.toString().split('').reverse();
    screen.innerHTML = '';

    for(i = 0; i < 1080; i++){
        let newDiv = document.createElement("div");
        newDiv.classList.add('pixel');
        newDiv.classList.add(`num-${i}`);

        // State
        if(Anims.gift.base.some(elem => elem == `num-${i}`)){
            newDiv.classList.add('clicked');
        }


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
    
        screen.appendChild(newDiv)
    }
}

function SelectWattsAmount(screen, cents, decs, units, currentSelected) {
    let miliseconds = new Date().getMilliseconds();
    givenAmountWatts = Number(`${GivenCents}${GivenDecs }${GivenUnits}`)
    for(i = 0; i < 1080; i++){
        if(miliseconds <= 500 && currentSelected == 'unit' || currentSelected != 'unit'){
            if(Anims.givenWatts.unit[units].some(elem => elem == `num-${i}`)){
                screen.querySelector(`.num-${i}`).classList.add('clicked');
            }
        }

        if(miliseconds <= 500 && currentSelected == 'dec' || currentSelected != 'dec'){
            if(Anims.givenWatts.dec[decs].some(elem => elem == `num-${i}`)){
                screen.querySelector(`.num-${i}`).classList.add('clicked');
            }
        }

        if(miliseconds <= 500 && currentSelected == 'cent' || currentSelected != 'cent'){
            if(Anims.givenWatts.cent[cents].some(elem => elem == `num-${i}`)){
                screen.querySelector(`.num-${i}`).classList.add('clicked');
            }
        }

        if(miliseconds <= 500 && currentSelected == 'give'){
            if(givenAmountWatts <= watts){
                if(Anims.gift.give.some(elem => elem == `num-${i}`)){
                    screen.querySelector(`.num-${i}`).classList.add('clicked');
                }    
            }else{
                if(Anims.gift.notEnouff.some(elem => elem == `num-${i}`)){
                    screen.querySelector(`.num-${i}`).classList.add('clicked');
                }
                auxiliarTimeout = setTimeout(() => {
                    selectedUnitWatt = 'cent'
                }, 500);    
            }
        }
    }
}

function cleanStates() {
    document.querySelector("#clockMenu").classList.remove('selected')
    document.querySelector("#giftMenu").classList.remove('selected')
    document.querySelector("#gamblingMenu").classList.remove('selected')
}

