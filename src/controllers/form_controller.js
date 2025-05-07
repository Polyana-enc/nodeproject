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
    const { name, age, gender, city, bio, email, phone } = data;

    if (!name || !age || !gender || !city || !bio || !email || !phone) {
      logger.warn("Invalid form data");
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const user = await get_user_by_id(req.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const form = await create_form({ ...data, user_id: req.user_id });
    if (form === null) {
      return res.status(409).json({
        success: false,
        error: "User already has a form",
      });
    }

    res.status(201).json({
      success: true,
      message: "Form created successfully",
      data: { form },
    });
  } catch (err) {
    logger.error("Create form error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function getFormById(req, res, next) {
  try {
    const form_id = Number(req.params.form_id);
    const form = await get_form_by_id(form_id);

    if (!form) {
      return res.status(404).json({
        success: false,
        error: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { form },
      message: "Form retrieved successfully",
    });
  } catch (err) {
    logger.error("Get form error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function getInfoById(req, res, next) {
  try {
    const { form_id, type } = req.params;
    const form = await service.getFormById(form_id, type);

    if (!form) {
      return res.status(404).json({
        success: false,
        error: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { form },
      message: "Form info retrieved successfully",
    });
  } catch (err) {
    logger.error("Get form info error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function getFormByUserId(req, res, next) {
  try {
    const form_id = req.user_id;
    const form = await get_form_by_user_id(form_id);

    if (!form) {
      return res.status(404).json({
        success: false,
        error: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { form },
      message: "Form retrieved successfully",
    });
  } catch (err) {
    logger.error("Get form by user ID error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function getInfoByUserId(req, res, next) {
  try {
    const form_id = req.query.user_id;
    const form = await service.getFormByUserId(form_id, req.params.type);

    if (!form) {
      return res.status(404).json({
        success: false,
        error: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { form },
      message: "Form info retrieved successfully",
    });
  } catch (err) {
    logger.error("Get form info by user ID error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function updateFormById(req, res, next) {
  try {
    const form = req.body;
    const updatedForm = await update_form_by_id(form);

    if (!updatedForm) {
      return res.status(404).json({
        success: false,
        error: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form updated successfully",
      data: { form: updatedForm },
    });
  } catch (err) {
    logger.error("Update form error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function deleteFormById(req, res, next) {
  try {
    const result = await delete_form_by_id(req.params.form_id);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Form with ID ${req.params.form_id} deleted successfully`,
    });
  } catch (err) {
    logger.error("Delete form error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function deleteFormByUserId(req, res, next) {
  try {
    const result = await delete_form_by_user_id(req.user_id);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Form for user ID ${req.user_id} deleted successfully`,
    });
  } catch (err) {
    logger.error("Delete form by user ID error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
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
