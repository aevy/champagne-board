const router = require("express").Router();
const { timelionQuery } = require("../lib/queryProxy");

router.post("/timelion", (req, res) => {
  const { query, time } = req.body;
  timelionQuery({ query, time })
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
});

module.exports = router;
