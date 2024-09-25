const express = require("express");
const routes = express.Router();
const controller = require("../controllers/userCtrl.js");
const { uploadMultiple, uploadclubAvatar } = require('../middlewares/multerMiddleware.js');
const verifyToken = require("../middlewares/authMiddleware.js");
const verifyAdmin = require("../middlewares/verifyAdmin.js");

// Getting Routes
routes.get("/profile", verifyToken, controller.userProfile);
routes.get("/header", controller.getheader);
routes.get("/all-clubs", controller.getAllClubs);

// Posting Routes
routes.post("/set-role", controller.role);
routes.post("/register", controller.registerUser);
routes.post("/login", controller.loginUser);
routes.post("/logout", verifyToken, controller.logoutUser);
routes.post("/upload-banner", verifyToken, verifyAdmin, uploadMultiple, controller.header);
routes.post("/add-Club", verifyToken, verifyAdmin, uploadclubAvatar, controller.addClub);

module.exports = routes;
