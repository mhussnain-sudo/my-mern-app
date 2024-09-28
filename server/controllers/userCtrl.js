const mongoose = require("mongoose");
const Users = require("../models/userModel");
const Club = require("../models/clubs");
const Header = require("../models/header");
const Tournament = require("../models/tournament");
const Pigeons = require("../models/pigeon");
const PigeonsResults = require("../models/pigeonResult");
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

      // Await the password comparison
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: "Password incorrect", type: "error" });
      }

      if (user.status === "inactive") {
          return res.status(403).json({ message: "Account is deactivated", type: "error" });
      }

      const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);
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

//Upload Banner & Header
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

//Get Header Banner
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

// Add Clubs
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

//Get All Clubs
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
const getClubs = async (req, res) => {
  try {
      // Fetch clubs with pagination
      const clubs = await Club.find()
  

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
          }
      });
  } catch (error) {
      res.status(500).json({ error: error.message, type: "error" });
  }
};
const addTournament = async (req, res) => {
  try {
      const {
          tournamentName,
          tournamentInfo,
          date,
          timeStart,
          numberOfPigeons,
          numberOfHelperPigeons,
          numberOfLoftedPigeons,
          continueDays,
          continueDates, 
          prizes, 
          numberOfPrizes
      } = req.body;

      let parsedContinueDates = [];
      let parsedPrizes = [];

      try {
          parsedContinueDates = JSON.parse(continueDates).map(item => ({ date: new Date(item.date) })); // Ensure date format
      } catch (error) {
          return res.status(400).json({ message: "Invalid format for continueDates." });
      }

      try {
          parsedPrizes = JSON.parse(prizes).map(item => ({ name: item.name })); // Ensure prize format
      } catch (error) {
          return res.status(400).json({ message: "Invalid format for prizes." });
      }

      const tournamentImage = req.file ? `tournamentImage/${req.file.filename}` : null;

      // Validate required fields
      if (!tournamentName || !tournamentInfo || !date || !timeStart) {
          return res.status(400).json({ message: "Missing required fields." });
      }
      const existingTournament = await Tournament.findOne({ tournamentName });
if (existingTournament) {
  return res.status(400).json({ message: "A tournament with this name already exists.", type: "error" });
}
      const newTournament = new Tournament({
          tournamentImage,
          tournamentName,
          tournamentInfo,
          date,
          timeStart,
          numberOfPigeons,
          numberOfHelperPigeons,
          numberOfLoftedPigeons,
          continueDays,
          continueDates: parsedContinueDates, // Properly formatted
          prizes: parsedPrizes, // Properly formatted
          numberOfPrizes
      });

      const savedTournament = await newTournament.save();
      res.status(201).json(savedTournament);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


const getAllTournaments = async (req, res) => {
  try {
      const { page = 1, limit = 15 } = req.query;

      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;

      // Fetch tournaments with pagination
      const tournaments = await Tournament.find()
          .skip(skip)
          .limit(limitNumber)
          .select('tournamentName tournamentInfo numberOfPigeons date timeStart status tournamentImage');

      const totalTournaments = await Tournament.countDocuments();

      if (tournaments.length === 0) {
          return res.status(404).json({ message: "No tournaments found", type: "info" });
      }

      // Map over tournaments to format date and add public prefix to tournamentImage
      const tournamentsWithImage = tournaments.map(tournament => {
          const formattedDate = tournament.date ? tournament.date.toISOString().split('T')[0] : null; // Format the date

          return {
              ...tournament.toObject(), // Convert mongoose document to plain object
              tournamentImage: tournament.tournamentImage ? `/public/${tournament.tournamentImage}` : null, // Add prefix
              date: formattedDate // Add the formatted date
          };
      });

      res.status(200).json({
          message: "Tournaments retrieved successfully",
          type: "success",
          data: {
              tournaments: tournamentsWithImage,
              currentPage: pageNumber,
              totalPages: Math.ceil(totalTournaments / limitNumber),
              totalItems: totalTournaments,
          }
      });
  } catch (error) {
      res.status(500).json({ error: error.message, type: "error" });
  }
};

const getEveryTournaments = async (req, res) => {
  try {

      const tournaments = await Tournament.find()
    

      if (tournaments.length === 0) {
          return res.status(404).json({ message: "No tournaments found", type: "info" });
      }
    // Add public prefix to tournamentImage
    const updatedTournaments = tournaments.map(tournament => {
      return {
        ...tournament.toObject(), // Convert mongoose document to plain object
        tournamentImage: `public/${tournament.tournamentImage}` // Assuming you have a PUBLIC_URL in your environment variables
      };
    });

      res.status(200).json({
          message: "Tournaments retrieved successfully",
          type: "success",
          tournaments: updatedTournaments
      });
  } catch (error) {
      res.status(500).json({ error: error.message, type: "error" });
  }
};

const addPigeon = async (req, res) => {
  const userId = req.userId;

  try {
    // Check if the user exists
    const existingUser = await Users.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found", type: "error" });
    }

    // Check if user is an admin
    if (existingUser.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized", type: "error" });
    }

    // Extract fields from request body
    const { tournamentName, name, phone, city } = req.body;
    const pigeonAvatar = req.file ? `pigeonAvatar/${req.file.filename}` : null;

    // Validate required fields
    if (!tournamentName || !name || !phone || !city) {
      return res.status(400).json({ message: "All fields are required", type: "error" });
    }

    // Check if the tournament exists
    const tournament = await Tournament.findOne({ tournamentName });
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found", type: "error" });
    }

    // Create a new pigeon
    const newPigeon = new Pigeons({
      tournamentName,
      name,
      phone,
      city,
      pigeonAvatar,
    });

    // Save the new pigeon to the database
    await newPigeon.save();

    // Update the tournament to add the new participant's name
    await Tournament.findByIdAndUpdate(
      tournament._id, // Use the found tournament ID
      {
        $push: {
          participants: {
            member: newPigeon._id,
            userName: name, // Save the name of the pigeon (participant)
          },
        },
      },
      { new: true }
    );

    res.status(201).json({ message: "Pigeon added successfully and participant registered in tournament", type: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message, type: "error" });
  }
};


const addPigeonResult = async (req, res) => {
  const { tournamentName, name, startTime, numberOfPigeons, pigeonResults } = req.body;

  // Validate the request data
  if (!tournamentName || !name || !startTime || !numberOfPigeons || !pigeonResults) {
      return res.status(400).json({
          success: false,
          message: "Please provide all required fields"
      });
  }

  // Ensure pigeonResults is formatted correctly
  const formattedResults = pigeonResults.map(item => ({
      date: item.date,
      results: item.results // Assuming results is already structured correctly
  }));

  const newPigeon = new PigeonsResults({
      tournamentName,
      name,
      startTime,
      numberOfPigeons,
      pigeonResults: formattedResults
  });

  try {
      const savedPigeon = await newPigeon.save();
      res.status(201).json({
          success: true,
          data: savedPigeon
      });
  } catch (error) {
      console.error("Error creating pigeon:", error);
      if (error.name === 'ValidationError') {
          console.error("Validation errors:", error.errors);
      }
      res.status(500).json({
          success: false,
          message: "Server error"
      });
  }
};

const getPigeonResult = async (req,res)=>{
  try {
    const pigeonResults = await PigeonsResults.find();
    if (!pigeonResults) {
      return res.status(404).json({ message: "Pigeon not found", type: "error" });
    }
    res.status(200).json({ message: "Pigeon result retrieved successfully", type: "success", data: pigeonResults });
  } catch (error) {
    res.status(500).json({ error: error.message, type: "error" });
  }
}

module.exports = {
  role,
  registerUser,
  loginUser,
  logoutUser,
  userProfile,
  header,
  getheader,
  addClub,
  getAllClubs,
  getClubs,
  addTournament,
  getAllTournaments,
  getEveryTournaments,
  addPigeon,
  addPigeonResult,
  getPigeonResult,  
};
