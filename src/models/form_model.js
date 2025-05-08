class DtoForm {
  constructor(id, user_id, name, age, gender, city, bio, email, phone) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.city = city;
    this.bio = bio;
    this.email = email;
    this.phone = phone;
  }
  open_info() {
    return {
      id: this.id,
      user_id: this.user_id,
      name: this.name,
      age: this.age,
      gender: this.gender,
      city: this.city,
      bio: this.bio,
    };
  }
  private_info() {
    return {
      id: this.id,
      email: this.email,
      phone: this.phone,
    };
  }
}

module.exports = DtoForm;
