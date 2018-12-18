const logger = (req, res, next) => {
  console.log(new Date());
  next();
};

module.exports = { logger };
