const express = require('express');
const contacRoure = require('./routes/contacs');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

mongoose.connect('mongodb://localhost/Contacs', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('MongoDBga ulanish hosil qilindi...');
    })
    .catch((err) => {
        console.error('MongoDBga ulanish vaqtida xato ro\'y berdi...', err);
    });
mongoose.set('useFindAndModify', false);

app.use(express.json());
app.use('/contac', contacRoure);
app.use("/api/file", express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 5500;

app.listen(port, () => {
    console.log(`${port}chi portni eshitishni boshladim...`);
});