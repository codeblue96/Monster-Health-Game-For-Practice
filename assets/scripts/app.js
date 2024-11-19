const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const ATTACK_MODE = 'ATTACK';
const STRONG_ATTACK_MODE = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER-HEAL';
const LOG_EVENT_GAME_OVER = 'GAME-OVER';



let battleLog = [];

const getMaxLifeValue = function () {
  const enteredValue = prompt('Enter the starting health for you and monster.', '100');
  const parsedValue = parseInt(enteredValue);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: 'Ivalid user input.  Enter a number!' };
  }
  return parsedValue;
};

let chosenMaxLife;

try {

   chosenMaxLife = getMaxLifeValue();
} catch (error) {
  console.log(error);
  chosenMaxLife = 100
  alert('Entered invalid input. Default value 100 is used! ')
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

const writeToLog = function (event, value, monsterHealthBar, playerHealthBar) {
  let logEntry;
  if (event === LOG_EVENT_PLAYER_ATTACK) {
    logEntry = {
      event: event,
      value: value,
      target: 'Monster',
      finalMonsterHealth: monsterHealthBar,
      finalPlayerHealth: playerHealthBar
    };
  } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry = {
      event: event,
      value: value,
      target: 'Monster',
      finalMonsterHealth: monsterHealthBar,
      finalPlayerHealth: playerHealthBar
    };
  } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    logEntry = {
      event: event,
      value: value,
      target: 'Player',
      finalMonsterHealth: monsterHealthBar,
      finalPlayerHealth: playerHealthBar
    };
  } else if (event === LOG_EVENT_PLAYER_HEAL) {
    logEntry = {
      event: event,
      value: value,
      target: 'Player',
      finalMonsterHealth: monsterHealthBar,
      finalPlayerHealth: playerHealthBar
    };
  } else if (event === LOG_EVENT_GAME_OVER) {
    logEntry = {
      event: event,
      value: value,
      finalMonsterHealth: monsterHealthBar,
      finalPlayerHealth: playerHealthBar
    };
  }
  battleLog.push(logEntry);
};

const reset = function () {
  let currentMonsterHealth = chosenMaxLife;
  let currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
};

const endRound = function () {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    alert('Bonus life used');
    setPlayerHealth(initialPlayerHealth);
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You Killed the monster');
    writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER_WON', currentMonsterHealth, currentPlayerHealth);
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You got killed by the monster');
    writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER_LOST', currentMonsterHealth, currentPlayerHealth);
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert('You have a draw');
    writeToLog(LOG_EVENT_GAME_OVER, 'GAME_DRAW', currentMonsterHealth, currentPlayerHealth);
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
};

const monsterAttack = function (mode) {
  const maxDamage = mode === ATTACK_MODE ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent = mode === ATTACK_MODE ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
  // if (mode === ATTACK_MODE) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === STRONG_ATTACK_MODE) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
};
const attackHandler = function () {
  monsterAttack(ATTACK_MODE);
};

const monsterAttackHandler = function () {
  monsterAttack(STRONG_ATTACK_MODE);
};

const healPlayerHandler = function () {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert('You cannot heal more than Max Life');
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
  endRound();
};
const printLogHandler = function () {
  for (let i = 0; i < 3; i++) {
    console.log('--------');
  }
  // for (let i = 0; i < battleLog.length; i++) {
  //   console.log(battleLog[i]);
  // }
  let i = 0;
  for (const logEntry of battleLog) {
    console.log(logEntry);
    console.log(i);
    i++;
  }
};

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', monsterAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
