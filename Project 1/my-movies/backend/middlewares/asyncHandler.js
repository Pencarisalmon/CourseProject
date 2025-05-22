const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error(error);
    res
      .status(500)
      .json({ message: `Internal Server Error, ${error.message}` });
  });
};

export default asyncHandler;
