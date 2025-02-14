// Navigation
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
    if(!menuOpen) {
        menuBtn.classList.add('open');
        navLinks.classList.add('active');
        menuOpen = true;
    } else {
        menuBtn.classList.remove('open');
        navLinks.classList.remove('active');
        menuOpen = false;
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

document.querySelectorAll('section, .project-card').forEach((element) => {
    observer.observe(element);
});

document.addEventListener('DOMContentLoaded', () => {
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
        adminLink.style.display = localStorage.getItem('adminToken') ? 'inline-block' : 'none';
    }
}); 