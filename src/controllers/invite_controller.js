const express = require("express");
const router = express.Router();
const { get_all_invites, add_invite, update_invite_status } = require("../service/invite_service");
const authMiddleware = require("../routes/middleware/auth");
const logger = require("../utils/logger");

router.get("/invites", authMiddleware, (req, res) => {
    const invites = get_all_invites();
    res.status(200).json(invites);
});

router.post("/invites", authMiddleware, (req, res) => {
    const { receiver_id } = req.body;
    if (!receiver_id) {
        return res.status(400).json({ message: "ID of the receiver is required" });
    }
    
    const sender_id = req.user_id;
    const new_invite = add_invite(sender_id, receiver_id);
    res.status(201).json(new_invite);
});

router.put("/invites", authMiddleware, (req, res) => {
    const { sender_id, status } = req.body;
    if (!sender_id || !["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid request data" });
    }
    
    const receiver_id = req.user_id;
    const updated_invite = update_invite_status(sender_id, receiver_id, status);
    if (!updated_invite) {
        return res.status(404).json({ message: "Invite not found" });
    }
    
    res.status(200).json(updated_invite);
});

module.exports = router;
