const express = require("express");
const router = express.Router();
const authMiddleware = require("../routes/middleware/auth");
const logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");

const privateInfoPath = path.join(__dirname, "../mock/private_info.json");
const invitesPath = path.join(__dirname, "../mock/invite.json");

router.get("/private-info/:userId", authMiddleware, async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user_id;

    try {
        const invites = await fs.promises.readFile(invitesPath, "utf-8");
        const parsedInvites = JSON.parse(invites);
        const validInvite = parsedInvites.find(inv => inv.sender_id === userId && inv.receiver_id === currentUserId && inv.status === "accepted");

        if (!validInvite) {
            return res.status(403).json({ message: "Access denied. No accepted invite found." });
        }

        const privateInfo = await fs.promises.readFile(privateInfoPath, "utf-8");
        const parsedPrivateInfo = JSON.parse(privateInfo);
        const userPrivateInfo = parsedPrivateInfo.find(info => info.user_id === userId);

        if (!userPrivateInfo) {
            return res.status(404).json({ message: "Private information not found." });
        }

        res.status(200).json(userPrivateInfo);
    } catch (error) {
        logger.error("Error fetching private info", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
