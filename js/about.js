// Animate skill bars when they come into view
const animateSkills = () => {
    const skillFills = document.querySelectorAll('.skill-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.5 });

    skillFills.forEach(fill => observer.observe(fill));
};

// 3D tilt effect for profile image
const profileImage = document.querySelector('.profile-image');
if (profileImage) {
    document.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = profileImage.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        gsap.to(profileImage, {
            duration: 0.5,
            rotateY: x * 10,
            rotateX: -y * 10,
            ease: 'power2.out'
        });
    });
}

// Animate timeline items when they come into view
const animateTimeline = () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => observer.observe(item));
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateSkills();
    animateTimeline();
}); 