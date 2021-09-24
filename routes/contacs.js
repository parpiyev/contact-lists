const fs = require("fs");
const path = require("path");
const router = require("express").Router();
const { img, imgDelete, main } = require("./function");
const { images } = require("./imgStorage");
const { validate } = require("../validatetion/validate");
const contacStorage = require("../storage/mongo/contacList");

router.get("/", async (req, res) => {
  try {
    const response = await contacStorage.getAll();
    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const contac = await contacStorage.get({ _id: req.params.id });

    return res.json({ success: true, contac });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

router.post("/create", images, async (req, res) => {
  try {
    const { error } = await validate(req.body);
    if (error) throw new Error(error.message);
    main()

    let photos = [];
    let images = [];
    let fileArr = Object.values(req.files);
    for (const iterator of fileArr) {
      for (const value of iterator) {
        console.log(value.size * 1024)
        if (value.fieldname == "photo")
          photos.push(`/api/file/${value.filename}`);
        else images.push(`/api/file/${value.filename}`);
      }
    }

    const { firstName, lastName, description, phone } = req.body;

    await contacStorage.create({
      firstName,
      lastName,
      description,
      photo: photos,
      image: images,
      phone,
    });

    img();
    return res.status(201).json({ success: true, message: "Contac created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/update/:id", images, async (req, res) => {
  try {
    const { error } = await validate(req.body);
    if (error) throw new Error(error.message);

    imgDelete(req.params.id);

    let photos = [];
    let images = [];
    let fileArr = Object.values(req.files);
    for (const iterator of fileArr) {
      for (const value of iterator) {
        if (value.fieldname == "photo")
          photos.push(`/api/file/${value.filename}`);
        else images.push(`/api/file/${value.filename}`);
      }
    }

    await contacStorage.update(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      photo: photos,
      image: images,
    });

    img();
    return res.status(200).json({ success: true, message: "Contac updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    imgDelete(req.params.id);

    await contacStorage.delete(req.params.id);

    res.status(200).json({ success: true, message: "Contac deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
