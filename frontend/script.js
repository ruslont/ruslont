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
        successMessage: "Thank you for your order. I will contact you shortly on WhatsApp.",
        orderTime: "Order time:",
        closeBtn: "Close",
        loading: "Loading...",
        success: "Success!",
        error: "Error!",
        connectionOnline: "Online",
        connectionOffline: "Offline",
        retry: "Try Again",
        validationRequired: "Please fill in this field",
        validationEmail: "Please enter a valid email address",
        validationWhatsApp: "Please enter a valid WhatsApp number"
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
        successMessage: "Спасибо за ваш заказ. Я свяжусь с вами в ближайшее время через WhatsApp.",
        orderTime: "Время заказа:",
        closeBtn: "Закрыть",
        loading: "Загрузка...",
        success: "Успех!",
        error: "Ошибка!",
        connectionOnline: "Онлайн",
        connectionOffline: "Оффлайн",
        retry: "Попробовать снова",
        validationRequired: "Пожалуйста, заполните это поле",
        validationEmail: "Пожалуйста, введите действительный адрес электронной почты",
        validationWhatsApp: "Пожалуйста, введите действительный номер WhatsApp"
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

// Form elements
const nameInput = document.getElementById('name');
const whatsappInput = document.getElementById('whatsapp');
const emailInput = document.getElementById('email');
const detailsInput = document.getElementById('details');

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
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
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
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    });
    
    // Validate name
    const name = nameInput.value.trim();
    if (!name) {
        showFieldError(nameInput, translations[currentLang].validationRequired);
        isValid = false;
    }
    
    // Validate WhatsApp
    const whatsapp = whatsappInput.value.trim();
    if (!whatsapp) {
        showFieldError(whatsappInput, translations[currentLang].validationWhatsApp);
        isValid = false;
    } else if (!isValidWhatsApp(whatsapp)) {
        showFieldError(whatsappInput, translations[currentLang].validationWhatsApp);
        isValid = false;
    }
    
    // Validate email
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showFieldError(emailInput, translations[currentLang].validationRequired);
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showFieldError(emailInput, translations[currentLang].validationEmail);
        isValid = false;
    }
    
    // Validate details
    const details = detailsInput.value.trim();
    if (!details) {
        showFieldError(detailsInput, translations[currentLang].validationRequired);
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.5rem';
    
    formGroup.appendChild(errorElement);
}

// Validate WhatsApp number
function isValidWhatsApp(number) {
    // Basic validation for WhatsApp numbers
    const whatsappRegex = /^[+\d][\d\s\-\(\)]{10,}$/;
    return whatsappRegex.test(number);
}

// Form Submission - Emailga jo'natish
async function handleOrderSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        showNotification('Please fill all required fields correctly.', 'error');
        return;
    }
    
    // Get form values
    const name = nameInput.value;
    const whatsapp = whatsappInput.value;
    const email = emailInput.value;
    const details = detailsInput.value;
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
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `Server error: ${response.status}`);
        }
        
        if (data.success) {
            // Show success notification
            showNotification(translations[currentLang].successMessage, 'success');
            
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
            
        } else {
            throw new Error(data.error || 'Order submission failed');
        }
        
    } catch (error) {
        console.error('Error:', error);
        
        // Agar server ishlamasa, WhatsApp ga yo'naltiramiz
        const whatsappMessage = `Salom! Men ${service} xizmati uchun buyurtma bermoqchiman. Ismim: ${name}, Email: ${email}. Tafsilotlar: ${details}`;
        const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(whatsappMessage)}`;
        
        showNotification('Server not responding. Please contact us directly on WhatsApp.', 'warning');
        
        // 3 soniyadan so'ng WhatsApp ga yo'naltiramiz
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 3000);
        
    } finally {
        // Hide loading, show submit button
        if (formLoading && submitOrderBtn) {
            formLoading.style.display = 'none';
            submitOrderBtn.style.display = 'block';
        }
    }
}

// Service demand tracking
function trackServiceDemand(serviceName) {
    try {
        const demandData = JSON.parse(localStorage.getItem('serviceDemand')) || {};
        demandData[serviceName] = (demandData[serviceName] || 0) + 1;
        localStorage.setItem('serviceDemand', JSON.stringify(demandData));
    } catch (error) {
        console.error('Error tracking service demand:', error);
    }
}

// Real-time form validation
function setupFormValidation() {
    const formFields = orderForm.querySelectorAll('input, textarea');
    
    formFields.forEach(field => {
        field.addEventListener('blur', () => {
            validateForm();
        });
        
        field.addEventListener('input', () => {
            // Remove error state when user starts typing
            const formGroup = field.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('error');
                const errorElement = formGroup.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                }
            }
        });
    });
}

// Initialize the application
function init() {
    // Initialize typing animation
    type();
    
    // Initialize scroll animations
    checkScroll();
    window.addEventListener('scroll', checkScroll);
    
    // Setup form validation
    if (orderForm) {
        setupFormValidation();
    }
    
    // Check if there are any orders in localStorage on page load
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    console.log('Orders in localStorage:', orders.length);
}

// Event Listeners
window.addEventListener('load', init);

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) {
            navMenu.classList.remove('active');
        }
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

// WhatsApp contact button
const whatsappBtn = document.querySelector('.btn-whatsapp');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const message = "Salom! Men xizmatlaringiz haqida ma'lumot olmoqchiman.";
        window.open(`https://wa.me/1234567890?text=${encodeURIComponent(message)}`, '_blank');
    });
}
```
