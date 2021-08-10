const mongoose = require("mongoose");

const contacSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    photo: {
        type: Array,
    },
});

const Contac = mongoose.model("Contac", contacSchema);

exports.Contac = Contac;