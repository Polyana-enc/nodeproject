class DtoInvite {
  constructor(id, from_user_id, to_user_id, status, created_at) {
    this.id = id;
    this.from_user_id = from_user_id;
    this.to_user_id = to_user_id;
    this.created_at = created_at;
  }
}

module.exports = DtoInvite