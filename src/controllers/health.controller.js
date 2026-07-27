export const getHealth = (req, res, next) => {
  // return res.status(200).json({
  //   success: true,
  //   status: "ok",
  //   uptime: process.uptime(),
  //   timestamp: new Date().toISOString(),
  // });

  try {
    throw new Error("Test Error");
  } catch (err) {
    next(err);
  }
};
