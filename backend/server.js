const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

// === Statik yo‘llar ===
// Frontend (mijozlar sayti)
app.use("/", express.static(path.join(__dirname, "..", "frontend")));

// Admin panel
app.use("/admin", express.static(path.join(__dirname, "..", "admin")));

// === Data papkasi ===
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// === Fayllar ===
const ordersFile = path.join(dataDir, "orders.json");
const freelancersFile = path.join(dataDir, "freelancers.json");
const completedFile = path.join(dataDir, "completed.json");

// === Helper: JSON o‘qish/yozish ===
function readJSON(file) {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file));
}
function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// === BUYURTMALAR ===

// Buyurtma yuborish (mijoz tomonidan)
app.post("/api/orders", (req, res) => {
    const { clientName, clientWhatsApp, clientEmail, clientMessage, package } = req.body;

    if (!clientName || !clientWhatsApp || !clientEmail || !package) {
        return res.status(400).json({ success: false, message: "Barcha maydonlarni to‘ldiring" });
    }

    let orders = readJSON(ordersFile);
    const newOrder = {
        id: orders.length + 1,
        clientName,
        clientWhatsApp,
        clientEmail,
        clientMessage,
        package,
        status: "pending",
        date: new Date().toISOString()
    };

    orders.push(newOrder);
    writeJSON(ordersFile, orders);

    res.json({ success: true, message: "Buyurtma yuborildi", order: newOrder });
});

// Admin buyurtmalarni ko‘rishi
app.get("/api/admin/orders", (req, res) => {
    res.json({ success: true, orders: readJSON(ordersFile) });
});

// === FREELANCERLAR ===

// Freelancer qo‘shish
app.post("/api/freelancers", (req, res) => {
    const { name, skills, contact } = req.body;
    if (!name || !skills || !contact) {
        return res.status(400).json({ success: false, message: "Barcha maydonlarni to‘ldiring" });
    }

    let freelancers = readJSON(freelancersFile);
    const newFreelancer = {
        id: freelancers.length + 1,
        name,
        skills,
        contact,
        joined: new Date().toISOString()
    };

    freelancers.push(newFreelancer);
    writeJSON(freelancersFile, freelancers);

    res.json({ success: true, message: "Freelancer qo‘shildi", freelancer: newFreelancer });
});

// Admin freelancerlarni ko‘rishi
app.get("/api/admin/freelancers", (req, res) => {
    res.json({ success: true, freelancers: readJSON(freelancersFile) });
});

// === BAJARILGAN BUYURTMALAR ===

// Buyurtmani bajarilgan deb belgilash
app.post("/api/completed", (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
        return res.status(400).json({ success: false, message: "orderId kerak" });
    }

    let orders = readJSON(ordersFile);
    let completed = readJSON(completedFile);

    const order = orders.find(o => o.id === orderId);
    if (!order) {
        return res.status(404).json({ success: false, message: "Buyurtma topilmadi" });
    }

    // Statusni o‘zgartirish
    order.status = "completed";
    completed.push(order);

    // Yozib qo‘yish
    writeJSON(completedFile, completed);
    writeJSON(ordersFile, orders);

    res.json({ success: true, message: "Buyurtma bajarildi", order });
});

// Admin bajarilgan buyurtmalarni ko‘rishi
app.get("/api/admin/completed", (req, res) => {
    res.json({ success: true, completed: readJSON(completedFile) });
});

// === SERVERNI ISHGA TUSHIRISH ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server http://localhost:${PORT} da ishlamoqda`);
});
