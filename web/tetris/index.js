import * as Blocks from "./blocks.js"

const Wrapper = document.getElementsByClassName("Wrapper")[0];
const Points = document.getElementById("points");

let coordinates = []; // yx
let currentBlock = null;
let points = 0;
let speed = 500;
const speedMultiplier = 0.9;
let loopId;

const colors = ["rgb(112, 179, 116)", "rgb(128, 82, 82)", "rgb(63, 74, 170)", "rgb(205, 96, 96)"]
const bgEmpty = "rgb(225, 225, 225)";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function setup() {
    for (let i = 0; i < 20; i++) {
        const row = [];
        for (let k = 0; k < 10; k++) {
            const div = document.createElement("div");
            div.classList.add("Block");
            div.style.backgroundColor = bgEmpty
            Wrapper.appendChild(div);
            row.push(div);
        }
        coordinates.push(row);
    }
}

function moveRight() {
    let isAvail = true;
    currentBlock.cords.forEach(cord => {
        if (!currentBlock.cords.some(([y, x]) => y === cord[0] && x === cord[1] + 1)) {
            if (cord[1] + 1 == 10 || coordinates[cord[0]][cord[1] + 1].style.backgroundColor != bgEmpty ) {
                isAvail = false;
            }
        }
    })

    if (isAvail) {
        currentBlock.cords.map(cord => {
            cord[1]++
            coordinates[cord[0]][cord[1]].style.backgroundColor = currentBlock.color;
        })
        currentBlock.cords.forEach(cord => {
            if (!currentBlock.cords.some(([y, x]) => y === cord[0] && x === cord[1] - 1)) {
                coordinates[cord[0]][cord[1] - 1].style.backgroundColor = bgEmpty
            }
        })
    }
}

function moveLeft() {
    let isAvail = true;
    currentBlock.cords.forEach(cord => {
        if (!currentBlock.cords.some(([y, x]) => y === cord[0] && x === cord[1] - 1)) {
            if (cord[1] - 1 == -1 || coordinates[cord[0]][cord[1] - 1].style.backgroundColor != bgEmpty ) {
                isAvail = false;
            }
        }
    })

    if (isAvail) {
        currentBlock.cords.map(cord => {
            cord[1]--
            coordinates[cord[0]][cord[1]].style.backgroundColor = currentBlock.color;
        })
        currentBlock.cords.forEach(cord => {
            if (!currentBlock.cords.some(([y, x]) => y === cord[0] && x === cord[1] + 1)) {
                coordinates[cord[0]][cord[1] + 1].style.backgroundColor = bgEmpty
            }
        })
    }
}

function rotate() {
    if (currentBlock.phase != -1) {
        let phase = currentBlock.phase;
        let isAvail = true;
        for (let i = 0; i < currentBlock.cords.length; i++) {
            let nextY = currentBlock.cords[i][0] + currentBlock.phases[phase][i][0]
            let nextX = currentBlock.cords[i][1] + currentBlock.phases[phase][i][1]
            if (!currentBlock.cords.some(([y, x]) => y === nextY && x === nextX)) {
                if (coordinates[nextY][nextX] == undefined || coordinates[nextY][nextX].style.backgroundColor != bgEmpty) {
                    isAvail = false;
                }
            }
        }

        if (isAvail) {
            for (let i = 0; i < currentBlock.cords.length; i++) {
                coordinates[currentBlock.cords[i][0]][currentBlock.cords[i][1]].style.backgroundColor = bgEmpty
            }
            for (let i = 0; i < currentBlock.cords.length; i++) {
                let y = currentBlock.cords[i][0] + currentBlock.phases[phase][i][0]
                let x = currentBlock.cords[i][1] + currentBlock.phases[phase][i][1]
                coordinates[y][x].style.backgroundColor = currentBlock.color;
                currentBlock.cords[i] = [y,x];
            }
            currentBlock.phase++
            if (currentBlock.phase == currentBlock.phases.length) currentBlock.phase = 0;
        }
    }
}

function moveDown() {
    const belows = [];
    currentBlock.cords.forEach(cord => {
        if (!currentBlock.cords.some(([y, x]) => y === cord[0] + 1 && x === cord[1])) {
            belows.push(cord)
        }
    })

    let found = false;
    let count = 1;
    while (!found) {
        belows.forEach(cord => {
            if (cord[0]+count == 20 || coordinates[cord[0]+count][cord[1]].style.backgroundColor != bgEmpty) {
                found = true;
            }
        })
        count++
    }
    count -= 2

    currentBlock.cords.map(cord => {
        coordinates[cord[0]][cord[1]].style.backgroundColor = bgEmpty;
        cord[0] += count;
        coordinates[cord[0]][cord[1]].style.backgroundColor = currentBlock.color;
    })
}

function spawnBlock(blockId) {
    if (coordinates[1][4].style.backgroundColor != bgEmpty) {
        console.warn("GAME OVER");
        clearInterval(loopId)
    } else {
        currentBlock = Blocks.getBlock(blockId)
        currentBlock.color = colors[getRandomInt(4)];
    
        currentBlock.cords.forEach(cord => {
            coordinates[cord[0]][cord[1]].style.backgroundColor = currentBlock.color;
        })
    }
}

function checkandclearRow() {
    for (let i = 19; i >= 0; i--) {
        let fullCount = 0;
        for (let k = 0; k < 10; k++) {
            if (coordinates[i][k].style.backgroundColor != bgEmpty) fullCount++;
        }

        if (fullCount == 10) {
            for (let k = 0; k < 10; k++) {
                coordinates[i][k].style.backgroundColor = bgEmpty;
            }
            for (let k = i-1; k >= 0; k--) {
                for (let j = 0; j < 10; j++) {
                    let bgColor = coordinates[k][j].style.backgroundColor;

                    if (bgColor != bgEmpty) {
                        coordinates[k][j].style.backgroundColor = bgEmpty;
                        coordinates[k + 1][j].style.backgroundColor = bgColor;
                    }   
                }
            }
            i++

            /*
            if (points > 1000) {
                speed *= Math.floor(points/1000) * speedMultiplier;
            }
                
            clearInterval(loopId);
            setInterval(() => {
                loop();
            }, speed);
            */

            points += 100
            Points.innerText = `Points: ${points}`;
        }
        
    }
}

function loop() {
    let isTouching = false;

    currentBlock.cords.forEach(cord => {
        if (!currentBlock.cords.some(([y, x]) => y === cord[0] + 1 && x === cord[1])) {
            if (cord[0] + 1 == 20 || coordinates[cord[0] + 1][cord[1]].style.backgroundColor != bgEmpty ) {
                isTouching = true;
            }
        }
    })

    if (isTouching) {  
        checkandclearRow();
        spawnBlock(getRandomInt(7))
    } else {
        currentBlock.cords.map(cord => {
            cord[0]++
            coordinates[cord[0]][cord[1]].style.backgroundColor = currentBlock.color;
        })
        currentBlock.cords.forEach(cord => {
            if (!currentBlock.cords.some(([y, x]) => y === cord[0] - 1 && x === cord[1])) {
                coordinates[cord[0] - 1][cord[1]].style.backgroundColor = bgEmpty
            }
        })
    }
}

document.addEventListener("keyup", e => {
    switch (e.key) {
        case "ArrowRight":
            moveRight();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowDown":
            moveDown();
            break;
        case "r":
            rotate();
            break;
    }
})

setup();
spawnBlock(getRandomInt(7));

loopId = setInterval(() => {
    loop();
}, speed);