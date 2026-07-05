// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSearch();
    initializeForm();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            
            certificateCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                if (cardText.includes(searchTerm)) {
                    card.style.display = '';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Form submission
function initializeForm() {
    const form = document.getElementById('certificateForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const certName = document.getElementById('certName').value;
            const certFile = document.getElementById('certFile').files[0];
            const certDate = document.getElementById('certDate').value;
            
            // Validate form
            if (!certName || !certFile || !certDate) {
                alert('Please fill in all fields');
                return;
            }
            
            // Show success message
            alert(`Certificate "${certName}" submitted successfully!\n\nNote: In a production environment, this would upload to a server.`);
            
            // Reset form
            form.reset();
            
            // Optionally scroll to certificates section
            document.getElementById('certificates').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Add fade-in animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Utility function to load certificates dynamically (for future enhancement)
function loadCertificates() {
    const certificatesGrid = document.getElementById('certificatesGrid');
    
    // This function can be enhanced to load from an API or database
    // For now, it will work with static content
}

// Export functions for future use
window.certificateApp = {
    loadCertificates: loadCertificates,
    initializeNavigation: initializeNavigation,
    initializeSearch: initializeSearch,
    initializeForm: initializeForm
};
