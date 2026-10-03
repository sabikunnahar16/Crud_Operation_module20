function notFound(_request, response) {
  response.status(404).json({ success: false, message: "Route not found" });
}

function errorHandler(error, _request, response, _next) {
  if (error.code === 11000) {
    return response.status(409).json({ success: false, message: "Email is already registered" });
  }
  if (error.name === "ValidationError" || error instanceof SyntaxError) {
    return response.status(400).json({ success: false, message: "Invalid request data", details: error.message });
  }
  if (error.code === "LIMIT_FILE_SIZE") {
    return response.status(400).json({ success: false, message: "Image must be 5MB or smaller" });
  }
  console.error(error);
  return response.status(500).json({ success: false, message: "Internal server error" });
}

module.exports = { notFound, errorHandler };
