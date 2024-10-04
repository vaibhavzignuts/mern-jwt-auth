const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_EXPIRY = "10s";
const REFRESH_TOKEN_EXPIRY = "2m";

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists! Login Instead" });
    }

    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    return res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found. Signup Please" });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Email / Password" });
    }

    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Successfully Logged In",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 1000, // 10 seconds
    });

    return res.status(200).json({
      message: "Access token refreshed successfully",
      user: { id: user._id, name: user.name, email: user.email },
      accessToken: newAccessToken, // Returning new access token
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    }
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

const verifyToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: "Access token not found" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(403).json({ message: "Invalid access token" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Successfully Logged Out" });
};

module.exports = {
  signup,
  login,
  refreshToken,
  verifyToken,
  getUser,
  logout,
};
