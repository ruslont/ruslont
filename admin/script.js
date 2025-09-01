// DOM elementlarini olish
const ordersContainer = document.getElementById("orders");
const freelancersContainer = document.getElementById("freelancers");
const completedContainer = document.getElementById("completed");

// API dan ma'lumotlarni olish funksiyasi
async function fetchData(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.success ? data : { success: false, message: "Xato: ma'lumot olinmadi" };
    } catch (err) {
        console.error("Fetch error:", err);
        return { success: false, message: err.message };
    }
}

// Buyurtmalarni jadval ko‘rinishida chiqarish
async function loadOrders() {
    const data = await fetchData("/api/admin/orders");
    if (data.success) {
        if (data.orders.length === 0) {
            ordersContainer.innerHTML = "<p>Buyurtmalar mavjud emas.</p>";
            return;
        }
        let html = `
            <table border="1" cellpadding="8" cellspacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ism</th>
                        <th>WhatsApp</th>
                        <th>Email</th>
                        <th>Xabar</th>
                        <th>Paket</th>
                        <th>Status</th>
                        <th>Sana</th>
                    </tr>
                </thead>
                <tbody>
        `;
        data.orders.forEach(order => {
            html += `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.clientName}</td>
                    <td>${order.clientWhatsApp}</td>
                    <td>${order.clientEmail}</td>
                    <td>${order.clientMessage}</td>
                    <td>${order.package}</td>
                    <td>${order.status}</td>
                    <td>${new Date(order.date).toLocaleString()}</td>
                </tr>
            `;
        });
        html += "</tbody></table>";
        ordersContainer.innerHTML = html;
    }
}

// Freelancerlarni jadval ko‘rinishida chiqarish
async function loadFreelancers() {
    const data = await fetchData("/api/admin/freelancers");
    if (data.success) {
        if (data.freelancers.length === 0) {
            freelancersContainer.innerHTML = "<p>Freelancerlar mavjud emas.</p>";
            return;
        }
        let html = `
            <table border="1" cellpadding="8" cellspacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ism</th>
                        <th>Mamlakat</th>
                        <th>WhatsApp</th>
                        <th>Email</th>
                        <th>Tillar</th>
                        <th>Mutaxassislik</th>
                        <th>Haqida</th>
                        <th>Status</th>
                        <th>Sana</th>
                    </tr>
                </thead>
                <tbody>
        `;
        data.freelancers.forEach(f => {
            html += `
                <tr>
                    <td>${f.id}</td>
                    <td>${f.freelancerName}</td>
                    <td>${f.freelancerCountry}</td>
                    <td>${f.freelancerWhatsApp}</td>
                    <td>${f.freelancerEmail}</td>
                    <td>${f.freelancerLanguages}</td>
                    <td>${f.freelancerSpecialty}</td>
                    <td>${f.freelancerAbout}</td>
                    <td>${f.status}</td>
                    <td>${new Date(f.date).toLocaleString()}</td>
                </tr>
            `;
        });
        html += "</tbody></table>";
        freelancersContainer.innerHTML = html;
    }
}

// Bajarilgan buyurtmalarni jadval ko‘rinishida chiqarish
async function loadCompletedOrders() {
    const data = await fetchData("/api/admin/completed-orders");
    if (data.success) {
        if (data.completedOrders.length === 0) {
            completedContainer.innerHTML = "<p>Bajarilgan buyurtmalar mavjud emas.</p>";
            return;
        }
        let html = `
            <table border="1" cellpadding="8" cellspacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ism</th>
                        <th>Paket</th>
                        <th>Sana</th>
                    </tr>
                </thead>
                <tbody>
        `;
        data.completedOrders.forEach(order => {
            html += `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.clientName}</td>
                    <td>${order.package}</td>
                    <td>${new Date(order.date).toLocaleString()}</td>
                </tr>
            `;
        });
        html += "</tbody></table>";
        completedContainer.innerHTML = html;
    }
}

// Sahifa yuklanganda barcha ma'lumotlarni olish
document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
    loadFreelancers();
    loadCompletedOrders();
});
