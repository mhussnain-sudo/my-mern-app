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
      
      const token = jwt.sign({ userId: user._id, role: user.role }, secretKey); // Include role in the token
      const { password: _, ...userDetails } = user.toObject(); // Remove the password field

      res.status(200).json({ 
          message: "Login Successful", 
          type: "success", 
          token, 
          user: userDetails
      });
  } catch (error) {
      res.status(500).json({ message: error.message, type: "error" });
  }
};

// logout user
const logoutUser = async (req, res) => {
  try {
    const { userId } = req;

    const user = await Users.findById(userId);

    if (!user) {
      throw new Error("user not found");
    }

    res.status(200).json({
      message: "Logout successfully",
      type: "success",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      type: "error",
    });
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

    // Check if any files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one banner image is required", type: "error" });
    }

    // Map over the files and create a new Header document for each banner
    const newHeaders = req.files.map(file => {
      const formattedPath = file.path.replace(/\\/g, "/").replace("public/", ""); // Format the banner path
      return new Header({ banner: formattedPath }); // Create a new Header instance
    });

    // Save all headers to the database
    await Header.insertMany(newHeaders);

    res.status(200).json({
      message: "Banners uploaded successfully",
      type: "success",
    });
  } catch (error) {
    res.status(500).json({ error: error.message, type: "error" });
  }
};

const getheader = async (req, res) => {
  try {
      const headers = await Header.find(); // Fetch all headers

      if (!headers.length) {
          return res.status(404).json({ message: "No headers found", type: "error" });
      }

      // Prepend the public prefix to the banner path for the frontend
      const headersWithPath = headers.map(header => ({
          ...header._doc,
          banner: `/public/${header.banner}`
      }));

      res.status(200).json({ message: "Headers retrieved successfully", type: "success", headers: headersWithPath });
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

    const { ownerName, clubName, email, password } = req.body;

    // Validate required fields
    if (!ownerName || !clubName || !email || !password) {
      return res.status(400).json({ message: "All fields are required", type: "error" });
    }



    // Create a new club
    const newClub = new Club({
      ownerName,
      clubName,
      email,
      password,
      clubAvatar: req.file ? `clubAvatar/${req.file.filename}` : null, // Save the filename from multer
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
      const { page = 1, limit = 15 } = req.query;

      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;

      // Fetch clubs with pagination
      const clubs = await Club.find()
        .skip(skip)
        .limit(limitNumber)
        .select('clubName ownerName email password clubAvatar');

      const totalClubs = await Club.countDocuments();

      if (clubs.length === 0) {
          return res.status(404).json({ message: "No clubs found", type: "info" });
      }

      // Map over clubs to add public prefix to clubAvatar
      const clubsWithAvatar = clubs.map(club => ({
          ...club.toObject(), // Convert mongoose document to plain object
          clubAvatar: club.clubAvatar ? `/public/${club.clubAvatar}` : null, // Add prefix
      }));

      res.status(200).json({
          message: "Clubs retrieved successfully",
          type: "success",
          data: {
              clubs: clubsWithAvatar,
              currentPage: pageNumber,
              totalPages: Math.ceil(totalClubs / limitNumber),
              totalItems: totalClubs,
          }
      });
  } catch (error) {
      res.status(500).json({ error: error.message, type: "error" });
  }
};



module.exports = {
  role,
  registerUser,
  loginUser,
  logoutUser,
  userProfile,
  header,
  getheader,
  addClub,
  getAllClubs
};
