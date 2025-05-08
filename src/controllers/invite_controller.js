const logger = require("../utils/logger");
const {
  create_invite,
  get_invite_by_id,
  get_all_invites_by_sender_id,
  get_all_invites_by_receiver_id,
  delete_invite_by_id,
  set_invite_status_by_id,
} = require("../repository/invite_repository.js");
const { get_user_by_id } = require("../repository/user_repository");

async function createInvite(req, res) {
  try {
    const sender_id = req.user_id;
    const receiver_id = Number(req.params.receiver_id);

    if (!sender_id || !receiver_id) {
      logger.warn("Missing sender or receiver ID");
      return res.status(400).json({
        success: false,
        error: "Sender and receiver IDs are required",
      });
    }

    const sender = await get_user_by_id(sender_id);
    const receiver = await get_user_by_id(receiver_id);

    if (!sender) {
      return res.status(404).json({
        success: false,
        error: "Sender not found",
      });
    }

    if (!receiver) {
      return res.status(404).json({
        success: false,
        error: "Receiver not found",
      });
    }

    const created_date = new Date().toISOString();
    const invite = await create_invite({ sender_id, receiver_id, created_at: created_date });

    res.status(201).json({
      success: true,
      message: "Invite created successfully",
      data: { invite },
    });
  } catch (err) {
    logger.error("Create invite error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function getInviteById(req, res) {
  try {
    const invite_id = Number(req.params.invite_id);
    const invite = await get_invite_by_id(invite_id);

    if (!invite) {
      return res.status(404).json({
        success: false,
        error: "Invite not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { invite },
      message: "Invite retrieved successfully",
    });
  } catch (err) {
    logger.error("Get invite error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function getAllInvitesBySenderId(req, res) {
  try {
    const sender_id = Number(req.params.sender_id);
    const invites = await get_all_invites_by_sender_id(sender_id);

    res.status(200).json({
      success: true,
      data: { invites },
      message: "Invites retrieved successfully",
    });
  } catch (err) {
    logger.error("Get invites by sender error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function getAllInvitesByReceiverId(req, res) {
  try {
    const receiver_id = Number(req.params.receiver_id);
    const invites = await get_all_invites_by_receiver_id(receiver_id);

    res.status(200).json({
      success: true,
      data: { invites },
      message: "Invites retrieved successfully",
    });
  } catch (err) {
    logger.error("Get invites by receiver error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function deleteInviteById(req, res) {
  try {
    const invite_id = Number(req.params.invite_id);
    await delete_invite_by_id(invite_id);

    res.status(200).json({
      success: true,
      message: "Invite deleted successfully",
    });
  } catch (err) {
    logger.error("Delete invite error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function acceptInviteById(req, res) {
  try {
    await set_invite_status_by_id(Number(req.params.invite_id), "accepted");
    res.status(200).json({
      success: true,
      message: "Invite accepted successfully",
    });
  } catch (err) {
    logger.error("Accept invite error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function rejectInviteById(req, res) {
  try {
    await set_invite_status_by_id(Number(req.params.invite_id), "rejected");
    res.status(200).json({
      success: true,
      message: "Invite rejected successfully",
    });
  } catch (err) {
    logger.error("Reject invite error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

module.exports = {
  createInvite,
  getInviteById,
  getAllInvitesBySenderId,
  getAllInvitesByReceiverId,
  deleteInviteById,
  acceptInviteById,
  rejectInviteById,
};
