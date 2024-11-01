import winston from "winston";

// Create a logger instance with specific configurations
const logger = winston.createLogger({
  level: "silly", // Set the default logging level to 'debug' (logs all messages at this level and higher)

  // Define the format for log messages
  format: winston.format.combine(
    winston.format.timestamp(), // Add a timestamp to each log entry
    winston.format.json() // Format log messages as JSON (structured and easily parsable)
  ),

  // Specify the transports (where logs will be sent)
  transports: [
    // Console transport for logging to the terminal
    new winston.transports.Console({
      level: "silly",
      // Define the format specifically for console logs
      format: winston.format.combine(
        winston.format.colorize(), // Colorize log messages for better readability in the console
        winston.format.simple() // Use a simple format (e.g., "info: message") for console output
      ),
    }),
    // File transport for logging to a file
    new winston.transports.File({ filename: "logFile.log" }), // Log messages will be saved in 'logFile.log'
  ],
});

// Export the logger instance for use in other files
export default logger;
