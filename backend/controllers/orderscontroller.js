const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "../../data/orders.json");

// Agar fayl mavjud bo'lmasa, avtomatik yaratish
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}

// Barcha buyurtmalarni olish
const getOrders = (req, res) => {
  const orders = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
  res.json(orders);
};

// Yangi buyurtma qo'shish
const addOrder = (req, res) => {
  const orders = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
  const newOrder = {
    id: orders.length + 1,
    name: req.body.name,
    phone: req.body.phone,
    product: req.body.product,
    date: new Date().toLocaleString("uz-UZ")
  };
  orders.push(newOrder);
  fs.writeFileSync(dataFile, JSON.stringify(orders, null, 2));
  res.status(201).json(newOrder);
};

module.exports = { getOrders, addOrder };
