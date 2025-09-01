const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Buyurtmalar fayli
const ordersFile = __dirname + "/../data/orders.json";

// Buyurtmalarni olish
app.get("/api/orders", (req, res) => {
  fs.readFile(ordersFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Faylni o‘qib bo‘lmadi" });
    const orders = JSON.parse(data || "[]");
    res.json(orders);
  });
});

// Buyurtma qo‘shish
app.post("/api/orders", (req, res) => {
  const newOrder = req.body;

  fs.readFile(ordersFile, "utf8", (err, data) => {
    let orders = [];
    if (!err && data) orders = JSON.parse(data);

    // Sana qo‘shib yuboramiz
    newOrder.date = new Date().toLocaleString("uz-UZ");

    orders.push(newOrder);

    fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Saqlashda xatolik" });
      res.status(201).json(newOrder);
    });
  });
});

// Serverni ishga tushirish
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} da ishlayapti`);
});
