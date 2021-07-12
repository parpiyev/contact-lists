const Joi = require('joi');
const mongoose = require('mongoose');

const contacSchema = mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
        }
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    descripton: {
        type: String
    },
    photo: {
        type: String
    }
});

const Contac = mongoose.model('Contac', contacSchema);

async function validateContac(contac) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string(),
        phone: Joi.number().required(),
        descripton: Joi.string(),
        photo: Joi.string()
    });
    return await schema.validateAsync(contac);
}

exports.Contac = Contac;
exports.validate = validateContac;