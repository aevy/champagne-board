const router = require("express").Router();
const { rails, userNames } = require("../config");
const { sendTo } = require("../lib/udp");

const userMiddleware = (req, res, next) => {
  const userId = rails.users[req.body.user_id] || rails.users.__UNKNOWN__;
  const userName = userNames[userId];

  req.personId = req.body.person_id;
  req.positionId = req.body.list_id;
  req.userId = userId;
  req.userName = userName;

  next();
};

const reportAfterware = (req, res) => {
  sendTo({
    story: "Delivery",
    postionId: req.positionId,
    personId: req.personId,
    caseId: req.positionId,
    user: req.userName,
    userId: req.userId,
    ...req.report
  });
  res.send("OK");
};

router.use(userMiddleware);

router.post("/presented", (req, res, next) => {
  req.report = { action: "presented" };
  next();
});

router.post("/accepted", (req, res, next) => {
  req.report = { action: "accepted" };
  next();
});

router.post("/rejected", (req, res, next) => {
  req.report = { action: "rejected" };
  next();
});

router.use(reportAfterware);

module.exports = router;
