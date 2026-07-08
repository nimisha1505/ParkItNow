/**
 * Higher-order utility to handle uncaught errors in async controller handlers.
 * Eliminates boilerplate try-catch blocks in Express controllers.
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
export { asyncHandler };
