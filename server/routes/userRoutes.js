const express = require("express");
const routes = express.Router();
const controller = require("../controllers/userCtrl.js");
const { uploadMultiple, uploadclubAvatar,uploadtournamentImage, uploadPigeonAvatar } = require('../middlewares/multerMiddleware.js');
const verifyToken = require("../middlewares/authMiddleware.js");
const {verifyAdmin,verifysuperior} = require("../middlewares/verifyAdmin.js");

// Getting Routes
routes.get("/profile", verifyToken, controller.userProfile);
routes.get("/header", controller.getheader);
routes.get("/all-Clubs", controller.getAllClubs);
routes.get("/Clubs", controller.getClubs);
routes.get("/all-Tournaments", controller.getAllTournaments);
routes.get("/every-tournament", controller.getEveryTournaments);
routes.get("/every-pigeonResults", controller.getPigeonResult);

// Posting Routes
routes.post("/set-role", controller.role);
routes.post("/register", controller.registerUser);
routes.post("/login", controller.loginUser);
routes.post("/logout", verifyToken, controller.logoutUser);
routes.post("/upload-banner", verifyToken, verifyAdmin, uploadMultiple, controller.header);
routes.post("/add-Club", verifyToken, verifyAdmin, uploadclubAvatar, controller.addClub);
routes.post("/add-Tournament", verifyToken, verifyAdmin, uploadtournamentImage, controller.addTournament);
routes.post("/add-pigeon", verifyToken, verifysuperior, uploadPigeonAvatar, controller.addPigeon);
routes.post("/add-pigeonresults", verifyToken, verifysuperior, controller.addPigeonResult);
module.exports = routes;
