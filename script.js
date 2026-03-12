// Accounts data
const accounts = [
  { card: "1111", pin: "1234", balance: 10000 },
  { card: "2222", pin: "4321", balance: 7000 }
];

let current = null;
let pin = "";
let attempts = 0;
let amount = "";

// Play sound
function play(sound) {
  new Audio("sounds/" + sound + ".mp3").play();
}

// Show screen
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  // Reset PIN screen each time
  if (id === "pin") resetPin();
}

// Choose card
function chooseCard(i) {
  current = accounts[i];
  show("insert");
}

// Insert card
function insertCard() {

play("beep");

const cardEl = document.getElementById("card");

cardEl.classList.remove("eject");
cardEl.classList.add("insert");

setTimeout(() => {

generatePinPad();
show("pin");

}, 900);

}// Reset PIN
function resetPin() {
  pin = "";
  attempts = 0;
  document.getElementById("pinDisplay").innerText = "";
  document.getElementById("pinError").innerText = "";
  generatePinPad();
}

// Generate PIN keypad (randomized)
function generatePinPad() {
  let keys = ["0","1","2","3","4","5","6","7","8","9"];
  keys.sort(() => Math.random() - 0.5);

  const pad = document.getElementById("pinPad");
  pad.innerHTML = "";

  keys.forEach(k => {
    let btn = document.createElement("button");
    btn.innerText = k;
    btn.onclick = () => pressPin(k);
    pad.appendChild(btn);
  });

  let clearBtn = document.createElement("button");
  clearBtn.innerText = "⌫";
  clearBtn.classList.add("backspace");
  clearBtn.onclick = clearPin;
  pad.appendChild(clearBtn);
}

// Press PIN number
function pressPin(k) {
  if (isNaN(k)) return;
  play("beep");
  if (pin.length < 4) {
    pin += k;
    document.getElementById("pinDisplay").innerText = "•".repeat(pin.length);
  }
}

// Clear last PIN digit
function clearPin() {
  pin = pin.slice(0,-1);
  document.getElementById("pinDisplay").innerText = "•".repeat(pin.length);
}

// Submit PIN
function submitPin() {
  const display = document.getElementById("pinDisplay");

  if (pin === current.pin) {
    play("success");
    display.classList.add("success");

    setTimeout(() => {
      display.classList.remove("success");
      pin = "";
      attempts = 0;
      show("welcome");

      setTimeout(() => {
        show("menu");
        showBalance();
      }, 2000);
    }, 800);
  } else {
    play("error");
    display.classList.add("error");
    setTimeout(() => display.classList.remove("error"), 400);

attempts++;
pin = "";
display.innerText = "";
generatePinPad();

let remaining = 3 - attempts;

if (remaining > 0) {
  document.getElementById("pinError").innerText =
    "Incorrect PIN. Attempts remaining: " + remaining;
} else {
  document.getElementById("pinError").innerText =
    "Card locked.";
}

    setTimeout(() => {
      document.getElementById("pinError").innerText = "";
    }, 2000);

if (attempts >= 3) {

  play("error");

  setTimeout(() => {
    alert("CARD LOCKED. Please contact your bank.");
    finishTransaction();
  }, 1000);

}
  }
}

// Show balance
function showBalance() {
  document.getElementById("balance").innerText =
    "Balance: ₱" + current.balance;
}

// Open withdraw screen
function openWithdraw() {
  amount = "";
  document.getElementById("amountDisplay").innerText = "";
  generateAmountPad();
  show("withdraw");
}

// Generate custom amount keypad
function generateAmountPad() {
  const keys = ["1","2","3","4","5","6","7","8","9","0"];
  const pad = document.getElementById("amountPad");
  pad.innerHTML = "";

  keys.forEach(k => {
    let btn = document.createElement("button");
    btn.innerText = k;
    btn.onclick = () => {
      amount += k;
      document.getElementById("amountDisplay").innerText = amount;
      play("beep");
    };
    pad.appendChild(btn);
  });

  let clearBtn = document.createElement("button");
  clearBtn.innerText = "⌫";
  clearBtn.classList.add("backspace");
  clearBtn.onclick = () => {
    amount = amount.slice(0,-1);
    document.getElementById("amountDisplay").innerText = amount;
    play("beep");
  };
  pad.appendChild(clearBtn);
}

// Submit custom amount
function submitCustom() {
  if(amount) withdraw(parseInt(amount));
}

// Withdraw cash
function withdraw(val) {
  if (val > current.balance) {
    play("error");
    alert("Insufficient funds");
    return;
  }

  current.balance -= val;
  amount = "";
  document.getElementById("amountDisplay").innerText = "";

  show("process");

  setTimeout(() => {
    show("dispense");

    const cash = document.getElementById("cash");
    cash.classList.remove("dispense");
    void cash.offsetWidth;
    cash.classList.add("dispense");
    play("cash");

    setTimeout(() => {
      printReceipt(val);
    }, 2000);

  }, 1500);
}

// Print receipt
function printReceipt(val) {
  show("receipt");

  const paper = document.getElementById("receiptPaper");
  paper.classList.remove("print");
  void paper.offsetWidth;
  paper.innerHTML = `
ATM RECEIPT
-----------
Card: **** ${current.card}
Withdrawn: ₱${val}
Balance: ₱${current.balance}
Thank you!
  `;
  paper.classList.add("print");
  play("print");

  setTimeout(() => {
    show("another"); // Show Another Transaction screen
  }, 3500);
}

// Go back to menu
function goMenu() {
  show("menu");
  showBalance();
}

// Another transaction choices
function anotherYes() {
  show("menu");
  showBalance();
}

// Finish transaction (eject card + reset ATM)
function finishTransaction() {
  ejectCard();
}

// Eject card
function ejectCard() {
  const cardEl = document.getElementById("card");
  cardEl.classList.remove("insert");
  cardEl.classList.add("eject");
  resetPin();

  setTimeout(reset, 1500);
}

// Reset ATM
function reset() {
  pin = "";
  amount = "";
  attempts = 0;
  document.getElementById("card").classList.remove("eject");
  show("cardSelect");
}

// Intro screen fade
window.addEventListener("load", () => {

const intro = document.getElementById("intro");

setTimeout(() => {

intro.classList.add("fade-out");

setTimeout(() => {
intro.remove();
}, 800);

}, 2000);

});