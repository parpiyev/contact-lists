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

        try {
            const contac = await Contac.findByIdAndUpdate({ _id: id });
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
            let contac = await Contac.findOne({ id: id });
            return contac
        } catch (error) {
            throw new Error(error.message)
        }
    },
    delete: async(id, data) => {
        try {
            let contact = await Contac.findByIdAndDelete({ _id: id });
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