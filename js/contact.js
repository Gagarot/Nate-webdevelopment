// Form handling
const contactForm = document.getElementById('contactForm');
const inputs = document.querySelectorAll('.form-group input, .form-group textarea');

// Floating label animation
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    // Show loading state
    btnText.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        btnText.textContent = 'Message Sent!';
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            btnText.textContent = originalText;
            submitBtn.disabled = false;
        }, 3000);
    } catch (error) {
        // Handle error
        btnText.textContent = 'Error! Try Again';
        submitBtn.disabled = false;
        
        setTimeout(() => {
            btnText.textContent = originalText;
        }, 3000);
    }
});

// Animate background shapes
const shapes = document.querySelectorAll('.shape');
shapes.forEach(shape => {
    gsap.to(shape, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
    });
});

// Parallax effect for shapes
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        gsap.to(shape, {
            duration: 1,
            x: (mouseX - 0.5) * 100 * speed,
            y: (mouseY - 0.5) * 100 * speed,
            ease: 'power2.out'
        });
    });
}); 