const logger = require("../utils/logger");
const {
  create_form,
  get_form_by_user_id,
  update_form_by_id,
  delete_form_by_id,
  delete_form_by_user_id,
  get_form_by_id,
} = require("../repository/form_repository");
const { get_user_by_id } = require("../repository/user_repository");
const service = require("../service/form_service");

async function createForm(req, res, next) {
  try {
    const data = req.body;
    // check input data
    const { name, age, gender, city, bio, email, phone } = data;
    if (!name || !age || !gender || !city || !bio || !email || !phone) {
      logger.error("Invalid form data");
      return res.status(400).json({ message: "All fields are required" });
    }
    // check is user present
    if (get_user_by_id(req.user_id) === null) {
      return res.status(400).json({ message: "User not found" });
    }
    const form = await create_form({ ...data, user_id: req.user_id });
    if(form === null) return res.status(400).json({ message: "User already have form" });
    res.status(200).json({ form: form });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getFormById(req, res, next) {
  try {
    const form_id = Number(req.params.form_id);
    const form = await get_form_by_id(form_id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    res.status(200).json({ form: form });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Get shorter form info by provided type
 */
async function getInfoById(req, res, next) {
  try {
    
    const { form_id, type } = req.params;
    const form = await service.getFormById(form_id, type);
        if (!form) return res.status(404).json({ message: "Form not found" });

    res.status(200).json({ form: form });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getFormByUserId(req, res, next) {
  try {
    const form_id = req.user_id;
    const form = get_form_by_user_id(form_id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    res.status(200).json({ form: form });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
/**
 * Get shorter form info for provided user by provided type
 */
async function getInfoByUserId(req, res, next) {
  try {
    const form_id = req.query.user_id;
    const form = await service.getFormByUserId(form_id, req.params.type);
    if (!form) return res.status(404).json({ message: "Form not found" });

    res.status(200).json({ form: form });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateFormById(req, res, next) {
  try {
    const form = req.body
    const updatedForm = await update_form_by_id(form)
    res.status(200).json({ form: updatedForm });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteFormById(req, res, next) {
  try {
    await delete_form_by_id(req.params.form_id);

    res.status(200).json({ message: `Form deleted, ${req.params.form_id}` });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteFormByUserId(req, res, next) {
  try {
    await delete_form_by_user_id(req.user_id);

    res.status(200).json({ message: `Form deleted, id:${req.user_id}` });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getFormById,
  createForm,
  updateFormById,
  deleteFormById,
  deleteFormByUserId,
  getFormByUserId,
  getInfoById,
  getInfoByUserId,
};
