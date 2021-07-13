const express = require('express');
const router = express.Router();
const contacStorage = require('../storage/mongo/contacList');
const multer = require('multer');
const path = require('path');
const { validate } = require('../validatetion/validate');


// contaclarni barchsini ko'rish uchun 
router.get('/', async(req, res) => {
    try {
        const response = await contacStorage.getAll()
        return res.status(200).json({ response });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

// // rasmdi qaysi faylga saqlashligi
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../', 'uploads'));
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.png`);
    }
});

// foydalanuvchi rasm yubor yatganini tekshirish
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// rasm olchami
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// yangi contac qoshish
router.post('/create', upload.array('images', 10), async(req, res) => {
    try {

        const { error } = await validate(req.body);
        if (error) {
            throw new Error(error.message);
        }


        let photos = []

        for (let photo of req.files) {
            photos.push(`/api/file/${photo.filename}`)
        }

        const { firstName, lastName, description, phone } = req.body
        await contacStorage.create({
            fullName: {
                firstName,
                lastName
            },
            description,
            photo: photos,
            phone
        });
        return res.status(201).json({ success: true, message: "Contac created" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// bitta contacni idsi boyicha olish
router.get('/:id', async(req, res) => {
    try {
        const contac = await contacStorage.get({ _id: req.params.id });
        return res.json({ success: true, contac });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
});

// contacni name ozgartirish 
router.patch('/update/:id', async(req, res) => {
    try {

        const { error } = await validate(req.body);
        if (error) {
            throw new Error(error.message);
        }

        await contacStorage.update(req.params.id, { fullName: { firstName: req.body.firstName, lastName: req.body.lastName }, phone: req.body.phone }, {
            new: true
        });

        return res.status(200).json({ success: true, message: "Contac updated" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// contacni o'chirib yuborish
router.delete('/delete/:id', async(req, res) => {
    try {
        await contacStorage.delete(req.params.id);
        res.status(200).json({ success: true, message: "Contac deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;