// Load animations
var Anims = {hours: [], minutesDecen: [], minutesUnit: []};
fetch('./anims.json')
.then((response) => response.json())
.then((data) => {
    Anims = data;
    // Anims.edit = Anims.start.leftGiggle;
    Anims.edit = Anims.start.rightGigle;
});

// Anim vars
var saved = null;
var clickedPixels = [];
var intervalAnim;
var animStatus = ''

// Steps
var steps = (localStorage.getItem("steps") != null)? Number(localStorage.getItem("steps")) : 0;
var totalSteps = (localStorage.getItem("totalSteps") != null)? Number(localStorage.getItem("totalSteps")) : 0;
var watts = (localStorage.getItem("watts") != null)? Number(localStorage.getItem("watts")) : 0;
var breakfastHours = [10, 12, 18]


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
    if(window.location.href.indexOf('github.io') != -1){
        // document.querySelector('.developerScreen').classList.add('hide');
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
                    basicAnim('start');
                }else{
                    if(animStatus != 'clock'){ // | gift | game
                        let menuSelected = document.querySelector('.menuBar .selected').id
                        console.log(menuSelected)
                        switch (menuSelected) {
                            case "clockMenu": //CLOCK
                                basicAnim('stop');
                                animStatus = 'clock'
                                console.log(animStatus)
                                document.querySelector("#clockMenu").classList.remove('selected')
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
                        
                            default:
                                break;
                        }
                    }
                }
    
            }, 500);
    
    
            // APAGAR LA PANTALLA
            screenOff = setInterval(switchOff, 60000)
            function switchOff() {
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
    document.querySelector("#back-button").addEventListener('click', () => {
        if(animStatus == 'clock' || animStatus == 'state'){
            clearInterval(intervalAnim)
            document.querySelector("#clockMenu").classList.add('selected')
            basicAnim('start');
        }
    })

    // STATE BUTTON
    document.querySelector("#state-button").addEventListener('click', () => {
        if(animStatus == 'stand'){
            cleanStates();
            animStatus = 'state'
            clearInterval(intervalAnim)
            // loadAnim(DisplayScreen, Anims.status.ok)
            displayState(DisplayScreen);
        }
    })

    // RIGHT BUTTON
    var menus = ['clockMenu', 'giftMenu', 'gamblingMenu'];
    document.querySelector('#right-button').addEventListener('click', () => {
        if(animStatus != '' && animStatus == 'stand'){
            let selected = menus.find(item => document.querySelector(`#${item}`).classList.contains('selected'))
            let nextMenu = (menus.indexOf(selected) < (menus.length - 1))? (menus.indexOf(selected) + 1) : menus.indexOf(selected)
            // console.log('right')
            document.querySelector(`#${selected}`).classList.remove('selected');
            document.querySelector(`#${menus[nextMenu]}`).classList.add('selected');
        }
    })

    // LEFT BUTTON
    document.querySelector('#left-button').addEventListener('click', () => {
        if(animStatus != '' && animStatus == 'stand'){
            let selected = menus.find(item => document.querySelector(`#${item}`).classList.contains('selected'))
            let nextMenu = (menus.indexOf(selected) > 0)? (menus.indexOf(selected) - 1) : menus.indexOf(selected)
            // console.log('right')
            document.querySelector(`#${selected}`).classList.remove('selected');
            document.querySelector(`#${menus[nextMenu]}`).classList.add('selected');
        }
    })

    //RESET BUTTON
    document.querySelector('#reset-button').addEventListener('click', () => {
        restartTamagotchi(DisplayScreen);
    })

    // Test Animation
    let on = 0;
    document.querySelector("#startAnim").addEventListener('click', () => {
        on = on == 1? 0 : 1;
        if(on == 1){
            // breakFast();
            pokeinit();
            // happyAnim();
        }else{
            pokeinit();
            // breakFast();
            // happyAnim();
        }
    })

    // Basic stand animation
    function basicAnim(instruction) {
        animStatus = 'stand'
        let startTime = new Date();
        let sleepCounter = 1
        let coockieHadBreakfast = document.cookie.split("; ").find((row) => row.startsWith("had_breakfast="))?.split("=")[1];

        // Breakfast
        //breakfastHours = [10, 12, 18]
        if( breakfastHours.some(elem => elem == startTime.getHours()) && coockieHadBreakfast != 'true') {
            breakFast();
        }else{

            if(instruction == 'start'){
                console.log("start")
                animate(true);
                intervalAnim = setInterval(animate, 1000);
            }else if(instruction == 'stop'){
                clearInterval(intervalAnim);
                console.log("stop")
            }
        
            function animate(avoidLook = false) {
                // Check the time pased
                endTime = new Date();
                var timeDiff = endTime - startTime; //in ms
                timeDiff /= 1000;
                secondsElapsed = Math.round(timeDiff)
        
                // console.log(startTime.getHours())
                // console.log(secondsElapsed)
    
                // Sleep
                if (endTime.getHours() >= 20 && endTime.getHours() <= 23 ||
                    endTime.getHours() >= 0 && endTime.getHours() < 7){
                    if(sleepCounter <= 1){
                        loadAnim(DisplayScreen, Anims.sleep.sleep1)
                        sleepCounter++
                    }else{
                        loadAnim(DisplayScreen, Anims.sleep.sleep2)
                        sleepCounter = (sleepCounter < 2)? (sleepCounter + 1) : 1;
                    }
                }else {
                    if(secondsElapsed % 20 == 0 && !avoidLook){
                        loadAnim(DisplayScreen, Anims.standBasic.look)
                        animStatus = 'look'
                    }else if(secondsElapsed % 4 == 0 && secondsElapsed != 0){
                        loadAnim(DisplayScreen, Anims.standBasic.extend)
                        // animStatus = 'extend'
                    }else {
                        if(animStatus == 'look'){
                            // Para que mire durante 2 segundos
                            setTimeout(() => {
                                loadAnim(DisplayScreen, Anims.standBasic.stand)
                            }, 1000);
                        }else{
                            loadAnim(DisplayScreen, Anims.standBasic.stand)
                        }
                        animStatus = 'stand'
                    }
                }
            }
        }

    }

    //SHAKE WALK
    var timeOutLook = undefined; //Prevent start the animation until stop shaking
    document.querySelector('#shake').addEventListener('click', () => {
        let startTime = new Date();
        let screenShaked = document.querySelector('.screenContainer');
        let buttons = document.querySelector('.buttonsContainer');

        clearTimeout(timeOutLook);
        
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
        }, 250);

        if (startTime.getHours() >= 7 && startTime.getHours() < 20) { //Prevent during sleeping

            if(animStatus == 'stand') { // Make Pikachu look 
                timeOutLook = setTimeout(() => {
                    console.log("EING?")
                    basicAnim('stop');
                    setTimeout(() => {
                        loadAnim(DisplayScreen, Anims.standBasic.look);
                    }, 500);
            
                    setTimeout(() => {
                        basicAnim('start');
                    }, 3000);
                }, 2000);
            }
        }else{
            console.log("Pikachu is sleeping")
        }

    })

    // CELEBRATE ANIMATIONS
    function happyAnim() {
        basicAnim('stop');
        animStatus = 'happy'
        console.log("startHappy")
        intervalAnim = setInterval(animate, 500);
        startTime = new Date();

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
                basicAnim('start');
            }
            
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
    
                //breakfastHours = [10, 12, 18]
                if(!breakfastHours.some(elem => elem == endTime.getHours())) {
                    clearInterval(intervalAnim);
                    basicAnim('start');
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
            endTime = new Date();
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

    function restartTamagotchi (DisplayScreen, enterclicked) {
        if(!enterclicked){
            if(animStatus != ''){
                clearInterval(intervalAnim);
                clearTimeout(timeOutLook)
                animStatus = '';
            }
            document.querySelector("#clockMenu").classList.add('selected')
            document.querySelector("#giftMenu").classList.add('selected')
            document.querySelector("#gamblingMenu").classList.add('selected')
            document.querySelector('.walkCounter').innerHTML = 88888;
            steps = 0;
            loadAnim(DisplayScreen, null, true, true);
            document.cookie = ''
            localStorage.clear();
    
            setTimeout(() => {
                cleanStates();
                document.querySelector('.walkCounter').innerHTML = '';
                localStorage.setItem("InitTamagotchi", true)
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
                document.querySelector('.walkCounter').innerHTML = steps;
                document.querySelector("#clockMenu").classList.add('selected')
                basicAnim('start');
            }, 3000);
        }
    }

    //PROBAR ESTO CUANDO ESTE SUBIDO A UN HTTPS

    window.addEventListener("deviceorientation", handleOrientation);
	
	function handleOrientation(event) {
		// var absolute = event.absolute;
		if (event.alpha > 180 && event.alpha < 360) {
			var alpha = Math.round(Math.abs(event.alpha/360*255));
			
		} else {
			var alpha = Math.round(Math.abs((360-event.alpha)/360*255));
			
		}
		if (Math.abs(event.beta) > 90 && Math.abs(event.beta) < 180) {
			var beta = Math.round((Math.abs(event.beta/90*255)-225));
			
		} else {
			var beta = Math.round(((180-Math.abs(event.beta))/90*255)-225);
			
		}
		if (Math.abs(event.gamma) > 90 && Math.abs(event.gamma) < 180) {
			var gamma = Math.round(Math.abs(event.gamma/90*255));
			
		} else {
			var gamma = Math.round(((180-Math.abs(event.gamma))/90*255)-255);
			
		}

		newColor = "rgba(" + beta + "," + alpha + "," + gamma + ",1.00)";
        document.querySelector('#salida').value = `${Math.round(event.alpha)} // ${Math.round(event.beta)} // ${Math.round(event.gamma)}`;
		
		
		// console.log(event.alpha);
		
		// $("body").css("background-color", newColor);
		
		// if (event.alpha > 160 && event.alpha < 180) {
		// 	console.log("north");
		// 	$("body").trigger("click");
			
		// }
		
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
    screen.innerHTML = '';

    for(i = 0; i < 1080; i++){
        let newDiv = document.createElement("div");
        newDiv.classList.add('pixel');
        newDiv.classList.add(`num-${i}`);

        /* Calcular el state */
        let currentState = "ok"

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

function cleanStates() {
    document.querySelector("#clockMenu").classList.remove('selected')
    document.querySelector("#giftMenu").classList.remove('selected')
    document.querySelector("#gamblingMenu").classList.remove('selected')
}

