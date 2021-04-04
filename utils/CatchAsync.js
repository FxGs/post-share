// a function to handle errors of all async routes

module.exports = (fun) => {
  return (req, res, next) => {
    fun(req, res, next).catch(next);
  };
};
