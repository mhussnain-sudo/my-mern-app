const Users = require ('../models/userModel')

const verifyAdmin = async (req, res, next) => {
      const userId = req.userId
    try {
        const user = await Users.findById(userId);

        if (user && user.role === "admin") {
            next();
        } else {
            return res
                .status(403)
                .json({ message: "Insufficient permissions", success: false });
        }
    } catch (error) {
        console.error("Role verification error:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};

module.exports = verifyAdmin
