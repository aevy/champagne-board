const fetch = require("node-fetch");
const { timelion } = require("../config");

const timelionQuery = ({ query, time }) => {
  const body = JSON.stringify({
    sheet: [query],
    time
  });
  return fetch(timelion.queryUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "kbn-version": "6.4.0",
      Authorization: "Basic a2liYW5hYWRtaW46SGVtbGlndDEyMw=="
    },
    body
  })
    .then(res => res.json())
    .then(data => data.sheet[0]);
};

module.exports = {
  timelionQuery
};
