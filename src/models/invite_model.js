const { DataTypes } = require("sequelize");
const sequelize = require("../../db.js");
const User = require("./user_model.js");

const Invite = sequelize.define(
  "Invite",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "invites",
    timestamps: false,
  },
);

Invite.belongsTo(User, { as: "Sender", foreignKey: "sender_id" });
Invite.belongsTo(User, { as: "Receiver", foreignKey: "receiver_id" });

module.exports = Invite;
