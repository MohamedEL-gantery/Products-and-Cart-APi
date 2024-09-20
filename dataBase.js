const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: ".env" });

/**
 *  Connect to the database
 */
const userName = process.env.DB_USER;
const host = process.env.DB_HOST;
const password = process.env.DB_PASSWORD;
const connectDB = () => {
  const url = `mongodb+srv://${userName}:${password}@${host}/?retryWrites=true&w=majority&appName=code`;
  mongoose
    .connect(url)
    .then(() =>
      console.log(
        `[MongoDB] The connection with database on host "${host}" is done successfully!`
      )
    )
    .catch((err) => console.log(err));
};

module.exports = connectDB;