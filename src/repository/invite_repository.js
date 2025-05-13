//KURMAX CODE ඞ
const Invite = require("../models/invite_model.js");
const sequelize = require("../../db.js");

/**
 * Creates a new invite
 * @param {Object} data {sender_id, receiver_id, created_at}
 * @returns {Promise<Invite>}
 */
async function create_invite(data) {
  if (data.sender_id === data.receiver_id) {
    throw new Error(`Invalid receiver_id: ${data.receiver_id}`);
  }

  return await sequelize.transaction(async (t) => {
    const existing = await Invite.findOne({
      where: {
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
      },
      transaction: t,
    });

    if (existing) {
      throw new Error("Invite to this user already sent");
    }

    const invite = await Invite.create(
      {
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        status: "pending",
        created_at: data.created_at,
      },
      { transaction: t },
    );

    return invite;
  });
}
/**
 * Returns invite by id or null
 * @param {number} id
 * @returns {Promise<Invite|null>}
 */
async function get_invite_by_id(id) {
  return await Invite.findByPk(id);
}
/**
 * Returns all invites by sender id
 * @param {number} sender_id
 * @returns {Promise<Invite[]>}
 */
async function get_all_invites_by_sender_id(sender_id) {
  return await Invite.findAll({ where: { sender_id } });
}
/**
 * Returns all invites by receiver id
 * @param {number} receiver_id
 * @returns {Promise<Invite[]>}
 */
async function get_all_invites_by_receiver_id(receiver_id) {
  return await Invite.findAll({ where: { receiver_id } });
}
/**
 * Sets invite status by id
 * @param {number} id
 * @param {'accepted' | 'rejected'} status
 * @returns {Promise<Invite>}
 */
async function set_invite_status_by_id(id, status) {
  return await sequelize.transaction(async (t) => {
    const invite = await Invite.findByPk(id, { transaction: t });
    if (!invite) {
      throw new Error(`Invite with id=${id} does not exist`);
    }

    await invite.update({ status }, { transaction: t });
    return invite;
  });
}
/**
 * Deletes invite by id
 * @param {number} id
 * @returns {Promise<Invite>}
 */
async function delete_invite_by_id(id) {
  return await sequelize.transaction(async (t) => {
    const invite = await Invite.findByPk(id, { transaction: t });
    if (!invite) {
      throw new Error(`Invite with id=${id} does not exist`);
    }

    await invite.destroy({ transaction: t });
    return invite;
  });
}

module.exports = {
  create_invite,
  get_invite_by_id,
  get_all_invites_by_sender_id,
  get_all_invites_by_receiver_id,
  delete_invite_by_id,
  set_invite_status_by_id,
};
