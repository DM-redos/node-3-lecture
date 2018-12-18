const express = require("express");
const { json } = require("body-parser");
const { logger } = require("./middlewares");
const session = require('express-session');
const app = express();
const numbers = [12, 4, 63, 19, 48];

app.use(session(
  { secret: "house hunters intl",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 60 * 24 * 7
    }
  }
))
app.use(json());

// We need to know the date and time for every request.
app.use(logger);

app.get("/api/numbers", (req, res, next) => {
  res.json(numbers);
  req.session.user = "LI";
  console.log("get:", req.session);
});

// The routes below should be protected.
app.use((req, res, next) => {
  if (req.body.username === "admin") {
    console.log("middle:", req.session);
    req.session.test = 'test'
    next();
  } else {
    res.json({ error: "Unauthorized" });
  }
});
app.post("/api/numbers", (req, res, next) => {
  numbers.push(req.body.number);
  console.log("post:", req.session)
  res.json(numbers);
});
app.put(
  "/api/numbers/:id",

  (req, res, next) => {
    numbers.splice(req.params.id, 1, req.body.number);
    res.json(numbers);
  }
);

// There's a bug here, let's use middleware to find it
app.delete(
  "/api/numbers/:id",
  (req, res, next) => {
    console.log("Endpoint hit");
    console.log(req.body);
    next();
  },
  (req, res, next) => {
    numbers.splice(req.body.id, 1);
    res.json(numbers);
  }
);

app.listen(5050, () => "Listening on 5050");
