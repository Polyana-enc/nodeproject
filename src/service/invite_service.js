const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");
const invitesFilePath = path.join(__dirname, "../mock/invite.json");

function get_all_invites() {
    return new Promise((resolve, reject) => {
        fs.readFile(invitesFilePath, "utf-8", (err, data) => {
            if (err) {
                logger.error("Error reading invites file", err);
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

function add_invite(sender_id, receiver_id) {
    return new Promise((resolve, reject) => {
        get_all_invites()
            .then((invites) => {
                const new_invite = { sender_id, receiver_id, status: "pending", timestamp: new Date().toISOString() };
                invites.push(new_invite);
                fs.writeFile(invitesFilePath, JSON.stringify(invites, null, 2), (err) => {
                    if (err) {
                        logger.error("Error writing to invites file", err);
                        reject(err);
                    } else {
                        resolve(new_invite);
                    }
                });
            })
            .catch((err) => reject(err));
    });
}

function update_invite_status(sender_id, receiver_id, status) {
    return new Promise((resolve, reject) => {
        get_all_invites()
            .then((invites) => {
                const invite = invites.find((inv) => inv.sender_id === sender_id && inv.receiver_id === receiver_id);
                if (invite) {
                    invite.status = status;
                    invite.updated_at = new Date().toISOString();
                    fs.writeFile(invitesFilePath, JSON.stringify(invites, null, 2), (err) => {
                        if (err) {
                            logger.error("Error updating invite status", err);
                            reject(err);
                        } else {
                            resolve(invite);
                        }
                    });
                } else {
                    reject(new Error("Invite not found"));
                }
            })
            .catch((err) => reject(err));
    });
}

module.exports = {
    get_all_invites,
    add_invite,
    update_invite_status
};
