require("dotenv").config();
const express = require("express");
const { json } = require("body-parser");
const session = require("express-session");
const { logger } = require("./middlewares");
const app = express();
const numbers = [12, 4, 63, 19, 48];

app.use(json());
// use sessions for every request
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

// We need to know the date and time for every request.
app.use(logger);

app.get("/api/numbers", (req, res, next) => {
  res.json(numbers);
});
app.post("/api/login", (req, res, next) => {
  if (req.body.user === "admin") {
    req.session.authenticated = true;
    res.json({ success: "Successfully logged in" });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});
app.post("/api/logout", (req, res, next) => {
  req.session.destroy();
  res.json({ success: "Successfully logged out" });
});

// The routes below should be protected.
app.use((req, res, next) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.json({ error: "Unauthorized" });
  }
});
app.post("/api/numbers", (req, res, next) => {
  numbers.push(req.body.number);
  res.json(numbers);
});
app.put(
  "/api/numbers/:id",

  (req, res, next) => {
    numbers.splice(req.params.id, 1, req.body.number);
    res.json(numbers);
  }
);

// We fixed the bug -- req.body was empty, we should have used req.params instead
app.delete(
  "/api/numbers/:id",

  (req, res, next) => {
    numbers.splice(req.params.id, 1);
    res.json(numbers);
  }
);

app.listen(5050, () => "Listening on 5050");
