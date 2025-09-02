// Buyurtmalarni backenddan olish (misol uchun /api/orders)
async function loadOrders() {
  try {
    const response = await fetch('/api/orders'); // backend route bo'lishi kerak
    const orders = await response.json();

    const tableBody = document.querySelector('#orders-table tbody');
    tableBody.innerHTML = "";

    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.name}</td>
        <td>${order.phone}</td>
        <td>${order.product}</td>
        <td>${order.date}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Buyurtmalarni yuklashda xatolik:", err);
  }
}

document.addEventListener('DOMContentLoaded', loadOrders);
