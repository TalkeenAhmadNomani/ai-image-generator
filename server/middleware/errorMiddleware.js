// This middleware catches errors thrown in your async controllers
const errorHandler = (err, req, res, next) => {
  // Log the full error stack for debugging purposes
  console.error(err.stack);

  // Set a default status code if one isn't already set
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  // Send a structured JSON error response
  res.json({
    message: err.message,
    // In a production environment, you might not want to send the stack trace
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { errorHandler };
