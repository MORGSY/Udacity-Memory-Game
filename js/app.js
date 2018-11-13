/*
 * Create a list that holds all of your cards
 */
let cardList = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let compare = [];
let moves = 0;

//initialize timer, so the variable becomes global
let time, hourInit, minuteInit, secondInit, t;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Create a function reset for reset button
function reset() {
    location.reload();
}

//function to toggle closed and opened cards
function toggleCard(object) {
    object.classList.toggle('show');
    object.classList.toggle('open');
}

//function to add total moves
function addMoves() {
    moves++;
    document.querySelector('.moves').innerHTML = moves;
}

//Timer
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getTimeNow() {
    let today = new Date();
    let hour = today.getHours() - hourInit;
    let minute = today.getMinutes() - minuteInit;
    if (minute < 0) {
        minute += 60;
        hour--;
    }
    let second = today.getSeconds() - secondInit;
    if (second < 0) {
        second += 60;
        minute--;
    }
    // adds a 0 in front of numbers<10
    hour = checkTime(hour);
    minute = checkTime(minute);
    second = checkTime(second);

    return [hour, minute, second]
}

//starts the timer
function startTime() {
    let [hour, minute, second] = getTimeNow();
    document.querySelector('.time').innerHTML = hour + ":" + minute + ":" + second;
    t = setTimeout(function() {
        startTime()
    }, 500);
}

function initiateStopwatch() {
    time = new Date();
    hourInit = time.getHours();
    minuteInit = time.getMinutes();
    secondInit = time.getSeconds();
    document.removeEventListener('click', initiateStopwatch);
}

function eventListener(e) { //event listener function
    const target = e.target;
    if (target.className != 'card match' && target.className == 'card' || target.className == 'card show open' && target != compare[0]) {
        startTime();

        if (compare.length < 2) { //compare array length
            toggleCard(target);
            compare.push(target);
        }

        if (compare.length == 2) { // check whether the cards match
            if (compare[0].firstElementChild.className == compare[1].firstElementChild.className) { //if match, add the class match
                compare.forEach(element => {
                    element.classList.toggle('correct');
                    setTimeout(() => {
                        element.classList.toggle('correct');
                    }, 300);
                    element.classList.toggle('match');
                });
            } else { //cards do not match
                document.removeEventListener('click', eventListener);
                compare.forEach(element => {
                    element.classList.toggle('wrong');
                    setTimeout(() => {
                        element.classList.toggle('wrong');
                    }, 300);
                    toggleCard(element);
                });
                document.addEventListener('click', eventListener);
            }
            compare = [];

            addMoves(); //increase moves count

            if (moves > 30) {
                document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li>';
            } else if (moves > 20) {
                document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
            } else {
                document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
            }

            console.log(document.querySelectorAll('.match').length);

            //If all cards match, run this
            if (document.querySelectorAll('.match').length == 16) {
                console.log("Winner...Winner..Chicken Dinner!")
                let totalStars = document.querySelectorAll('.fa-star').length;
                let scoreStar = '';
                for (let i = 0; i < totalStars; i++) {
                    scoreStar += '<i class="fa fa-star"></i>';
                }

                let [hour, minute, second] = getTimeNow();
                document.querySelector('.moves-result').innerHTML = moves;
                document.querySelector('.time-result').innerHTML = hour + ":" + minute + ":" + second;
                document.querySelector('.stars-result').innerHTML = scoreStar;
                document.querySelector('.modal').style.display = "block";
            }
        }
    }
}


//initialize the cards
shuffle(cardList);
let cardBoxes = document.querySelectorAll('.card .fa');
const lengthBoxes = cardBoxes.length;

for (let count = 0; count < lengthBoxes; count++) {
    cardBoxes[count].classList.add(cardList[count]);
}

//start stopwatch
document.addEventListener('click', initiateStopwatch);

//event listener
document.addEventListener('click', eventListener);