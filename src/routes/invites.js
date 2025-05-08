const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const router = express.Router();
const {
  createInvite,
  getInviteById,
  getAllInvitesBySenderId,
  getAllInvitesByReceiverId,
  deleteInviteById,
  acceptInviteById,
  rejectInviteById,
} = require("../controllers/invite_controller.js");

router.post("/invite/:receiver_id", authMiddleware, createInvite);
router.get("/invite/id/:invite_id", getInviteById);
router.get("/invite/sender/:sender_id", getAllInvitesBySenderId);
router.get("/invite/receiver/:receiver_id", getAllInvitesByReceiverId);
router.delete("/invite/:invite_id", deleteInviteById);
router.post("/invite/:invite_id/accept", acceptInviteById)
router.post("/invite/:invite_id/reject", rejectInviteById)

module.exports = router;