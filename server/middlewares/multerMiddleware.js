const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Define allowed mime types for each file type
const allowedMimeTypes = {
  banners: ["image/jpeg", "image/png"],
  avatar: ["image/jpeg", "image/png"],
  tournamentImage: ["image/jpeg", "image/png"],
  pigeonAvatar: ["image/jpeg", "image/png"],
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.userId;
    let destinationPath;

    switch (file.fieldname) {
      case "banners":
        destinationPath = `./public/banners/`;
        break;
        case "avatar":
          destinationPath = `./public/avatar/`;
          break;
        case "tournamentImage":
          destinationPath = `./public/tournamentImage/`;
          break;
          case "pigeonAvatar":
          destinationPath = `./public/pigeonAvatar/`;
          break;
        // Add more file types as needed...
      default:
        return cb(new Error("Invalid fieldname"));
    }

    fs.mkdirSync(destinationPath, { recursive: true });
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const uuid = uuidv4().substr(0, 6); // Generate 6-digit UUID
    const fileExtension = originalName.split(".").pop(); // Get the file extension from the original name
    const originalFileName = originalName.replace(`.${fileExtension}`, ""); // Remove extension from original name
    const fileName = `${originalFileName}-${uuid}.${fileExtension}`; // Construct filename
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    allowedMimeTypes[file.fieldname] &&
    allowedMimeTypes[file.fieldname].includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported"));
  }
};


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1000, // Example limit: 1GB
  },
  fileFilter: fileFilter,
});

// Change to allow multiple file uploads
const uploadMultiple = upload.array("banners", 5); 
const uploadAvatar = upload.single("avatar");
const uploadtournamentImage = upload.single("tournamentImage");
const uploadPigeonAvatar = upload.single("pigeonAvatar");
module.exports = {uploadMultiple,uploadAvatar,uploadtournamentImage,uploadPigeonAvatar};
