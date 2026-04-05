// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = document.querySelector('button[type="submit"]');

    // Mobile menu functionality
    const menuIcon = document.getElementById('menuicon');
    const sidenav = document.getElementById('sidenav');
    const closenav = document.getElementById('closenav');

    if (menuIcon && sidenav && closenav) {
        menuIcon.addEventListener('click', function() {
            sidenav.style.right = '0';
        });

        closenav.addEventListener('click', function() {
            sidenav.style.right = '-50%';
        });
    }

    // Form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateForm() {
        let isValid = true;
        const errors = [];

        // Email validation
        if (!emailInput.value.trim()) {
            errors.push('Email is required');
            emailInput.classList.add('error');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            errors.push('Please enter a valid email address');
            emailInput.classList.add('error');
            isValid = false;
        } else {
            emailInput.classList.remove('error');
        }

        // Subject validation
        if (!subjectInput.value.trim()) {
            errors.push('Subject is required');
            subjectInput.classList.add('error');
            isValid = false;
        } else {
            subjectInput.classList.remove('error');
        }

        // Message validation
        if (!messageInput.value.trim()) {
            errors.push('Message is required');
            messageInput.classList.add('error');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
            messageInput.classList.add('error');
            isValid = false;
        } else {
            messageInput.classList.remove('error');
        }

        return { isValid, errors };
    }

    // Add error styles
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 1px #ef4444 !important;
        }
        .success-message {
            background: #d1fae5;
            color: #065f46;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            border: 1px solid #a7f3d0;
            animation: slideIn 0.3s ease;
        }
        .error-message {
            background: #fee2e2;
            color: #991b1b;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            border: 1px solid #fecaca;
            animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .contact-info-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .contact-info-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Remove existing messages
        const existingMessage = form.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const { isValid, errors } = validateForm();

        if (!isValid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = '<strong>Please fix the following errors:</strong><ul>' +
                errors.map(error => `<li>${error}</li>`).join('') + '</ul>';
            form.appendChild(errorDiv);
            return;
        }

        // Simulate form submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        setTimeout(() => {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.innerHTML = '<strong>Thank you!</strong> Your message has been sent successfully. We\'ll get back to you within 24 hours.';
            form.appendChild(successDiv);

            // Reset form
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send message';

            // Remove success message after 5 seconds
            setTimeout(() => {
                successDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (successDiv.parentNode) {
                        successDiv.parentNode.removeChild(successDiv);
                    }
                }, 300);
            }, 5000);
        }, 2000);
    });

    // Real-time validation feedback
    [emailInput, subjectInput, messageInput].forEach(input => {
        input.addEventListener('blur', function() {
            validateForm();
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
            }
        });
    });

    // Character counter for message
    const charCounter = document.createElement('div');
    charCounter.className = 'text-xs text-gray-500 mt-1';
    charCounter.id = 'char-counter';
    messageInput.parentNode.appendChild(charCounter);

    messageInput.addEventListener('input', function() {
        const length = this.value.length;
        charCounter.textContent = `${length}/500 characters`;
        if (length > 450) {
            charCounter.classList.add('text-red-500');
            charCounter.classList.remove('text-gray-500');
        } else {
            charCounter.classList.remove('text-red-500');
            charCounter.classList.add('text-gray-500');
        }
    });

    // Set max length
    messageInput.setAttribute('maxlength', '500');

    // Add hover effects to contact info cards
    const contactCards = document.querySelectorAll('.bg-white.p-6.rounded-lg.shadow-md');
    contactCards.forEach(card => {
        card.classList.add('contact-info-card');
    });

    // Add slideOut animation
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
        @keyframes slideOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(slideOutStyle);
});