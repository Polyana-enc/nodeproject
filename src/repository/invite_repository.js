//KURMAX CODE ඞ
const DtoInvite = require("../models/invite_model.js");
const pool = require("../../db").default;
const withTransaction = require("../utils/withTransaction");

/**
 * Creates a new invite
 * @param {Object} data {sender_id, receiver_id, created_at}
 * @returns {DtoInvite} new invite
 */
async function create_invite(data) {
  if (data.sender_id === data.receiver_id) {
    throw new Error(`Invalid receiver_id: ${data.receiver_id}`);
  }
  return withTransaction(async (client) => {
    const existing = await client.query(
      "SELECT * FROM invites WHERE sender_id = $1 AND receiver_id = $2",
      [data.sender_id, data.receiver_id],
    );
    if (existing.rows.length > 0) {
      throw new Error("Invite to this user already sent");
    }

    const res = await client.query(
      `INSERT INTO invites (sender_id, receiver_id, status, created_at)
     VALUES ($1, $2, 'pending', $3)
     RETURNING *`,
      [data.sender_id, data.receiver_id, data.created_at],
    );

    return new DtoInvite(...Object.values(res.rows[0]));
  });
}
/**
 * Returns invite by id and null otherwise
 * @param {number} id invite id
 * @returns {DtoInvite|null} found invite or null if not found
 */
async function get_invite_by_id(id) {
  const res = await pool.query("SELECT * FROM invites WHERE id = $1", [id]);
  if (res.rows.length === 0) return null;
  return new DtoInvite(...Object.values(res.rows[0]));
}
/**
 * Returns all invites by sender id
 * @param {number} sender_id invite sender id
 * @returns {DtoInvite[]|[]} found invites array or [] if not found
 */
async function get_all_invites_by_sender_id(sender_id) {
  const res = await pool.query("SELECT * FROM invites WHERE sender_id = $1", [
    sender_id,
  ]);
  if (res.rows.length === 0) return [];
  return res.rows.map((row) => new DtoInvite(...Object.values(row)));
}
/**
 * Returns all invites by receiver id
 * @param {number} receiver_id invite receiver id
 * @returns {DtoInvite[]|[]} found invites array or [] if not found
 */
async function get_all_invites_by_receiver_id(receiver_id) {
  const res = await pool.query("SELECT * FROM invites WHERE receiver_id = $1", [
    receiver_id,
  ]);
  if (res.rows.length === 0) return [];
  return res.rows.map((row) => new DtoInvite(...Object.values(row)));
}
/**
 * Sets invite status by id
 * @param {number} id invite id
 * @param {'accepted' | 'rejected'} status invite status
 */
async function set_invite_status_by_id(id, status) {
   return withTransaction(async (client) => {
  const res = await client.query(
    "UPDATE invites SET status = $1 WHERE id = $2 RETURNING *",
    [status, id],
  );
  if (res.rows.length === 0) {
    throw new Error(`Invite with id=${id} does not exist`);
  }
  return new DtoInvite(...Object.values(res.rows[0]));})
}
/**
 * Deletes invite (if it exists) by id
 * @param {number} invite_id invite id
 * @returns {DtoInvite}
 */
async function delete_invite_by_id(invite_id) {
   return withTransaction(async (client) => {
  const res = await client.query(
    "DELETE FROM invites WHERE id = $1 RETURNING *",
    [id],
  );
  if (res.rows.length === 0) {
    throw new Error(`Invite with id=${id} does not exist`);
  }
  return new DtoInvite(...Object.values(res.rows[0]));})
}

module.exports = {
  create_invite,
  get_invite_by_id,
  get_all_invites_by_sender_id,
  get_all_invites_by_receiver_id,
  delete_invite_by_id,
  set_invite_status_by_id,
};
