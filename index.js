const express = require("express");
const { json } = require("body-parser");
const app = express();
const {auth} = require ('./middleware');
const numbers = [12, 4, 63, 19, 48];

app.use(json());

app.use((req, res, next) =>{
  console.log(new Date());
  next();
})
// We need to know the date and time for every request.

app.use((req, res, next) => {
  if (req.body.username === "admin") {
    next();
  }else{
    res.status(401).json({error: "No hackerz"});
  }
})

app.get("/api/numbers", (req, res, next) => {
  res.json(numbers);
});

// The routes below should be protected.
app.post("/api/numbers", (req, res, next) => {
  numbers.push(req.body.number);
  res.json(numbers);
});
app.put("/api/numbers/:id", auth, (req, res, next) => {
  numbers.splice(req.params.id, 1, req.body.number);
  res.json(numbers);
});

// There's a bug here, let's use middleware to find it
// use middleware to figure out what's in req.body
app.delete("/api/numbers/:id", (req, res, next) => {
  console.log("hello", req.body);
  next();
},(req, res, next) => {
  console.log("params", req.param)
  numbers.splice(req.params.id, 1);
  res.json(numbers);
});

app.listen(5050, () => "Listening on 5050");
