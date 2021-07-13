const { Contac, validate } = require('../../models/contac-list');

let contacStorage = {
    create: async(data) => {
        try {
            return await Contac.create({...data });
        } catch (error) {
            console.log(error)
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

    get: async(query) => {
        try {
            let contac = await Contac.findOne({...query });
            return contac
        } catch (error) {
            throw new Error(error.message)
        }
    },
    delete: async(query) => {
        try {
            let contact = await Contac.findOneAndDelete({...query });
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