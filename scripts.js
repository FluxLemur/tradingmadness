// Borrowed from http://canvasjs.com/html5-javascript-dynamic-chart/
var stockValue = 0;
var updateStock;
var running = true;
var bankrupt = false;
var INTERVAL = 500;

var xVal;
var yVal;
var dataLength = 500; // number of dataPoints visible at any point

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
}

function changeMarketSpeed(sliderValue) {
  clearInterval(updateStock);
  var period = INTERVAL / sliderValue;
  runMarket(period);
}

function startMarket() {
  document.getElementById("startStop").value = "Stop";
  runMarket();
  running = true;
}

function restartMarket() {
  xVal = 0;
  yVal = 100;
  //resetPoints(); //TODO: implement this
  bankrupt = false;
  updateChart(chart, dps, dataLength);
  if (!bankrupt) {
    startMarket();
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

function updateChart(chart, dps, count) {
  if (bankrupt) {
    return;
  }
  count = count || 1;
  // count is number of times loop runs to generate random dataPoints.

  for (var j = 0; j < count; j++) {
    yVal = yVal +  Math.round(5 + Math.random() * (-10));
    yVal = Math.max(yVal, 0);

    dps.push({
      x: xVal,
      y: yVal
    });
    xVal++;

    stockValue = yVal;
    if (stockValue == 0) {
      clearInterval(updateStock);
      break;
    }
  }
  if (dps.length > dataLength) {
    dps.shift();
  }

  chart.render();
  document.getElementById("stockValue").innerHTML = stockValue;
  if (stockValue == 0) {
    document.getElementById("stockValue").innerHTML += "... Bankrupt!";
    document.getElementById("startStop").value = "Restart";
    bankrupt = true;
  }
}

window.onload = function() {
  createChart();
  restartMarket();
}
