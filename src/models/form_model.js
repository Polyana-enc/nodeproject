const { DataTypes } = require("sequelize");
const sequelize = require("../../db.js");
const User = require("./user_model.js");

const Form = sequelize.define(
  "Form",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    city: DataTypes.STRING,
    bio: DataTypes.TEXT,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
  },
  {
    tableName: "forms",
    timestamps: false,
  },
);

User.hasOne(Form, { foreignKey: "user_id" });
Form.belongsTo(User, { foreignKey: "user_id" });

module.exports =  Form;

// class DtoForm {
//   constructor(id, user_id, name, age, gender, city, bio, email, phone) {
//     this.id = id;
//     this.user_id = user_id;
//     this.name = name;
//     this.age = age;
//     this.gender = gender;
//     this.city = city;
//     this.bio = bio;
//     this.email = email;
//     this.phone = phone;
//   }
//   open_info() {
//     return {
//       id: this.id,
//       user_id: this.user_id,
//       name: this.name,
//       age: this.age,
//       gender: this.gender,
//       city: this.city,
//       bio: this.bio,
//     };
//   }
//   private_info() {
//     return {
//       id: this.id,
//       email: this.email,
//       phone: this.phone,
//     };
//   }
// }

// module.exports = DtoForm;
