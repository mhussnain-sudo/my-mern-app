const mongoose = require("mongoose");
const Users = require("../models/userModel");
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
    const { ID, password } = req.body;
    const role = getRole();

    const existingUser = await Users.findOne({ ID });
    if (existingUser) {
      throw new Error("User with this ID already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new Users({ role, ID, password: hashPassword });
    await newUser.save();
    clearRole();
    res.status(200).json({ message: "Signup Successfully", type: "success" });
  } catch (error) {
    res.status(400).json({ message: error.message, type: "error" });
  }
};
//STEP 3 : login user
const loginUser = async (req, res) => {
  console.log("login working at back");
  try {
    const { ID, password } = req.body;
    const user = await Users.findOne({ ID });

    if (!user) {
      return res.status(401).json({ message: "ID incorrect", type: "error" });
    }

    // Check if user is a member
    if (user.role === "member") {
      // Directly compare the input password with the stored password
      if (password !== user.password) {
        return res.status(401).json({ message: "Password incorrect", type: "error" });
      }
    } else {
      // For other roles, check hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Password incorrect", type: "error" });
      }
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);
    const { password: _, ...userDetails } = user.toObject(); // Remove the password field

    res.status(200).json({
      message: "Login Successful",
      type: "success",
      token,
      user: userDetails,
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

    if (user.role === "member") {
      res.status(200).json({
        role: user.role,
        ID: user.ID,
      });
    } else if (user.role === "admin") {
      res.status(200).json({
        role:user.role,
        ID: user.ID,
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
const addMember = async (req, res) => {
  const userId = req.userId;

  try {
    const existingUser = await Users.findById(userId);

    // Check if user is an admin
    if (existingUser.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized", type: "error" });
    }

    const { ownerName,ID, password } = req.body;



    // Create a new club
    const newMember = new Users({
      ownerName,
      ID,
      password,
      avatar: req.file ? `avatar/${req.file.filename}` : null, // Save the filename from multer
    });

    // Save the new club to the database
    await newMember.save();

    res.status(201).json({ message: "Member added successfully", type: "success", Member: newMember });
  } catch (error) {
    res.status(500).json({ error: error.message, type: "error" });
  }
};


// Get All Members
const getAllMembers = async (req, res) => {
  try {
      const { page = 1, limit = 15 } = req.query;

      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;

      // Fetch members (excluding admins) with pagination
      const members = await Users.find({ role: 'member' }) // Filter out admins
        .skip(skip)
        .limit(limitNumber)
        .select(`ID ownerName password avatar`);

      const totalMembers = await Users.countDocuments({ role:'member' }); // Count only non-admin members

      if (members.length === 0) {
          return res.status(404).json({ message: "No Member found", type: "info" });
      }

      // Map over members to add public prefix to avatar
      const membersWithAvatar = members.map(member => ({
          ...member.toObject(), // Convert mongoose document to plain object
          Avatar: member.avatar ? `/public/${member.avatar}` : null, // Add prefix
      }));

      res.status(200).json({
          message: "Members retrieved successfully",
          type: "success",
          data: {
              members: membersWithAvatar,
              currentPage: pageNumber,
              totalPages: Math.ceil(totalMembers / limitNumber),
              totalItems: totalMembers,
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
      const updatedParticipants = tournament.participants.map(participant=>{
       return{
          ...participant.toObject(),
          avatar: participant.avatar?`public/${participant.avatar}`:null
};
});
      return {
        ...tournament.toObject(), // Convert mongoose document to plain object
        tournamentImage: `public/${tournament.tournamentImage}`, // Assuming you have a PUBLIC_URL in your environment variables
        participants:updatedParticipants
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
    if (!tournamentName || !name || !city) {
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
        phone,
        avatar:pigeonAvatar,
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
  const { tournamentName, name,startTime,numberOfPigeons, pigeonResults } = req.body; // Removed unused parameters

  if (!tournamentName || !name || !pigeonResults) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields"
    });
  }

  try {
    // Fetch the tournament using the tournamentName
    const tournament = await Tournament.findOne({ tournamentName });
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    const participant = tournament.participants.find(part => part.userName === name);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: `Participant ${name} not found in tournament`
      });
    }

    // Ensure pigeonResults is formatted correctly and include member ID
    const formattedResults = pigeonResults.map(item => ({
      date: item.date,
      results: item.results.map(res => ({
        ...res,
        member: participant.member // Add the member ID here
      }))
    }));

    const newPigeon = new PigeonsResults({
      tournamentName,
      name,
      startTime,
      numberOfPigeons,

      pigeonResults: formattedResults
    });

    console.log("New pigeon object before save:", newPigeon);

    const savedPigeon = await newPigeon.save();
    res.status(201).json({
      success: true,
      data: savedPigeon
    });
  } catch (error) {
    console.error("Error creating pigeon:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
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
  addMember,
  getAllMembers,
  addTournament,
  getAllTournaments,
  getEveryTournaments,
  addPigeon,
  addPigeonResult,
  getPigeonResult,  
};
