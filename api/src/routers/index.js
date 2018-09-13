const router = require("express").Router();
const slackRouter = require("./slack");
const deliveryRouter = require("./delivery");
const searchRouter = require("./search");

router.use("/slack", slackRouter);
router.use("/delivery", deliveryRouter);
router.use("/search", searchRouter);

module.exports = router;
