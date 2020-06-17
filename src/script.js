console.log("hello world");
var manParts = [];
var wordList = ["application", "programming", "interface", "wizard"];
var currentWord = "";
var wrong_chars;
var correct_chars;
var correctEnteredChars;
var complete;

// DOM ELEMENTS
var elNotification;
var elWrongTries;
var elWtEntries;
var elWord;
var elHangmanParts = [];
var elRetryGame;
var elBanner;

var resetVariables = () => {
  manParts = [];
  currentWord = "";
  wrong_chars = new Set([]);
  correct_chars = new Set([]);
  correctEnteredChars = new Set([]);
  complete = false;
};
var initDomRefferences = () => {
  elNotification = document.querySelector(".notification");
  elWrongTries = document.querySelector(".wrongTries");
  elWtEntries = document.querySelector(".wt_entries");
  elWord = document.querySelector(".word");
  elHangmanParts = [...document.querySelectorAll(".man")];
  elRetryGame = document.querySelector(".retryGame");
  elBanner = document.querySelector(".banner");
};

var chooseWord = () => {
  let index = Math.floor(Math.random() * wordList.length);
  currentWord = wordList[index];
  currentWord.split("").forEach((c) => correct_chars.add(c));
};

var resetDomValues = () => {
  elNotification.classList.add("hide");
  elHangmanParts.forEach((element) => element.classList.remove("showSvg"));
  elWrongTries.classList.add("hide");
  updateWordDisplay();

  //   console.log(elHangmanParts);
};
var updateWordDisplay = () => {
  let html = currentWord
    .split("")
    .map(
      (c) => `<div class="char">${correctEnteredChars.has(c) ? c : ""}</div>`
    )
    .reduce((a, b) => a + b);
  elWord.innerHTML = html;
};
var keyPressed = (event) => {
  keyPress(event, checkEntry);
};
var checkEntry = (key) => {
  if (correctEnteredChars.has(key) || wrong_chars.has(key)) {
    return;
  }
  if (correct_chars.has(key)) {
    correctEnteredChars.add(key);
    if (correctEnteredChars.size == correct_chars.size) {
      complete = true;
      notify(true);
    }
  } else {
    if (elHangmanParts.length == 1) {
      complete = true;
      notify(false);
    } else {
      elHangmanParts.pop().classList.add("showSvg");
      wrong_chars.add(key);
      updateError();
    }
  }
  updateWordDisplay();
};
var updateError = () => {
  elWrongTries.classList.remove("hide");
  let html = [...wrong_chars].reduce((a, b) => {
    return a + "," + b;
  });
  elWtEntries.innerHTML = html;
};
var notify = (cond) => {
  if (!cond) {
    elNotification.children.notificationMessage.innerHTML = `you lost!<br><br> the word was "${currentWord}"`;
    elNotification.children.notificationHeader.innerHTML = "OH no!";
    elNotification.children.retryGame.innerHTML = "try again?";
  } else {
    elNotification.children.notificationMessage.innerHTML = "You Won!";
    elNotification.children.notificationHeader.innerHTML = "Excelent!";
    elNotification.children.retryGame.innerHTML = "New game?";
  }
  elNotification.classList.remove("hide");
  elBanner.classList.remove("transformBanner");
  //todo
};
var setEventClickListeners = () => {
  window.addEventListener("keydown", keyPressed);
  elRetryGame.addEventListener("click", init);
};
var init = () => {
  resetVariables();
  initDomRefferences();
  chooseWord();
  resetDomValues();
  setEventClickListeners();
  setupBanner();
};
var setupBanner = () => {
  elBanner.classList.add("transformBanner");
};
var keyPress = (e, callback) => {
  if (complete) return;
  var keynum;
  if (window.event) {
    keynum = e.keyCode;
  } else if (e.which) {
    keynum = e.which;
  }
  switch (keynum) {
    case 8:
      break;
    default:
      if (!invalidKeys(keynum)) {
        callback(e.key.toLowerCase());
      }
  }
};
var invalidKeys = (keynum) => {
  if (keynum >= 65 && keynum <= 90) {
    return false;
  } else return true;
};
window.onload = init;
