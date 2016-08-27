// Borrowed from http://canvasjs.com/html5-javascript-dynamic-chart/
var stockValue = 0;
var updateStock;
var running = true;
var bankrupt = false;
var INTERVAL = 500;
var VALUE_WINDOW = 500;
var currentMarket = 1;
var noCongrats = true;
var initialCash = 250;

var sharesOwned;
var cash;
var netWorth;

var xVal;
var yVal;

var dps = []; // dataPoints
var chart;

function notify(message, timeout) {
  setTimeout(function() {
    alert(message)
  }, timeout);
}

function createChart() {
  chart = new CanvasJS.Chart("marketSimulation", {
    title :{
      text: "Stock Value",
      fontSize: 20,
      font: "Courier New"
    },
    data: [{
      type: "line",
      dataPoints: dps
    }]
  });
}

function stopMarket() {
  document.getElementById("startStop").value = "Start";
  clearInterval(updateStock);
  running = false;
}

function runMarket(interval) {
  updateStock = setInterval(function(){updateChart(chart, dps)}, interval || INTERVAL);
  document.getElementById("startStop").value = "Stop";
  running = true;
}

function changeMarketSpeed(sliderValue) {
  var period = INTERVAL / sliderValue;
  if (!bankrupt) {
    clearInterval(updateStock);
    runMarket(period);
  }
}

function startMarket() {
  var speed = document.getElementById("speedSlider").value;
  changeMarketSpeed(speed);
}

function restartMarket() {
  xVal = 0;
  yVal = 100;

  clearOwned();
  resetCash();

  dps = [];
  chart.options.data[0].dataPoints = dps;
  bankrupt = false;
  updateChart(chart, dps);
  noCongrats = true;

  if (!bankrupt) {
    startMarket();
  }
}

function stepMarket() {
  if (!bankrupt) {
    updateChart(chart, dps);
  }
}

function toggleMarket() {
  if (bankrupt) {
    restartMarket();
  } else {
    if (running) {
      stopMarket();
    } else {
      startMarket();
    }
  }
}

function setCurrentMarket() {
  if (document.getElementById("market1").checked) {
    currentMarket = 1;
  } else if (document.getElementById("market2").checked) {
    currentMarket = 2;
  } else if (document.getElementById("market3").checked) {
    currentMarket = 3;
  } else {
    currentMarket = 4;
  }
}

function changeMarket(newMarket) {
  setCurrentMarket();
}

function updateValue() {
  netWorth = cash + sharesOwned * stockValue;
  document.getElementById("worth").innerHTML = netWorth;
}

function clearOwned() {
  sharesOwned = 0;
  updateOwned(0);
}

function updateOwned(num) {
  sharesOwned += num;
  document.getElementById("shares").innerHTML = sharesOwned;
}

function resetCash() {
  cash = initialCash;
  updateCash(0);
}

function updateCash(delta) {
  cash += delta;
  document.getElementById("cash").innerHTML = cash;
}


function clearTransactions() {
  document.getElementById("transactions").innerHTML = "";
}

function updateTransactions(operation) {
  transactionArea = document.getElementById("transactions");
  transactionArea.innerHTML += operation + "\t" + stockValue + "\n";
  transactionArea.scrollTop = transactionArea.scrollHeight;
}

function buy() {
  var cost = stockValue;
  if (cost > cash) {
    notify("Insufficient funds", 0);
  } else {
    updateCash(-cost);
    updateOwned(1);
    updateTransactions("Buy");
  }
}

function sell() {
  if (sharesOwned > 0) {
    updateCash(stockValue);
    updateOwned(-1);
    updateTransactions("Sell");
  } else {
    notify("Insufficient shares", 0);
  }
}

function setStockValue(value) {
  stockValue = yVal;
  updateValue();
}

function getNextValue() {
  if (currentMarket == 1) {
    return Math.round(-5 + 10 * Math.random());
  } else if (currentMarket == 2) {
    return Math.round(-6 + 10 * Math.random());
  } else if (currentMarket == 3) {
    return Math.round(-3 + 8 * Math.random());
  } else {
    return Math.round(-10 + 20 * Math.random());
  }
}

function updateChart(chart, dps) {
  if (bankrupt) {
    return;
  }

  yVal = yVal + getNextValue();
  yVal = Math.max(yVal, 0);

  dps.push({
    x: xVal,
    y: yVal
  });
  xVal++;

  setStockValue(yVal);
  if (stockValue == 0) {
    clearInterval(updateStock);
  }

  if (dps.length > VALUE_WINDOW) {
    dps.shift();
  }

  chart.render();
  document.getElementById("stockValue").innerHTML = stockValue;

  // end conditions
  if (stockValue == 0) {
    document.getElementById("stockValue").innerHTML += "... Game over";
    document.getElementById("startStop").value = "Restart";
    bankrupt = true;
    if (netWorth < 0) {
      notify("You're Bankrupt! You lost $" + (-netWorth), 50);
    } else {
      notify("Game over. You have a meager $" + netWorth, 50);
    }
  } else if (noCongrats && stockValue * sharesOwned > 10000) {
    noCongrats = false;
    notify("Congratulations! You're rich.", 50);
  }
}

window.onload = function() {
  createChart();
  restartMarket();
  document.getElementById("cash").innerHTML = cash;
}
