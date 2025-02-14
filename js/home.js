// Typing animation
const typed = new Typed('.typed', {
    strings: [
        'Frontend Developer',
        'UI/UX Designer',
        'Creative Thinker',
        'Problem Solver'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true
});

// Parallax effect for cubes
document.addEventListener('mousemove', (e) => {
    const cubes = document.querySelectorAll('.cube');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    cubes.forEach((cube, index) => {
        const speed = (index + 1) * 0.5;
        const rotateX = (y - 0.5) * 30 * speed;
        const rotateY = (x - 0.5) * 30 * speed;
        
        cube.style.transform = `
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
            translateZ(${50 * speed}px)
        `;
    });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll-based animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('in-view');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Initial check

// Mobile menu functionality
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
    if (!menuOpen) {
        menuBtn.classList.add('open');
        navLinks.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuOpen = true;
    } else {
        menuBtn.classList.remove('open');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
        menuOpen = false;
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (menuOpen && !e.target.closest('.nav-content')) {
        menuBtn.classList.remove('open');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
        menuOpen = false;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Service Modal Functionality
    const modal = document.getElementById('serviceModal');
    const closeModal = document.querySelector('.close-modal');

    if (!modal || !closeModal) {
        console.error('Modal elements not found');
        return;
    }

    // Initialize modal functionality
    window.openServiceModal = function(serviceType) {
        const serviceDetails = {
            web: {
                title: "Web Development",
                description: "Custom website development with modern technologies and best practices.",
                features: [
                    "Responsive Design",
                    "SEO Optimization",
                    "Performance Tuning",
                    "Content Management",
                    "Security Implementation",
                    "Analytics Integration"
                ],
                price: "Starting at $999",
                timeline: "2-4 weeks"
            },
            ecommerce: {
                title: "E-commerce Solutions",
                description: "Full-featured online store development with payment processing and inventory management.",
                features: [
                    "Product Management",
                    "Secure Payments",
                    "Inventory System",
                    "Order Processing",
                    "Customer Accounts",
                    "Analytics Dashboard"
                ],
                price: "Starting at $2499",
                timeline: "4-8 weeks"
            },
            custom: {
                title: "Custom Solutions",
                description: "Tailored development solutions to meet your specific needs.",
                features: [
                    "Custom Development",
                    "Technical Consultation",
                    "System Integration",
                    "API Development",
                    "Database Design",
                    "Ongoing Support"
                ],
                price: "Custom Quote",
                timeline: "Project Dependent"
            }
        };

        const details = serviceDetails[serviceType];
        const modalBody = modal.querySelector('.modal-body');
        
        modalBody.innerHTML = `
            <h2>${details.title}</h2>
            <p class="service-description">${details.description}</p>
            <div class="service-features">
                <h3>Features</h3>
                <ul>
                    ${details.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <div class="service-info">
                <p class="price">${details.price}</p>
                <p class="timeline">Estimated Timeline: ${details.timeline}</p>
            </div>
            <form id="serviceForm" class="service-form">
                <div class="form-group">
                    <label for="name">Your Name</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <input type="hidden" id="service" value="${serviceType}">
                <div class="form-group">
                    <label for="message">Project Details</label>
                    <textarea id="message" rows="4" required></textarea>
                </div>
                <button type="submit" class="submit-btn">
                    <span>Submit Request</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </form>
        `;

        // Show the modal
        modal.style.display = 'block';
        
        // Set up the new form submit handler
        const newForm = modalBody.querySelector('#serviceForm');
        setupFormHandler(newForm);
    }

    // Close modal when clicking the close button
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function setupFormHandler(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('span');
        const originalText = btnText.textContent;
        
        btnText.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            const formData = {
                name: form.querySelector('#name').value,
                email: form.querySelector('#email').value,
                service: form.querySelector('#service').value,
                message: form.querySelector('#message').value
            };

            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to submit request');
            
            btnText.textContent = 'Request Sent!';
            form.reset();
            
            setTimeout(() => {
                modal.style.display = 'none';
                btnText.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        } catch (error) {
            btnText.textContent = 'Error! Try Again';
            submitBtn.disabled = false;
            
            setTimeout(() => {
                btnText.textContent = originalText;
            }, 3000);
        }
    });
}

// Initialize AOS for scroll animations
AOS.init({
    duration: 800,
    offset: 100,
    once: true
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 