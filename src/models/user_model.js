class DtoUser {
  constructor(id, email, password, created_at, updated_at) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  public_user() {
    return {
      id: this.id,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  private_user() {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = DtoUser;
