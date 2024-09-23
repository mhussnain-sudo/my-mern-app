const mongoose = require("mongoose");
const Users = require("../models/userModel");
const Club = require("../models/clubs");
const Header = require("../models/header");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { setRole, getRole, clearRole } = require("../utils/roleStorage");
const secretKey = process.env.JWT_SECRET;

// STEP 1 : register user Role first
const role = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res
        .status(400)
        .json({ message: "Role is required", type: "error" });
    }
    setRole(role);
    res.status(200).json({ message: "Role set successfully", type: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, type: "error" });
  }
};

//STEP 2 : register user
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const role = getRole();

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new Users({ role, email, password: hashPassword });
    await newUser.save();
    clearRole();
    res.status(200).json({ message: "Signup Successfully", type: "success" });
  } catch (error) {
    res.status(400).json({ message: error.message, type: "error" });
  }
};

//STEP 3 : login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: "Email incorrect", type: "error" });
    }
    
    if (!bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: "Password incorrect", type: "error" });
    }
    
    if (user.status === "inactive") {
      return res.status(403).json({ message: "Account is deactivated", type: "error" });
    }
    
    const token = jwt.sign({ userId: user._id }, secretKey);
    res.status(200).json({ message: "Login Successful", type: "success", token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message, type: "error" });
  }
};


//Get User Profie
const userProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found", type: "error" });
    }

    if (user.role === "viewer") {
      res.status(200).json({
        email: user.email,
      });
    } else if (user.role === "admin") {
      res.status(200).json({
        role:user.role,
        email: user.email,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, type: "error" });
  }
};

const header = async (req, res) => {
  const userId = req.userId;

  try {
    const existingUser = await Users.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found", type: "error" });
    }

    // Check if user is an admin
    if (existingUser.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized", type: "error" });
    }

    const banner = req.file ? req.file.path : null; // Use multer to get the file path
    if (!banner) {
      return res.status(400).json({ message: "Banner image is required", type: "error" });
    }

    // Format the banner path for the database (remove 'public/' prefix)
    const formattedBannerPath = banner.replace(/\\/g, "/").replace("public/", "");

    // Check if there's an existing banner to replace
    const existingHeader = await Header.findOne(); // Adjust this if you have multiple headers

    if (existingHeader) {
      // If there's an existing banner, delete it from the filesystem
      const previousBannerPath = path.join(__dirname, '..',"public/",existingHeader.banner);
      if (fs.existsSync(previousBannerPath)) {
        fs.unlinkSync(previousBannerPath);
      }
      // Update the existing header with the new banner path
      existingHeader.banner = formattedBannerPath;
      await existingHeader.save();
      res.status(200).json({ message: "Banner updated successfully", type: "success", banner: formattedBannerPath });
    } else {
      // If no existing banner, create a new one
      const newHeader = new Header({ banner: formattedBannerPath });
      await newHeader.save();
      res.status(200).json({ message: "Banner uploaded successfully", type: "success", banner: formattedBannerPath });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, type: "error" });
  }
};

const getheader = async (req, res) => {
  try {
    const header = await Header.findOne(); // Adjust if you have multiple headers

    if (!header) {
      return res.status(404).json({ message: "Header not found", type: "error" });
    }

    // Prepend the public prefix to the banner path for the frontend
    header.banner = `/public/${header.banner}`;

    res.status(200).json({ message: "Header retrieved successfully", type: "success", header });
  } catch (error) {
    res.status(500).json({ message: error.message, type: "error" });
  }
};

const addClub = async (req, res) => {
  const userId = req.userId;

  try {
    const existingUser = await Users.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found", type: "error" });
    }

    // Check if user is an admin
    if (existingUser.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized", type: "error" });
    }

    const { ownerName, clubName,email,password,} = req.body;

    // Validate required fields
    if (!ownerName || !clubName || !email || !password) {
      return res.status(400).json({ message: "All fields are required", type: "error" });
    }

    // Create a new club
    const newClub = new Club({
      ownerName,
      clubName,
      email,
      password
    });

    // Save the new club to the database
    await newClub.save();

    res.status(201).json({ message: "Club added successfully", type: "success", club: newClub });
  } catch (error) {
    res.status(500).json({ error: error.message, type: "error" });
  }
};

const getAllClubs = async (req, res) => {
  try {
    // Fetch all clubs from the database
    const clubs = await Club.find();

    // Check if clubs exist
    if (clubs.length === 0) {
      return res.status(404).json({ message: "No clubs found", type: "info" });
    }

    // Return the list of clubs
    res.status(200).json({ message: "Clubs retrieved successfully", type: "success", clubs });
  } catch (error) {
    res.status(500).json({ error: error.message, type: "error" });
  }
};

module.exports = {
  role,
  registerUser,
  loginUser,
  userProfile,
  header,
  getheader,
  addClub,
  getAllClubs
};
