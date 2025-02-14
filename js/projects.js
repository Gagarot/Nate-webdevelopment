// Project filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;

        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Project hover effects
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.project-content'), {
            y: 0,
            opacity: 1,
            duration: 0.3
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.project-content'), {
            y: 20,
            opacity: 0,
            duration: 0.3
        });
    });
});

// Fetch projects from database
async function loadProjects() {
    try {
        const response = await fetch('http://localhost:3000/api/projects');
        const projects = await response.json();
        
        const projectsGrid = document.querySelector('.projects-grid');
        projectsGrid.innerHTML = projects.map(project => `
            <article class="project-card" data-category="${project.category}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tech-stack">
                        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.liveUrl}" class="project-link live">Live Demo</a>
                        <a href="${project.githubUrl}" class="project-link github">GitHub</a>
                    </div>
                </div>
            </article>
        `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', loadProjects); 