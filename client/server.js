const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);

// Use the environment port if available, or default to 3000
const port = process.env.PORT || 80;

// Serve static files from /public
app.use(express.static(path.join(__dirname, "dist")));

server.listen(port, () => console.log(`Server started on port ${port}`));
