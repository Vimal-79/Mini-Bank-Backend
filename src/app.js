import express from "express";
import cors from "cors";
import { connection } from "./connection.js";

export const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chulbul Bank Server is running!");
});

app.post("/api/register", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobile,
    dateOfBirth,
    nationality,
    accountType,
    initialDeposit,
    address,
    password,
    currentTime
  } = req.body;

  // if (
  //   !firstName ||
  //   !lastName ||
  //   !email ||
  //   !mobile ||
  //   !dateOfBirth ||
  //   !address ||
  //   !password ||
  //   termsAccepted !== true
  // ) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Missing required registration fields or terms not accepted.",
  //   });
  // }


  console.log("Registration received:", {
    firstName,
    lastName,
    email,
    mobile,
    dateOfBirth,
    nationality,
    accountType,
    initialDeposit,
    address,
    password,
    currentTime
  });

  const insert_query = `
    INSERT INTO users (first_name, last_name, email, mobile, date_of_birth, nationality, account_type, initial_deposit, address, password, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  `;

  const insert_query_respose = await connection.query(insert_query, [firstName, lastName, email, mobile, dateOfBirth, nationality, accountType, initialDeposit, address, password, currentTime], (err, result) => {
    if (!err) {
      return res.status(201).json({
        success: true,
        message: "Registration data received successfully.",
      });
    }

    console.error("Error inserting registration data:", err);
    return res.status(500).json({
      success: false,
      message: "Error inserting registration data.",
    });

  })
});