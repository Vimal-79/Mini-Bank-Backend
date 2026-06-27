import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { connection } from "./connection.js";
import { insert_query_users, insert_query_credentials, select_user_by_email, select_credentials_by_email } from "./queries.js";
import { executeWithTransaction } from "./transaction.js";
import { generateUserId } from "./utils/generateId.js";
import { verifyToken } from "./middleware/authMiddleware.js";

export const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chulbul Bank Server is running!");
});

// ---------------------------- handle registration -----------------------------

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


  console.log("Registration received:", { ...req.body });

  // Generate unique user ID (CB + 10 random chars = 12 chars total)
  const userId = generateUserId();
  console.log("Generated User ID:", userId);

  // Execute both queries in a transaction
  const transactionResult = await executeWithTransaction([
    {
      query: insert_query_credentials,
      params: [userId, email, password, currentTime]
    },
    {
      query: insert_query_users,
      params: [userId, firstName, lastName, email, mobile, dateOfBirth, nationality, accountType, initialDeposit, address, password, currentTime]
    }
  ]);

  if (!transactionResult.success) {
    return res.status(500).json({
      success: false,
      message: "Registration failed. All data has been rolled back.",
      error: transactionResult.error
    });
  }

  return res.status(201).json({
    success: true,
    message: "Registration completed successfully. All data committed.",
    userId: userId
  });
});

// --------------------------- handle login -----------------------------

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt received:", { email, password });

  try {
    // Query user by email
    const userResult = await connection.query(select_user_by_email, [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const user = userResult.rows[0];
    console.log("User found:", user);

    // Verify password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    console.log("Login successful for user:", email);
    console.log("Generated Token:", token);

    return res.status(200).json({
      success: true,
      valid: true,
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: err.message
    });
  }
});

// ------------------------ verify token middleware -------------------------

app.post("/api/verify-token", verifyToken, (req, res) => {
  console.log("Token verified for user:", req.user.email);
  return res.status(200).json({
    success: true,
    valid: true,
    message: "Token is valid",
    user: req.user
  });
});

// ----------------------- get user profile (protected) -----------------------

// app.get("/api/profile", verifyToken, async (req, res) => {
//   try {
//     const userEmail = req.user.email;
//     console.log("Fetching profile for user:", userEmail);

//     const userResult = await connection.query(select_user_by_email, [userEmail]);

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     const user = userResult.rows[0];
//     return res.status(200).json({
//       success: true,
//       message: "User profile retrieved successfully",
//       user: {
//         id: user.id,
//         email: user.email,
//         firstName: user.first_name,
//         lastName: user.last_name,
//         mobile: user.mobile,
//         nationality: user.nationality,
//         accountType: user.account_type,
//         initialDeposit: user.initial_deposit,
//         address: user.address,
//         createdAt: user.created_at
//       }
//     });
//   } catch (err) {
//     console.error("Profile fetch error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch profile",
//       error: err.message
//     });
//   }
// });