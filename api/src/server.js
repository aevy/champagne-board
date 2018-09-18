const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routers");

// Constants
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

// App
const app = express();

app.use("/api", bodyParser.json());
app.use("/api/slack", bodyParser.urlencoded({ extended: false }));

app.use("/api", router);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
