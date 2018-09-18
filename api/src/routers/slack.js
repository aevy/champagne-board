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
  }
  next();
};

const reportAfterware = (req, res) => {
  sendTo({
    story: "Sales",
    user: req.userName,
    userId: req.userId,
    ...req.report
  });
  //res.send("OK");
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
    convertToUSD(currency, amount).then(amountInUsd => {
      req.report = { action: "Hire", payload: { amount: amountInUsd } };
      console.log(req.report.payload);
      next();
    });
  } else {
    req.report = {
      action: "Hire",
      payload: {
        amount
      }
    };
    next();
  }
});

router.post("/meeting", (req, res, next) => {
  req.report = { action: "Meeting" };
  next();
});
router.post("/sent", (req, res, next) => {
  req.report = {
    action: "SentContract"
  };
  next();
});
router.post("/signed", (req, res, next) => {
  req.report = {
    action: "SignedContract"
  };
  next();
});
router.post("/case", (req, res, next) => {
  req.report = {
    action: "NewCase"
  };
  next();
});

router.use(reportAfterware);

module.exports = router;
