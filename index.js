const express = require("express");
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

function generateDailyMockStockData(symbol) {
  const startDate = new Date("2023-01-01");
  const endDate = new Date("2023-12-31");
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const initialPrice = 100;
  const volatility = 0.02;
  const stockData = [];
  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const priceChange = initialPrice * volatility * (2 * Math.random() - 1);
    const stockPrice = initialPrice + priceChange;
    stockData.push({
      symbol: symbol,
      date: date.toISOString().split("T")[0],
      openPrice: stockPrice,
      highPrice: stockPrice + Math.random(),
      lowPrice: stockPrice - Math.random(),
      closePrice: stockPrice + priceChange,
      volume: Math.floor(Math.random() * 1000000),
    });
  }
  return stockData;
}

function generateHourlyMockStockData(
  startDate,
  endDate,
  interval = 3600000,
  initialPrice = 100,
  symbol = "AAPL"
) {
  const stockData = [];
  let currentPrice = initialPrice;
  for (
    let timestamp = startDate.getTime();
    timestamp <= endDate.getTime();
    timestamp += interval
  ) {
    const priceChange = (Math.random() - 0.5) * 10;
    currentPrice += priceChange;
    currentPrice = Math.max(currentPrice, 1);
    currentPrice = Math.min(currentPrice, 200);
    const dataPoint = {
      symbol: symbol,
      time: new Date(timestamp),
      open: currentPrice,
      high: currentPrice + Math.random(),
      low: currentPrice - Math.random(),
      close: currentPrice,
      volume: Math.round(Math.random() * 1000),
    };
    stockData.push(dataPoint);
  }
  return stockData;
}

function generateMockStockData(symbol, period) {
  const date = new Date();
  if (period === "daily") {
    const mockStockData = generateDailyMockStockData(symbol);
    return mockStockData;
  } else if (period === "hourly") {
    const startDate = new Date("2023-10-24T09:00:00Z");
    const endDate = new Date("2023-10-24T16:00:00Z");
    const mockStockData = generateHourlyMockStockData(
      startDate,
      endDate,
      3600000,
      100,
      symbol
    );
    return mockStockData;
  }
  return [];
}

function generateRandomDate(originalDate) {
  const baseDate = new Date(originalDate);
  const minYear = baseDate.getFullYear();
  const maxYear = minYear + 5;
  const randomYear =
    Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
  const randomMonth = Math.floor(Math.random() * 12);
  const maxDay = new Date(randomYear, randomMonth + 1, 0).getDate();
  const randomDay = Math.floor(Math.random() * maxDay) + 1;
  const randomDate = new Date(randomYear, randomMonth, randomDay);
  return randomDate.toISOString();
}

app.get("/api/stocks", (req, res) => {
  const { symbol, period } = req.query;
  if (symbol === "null" || period === "null") {
    return res
      .status(400)
      .json({ error: "Both symbol and period are required query parameters." });
  }
  const mockStockData = generateMockStockData(symbol, period);
  res.json(mockStockData);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
