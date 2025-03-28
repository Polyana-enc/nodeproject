//KURMAX CODE ඞ
const fs = require("fs").promises;
const DtoForm = require("../models/form_model.js");
const MOCK_FORMS = "../nodeproject/src/mock/forms.json";

let forms = [];
/**
 * Deserializes all forms in JSON
 */
async function deserialize_all_forms() {
  const data = await fs.readFile(MOCK_FORMS, "utf8");
  const array = JSON.parse(data);
  forms = array.map((el) => {
    return new DtoForm(
      el.id,
      el.user_id,
      el.name,
      el.age,
      el.gender,
      el.city,
      el.bio,
      el.email,
      el.phone,
    );
  });
}
/**
 * Serializes all forms in JSON
 */
async function serialize_all_forms() {
  await fs.writeFile(MOCK_FORMS, JSON.stringify(forms, null, 2), "utf8");
}
/**
 * Creates new form by data 
 * @param {object} data {user_id, name, age, gender, city, bio, email, phone,}
 * @returns {DtoForm} created form
 */
async function create_form(data) {
  const newId = forms.length > 0 ? Math.max(...forms.map((u) => u.id)) + 1 : 1;
  if (forms.find((el) => el.user_id === data.user_id)) return null;
  const new_form = new DtoForm(
    newId,
    data.user_id,
    data.name,
    data.age,
    data.gender,
    data.city,
    data.bio,
    data.email,
    data.phone,
  );
  forms.push(new_form);
  await serialize_all_forms();
  return new_form;
}
/**
 * Returns form by user id and undefined otherwise
 * @param {number} user_id form user id
 * @returns {DtoForm} found form
 */
function get_form_by_user_id(user_id) {
  return forms.find((el) => el.user_id === user_id);
}
/**
 * Returns form by id and undefined otherwise
 * @param {number} id form id
 * @returns {DtoForm} found form
 */
function get_form_by_id(id) {
  return forms.find((el) => el.id === id);
}
/**
 * Deletes form (if it exists) by its id
 * @param {number} id form id
 */
async function delete_form_by_id(id) {
  const form_index = forms.findIndex((el) => el.id === Number(id));
  if (form_index === -1) {
    throw new Error(`Trying to delete non-existent form, id:${id}`);
  }
  forms.splice(id - 1, 1);
  await serialize_all_forms();
}
/**
 * Deletes form (if it exists) by its user id
 * @param {number} user_id form user id
 */
async function delete_form_by_user_id(user_id) {
  const form = get_form_by_user_id(user_id);
  await delete_form_by_id(form.id);
}
/**
 * Updates form (if it exists) information by id and otherwise returns null
 * @param {number} id form id
 * @param {object} data {name, age, gender, city, bio, email, phone}
 * @returns {DtoForm} updated form
 */
function update_form_by_id(id, data){
  const form = get_form_by_id(id);
  if (!form) return null
  form.name = data.name
  form.age = data.age;
  form.gender = data.gender;
  form.city = data.city;
  form.bio = data.bio;
  form.email = data.email;
  form.phone = data.phone
  serialize_all_forms()
  return form
}
/**
 * Updates form (if it exists) information by user id and otherwise returns null
 * @param {number} user_id form user id
 * @param {object} data {name, age, gender, city, bio, email, phone}
 * @returns {DtoForm} updated form
 */
function update_form_by_user_id(user_id, data){
  const form = get_form_by_user_id(user_id);
  if (!form) return null
  form.age = data.age;
  form.bio = data.bio;
  form.city = data.city;
  form.gender = data.gender;
  form.email = data.email;
  form.phone = data.phone
  serialize_all_forms()
  return form
}

module.exports = {
  serialize_all_forms,
  deserialize_all_forms,
  create_form,
  get_form_by_user_id,
  get_form_by_id,
  delete_form_by_id,
  delete_form_by_user_id,
  update_form_by_id,
  update_form_by_user_id
};
