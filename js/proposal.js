document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quoteForm');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const submitBtn = document.querySelector('.submit-btn');
    let currentStep = 0;

    // Initialize feature options for different project types
    const featureOptions = {
        website: [
            'Responsive Design',
            'Contact Form',
            'Blog Section',
            'SEO Optimization',
            'Social Media Integration',
            'Analytics Integration',
            'Custom Domain Setup'
        ],
        ecommerce: [
            'Product Management',
            'Shopping Cart',
            'Payment Gateway',
            'Order Management',
            'Inventory System',
            'Customer Accounts',
            'Wishlist Feature'
        ],
        webapp: [
            'User Authentication',
            'Database Integration',
            'API Development',
            'Real-time Features',
            'Admin Dashboard',
            'File Upload',
            'Search Functionality'
        ]
    };

    // Update feature options based on project type
    const projectTypeInputs = document.querySelectorAll('input[name="projectType"]');
    projectTypeInputs.forEach(input => {
        input.addEventListener('change', () => {
            const featuresList = document.querySelector('.feature-options');
            const features = featureOptions[input.value];
            
            featuresList.innerHTML = features.map(feature => `
                <div class="feature-option">
                    <input type="checkbox" id="${feature.toLowerCase().replace(/\s+/g, '-')}" 
                           name="features" value="${feature}">
                    <label for="${feature.toLowerCase().replace(/\s+/g, '-')}">${feature}</label>
                </div>
            `).join('');
        });
    });

    // Navigation functions
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
            stepIndicators[index].classList.toggle('active', index === stepIndex);
        });

        prevBtn.style.display = stepIndex === 0 ? 'none' : 'block';
        nextBtn.style.display = stepIndex === steps.length - 1 ? 'none' : 'block';
        submitBtn.style.display = stepIndex === steps.length - 1 ? 'block' : 'none';

        // Add animation class
        steps[stepIndex].classList.add('fade-in');
    }

    function validateStep(stepIndex) {
        const currentStepEl = steps[stepIndex];
        const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            showStep(currentStep);
        }
    });

    prevBtn.addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                form.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h2>Quote Request Sent!</h2>
                        <p>We'll get back to you within 24 hours.</p>
                        <a href="index.html" class="home-btn">Back to Home</a>
                    </div>
                `;
            } catch (error) {
                submitBtn.textContent = 'Error! Try Again';
                submitBtn.disabled = false;
            }
        }
    });

    // Initialize first step
    showStep(currentStep);
}); 