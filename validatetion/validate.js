const Joi = require('joi');

async function validateContac(contac) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string(),
        phone: Joi.number().required(),
        description: Joi.string(),
        photo: Joi.array()
    });
    return await schema.validateAsync(contac);
}

exports.validate = validateContac;