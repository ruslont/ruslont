document.addEventListener('DOMContentLoaded', () => {
    // Eski kodlaringiz shu yerda tursin
    console.log("Frontend script yuklandi ✅");

    const orderForm = document.getElementById('orderForm');

    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Forma qiymatlarini olish
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value.trim();
            const date = document.getElementById('date').value.trim();

            const order = { name, phone, service, date };

            try {
                // 🚀 Yangi qism: buyurtmani serverga yuborish
                const response = await fetch('http://localhost:3000/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order)
                });

                const result = await response.json();
                alert(result.message || "Buyurtma yuborildi ✅");

                // Forma tozalash
                orderForm.reset();
            } catch (error) {
                console.error('❌ Buyurtma yuborishda xatolik:', error);
                alert('Buyurtma yuborishda muammo yuz berdi.');
            }
        });
    }

    // Agar boshqa eski funksiyalar bo‘lsa, ular shu yerda turadi
});
  
// Language Data
const translations = {
    en: {
        home: "Home",
        services: "Services",
        about: "About",
        portfolio: "Portfolio",
        heroTitle: "Professional Freelance Services",
        heroDesc: "High-quality freelance services with attention to detail and fast turnaround times. Available in multiple languages.",
        servicesBtn: "My Services",
        contactBtn: "Contact Me",
        servicesTitle: "My Services",
        service1: "Translation Work",
        service1Desc: "Professional translation services in multiple languages with accuracy and cultural sensitivity.",
        service2: "Web Design",
        service2Desc: "Custom website designs that are responsive, user-friendly, and visually appealing.",
        service3: "Logo Design",
        service3Desc: "Unique and memorable logo designs that represent your brand identity.",
        service4: "Website Improvement",
        service4Desc: "Enhance your existing website with improved functionality and modern design.",
        service5: "Brand Development",
        service5Desc: "Comprehensive brand development services to establish your market presence.",
        service6: "3D Business Cards",
        service6Desc: "Innovative 3D business card designs that leave a lasting impression.",
        service7: "3D Models",
        service7Desc: "Detailed 3D modeling services for various applications and industries.",
        service8: "Banners & Advertising",
        service8Desc: "Eye-catching banners and advertising materials for books, promotions, and events.",
        orderNow: "Order Now",
        aboutTitle: "About Me",
        aboutSubtitle: "Ruslon Toraboyev",
        aboutDesc1: "I am a professional freelancer with expertise in multiple domains including translation, web design, and 3D modeling. With years of experience, I deliver high-quality work that meets client expectations.",
        aboutDesc2: "My approach focuses on understanding client needs, clear communication, and delivering projects on time. I'm fluent in multiple languages and can work with clients from diverse backgrounds.",
        skillsTitle: "My Skills",
        skill1: "Web Design & Development",
        skill2: "Graphic Design & Logo Creation",
        skill3: "3D Modeling & Rendering",
        skill4: "Multilingual Translation",
        skill5: "Brand Development",
        portfolioTitle: "Completed Projects",
        project1: "E-commerce Website",
        project1Desc: "Fully responsive online store with payment integration",
        project2: "Brand Identity",
        project2Desc: "Complete branding package for a startup company",
        project3: "3D Product Models",
        project3Desc: "Series of 3D models for product visualization",
        contactTitle: "Get In Touch",
        contactSubtitle: "Contact Information",
        contactDesc: "Feel free to reach out for project inquiries or collaboration opportunities.",
        location: "City, Country",
        footerDesc: "Professional Freelancer Services",
        orderTitle: "Place Your Order",
        serviceLabel: "Service",
        nameLabel: "Your Name",
        whatsappLabel: "WhatsApp Number",
        emailLabel: "Email Address",
        detailsLabel: "Project Details",
        submitOrder: "Submit Order",
        successTitle: "Thank You!",
        successMessage: "Thank you for your order. Ruslon Toraboyev will contact you shortly.",
        orderTime: "Order time:",
        closeBtn: "Close",
        loading: "Loading...",
        success: "Success!",
        error: "Error!",
        connectionOnline: "Online",
        connectionOffline: "Offline",
        retry: "Try Again"
    },
    ru: {
        home: "Главная",
        services: "Услуги",
        about: "Обо мне",
        portfolio: "Портфолио",
        heroTitle: "Профессиональные Фриланс Услуги",
        heroDesc: "Высококачественные фриланс-услуги с вниманием к деталям и быстрыми сроками выполнения. Доступно на нескольких языках.",
        servicesBtn: "Мои Услуги",
        contactBtn: "Связаться",
        servicesTitle: "Мои Услуги",
        service1: "Переводческие работы",
        service1Desc: "Профессиональные услуги перевода на multiple languages с точностью и культурной чувствительностью.",
        service2: "Веб-дизайн",
        service2Desc: "Индивидуальные дизайны веб-сайтов, которые адаптивны, удобны для пользователя и визуально привлекательны.",
        service3: "Дизайн логотипа",
        service3Desc: "Уникальные и запоминающиеся дизайны логотипов, которые представляют идентичность вашего бренда.",
        service4: "Улучшение веб-сайта",
        service4Desc: "Улучшите свой существующий веб-сайт с улучшенной функциональностью и современным дизайном.",
        service5: "Развитие бренда",
        service5Desc: "Комплексные услуги по развитию бренда для установления вашего присутствия на рынке.",
        service6: "3D визитки",
        service6Desc: "Инновационные дизайны 3D визиток, которые оставляют lasting impression.",
        service7: "3D модели",
        service7Desc: "Детальные услуги 3D моделирования для различных приложений и отраслей.",
        service8: "Баннеры и реклама",
        service8Desc: "Привлекающие внимание баннеры и рекламные материалы для книг, промоакций и мероприятий.",
        orderNow: "Заказать Сейчас",
        aboutTitle: "Обо Мне",
        aboutSubtitle: "Руслон Торабоев",
        aboutDesc1: "Я профессиональный фрилансер с опытом работы в multiple domains, включая перевод, веб-дизайн и 3D моделирование. Имея многолетний опыт, я предоставляю высококачественную работу, соответствующую ожиданиям клиентов.",
        aboutDesc2: "Мой подход focuses on пониманием потребностей клиентов, четкой коммуникацией и своевременной delivery проектов. Я свободно владею multiple languages и могу работать с клиентами из разных стран.",
        skillsTitle: "Мои Навыки",
        skill1: "Веб-дизайн и разработка",
        skill2: "Графический дизайн и создание логотипов",
        skill3: "3D моделирование и рендеринг",
        skill4: "Многоязычный перевод",
        skill5: "Развитие бренда",
        portfolioTitle: "Завершенные Проекты",
        project1: "Интернет-магазин",
        project1Desc: "Полностью адаптивный интернет-магазин с интеграцией платежей",
        project2: "Идентичность бренда",
        project2Desc: "Полный пакет брендинга для стартап-компании",
        project3: "3D модели продуктов",
        project3Desc: "Серия 3D моделей для визуализации продуктов",
        contactTitle: "Связаться",
        contactSubtitle: "Контактная информация",
        contactDesc: "Не стесняйтесь обращаться по вопросам проектов или возможностей сотрудничества.",
        location: "Город, Страна",
        footerDesc: "Профессиональные Фриланс Услуги",
        orderTitle: "Разместите Ваш Заказ",
        serviceLabel: "Услуга",
        nameLabel: "Ваше Имя",
        whatsappLabel: "Номер WhatsApp",
        emailLabel: "Email Адрес",
        detailsLabel: "Детали Проекта",
        submitOrder: "Отправить Заказ",
        successTitle: "Спасибо!",
        successMessage: "Спасибо за ваш заказ. Руслон Торабоев свяжется с вами в ближайшее время.",
        orderTime: "Время заказа:",
        closeBtn: "Закрыть",
        loading: "Загрузка...",
        success: "Успех!",
        error: "Ошибка!",
        connectionOnline: "Онлайн",
        connectionOffline: "Оффлайн",
        retry: "Попробовать снова"
    }
};

// Current language
let currentLang = 'en';

// DOM Elements
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const languageBtns = document.querySelectorAll('.language-btn');
const orderBtns = document.querySelectorAll('.order-btn');
const orderModal = document.getElementById('order-modal');
const closeOrderModal = document.getElementById('close-order-modal');
const orderForm = document.getElementById('order-form');
const serviceInput = document.getElementById('service');
const successModal = document.getElementById('success-modal');
const closeSuccessModal = document.getElementById('close-success-modal');
const orderTime = document.getElementById('order-time');
const typingElement = document.querySelector('.typing-effect');
const formLoading = document.getElementById('form-loading');
const submitOrderBtn = document.getElementById('submit-order-btn');

// Typing Animation
const typingTexts = ['Freelance Services', 'Web Design', '3D Modeling', 'Translation'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentText = typingTexts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
}

// Scroll Animation
function checkScroll() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < windowHeight - 100) {
            section.classList.add('visible');
            
            // Animate service cards with delay
            if (section.id === 'services') {
                const serviceCards = document.querySelectorAll('.service-card');
                serviceCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 150);
                });
            }
        }
    });
    
    // Header background on scroll
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Change Language
function changeLanguage(lang) {
    currentLang = lang;
    
    // Update language buttons
    languageBtns.forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update all elements with data-lang-key
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

// Order Modal
function openOrderModal(service) {
    serviceInput.value = service;
    orderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModals() {
    orderModal.classList.remove('active');
    successModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Form validation
function validateForm() {
    let isValid = true;
    
    // Reset all error states
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    
    // Validate name
    const name = document.getElementById('name').value.trim();
    if (!name) {
        document.querySelector('[for="name"]').parentElement.classList.add('error');
        isValid = false;
    }
    
    // Validate WhatsApp
    const whatsapp = document.getElementById('whatsapp').value.trim();
    if (!whatsapp) {
        document.querySelector('[for="whatsapp"]').parentElement.classList.add('error');
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        document.querySelector('[for="email"]').parentElement.classList.add('error');
        isValid = false;
    }
    
    // Validate details
    const details = document.getElementById('details').value.trim();
    if (!details) {
        document.querySelector('[for="details"]').parentElement.classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

// Form Submission (backend bilan ishlaydigan versiya)
async function handleOrderSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        showNotification('Please fill all required fields correctly.', 'error');
        return;
    }
    
    // Get form values
    const name = document.getElementById('name').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const email = document.getElementById('email').value;
    const details = document.getElementById('details').value;
    const service = serviceInput.value;
    
    // Show loading, hide submit button
    if (formLoading && submitOrderBtn) {
        formLoading.style.display = 'block';
        submitOrderBtn.style.display = 'none';
    }
    
    try {
        // Backendga so'rov yuborish
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                whatsapp,
                email,
                service,
                details
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // LocalStorage ga ham saqlaymiz (backup sifatida)
        saveOrderToLocalStorage(name, whatsapp, email, service, details);
        
        // Show success notification
        showNotification('Order submitted successfully!', 'success');
        
        // Close order modal and show success modal
        closeModals();
        
        // Set order time
        const now = new Date();
        if (orderTime) {
            orderTime.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        }
        
        // Show success modal
        successModal.classList.add('active');
        
        // Reset form
        orderForm.reset();
        
    } catch (error) {
        console.error('Error:', error);
        
        // Agar backend ishlamasa, faqat localStorage ga saqlaymiz
        saveOrderToLocalStorage(name, whatsapp, email, service, details);
        
        showNotification('Order saved locally. We will contact you soon!', 'warning');
        
        // Close order modal and show success modal
        closeModals();
        
        // Set order time
        const now = new Date();
        if (orderTime) {
            orderTime.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        }
        
        // Show success modal
        successModal.classList.add('active');
        
        // Reset form
        orderForm.reset();
    } finally {
        // Hide loading, show submit button
        if (formLoading && submitOrderBtn) {
            formLoading.style.display = 'none';
            submitOrderBtn.style.display = 'block';
        }
    }
}

// LocalStorage ga buyurtma saqlash
function saveOrderToLocalStorage(name, whatsapp, email, service, details) {
    try {
        // Get existing orders from localStorage
        const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Create new order
        const newOrder = {
            id: Date.now(),
            name,
            whatsapp,
            email,
            service,
            details,
            orderTime: new Date().toISOString(),
            status: 'pending'
        };
        
        // Add to orders array
        existingOrders.push(newOrder);
        
        // Save to localStorage
        localStorage.setItem('orders', JSON.stringify(existingOrders));
        
        console.log('Order saved to localStorage:', newOrder);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

// Service demand tracking
function trackServiceDemand(serviceName) {
    try {
        const demandData = JSON.parse(localStorage.getItem('serviceDemand')) || {};
        demandData[serviceName] = (demandData[serviceName] || 0) + 1;
        localStorage.setItem('serviceDemand', JSON.stringify(demandData));
        
        // Backendga ham yuborish (agar ulanish bo'lsa)
        fetch('/api/service-demand', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service: serviceName,
                timestamp: new Date().toISOString()
            })
        }).catch(error => console.error('Failed to track service demand:', error));
    } catch (error) {
        console.error('Error tracking service demand:', error);
    }
}

// Event Listeners
window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

if (languageBtns.length > 0) {
    languageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            changeLanguage(btn.dataset.lang);
        });
    });
}

if (orderBtns.length > 0) {
    orderBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            openOrderModal(btn.dataset.service);
            trackServiceDemand(btn.dataset.service);
        });
    });
}

if (closeOrderModal) {
    closeOrderModal.addEventListener('click', closeModals);
}

if (closeSuccessModal) {
    closeSuccessModal.addEventListener('click', closeModals);
}

if (orderForm) {
    orderForm.addEventListener('submit', handleOrderSubmit);
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target === orderModal || e.target === successModal) {
        closeModals();
    }
});

// Close modal when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModals();
    }
});

// Real-time form validation
if (orderForm) {
    orderForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', () => {
            validateForm();
        });
        
        input.addEventListener('input', () => {
            // Remove error state when user starts typing
            if (input.value.trim()) {
                input.parentElement.classList.remove('error');
            }
        });
    });
}
document.getElementById("order-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const product = document.getElementById("product").value.trim();

  if (!name || !phone || !product) {
    document.getElementById("message").textContent = "❌ Barcha maydonlarni to‘ldiring!";
    return;
  }

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, product })
    });

    if (response.ok) {
      document.getElementById("message").textContent = "✅ Buyurtma yuborildi!";
      document.getElementById("order-form").reset();
    } else {
      document.getElementById("message").textContent = "❌ Xatolik yuz berdi!";
    }
  } catch (error) {
    console.error("Xatolik:", error);
    document.getElementById("message").textContent = "❌ Server ishlamayapti!";
  }
});

// Initialize
type();
checkScroll();

// Check if there are any orders in localStorage on page load
window.addEventListener('load', () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    console.log('Orders in localStorage:', orders.length);
});
```

