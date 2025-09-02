const express = require("express");
const router = express.Router();
const { getOrders, addOrder } = require("../controllers/ordersController");

// Buyurtmalar ro'yxati olish
router.get("/", getOrders);

// Yangi buyurtma qo'shish (frontenddan yuboriladi)
router.post("/", addOrder);


module.exports = router;
