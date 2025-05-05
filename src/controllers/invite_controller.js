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
      logger.error("Invalid form data");
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!get_user_by_id(sender_id)) {
      return res.status(400).json({ message: "Sender not found" });
    }
    if (!get_user_by_id(Number(receiver_id))) {
      return res.status(400).json({ message: "Receiver not found" });
    }
    const created_date = new Date();
    const formatted_date = created_date.toISOString();
    const invite = await create_invite({ sender_id: sender_id, receiver_id: receiver_id, created_at: formatted_date });
    res.status(200).json({ invite: invite });
  } catch (err) {
    logger.error(err);
    return res.status(400).json({ message: err });
  }
}

function getInviteById(req, res) {
  try {
    const invite_id = Number(req.params.invite_id);
    const invite = get_invite_by_id(invite_id);
    if (!invite) return res.status(404).json({ message: "Invite not found" });

    res.status(200).json({ invite: invite });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
function getAllInvitesBySenderId(req, res) {
  try {
    const sender_id = Number(req.params.sender_id);
    const invite = get_all_invites_by_sender_id(sender_id);

    res.status(200).json({ invites: invite });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: err });
  }
}

function getAllInvitesByReceiverId(req, res) {
  try {
    const receiver_id = Number(req.params.receiver_id);
    const invite = get_all_invites_by_receiver_id(receiver_id);

    res.status(200).json({ invites: invite });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: err });
  }
}

async function deleteInviteById(req, res) {
  try {
    const invite_id = Number(req.params.invite_id);
    await delete_invite_by_id(invite_id);
    res.status(200).json({ message: "Invite deleted successfully" });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: err });
  }
}

function acceptInviteById(req, res) {
  try {
    set_invite_status_by_id(Number(req.params.invite_id), "accepted");
    res.status(200).json({ message: "Invite accepted successfully" });
  } catch (err) {
    logger.error(err);
    return res.status(400).json({ message: err });
  }
}

function rejectInviteById(req, res) {
  try {
    set_invite_status_by_id(Number(req.params.invite_id), "rejected");
    res.status(200).json({ message: "Invite rejected successfully" });
  } catch (err) {
    logger.error(err);
    return res.status(400).json({ message: err });
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
