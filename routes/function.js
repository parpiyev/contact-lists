const fs = require("fs");
const path = require("path");
const contacStorage = require("../storage/mongo/contacList");

exports.img = async function img() {
    const contacs = await contacStorage.getAll();
    let userPhoto = [];
    let userImage = [];
    let storage = {};
    let _storage = {};

    let filePhoto = fs.readdirSync(path.join(__dirname, "../", "uploads"));
    contacs.forEach((element) => {
        element.photo.forEach((el) => {
            userPhoto.push(el.trim().split("/api/file/").pop());
        });
        element.image.forEach((el) => {
            userImage.push(el.trim().split("/api/file/").pop());
        });
    });

    for (let key of userPhoto) {
        storage[key] = 1
    }
    for (let key of userImage) {
        _storage[key] = 1
    }

    for (let i = 0; i < filePhoto.length; i++) {
        if (!storage[filePhoto[i]] && !_storage[filePhoto[i]]) {
            fs.unlink(path.join(__dirname, "../", "uploads", filePhoto[i]), (err) => {
                if (err) return err;
            });
        }
    }
};

exports.imgDelete = async function imgDelete(id) {
    const contac = await contacStorage.get(id);
    let userPhoto
    let userImage

    if (contac.photo.length > 0) {
        contac.photo.forEach((element) => {
            userPhoto = element.trim().split('/api/file/').pop()

            fs.unlink(path.join(__dirname, '../', 'uploads', userPhoto), (err) => {
                if (err) return err
            })
        })
    }
    if (contac.image.length > 0) {
        contac.image.forEach((element) => {
            userImage = element.trim().split('/api/file/').pop()

            fs.unlink(path.join(__dirname, '../', 'uploads', userImage), (err) => {
                if (err) return err
            })
        })
    }
}
