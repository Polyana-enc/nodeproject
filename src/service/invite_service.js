const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");
const invitesFilePath = path.join(__dirname, "../mock/invite.json");

function get_all_invites() {
    try {
        const data = fs.readFileSync(invitesFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        logger.error("Error with the reading of the invites file", error);
        return [];
    }
}

function add_invite(sender_id, receiver_id) {
    const invites = get_all_invites();
    const new_invite = { sender_id, receiver_id, status: "pending", timestamp: new Date().toISOString() };
    invites.push(new_invite);
    
    fs.writeFileSync(invitesFilePath, JSON.stringify(invites, null, 2));
    logger.info(`A new invite from ${sender_id} to ${receiver_id}`);
    return new_invite;
}

function update_invite_status(sender_id, receiver_id, status) {
    const invites = get_all_invites();
    const invite = invites.find(inv => inv.sender_id === sender_id && inv.receiver_id === receiver_id);
    if (invite) {
        invite.status = status;
        invite.updated_at = new Date().toISOString();
        fs.writeFileSync(invitesFilePath, JSON.stringify(invites, null, 2));
        logger.info(`Invite updated: ${sender_id} -> ${receiver_id}, status: ${status}`);
        return invite;
    }
    return null;
}

module.exports = {
    get_all_invites,
    add_invite,
    update_invite_status
};
