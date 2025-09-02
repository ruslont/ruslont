const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname>

// Agar fayl mavjud bo'lmasa, avtoma>
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.st>
}

// Barcha buyurtmalarni olish
const getOrders = (req, res) => {
  const orders = JSON.parse(fs.readF>
  res.json(orders);
};

// Yangi buyurtma qo'shish
const addOrder = (req, res) => {
  const orders = JSON.parse(fs.readF>
  const newOrder = {
    id: orders.length + 1,
    name: req.body.name,
    phone: req.body.phone,
    product: req.body.product,
    date: new Date().toLocaleString(>
  };
  orders.push(newOrder);
  fs.writeFileSync(dataFile, JSON.st>
  res.status(201).json(newOrder);
};
