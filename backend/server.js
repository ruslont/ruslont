const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 📩 Mail.ru konfiguratsiya
const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// 📩 Buyurtma yuborish marshruti
app.post('/order', (req, res) => {
    const { name, phone, service, date } = req.body;

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: 'ruslontoraboyev0@gmail.com', // buyurtmalar qabul qilinadigan email
        subject: '🛒 Yangi buyurtma',
        text: `
        Ism: ${name}
        Telefon: ${phone}
        Xizmat: ${service}
        Sana: ${date}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Xato:', error);
            return res.status(500).send('Buyurtma yuborilmadi');
        }
        console.log('✅ Xat yuborildi:', info.response);
        res.status(200).send('Buyurtma emailingizga yuborildi!');
    });
});

// 🚀 Serverni ishga tushirish
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} da ishlayapti`);
});
