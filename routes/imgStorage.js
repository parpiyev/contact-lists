const path = require("path");
const multer = require("multer");

// rasmdi qaysi faylga saqlashligi
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.png`);
  },
});

// foydalanuvchi rasm yubor yatganini tekshirish
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// rasm olchami
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

exports.images = upload.fields([
  { name: "photo", maxCount: 2 },
  { name: "image", maxCount: 2 },
]);
