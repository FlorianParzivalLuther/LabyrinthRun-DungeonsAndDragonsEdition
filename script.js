const labyrinth = [
  "###############",
  "#.............#",
  "#.#.#######.#.#",
  "#.#.......#.#.#",
  "#.#.###.#.#.#.#",
  "#.#.#...#.#.#.#",
  "#.###.#.#.#.#.#",
  "#.....#.#.#.#.#",
  "#.#####.#.#.#.#",
  "#.#.......#.#.#",
  "#.#.###.###.#.#",
  "#.#...#.....#.#",
  "#.###.#.#####.#",
  "#.............#",
  "###############",
];

const gameBoard = document.getElementById("gameBoard");
let heroPosition;
let heroLives = 3;
const enemies = [];
const powerups = [];
let enemiesDefeat = 0; //counter how many enemies out hero has defeated ->initialisation
var audio = document.getElementById("audioElement");
var playButton = document.getElementById("playButton");

let leftButton = document.getElementById("left-button");
let rightButton = document.getElementById("right-button");
let upButton = document.getElementById("up-button");
let downButton = document.getElementById("down-button");

let smashButton = document.getElementById("smash-button");

// Function to create the game board
function createGameBoard() {
  for (let i = 0; i < labyrinth.length; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < labyrinth[i].length; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.position = `${i}-${j}`;

      if (labyrinth[i][j] === "#") {
        cell.classList.add("blocked");
      } else if (labyrinth[i][j] === ".") {
        cell.classList.add("color");
      }

      row.appendChild(cell);
    }

    gameBoard.appendChild(row);
  }
}
// Audiotoggle for the music
function toggleAudio() {
  if (audio.paused) {
    audio.play();
    playButton.src = "pixelpics/audio_music.png"; // Replace with the path to the pause button image
  } else {
    audio.pause();
    audio.currentTime = 0;
    playButton.src = "pixelpics/audio_music_on1.png"; // Replace with the path to the play button image
  }
}

// Function to generate a random position for the hero
function generateRandomPosition() {
  const emptyCells = Array.from(
    gameBoard.getElementsByClassName("cell")
  ).filter((cell) => !cell.classList.contains("blocked"));
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];
  heroPosition = randomCell.dataset.position;
  randomCell.classList.add("hero");
  audio.play();
}

// Function to generate a random position for an enemy
/*
    function generateEnemy() {
      const emptyCells = Array.from(
        gameBoard.getElementsByClassName("cell")
      ).filter(
        (cell) =>
          !cell.classList.contains("blocked") && !cell.classList.contains("enemy")
      );
    
      if (emptyCells.length === 0) {
        return;
      }
    
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomIndex];
      randomCell.classList.add("enemy");
      enemies.push(randomCell.dataset.position);
    }
    */

//Function to generate a random position for an enemy
function generateEnemy() {
  const emptyCells = Array.from(
    gameBoard.getElementsByClassName("cell")
  ).filter(
    (cell) =>
      !cell.classList.contains("blocked") &&
      !cell.classList.contains("enemy") &&
      !cell.classList.contains("powerUp")
  );

  if (emptyCells.length === 0) {
    //if there are no free cells left than dont generate
    return;
  }

  //style randomizer
  const styles = ["enemy1", "enemy2", "enemy3"];
  let randomizerStyles = styles[Math.floor(Math.random() * 3)];

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];
  randomCell.classList.add(`${randomizerStyles}`, "enemy"); // experimental original code  -> randomCell.classList.add("enemy");
  enemies.push(randomCell.dataset.position);
}

//Function to generate a random powerUp
function generatePowerUp() {
  const emptyCells = Array.from(
    gameBoard.getElementsByClassName("cell")
  ).filter(
    (cell) =>
      !cell.classList.contains("blocked") &&
      !cell.classList.contains("enemy") &&
      !cell.classList.contains("powerUp")
  );

  if (emptyCells.length === 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];
  randomCell.classList.add("powerUp");
  powerups.push(randomCell.dataset.position);
}
//Function removing the random powerUp after 10seconds
function removePowerUp() {
  const intervalId = setInterval(() => {
    const powerUpPosition = document.querySelector(".powerUp");

    if (powerUpPosition) {
      powerUpPosition.classList.remove("powerUp");
      clearInterval(intervalId); // Clear the interval
    }
  }, 1000); // Check every 1 second
}

// Function to move the hero
function moveHero(direction) {
  const [currentRow, currentCol] = heroPosition.split("-");
  let newRow = Number(currentRow);
  let newCol = Number(currentCol);

  switch (direction) {
    case "ArrowUp":
      newCol -= 1;
      break;
    case "ArrowDown":
      newCol += 1;
      break;
    case "ArrowLeft":
      newRow -= 1;
      break;
    case "ArrowRight":
      newRow += 1;
      break;
    default:
      return;
  }

  const newPosition = `${newRow}-${newCol}`;
  const newCell = document.querySelector(`[data-position="${newPosition}"]`);

  if (newCell && !newCell.classList.contains("blocked")) {
    const heroCell = document.querySelector(
      `[data-position="${heroPosition}"]`
    );
    //decreasing of the Heros lifes
    if (
      newCell.classList.contains("enemy1") ||
      newCell.classList.contains("enemy2") ||
      newCell.classList.contains("enemy3")
    ) {
      heroLives--;

      if (heroLives <= 0) {
        restartGame();
        return;
      }
    }

    if (newCell.classList.contains("powerUp")) {
      heroLives++;
    }

    heroCell.classList.remove("hero");
    newCell.classList.add("hero");
    heroPosition = newPosition;
  }
}

// Function to move the hero - mobile version
function moveHeroMobile(direction) {
  const [currentRow, currentCol] = heroPosition.split("-");
  let newRow = Number(currentRow);
  let newCol = Number(currentCol);

  switch (direction) {
    case "up":
      newCol -= 1;
      break;
    case "down":
      newCol += 1;
      break;
    case "left":
      newRow -= 1;
      break;
    case "right":
      newRow += 1;
      break;
    default:
      return;
  }

  const newPosition = `${newRow}-${newCol}`;
  const newCell = document.querySelector(`[data-position="${newPosition}"]`);

  if (newCell && !newCell.classList.contains("blocked")) {
    const heroCell = document.querySelector(
      `[data-position="${heroPosition}"]`
    );
    //decreasing of the Heros lifes
    if (
      newCell.classList.contains("enemy1") ||
      newCell.classList.contains("enemy2") ||
      newCell.classList.contains("enemy3")
    ) {
      heroLives--;

      if (heroLives <= 0) {
        restartGame();
        return;
      }
    }

    if (newCell.classList.contains("powerUp")) {
      heroLives++;
    }

    heroCell.classList.remove("hero");
    newCell.classList.add("hero");
    heroPosition = newPosition;
  }
}

//should update the heroes lifes
function updateLifeImages() {
  const lifeImage1 = document.getElementById("life1");
  const lifeImage2 = document.getElementById("life2");
  const lifeImage3 = document.getElementById("life3");

  console.log(lifeImage1, "LIFEIMAGE");

  if (heroLives === 3) {
    lifeImage1.style.visibility = "visible";
    lifeImage2.style.visibility = "visible";
    lifeImage3.style.visibility = "visible";
  } else if (heroLives === 2) {
    lifeImage1.style.visibility = "visible";
    lifeImage2.style.visibility = "visible";
    lifeImage3.style.visibility = "hidden";
  } else if (heroLives === 1) {
    lifeImage1.style.visibility = "visible";
    lifeImage2.style.visibility = "hidden";
    lifeImage3.style.visibility = "hidden";
  } else if (heroLives === 0) {
    lifeImage1.style.visibility = "hidden";
    lifeImage2.style.visibility = "hidden";
    lifeImage3.style.visibility = "hidden";
  }
}

// Function to move the enemies
function moveEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    const [currentRow, currentCol] = enemies[i].split("-");
    let newRow = Number(currentRow);
    let newCol = Number(currentCol);

    const randomDirection = Math.floor(Math.random() * 4); // Generate a random direction

    switch (randomDirection) {
      case 0:
        newRow -= 1; // Move up
        break;
      case 1:
        newRow += 1; // Move down
        break;
      case 2:
        newCol -= 1; // Move left
        break;
      case 3:
        newCol += 1; // Move right
        break;
      default:
        break;
    }

    const newPosition = `${newRow}-${newCol}`;
    const newCell = document.querySelector(`[data-position="${newPosition}"]`);

    if (
      newCell &&
      !newCell.classList.contains("blocked") &&
      !newCell.classList.contains("enemy")
    ) {
      const enemyCell = document.querySelector(
        `[data-position="${enemies[i]}"]`
      );

      if (enemyCell.classList.contains("enemy1")) {
        enemyCell.classList.remove("enemy1");
        newCell.classList.add("enemy1");
      } else if (enemyCell.classList.contains("enemy2")) {
        enemyCell.classList.remove("enemy2");
        newCell.classList.add("enemy2");
      } else if (enemyCell.classList.contains("enemy3")) {
        enemyCell.classList.remove("enemy3");
        newCell.classList.add("enemy3");
      }
      enemyCell.classList.remove("enemy");
      newCell.classList.add("enemy");

      enemies[i] = newPosition;
    }

    if (enemies.length > 15) {
      //gameover when more than 15 enemies on the field
      restartGame();
    }
  }
}

// Function to handle hero attack
/* old function 
    function heroAttack() {
      const [heroRow, heroCol] = heroPosition.split("-");
      let attackRow, attackCol;
    
      // Calculate attack position based on hero direction
      switch (direction) {
        case "ArrowUp":
          attackRow = Number(heroRow) - 1;
          attackCol = Number(heroCol);
          break;
        case "ArrowDown":
          attackRow = Number(heroRow) + 1;
          attackCol = Number(heroCol);
          break;
        case "ArrowLeft":
          attackRow = Number(heroRow);
          attackCol = Number(heroCol) - 1;
          break;
        case "ArrowRight":
          attackRow = Number(heroRow);
          attackCol = Number(heroCol) + 1;
          break;
        default:
          return;
      }
      const attackPosition = `${attackRow}-${attackCol}`;
      const attackCell = document.querySelector(
        `[data-position="${attackPosition}"]`
      );
    
      if (attackCell) {
        attackCell.classList.add("attack");
        setTimeout(() => {
          attackCell.classList.remove("attack");
        }, 500); // Remove the "attack" class after 500ms
      }
    
      // Check for enemy in the attack position
      const enemyIndex = enemies.indexOf(attackPosition);
    
      if (enemyIndex !== -1) {
        const enemyCell = document.querySelector(
          `[data-position="${attackPosition}"]`
        );
        enemyCell.classList.remove("enemy");
        enemies.splice(enemyIndex, 1);
      }
    }
    */
// new function to handle hero attack
function heroAttack() {
  let counterelement = document.getElementById("enemydeathcounter"); //get a reference to the deathcounter
  const [heroRow, heroCol] = heroPosition.split("-");
  let attackRow, attackCol;

  if (Math.random() < 0.5) {
    attackRow = Math.random() < 0.5 ? Number(heroRow) - 1 : Number(heroRow) + 1;
    attackCol = Number(heroCol);
  } else {
    attackRow = Number(heroRow);
    attackCol = Math.random() < 0.5 ? Number(heroCol) - 1 : Number(heroCol) + 1;
  }

  const attackPosition = `${attackRow}-${attackCol}`;
  const attackCell = document.querySelector(
    `[data-position="${attackPosition}"]`
  );

  if (
    (attackCell && attackCell.classList.contains("enemy1")) ||
    (attackCell && attackCell.classList.contains("enemy2")) ||
    (attackCell && attackCell.classList.contains("enemy3"))
  ) {
    attackCell.classList.add("attack");
    setTimeout(() => {
      attackCell.classList.remove("attack");
      attackCell.classList.remove("enemy1");
      attackCell.classList.remove("enemy2");
      attackCell.classList.remove("enemy3");
      enemies.splice(enemies.indexOf(attackPosition), 1);
    }, 500);
    enemiesDefeat++; //increasing the countervalue of enemiesDefeat
    counterelement.textContent = enemiesDefeat; // increasing the enemies death counter by 1
  }
}

//restarting the game afer loosing all 3 lifes
function restartGame() {
  const gameOverImage = document.createElement("img");
  gameOverImage.src = "pixelpics/endscreen_laughing.gif";
  gameOverImage.style.position = "fixed";
  gameOverImage.style.top = "50%";
  gameOverImage.style.left = "50%";
  gameOverImage.style.transform = "translate(-50%, -50%)";
  gameOverImage.style.opacity = "0";
  gameOverImage.style.transition = "opacity 1s ease-in-out";
  gameOverImage.style.height = "120%";

  document.body.appendChild(gameOverImage);

  // Show the image for 4 seconds
  setTimeout(() => {
    gameOverImage.style.opacity = "1";
    setTimeout(() => {
      location.reload();
    }, 4000); // Reload the page after 4 seconds
  }, 10); // Delay showing the image for 0.01 seconds
}

// Create the game board when the page loads
window.addEventListener("DOMContentLoaded", () => {
  createGameBoard(); //creates a gameboard
  generateRandomPosition(); //generates random position after reloading
  setInterval(generateEnemy, 4000); // Generate an enemy every 5 seconds
  setInterval(generatePowerUp, 10000); //Timer to get a powerup after 10 seconds
  setInterval(removePowerUp, 12000); //Removes the powerups after 12 seconds
  setInterval(moveEnemies, 500); //Move enemy every second
  setInterval(updateLifeImages, 50); //Updates the lifecounter every 0.05 seconds!
});

// Event listener for keyboard "ARROW" key presses
window.addEventListener("keydown", (event) => {
  moveHero(event.key);
});
// Event listener for "ENTER" key press to trigger hero attack
window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    heroAttack();
  }
});

// Mobile version navigation
// Event listener for the "LEFT,RIGHT,UP,DOWN" buttons on the mobile version ! not working
upButton.addEventListener("click", () => {
  moveHeroMobile("up");
});

downButton.addEventListener("click", () => {
  moveHeroMobile("down");
});

leftButton.addEventListener("click", () => {
  moveHeroMobile("left");
});

rightButton.addEventListener("click", () => {
  moveHeroMobile("right");
});
// Event listener for the Hero attack with the "SMASH" button on the mobile version ! working
window.addEventListener("click", (event1) => {
  if (event1.target.id === "smash-button") {
    heroAttack();
  }
});
