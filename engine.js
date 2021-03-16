let gameScreen = document.getElementById("gameScreen");
let ctx = gameScreen.getContext("2d");
window.addEventListener('resize', resizeCanvas, false);

let scene = "mainMenu";
let canShow = false;
let generation = true;
let activeBuilding = 0;
let isNewGame;

/*let backgroundMusic = new Audio("res/music/Shap3S - Swell.mp3"); 
backgroundMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);*/

//backgroundMusic.volume = 0.1;

ctx.fillStyle = "skyblue";
ctx.fillRect(0, 0, gameScreen.width, gameScreen.height);

let camera = {
    x: 0,
    y: 0,
    zoom: 1
}

let moving = {
    x: 0,
    y: 0
}

document.addEventListener('keydown', function(event) {
    if(event.key === "a") {
        moving.x = 16;
    } else if(event.key === "d") {
        moving.x = -16;
    } else if(event.key === "w") {
        moving.y = 16;
    } else if(event.key === "s") {
        moving.y = -16;
    }
});

let lastClick = {
    x: null,
    y: null
}

/*let dynamicPos = {
    x: 0,
    y: 0
}*/

$("#gameScreen").click(function(event) {
    lastClick.x = event.offsetX - camera.x;
    lastClick.y = event.offsetY - camera.y;
});

let gameGrid = [];
let distances = [];

let gameBoard = {
    spaces: [],
    width: 40
}

let texture1 = new Image(64, 128);
texture1.src = "res/0.png";

let texture2 = new Image(64, 128);
texture2.src = "res/1.png";

let texture3 = new Image(64, 128);
texture3.src = "res/2.png";

let texture4 = new Image(64, 128);
texture4.src = "res/3.png";

let texture5 = new Image(64, 128);
texture5.src = "res/4.png";

let texture6 = new Image(64, 128);
texture6.src = "res/5.png";

let texture7 = new Image(64, 128);
texture7.src = "res/6.png";

let texture8 = new Image(64, 128);
texture8.src = "res/7.png";

let buttonTexture = new Image(200, 64);
buttonTexture.src = "res/button.png";

let cursorTexture = new Image(8, 8);
cursorTexture.src = "res/cursor.png";

function selected(building) {
    activeBuilding = building;
}

function info() {
    let display = document.getElementById("instructions");
    if(display.style.display == "block") {
        display.style.display = "none";
    } else {
        display.style.display = "block";
    }
}

function menuStore() {
    let store = document.getElementById("store");
    if(store.style.display == "block") {
        store.style.display = "none";
    } else {
        store.style.display = "block";
    }
}

function newGame() {
    isNewGame = true;
    scene = "game";
    //backgroundMusic.play();
    //let propertiesObj = JSON.parse(fs.readFileSync(path, 'utf8'));  //saving json file to an object
    generateWorld();
    localStorage.setItem("savedGame", gameGrid);
}

function loadSave() {
    isNewGame = false;
    scene = "game";
    //backgroundMusic.play();
    let savedGame = localStorage.getItem("savedGame");
    if(savedGame != null) {
        gameGrid = savedGame.split(",");
        gameGrid = gameGrid.map(Number);
        console.log(gameGrid);
    }
}

function save() {
    localStorage.setItem("savedGame", gameGrid);
}

let plain = function(x, y, passedData) {
    if(gameGrid[passedData] === 0) {
        ctx.drawImage(texture1, x, y);
    } else if(gameGrid[passedData] === 1) {
        ctx.drawImage(texture2, x, y);
    } else if(gameGrid[passedData] === 2) {
        ctx.drawImage(texture3, x, y);
    } else if(gameGrid[passedData] === 3) {
        ctx.drawImage(texture4, x, y);
    } else if(gameGrid[passedData] === 4) {
        ctx.drawImage(texture5, x, y);
    } else if(gameGrid[passedData] === 5) {
        ctx.drawImage(texture6, x, y);
    } else if(gameGrid[passedData] === 6) {
        ctx.drawImage(texture7, x, y);
    } else if(gameGrid[passedData] === 7) {
        ctx.drawImage(texture8, x, y);
    }
}

for(i=0; i < Math.pow(gameBoard.width, 2); i++) {
    gameBoard.spaces.push(0);
}

function generateWorld() {
    if(isNewGame) {
        for(i=0; i < gameBoard.spaces.length; i++) {
            let rand = Math.random()
            if(rand > .2) {
                gameGrid.push(0);
            } else {
                gameGrid.push(1);
            }
        }
    
        if(gameGrid[Math.floor(gameBoard.width / 2) - 1] != 3 && gameGrid[Math.floor(gameBoard.width / 2) + gameBoard.width - 1] != 3) {
            gameGrid[Math.floor(gameBoard.width / 2)] = 5;
            gameGrid[Math.floor(gameBoard.width / 2) + gameBoard.width] = 5;
        }
    
        function placeTownhall() {
            let randomPlot = Math.floor(Math.random() * gameGrid.length)
            console.log(randomPlot);
            if(gameGrid[randomPlot] === 3) {
                placeTownhall();
            } else {
                gameGrid[randomPlot] = 6;
            }
        }
        placeTownhall();
    }
}

//stats
let town = {
    cash: 250,
    population: 0,
    maxPopulation: 0,
    electricity: 0,
    minElectricity: 0,
    water: 0,
    minWater: 0,
    work: 0,
    maxWork: 0,
    happiness: 100
}

let placableBuildings = [2, 4, 5];
let allowingNeighbors = [5, 6];
let notDestroyable = [3, 6];

function exit() {
    if(confirm("Do you really want to close the game?")) {
        window.close();
    }
}

function updateSimulation() {
    function countBuildings(passedParameter) {
        let count = 0;
        for(let i = 0; i < gameGrid.length; ++i){
            if(gameGrid[i] === passedParameter)
            count++;
        }
        switch (passedParameter) {
            case 2:
                return count * 4;
                break;
            case 3:
                return count * 2;
                break;
            case 4:
                return count * 9;
                break;
            case 7:
                return count * 55;
                break;
            default:
                return 0;
                break;
        }
    }
    town.maxPopulation = countBuildings(2);
    town.minElectricity = countBuildings(7);
    town.minWater = countBuildings(3);
    town.maxWork = countBuildings(4);
    function changeColor(state) {
        if(state == "good") {
            return "<font color='green'>";
        } else if(state == "ok") {
            return "<font color='orange'>";
        } else if(state == "bad") {
            return "<font color='red'>";
        }
    }

    function simulatePeople() {
        if(town.happiness >= 100 && town.maxPopulation > town.population) {
            if(Math.random() > .9) {
                town.population++;
            }
        } else if(town.happiness <= 70 && town.population > 0) {
            if(Math.random() > .9) {
                town.population--;
            }
        }
    }

    function simulateElectricity() {
        town.electricity = town.population + town.maxWork;
        if(town.electricity <= town.minElectricity) {
            document.getElementById("electricity").innerHTML = changeColor("good") + "Electricity: " + town.electricity + "/" + town.minElectricity;
        } else {
            document.getElementById("electricity").innerHTML = changeColor("bad") + "Electricity: " + town.electricity + "/" + town.minElectricity;
        }
    }

    document.getElementById("cash").innerHTML = changeColor("good") + "$" + town.cash;
    document.getElementById("population").innerHTML = changeColor("good") + "Population: " + town.population + "/" + town.maxPopulation;
    document.getElementById("water").innerHTML = changeColor("good") + "Water: " + town.water + "/" + town.minWater;
    document.getElementById("work").innerHTML = changeColor("good") + "Work: " + town.work+ "/" + town.maxWork;
    document.getElementById("happiness").innerHTML = changeColor("good") + "Happiness: " + town.happiness + "%";


    //sprawdz ludzi itd
    simulatePeople();
    simulateElectricity();
}

function resizeCanvas() {
    gameScreen.width = window.innerWidth;
    gameScreen.height = window.innerHeight;
    cursorTexture.onload = function(){          //main game loop
        let menuDiv = document.getElementById("mainMenu");
        let barDiv = document.getElementById("bar");
        let gameLoop = setInterval(function() {
            if(scene == "game") {
                barDiv.style.display = "block";
                menuDiv.style.display = "none";
                ctx.clearRect(0, 0, gameScreen.width, gameScreen.height);
                ctx.fillStyle = "skyblue";
                ctx.fillRect(0, 0, gameScreen.width, gameScreen.height);
                updateSimulation();
                renderWorld();
                camera.x = camera.x + moving.x;
                camera.y = camera.y + moving.y;
                moving.x = moving.x / 1.1;
                moving.y = moving.y / 1.1;
                canShow = true;
                generation = false;
            } if(scene == "mainMenu") {
                menuDiv.style.display = "block";
                barDiv.style.display = "none"; 
            }
        }, 1000 / 45);
    };
}
resizeCanvas();

const randomX = Math.random() * gameScreen.width;
const randomY = Math.random() * gameScreen.height;

function renderWorld() {
    let z = 0;
    let currentId = 0;
    let swampy = Math.random();
    for(i=0; i < gameBoard.width; i++) {
        for(y=0; y < gameBoard.width; y++) {
            const POSX = y*32 - i*32 + gameScreen.width/2 - 32;
            const POSY = z*16;

            target = gameGrid[currentId];
            let differenceX = lastClick.x - (POSX + 32);
            let differenceY = lastClick.y - (POSY + 80);
            distances[currentId] = Math.sqrt((differenceX * differenceX) + (differenceY * differenceY));

            if(distances[currentId] < 32 && Math.min(...distances) === distances[currentId]) { //te 3 kropki to nie wiem nawet co to na stackoverflow znalazlem i dziala
                if(gameGrid[currentId] === 0 || gameGrid[currentId] === 1) {
                    if(activeBuilding === 2 && town.electricity < town.minElectricity) {
                        gameGrid[currentId] = activeBuilding;
                        town.cash -= 20;
                    } else if(activeBuilding === 4 && town.electricity < town.minElectricity) {
                        gameGrid[currentId] = activeBuilding;
                        town.cash -= 40;
                    } else if(activeBuilding === 5) {
                        gameGrid[currentId] = activeBuilding;
                    } else if(activeBuilding === 7) {
                        gameGrid[currentId] = activeBuilding;
                        town.cash -= 70;
                    }
                } else if(notDestroyable.indexOf(gameGrid[currentId]) === -1 && activeBuilding === 0) { //destroying i guess
                    gameGrid[currentId] = activeBuilding;
                }
            }


            z++;

            //sprawdz stan (czy jest kolo drogi itp)
            if(allowingNeighbors.indexOf(gameGrid[currentId - gameBoard.width]) == -1 && allowingNeighbors.indexOf(gameGrid[currentId - 1]) == -1 && allowingNeighbors.indexOf(gameGrid[currentId + 1]) == -1 && allowingNeighbors.indexOf(gameGrid[currentId + gameBoard.width]) == -1) {
                if(placableBuildings.includes(gameGrid[currentId])) {
                    gameGrid[currentId] = 1;
                }
                
                /*else if(gameGrid.indexOf(currentId) === -1) {             //moglby to byc easter egg czy cos
                    gameGrid[currentId] = 5;
                }*/
            }


            /*if(generation) { STARY SYSTEM WODY NIE WIEM PO CO GO TRZYMAM
                let tempRandomX = randomX - POSX;
                let tempRandomY = randomY - POSY;
                let distance = Math.floor(Math.sqrt((tempRandomX * tempRandomX) + (tempRandomY * tempRandomY)));

                if(swampy < 0.5) {
                    if(distance < Math.random() * gameBoard.width * 10) {
                        gameGrid[currentId] = 3;
                    }
                } else {
                    if(distance <  gameBoard.width * 10) {
                        gameGrid[currentId] = 3;
                    }
                }
                
                if(gameGrid[currentId] != 3) {
                    if(gameGrid[currentId - gameBoard.width] === 3 || gameGrid[currentId - 1] === 3 || gameGrid[currentId + 1] === 3 || gameGrid[currentId + gameBoard.width] === 3) {
                        if(Math.random() > .9) {
                            gameGrid[currentId] = 3;
                        }
                    }
                }
            }*/

            //console.log(differenceX);
            plain(POSX + camera.x, POSY + camera.y, currentId);
            currentId++;
        }
        z = z - gameBoard.width + 1;
    }
    distances = [];
    generation = false;
}
