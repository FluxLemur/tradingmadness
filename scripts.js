// Borrowed from http://canvasjs.com/html5-javascript-dynamic-chart/
var stockValue = 0;
var updateStock;
var running = true;
var bankrupt = false;
var INTERVAL = 500;
var VALUE_WINDOW = 500;

var sharesOwned = 0;
var cash = 100;

var xVal;
var yVal;

var dps = []; // dataPoints
var chart;

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
  clearInterval(updateStock);
  runMarket(period);
}

function startMarket() {
  var speed = document.getElementById("speedSlider").value;
  changeMarketSpeed(speed);
}

function restartMarket() {
  xVal = 0;
  yVal = 100;
  //resetPoints(); //TODO: implement this
  bankrupt = false;
  updateChart(chart, dps);
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

function updateCost() {
  var num = parseInt(document.getElementById("shareNum").value);
  if (num) {
    document.getElementById("shareCost").value = '$' + num * stockValue;
  }
}

function updateValue() {
  document.getElementById("value").innerHTML = sharesOwned * stockValue;
  document.getElementById("gains").innerHTML = cash + sharesOwned * stockValue - 100;
}

function updateOwned(num) {
  sharesOwned += num;
  document.getElementById("shares").innerHTML = sharesOwned;
}

function updateCash(delta) {
  cash += delta;
  document.getElementById("cash").innerHTML = cash;
}

function buy() {
  var num = parseInt(document.getElementById("shareNum").value);
  if (num) {
    var cost = num * stockValue;
    if (cost > cash) {
      alert("Insufficient funds");
    } else {
      updateCash(-cost);
      updateOwned(num);
    }
  }
}

function sell() {
  if (sharesOwned > 0) {
    updateCash(stockValue);
    updateOwned(-1);
  } else {
    alert("Insufficient shares");
  }
}

function setStockValue(value) {
  stockValue = yVal;
  updateCost();
  updateValue();
}

function updateChart(chart, dps) {
  if (bankrupt) {
    return;
  }

  yVal = yVal +  Math.round(5 + Math.random() * (-10));
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
  if (stockValue == 0) {
    document.getElementById("stockValue").innerHTML += "... Bankrupt!";
    alert("You lose");
    document.getElementById("startStop").value = "Restart";
    bankrupt = true;
  }
}

window.onload = function() {
  createChart();
  restartMarket();
  document.getElementById("cash").innerHTML = cash;
}
