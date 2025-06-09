// Navigation functionality
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Add active class to clicked button
    event.target.closest('.nav-item').classList.add('active');
    
    // Smooth scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_ap1k4xn'; // Il tuo Service ID
const EMAILJS_TEMPLATE_ID_TOURNAMENT = 'template_k9h3o2m'; // Template per tornei
const EMAILJS_TEMPLATE_ID_DINNER = 'template_cu73535'; // Template per cene
const EMAILJS_PUBLIC_KEY = 'YRs5iRA2Id2iGd7u9'; // La tua Public Key

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    // Tournament form
    const tournamentForm = document.getElementById('tournamentForm');
    if (tournamentForm) {
        tournamentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(tournamentForm);
            const teamName = formData.get('team-name');
            const player1 = formData.get('player1');
            const player2 = formData.get('player2');
            const phone = formData.get('phone1');
            
            // Simple validation
            if (!teamName || !player1 || !player2 || !phone) {
                showNotification('Per favore, compila tutti i campi obbligatori.', 'error');
                return;
            }
            
            if (!validatePhone(phone)) {
                showNotification('Inserisci un numero di telefono valido.', 'error');
                return;
            }
            
            // Prepare email data
            const emailData = {
                to_email: 'bsbiliardo@gmail.com',
                team_name: teamName,
                player1: player1,
                player2: player2,
                phone: phone,
                date: new Date().toLocaleDateString('it-IT'),
                time: new Date().toLocaleTimeString('it-IT')
            };
            
            // Send email via EmailJS
            sendTournamentEmail(emailData, tournamentForm);
        });
    }
    
    // Dinner form
    const dinnerForm = document.getElementById('dinnerForm');
    if (dinnerForm) {
        dinnerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(dinnerForm);
            const name = formData.get('name');
            const surname = formData.get('surname');
            const phone = formData.get('phone2');
            const guests = formData.get('guests');
            
            // Simple validation
            if (!name || !surname || !phone || !guests) {
                showNotification('Per favore, compila tutti i campi obbligatori.', 'error');
                return;
            }
            
            if (!validatePhone(phone)) {
                showNotification('Inserisci un numero di telefono valido.', 'error');
                return;
            }
            
            // Prepare email data
            const emailData = {
                to_email: 'bsbiliardo@gmail.com',
                name: name,
                surname: surname,
                phone: phone,
                guests: guests,
                date: new Date().toLocaleDateString('it-IT'),
                time: new Date().toLocaleTimeString('it-IT')
            };
            
            // Send email via EmailJS
            sendDinnerEmail(emailData, dinnerForm);
        });
    }
});

// Function to send tournament email
function sendTournamentEmail(emailData, form) {
    const submitButton = form.querySelector('.submit-btn');
    addLoadingState(submitButton);
    
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_TOURNAMENT, emailData)
        .then(function(response) {
            console.log('Email inviata con successo!', response.status, response.text);
            showNotification(`Prenotazione torneo inviata con successo!\n\nSquadra: ${emailData.team_name}\nGiocatori: ${emailData.player1}, ${emailData.player2}\nTelefono: ${emailData.phone}\n\n`, 'success');
            form.reset();
        })
        .catch(function(error) {
            console.error('Errore nell\'invio dell\'email:', error);
            showNotification('Errore nell\'invio della prenotazione. Riprova più tardi o contattaci direttamente.', 'error');
        })
        .finally(function() {
            resetLoadingState(submitButton);
        });
}

// Function to send dinner email
function sendDinnerEmail(emailData, form) {
    const submitButton = form.querySelector('.submit-btn');
    addLoadingState(submitButton);
    
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_DINNER, emailData)
        .then(function(response) {
            console.log('Email inviata con successo!', response.status, response.text);
            showNotification(`Prenotazione cena inviata con successo!\n\nNome: ${emailData.name} ${emailData.surname}\nTelefono: ${emailData.phone}\nNumero persone: ${emailData.guests}\n\n`, 'success');
            form.reset();
        })
        .catch(function(error) {
            console.error('Errore nell\'invio dell\'email:', error);
            showNotification('Errore nell\'invio della prenotazione. Riprova più tardi o contattaci direttamente.', 'error');
        })
        .finally(function() {
            resetLoadingState(submitButton);
        });
}

// Enhanced form validation
function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return re.test(phone);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        border-radius: 8px;
        padding: 1rem;
        max-width: 400px;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
        }
        .notification-message {
            flex: 1;
            white-space: pre-line;
            line-height: 1.4;
        }
        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            margin-left: 0.5rem;
            opacity: 0.7;
        }
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Real-time validation feedback
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.style.borderColor = '#dc3545';
                this.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
            } else if (this.value) {
                this.style.borderColor = '#28a745';
                this.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
            } else {
                this.style.borderColor = '#e0e0e0';
                this.style.boxShadow = 'none';
            }
        });
        
        input.addEventListener('input', function() {
            this.style.borderColor = '#e0e0e0';
            this.style.boxShadow = 'none';
        });
    });
});

// Smooth scrolling for better UX
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

// Add loading animation to forms
function addLoadingState(button) {
    button.originalText = button.textContent;
    button.textContent = 'Invio in corso...';
    button.disabled = true;
    button.style.opacity = '0.7';
}

// Reset loading state
function resetLoadingState(button) {
    button.textContent = button.originalText || 'Invia';
    button.disabled = false;
    button.style.opacity = '1';
}

// Add animation on scroll
function animateOnScroll() {
    const cards = document.querySelectorAll('.info-card, .menu-card, .booking-card');
    
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardVisible = 150;
        
        if (cardTop < window.innerHeight - cardVisible) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.info-card, .menu-card, .booking-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger animation on load
    setTimeout(animateOnScroll, 100);
});

window.addEventListener('scroll', animateOnScroll);

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Add focus styles for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #667eea !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);
