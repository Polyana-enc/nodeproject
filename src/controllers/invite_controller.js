const express = require("express");
const router = express.Router();
const { get_all_invites, add_invite, update_invite_status } = require("../service/invite_service");
const authMiddleware = require("../routes/middleware/auth");
const logger = require("../utils/logger");

router.get("/invites", authMiddleware, async (req, res) => {
    try {
        const invites = await get_all_invites();
        res.status(200).json(invites);
    } catch (error) {
        logger.error("Error fetching invites", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/invites", authMiddleware, async (req, res) => {
    const { receiver_id } = req.body;
    if (!receiver_id) {
        return res.status(400).json({ message: "Receiver ID is required" });
    }
    try {
        const sender_id = req.user_id;
        const new_invite = await add_invite(sender_id, receiver_id);
        res.status(201).json(new_invite);
    } catch (error) {
        logger.error("Error sending invite", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/invites", authMiddleware, async (req, res) => {
    const { sender_id, status } = req.body;
    if (!sender_id || !["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid request data" });
    }
    const receiver_id = req.user_id;
    try {
        const updated_invite = await update_invite_status(sender_id, receiver_id, status);
        if (!updated_invite) {
            return res.status(404).json({ message: "Invite not found" });
        }
        res.status(200).json(updated_invite);
    } catch (error) {
        logger.error("Error updating invite", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
