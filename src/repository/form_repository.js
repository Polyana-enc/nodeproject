//KURMAX CODE ඞ
const fs = require("fs").promises;
const DtoForm = require("../models/form_model.js");
const MOCK_FORMS = "../nodeproject/src/mock/forms.json";

let forms = [];
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

async function serialize_all_forms() {
  await fs.writeFile(MOCK_FORMS, JSON.stringify(forms, null, 2), "utf8");
}

async function create_form(data) {
  const newId = forms.length > 0 ? Math.max(...forms.map((u) => u.id)) + 1 : 1;
  if (forms.find((el) => el.user_id === data.user_id)) return null
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
 * 
 * @param {number} user_id 
 * @returns {DtoForm}
 */
function get_form_by_user_id(user_id) {
  return forms.find((el) => el.user_id === user_id);
}
/**
 * 
 * @param {number} id 
 * @returns {DtoForm}
 */
function get_form_by_id(id) {
  return forms.find((el) => el.id === id);
}

async function delete_form_by_id(id) {
    const form_index = forms.findIndex((el) => el.id === Number(id))
    if (form_index === -1){
        throw new Error(`Trying to delete non-existent form, id:${id}`)
    }
    forms.splice(id-1, 1)
    await serialize_all_forms();
}

async function delete_form_by_user_id(user_id) {
    const form = get_form_by_user_id(user_id)
    await delete_form_by_id(form.id)
}

module.exports = {
  serialize_all_forms,
  deserialize_all_forms,
  create_form,
  get_form_by_user_id,
  get_form_by_id,
  delete_form_by_id,
  delete_form_by_user_id,
};
