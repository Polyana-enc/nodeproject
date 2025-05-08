//KURMAX CODE ඞ
const fs = require("fs").promises;
const DtoInvite = require("../models/invite_model.js");
const MOCK_INVITES = "../nodeproject/src/mock/invite.json";

let invites = [];
/**
 * Deserializes all invites in JSON
 */
async function deserialize_all_invites() {
  const data = await fs.readFile(MOCK_INVITES, "utf8");
  const array = JSON.parse(data);
  invites = array.map((el) => {
    return new DtoInvite(
      el.id,
      el.sender_id,
      el.receiver_id,
      el.status,
      el.created_at,
    );
  });
}
/**
 * Serializes all invites in JSON
 */
async function serialize_all_invites() {
  await fs.writeFile(MOCK_INVITES, JSON.stringify(invites, null, 2), "utf8");
}
/**
 * Creates invite by data
 * @param {object} data {sender_id, receiver_id, created_at}
 * @returns {DtoInvite} created invite
 */
async function create_invite(data) {
  const newId =
    invites.length > 0 ? Math.max(...invites.map((u) => u.id)) + 1 : 1;
  if (get_all_invites_by_sender_id(data.sender_id).find((el) => el.receiver_id === data.receiver_id))
    throw new Error("Invite to this user already sent");
  if (data.sender_id === data.receiver_id) throw new Error(`Invalid receiver id:${data.receiver_id}`);
  const new_invite = new DtoInvite(
    newId,
    data.sender_id,
    data.receiver_id,
    "pending",
    data.created_at,
  );
  invites.push(new_invite);
  await serialize_all_invites();
  return new_invite;
}
/**
 * Returns id and undefined otherwise
 * @param {number} id invite id
 * @returns {DtoInvite} found invite
 */
function get_invite_by_id(id) {
  return invites.find((el) => el.id === id);
}
/**
 * Returns invite by sender id and undefined otherwise
 * @param {number} sender_id invite sender id
 * @returns {DtoInvite} found invite
 */
function get_invite_by_sender_id(sender_id) {
  return invites.find((el) => el.sender_id === sender_id);
}
/**
 * Returns invite by receiver id and undefined otherwise
 * @param {number} receiver_id invite receiver id
 * @returns {DtoInvite} found invite
 */
function get_invite_by_receiver_id(receiver_id) {
  return invites.find((el) => el.receiver_id === receiver_id);
}
/**
 * Returns all invites by sender id
 * @param {number} sender_id invite sender id
 * @returns {DtoInvite[]} found invites array
 */
function get_all_invites_by_sender_id(sender_id) {
  return invites.filter((el) => el.sender_id === sender_id);
}
/**
 * Returns all invites by receiver id
 * @param {number} receiver_id invite receiver id
 * @returns {DtoInvite[]} found invites array
 */
function get_all_invites_by_receiver_id(receiver_id) {
  return invites.filter((el) => el.receiver_id === receiver_id);
}
/**
 * Deletes invite (if it exists) by id
 * @param {number} invite_id invite id
 */
async function delete_invite_by_id(invite_id) {
  const invite = get_invite_by_id(invite_id);
  if (invite === undefined) {
    throw new Error(
      `Trying to delete non-existent invite, invite_id:${invite_id}`,
    );
  }
  invites.splice(invite.id - 1, 1);
  await serialize_all_invites();
}
/**
 * Deletes invite (if it exists) by sender_id
 * @param {number} sender_id invite sender id
 */
async function delete_invite_by_sender_id(sender_id) {
  const invite = get_invite_by_sender_id(sender_id);
  if (invite === undefined) {
    throw new Error(
      `Trying to delete non-existent invite, sender_id:${sender_id}`,
    );
  }
  invites.splice(invite.id - 1, 1);
  await serialize_all_invites();
}
/**
 * Sets invite status by id
 * @param {number} id invite id
 * @param {'accepted' | 'rejected'} status invite status
 */
function set_invite_status_by_id(id, status) {
  const invite = get_invite_by_id(id);
  if (invite === undefined) {
    throw new Error(`Trying to set status to non-existent invite, id:${id}`);
  }
  invite.status = status;
  serialize_all_invites();
}
/**
 * Sets invite status by sender id
 * @param {number} sender_id
 * @param {'accepted' | 'rejected'} status
 */
function set_invite_status_by_sender_id(sender_id, status) {
  const invite = get_invite_by_sender_id(sender_id);
  if (invite === undefined) {
    throw new Error(
      `Trying to set status to non-existent invite, sender_id:${sender_id}`,
    );
  }
  invite.status = status;
  serialize_all_invites();
} /**
 * Sets invite status by receiver id
 * @param {number} receiver_id
 * @param {'accepted' | 'rejected'} status
 */
function set_invite_status_by_receiver_id(receiver_id, status) {
  const invite = get_invite_by_receiver_id(receiver_id);
  if (invite === undefined) {
    throw new Error(
      `Trying to set status to non-existent invite, receiver_id:${receiver_id}`,
    );
  }
  invite.status = status;
  serialize_all_invites();
}

module.exports = {
  deserialize_all_invites,
  serialize_all_invites,
  create_invite,
  get_invite_by_id,
  get_invite_by_sender_id,
  get_invite_by_receiver_id,
  get_all_invites_by_sender_id,
  get_all_invites_by_receiver_id,
  delete_invite_by_id,
  delete_invite_by_sender_id,
  set_invite_status_by_id,
  set_invite_status_by_sender_id,
  set_invite_status_by_receiver_id,
};
