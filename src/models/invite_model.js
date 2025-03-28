class DtoInvite {
  constructor(id, sender_id, receiver_id, status, created_at) {
    this.id = id;
    this.sender_id = sender_id;
    this.receiver_id = receiver_id;
    this.status = status
    this.created_at = created_at;
  }
}

module.exports = DtoInvite