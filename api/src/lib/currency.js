const fetch = require("node-fetch");
const convertToUSD = (currency, amount) =>
  fetch(
    `http://data.fixer.io/api/latest?access_key=458f4bbd022e9d9e5706a9160a787f67&format=1&symbols=USD,${currency}`
  )
    .then(res => res.json())
    .then(body => {
      const usdRate = body.rates.USD;
      const xchangeRate = body.rates[currency];
      if (!xchangeRate) {
        throw "Weird currency";
        return;
      }
      const amountInUsd = Math.floor((amount * usdRate) / xchangeRate);
      return amountInUsd;
    });
module.exports = {
  convertToUSD
};
