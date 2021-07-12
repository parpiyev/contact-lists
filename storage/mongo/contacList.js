const { Contac, validate } = require('../../Contac-list/models/contac-list');

let contacStorage = {
    create: async(data) => {
        console.log(data);
        const { value, error } = await validate(data);

        if (error) {
            throw new Error(error.message);
        }

        try {
            const contac = new Contac(data);
            const res = await contac.save();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    update: async(id, data) => {
        const { value, error } = await validate(data);

        if (error) {
            throw new Error(error.message);
        }

        try {
            const contac = await Contac.findOne({ _id: id });
            if (!contac) {
                throw new Error("Not found in database");
            }

            contac.fullName = data.fullName;
            contac.phone = data.phone;
            const res = await contac.save()

            return res.id;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    get: async(id) => {
        try {
            let contac = await Contac.findOne({ _id: id });

            if (!contac) {
                throw new Error("Not found in database");
            }

            return contac
        } catch (error) {
            throw new Error(error.message)
        }
    },

    delete: async(id) => {
        try {
            let contact = await Contac.findOneAndDelete({ _id: id });
            if (!contact) {
                throw new Error("Not found in database");
            }

            return "Contac deleted";
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getAll: async() => {
        try {
            const res = await Contac.find();
            return res;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

module.exports = contacStorage;