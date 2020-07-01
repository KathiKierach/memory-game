'use strict';

//Arrays
let firstArray = ['🐭', '💩', '👌', '🐊', '😍', '💎'];
let secondArray = ['🐸', '🍓', '🦄', '🍀', '🌈', '🤣'];
let thirdArray = ['🍉', '😍', '🌵', '🐯', '🍩', '✌️'];

// Variablen
let nameInput = document.querySelector("#eingabeModal");
let btnModal = document.querySelector("#btnModal")
let container = document.querySelector('#gameboard');
let neuerScore;

//Zufallsfunktion
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

//Neustart Button
let neustartButton = document.querySelector('#neustart');
neustartButton.addEventListener('click', neuesBoard);

// Neues Board mit Zufallsarray
function neuesBoard(array) {
    let zufall = random(1, 3);
    if (zufall == 1) createBoard(firstArray);
    else if (zufall == 2) createBoard(secondArray);
    else createBoard(thirdArray);
}

neuesBoard();

////////////////////////////////////////////////////////
///////////// Spiel Neustart im Modal  /////////////////
///////////////////////////////////////////////////////
let modalNewGame = document.querySelector('#btnNewGame');

modalNewGame.addEventListener('click', () => {
    //Klärt die Highscore-Liste
    while (gameScores.firstChild) {
        gameScores.removeChild(gameScores.firstChild);
    }
    neuesBoard();
    closeModal();
    updateGameMoves(true);

})


//variablen
let tempArray = [];
let winningCounter = 0;
let myInterval;
let moves = 0; //Anzahl der Gewinn-züge

//////////////////////////////////////   
//////// Updaten der Spielzüge ///////
/////////////////////////////////////
let halfedGameMoves = 0;
let neuStart = false;
let gameMoves = 0;

function updateGameMoves(neuStart) {

    //setzt gameMoves auf 0 zurück
    if (neuStart) { gameMoves = 0; halfedGameMoves = 0; }

    if (!(gameMoves % 2)) {
        halfedGameMoves = gameMoves / 2;
        document.querySelector('#gameMoves').innerHTML = `Moves: ${halfedGameMoves}`;
        document.querySelector('#winningMoves').innerHTML = `Du hast nur ${halfedGameMoves} Züge gebraucht.`
    }
    // return halfedGameMoves;
}

let newMoves = { get: halfedGameMoves }


//////////////////////////////////////////////
/////////// Modal Fenster - Action //////////
/////////////////////////////////////////////

//Modal Fenster mit Score aktualisieren



// JS für das Modal-Fenster
let modal = document.getElementById("myModal");
let btn = document.getElementById("myBtn");
let span = document.getElementsByClassName("close")[0];


//function das Modalfenster zu öffnen
function openModal() {
    modal.style.display = "block";
}

// Schließe Modal durch X
function closeModal() {
    modal.style.display = "none";
}
span.addEventListener('click', closeModal);

// Schließe Modal durch ausserhalb drücken
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



// Empfängt Array // Hängt HTML_Elemente ans Board
function createBoard(myArray) {

    // Board saubermachen
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    stackShuffle(myArray);

    //Erstellt doppeltes Array, durchmischt es 
    //Empfängt Array // Gibt Array raus
    function stackShuffle(array) {

        //verdoppelt das übergebene Array
        let tempArray = [...array];
        let newArray = tempArray.concat(array);

        //Durchmischt das doppelten Arrays nach der Stack-Shuffle Methode
        let count = newArray.length;
        while (count) {
            newArray.push(newArray.splice(random(0, count - 1), 1)[0]);
            count -= 1;
        }

        createBoard(newArray);
    }


    //Erstellt das Spielfeld
    //Empfängt Array // Gibt einzelne Strings raus    
    function createBoard(array) {
        for (let i = 0; i < (array.length); i++) {
            createElement(array[i]);
        }
    }

    //Erschafft die Memory-Karten
    //Empfängt-Strings //Gibt HTML-Element aus
    function createElement(string) {
        let neu = document.createElement('div');
        neu.innerHTML = string;
        neu.classList.add("bild");
        container.appendChild(neu);
        return neu;
    }

    //ruft die Funktion in Spielefunktion auf, übergibt das übergebene Array 
    eventListenerZuweisen(document.querySelectorAll('.bild'), myArray);

};

//////////////////////////////////////   
/////////////// Timer ///////////////
/////////////////////////////////////

let second = 0;
let minute = 0;
let timer = document.querySelector("#timer");

function timerBegin() {
    second++;
    //Null vor Sekunden 1 - 9
    if (second < 10) {
        timer.innerHTML = `Spieldauer: ${minute}:0${second}`;
    }

    //Gewohnte Zeit    
    else {
        timer.innerHTML = `Spieldauer: ${minute}:${second}`;
        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            minute = 0;
        }
    }
}


//////////////////////////////////////   
/////////////// Spielfunktion ///////
/////////////////////////////////////

function eventListenerZuweisen(pictureCards, smallArray) {

    [...pictureCards].forEach((elem) => elem.addEventListener('click', (a) => {

        //mein Array tempArray enthält nun die angeklickten Karten
        tempArray.push(a.target);
        gameMoves++;
        updateGameMoves();

        if (tempArray.length <= 2) {
            a.target.classList.add("markiert");

            //moves = Anzahl der Clicks
            moves++;

            //Startet den Timer beim ersten Click
            if (moves == 1) myInterval = setInterval(timerBegin, 1000);


            //wenn Karten vielfaches von 2... 
            if (!(tempArray.length % 2)) {

                //und Karten gleichen Inhalt haben aber NICHT diesselbe Karte sind..
                if (
                    tempArray[0].innerHTML === tempArray[1].innerHTML &&
                    tempArray[0] != tempArray[1]
                ) //Dann leere Array, pushe Zeichen in winning Array
                {
                    winningCounter++; //zähle winning moves
                    tempArray = []; //tempArray Array leeren

                    //Gewonnen! 
                    if (winningCounter === smallArray.length) {

                        //öffnet Gewinn-Modal-Fenster
                        function openModal() {
                            modal.style.display = "block"
                        }
                        openModal();

                        //klärt Gewinn-Zähler
                        winningCounter = 0;
                    }
                }

                //Karten zurückdrehen
                else {
                    console.log("und zurück");

                    setTimeout(function () {
                        tempArray[0].classList.remove("markiert");
                        tempArray[1].classList.remove("markiert");
                        tempArray = [];
                    }, 1000);
                }
            }
            //verhindert, dass wildes Herumgeklicke das Spiel zerbricht
            else { return }
        }

    }))

};
