const router = require("express").Router();
const { sendTo } = require("../lib/udp");
const { userNames } = require("../config");
const { convertToUSD } = require("../lib/currency");

const userMiddleware = (req, res, next) => {
  const { user_id } = req.body;
  req.userId = user_id;
  req.userName = userNames[user_id];
  if (!req.userName) {
    res.status(400).send("Couldn't recognize user");
  } else {
    next();
  }
};

const reportAfterware = (req, res) => {
  sendTo({
    story: "Sales",
    user: req.userName,
    userId: req.userId,
    ...req.report
  });
  res.send(req.slackMessage || "OK");
};

router.use(userMiddleware);

router.post("/hire", (req, res, next) => {
  console.log("BODY", req.body);
  const { text } = req.body;
  const [amountString, mCurrency] = text.split(" ");
  const currency = (mCurrency && mCurrency.toUpperCase()) || "USD";
  const amount = parseInt(amountString);
  if (isNaN(amount)) {
    res.status(400).send("value is not a number");
    return;
  }
  if (currency !== "USD") {
    convertToUSD(currency, amount)
      .then(amountInUsd => {
        req.report = { action: "Hire", payload: { amount: amountInUsd } };
        req.slackMessage = ":boom: BOOM BOOM :boom:";
        next();
      })
      .catch(err => {
        res
          .status(400)
          .send("Didn't catch that. Did you type in some weird currency?");
      });
  } else {
    req.report = {
      action: "Hire",
      payload: {
        amount
      }
    };
    req.slackMessage = ":boom: BOOM BOOM :boom:";
    next();
  }
});

router.post("/meeting", (req, res, next) => {
  req.report = { action: "Meeting" };
  req.slackMessage = "Meeting registered!";
  next();
});
router.post("/sent", (req, res, next) => {
  req.report = {
    action: "SentContract"
  };
  req.slackMessage = "Way to go!";
  next();
});
router.post("/signed", (req, res, next) => {
  req.report = {
    action: "SignedContract"
  };
  req.slackMessage = ":ok-hand: Niiiiiice :ok-hand:";
  next();
});
router.post("/case", (req, res, next) => {
  req.report = {
    action: "NewCase"
  };
  next();
  req.slackMessage = "Case registered";
});

router.use(reportAfterware);

module.exports = router;
