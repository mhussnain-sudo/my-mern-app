const express = require("express");
const routes = express.Router();
const controller = require("../controllers/userCtrl.js");
const upload = require("../middlewares/multerMiddleware.js");
const verifyToken = require("../middlewares/authMiddleware.js");
const verifyAdmin = require("../middlewares/verifyAdmin.js")


//Getting Routes
routes.get("/profile", verifyToken, controller.userProfile);
routes.get("/header",  controller.getheader);
routes.get("/all-clubs",  controller.getAllClubs);

//Posting Routes
routes.post("/set-role",controller.role);
routes.post("/register", controller.registerUser);
routes.post("/login", controller.loginUser);

routes.post("/upload-banner",verifyToken,verifyAdmin,upload.single("banner"),controller.header);


routes.post("/add-Clubs",verifyToken,verifyAdmin,controller.addClub);


module.exports = routes;
