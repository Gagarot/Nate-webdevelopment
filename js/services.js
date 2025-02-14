document.addEventListener('DOMContentLoaded', () => {
    // Add animation to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * index);
    });

    // Handle hash navigation
    if (window.location.hash) {
        setTimeout(() => {
            const targetService = document.querySelector(window.location.hash);
            if (targetService) {
                targetService.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetService.classList.add('highlight');
                targetService.style.animation = 'highlightService 2s ease-in-out';
            }
        }, 1000); // Wait for animations to complete
    }
});

// Update URL hash when clicking service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
        const id = card.getAttribute('id');
        if (id) {
            window.location.hash = id;
        }
    });
}); 