import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      success: false,
      valid: false,
      message: "No token provided"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Token verified for user:", decoded.email);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      valid: false,
      message: "Invalid or expired token",
      error: err.message
    });
  }
};
