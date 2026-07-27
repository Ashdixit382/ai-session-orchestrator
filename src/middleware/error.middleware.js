const errorMiddleware = (err, req, res, next) => {
  console.log("Error handler Reached");
  console.log(err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorMiddleware;
