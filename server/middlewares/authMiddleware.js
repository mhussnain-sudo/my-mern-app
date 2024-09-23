const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;
const verifyToken = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new Error("Unauthorized.......");
        }
        const tokenParts = req.headers.authorization.split(" ");

        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            throw new Error("Unauthorized...Bearer not found");
        }

        const token = tokenParts[1];

        const decodedToken = jwt.verify(token, secretKey);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: error.message, type: "error" });
    }
};

module.exports = verifyToken;
