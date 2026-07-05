// Certificate storage in localStorage
const STORAGE_KEY = 'liftingGearsCertificates';
let certificates = [];
let filteredStatus = 'all';

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCertificates();
    initializeNavigation();
    initializeSearch();
    updateStats();
    renderCertificates();
});

// Load certificates from localStorage
function loadCertificates() {
    const stored = localStorage.getItem(STORAGE_KEY);
    certificates = stored ? JSON.parse(stored) : [];
}

// Save certificates to localStorage
function saveCertificates() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates));
}

// Add new certificate
function addCertificate(event) {
    event.preventDefault();

    const newCertificate = {
        id: Date.now(),
        gearName: document.getElementById('gearName').value,
        certNumber: document.getElementById('certNumber').value,
        inspectionDate: document.getElementById('inspectionDate').value,
        nextDue: document.getElementById('nextDue').value,
        inspector: document.getElementById('inspector').value,
        status: document.getElementById('status').value,
        notes: document.getElementById('notes').value,
        addedDate: new Date().toLocaleDateString()
    };

    certificates.push(newCertificate);
    saveCertificates();

    // Clear form
    event.target.reset();

    // Show success message
    showNotification('Certificate added successfully!', 'success');

    // Update display
    updateStats();
    renderCertificates();

    // Scroll to list
    setTimeout(() => {
        scrollToSection('list');
    }, 500);
}

// Delete certificate
function deleteCertificate(id) {
    if (confirm('Are you sure you want to delete this certificate?')) {
        certificates = certificates.filter(cert => cert.id !== id);
        saveCertificates();
        updateStats();
        renderCertificates();
        showNotification('Certificate deleted!', 'success');
    }
}

// Edit certificate
function editCertificate(id) {
    const certificate = certificates.find(cert => cert.id === id);
    if (certificate) {
        // Populate form with certificate data
        document.getElementById('gearName').value = certificate.gearName;
        document.getElementById('certNumber').value = certificate.certNumber;
        document.getElementById('inspectionDate').value = certificate.inspectionDate;
        document.getElementById('nextDue').value = certificate.nextDue;
        document.getElementById('inspector').value = certificate.inspector;
        document.getElementById('status').value = certificate.status;
        document.getElementById('notes').value = certificate.notes;

        // Delete the old one
        deleteCertificate(id);

        // Scroll to form
        scrollToSection('add');

        showNotification('Certificate loaded for editing. Make changes and save.', 'info');
    }
}

// Filter certificates by status
function filterCertificates(status) {
    filteredStatus = status;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderCertificates();
}

// Search certificates
function searchCertificates(query) {
    const searchTerm = query.toLowerCase();
    return certificates.filter(cert => {
        return (
            cert.gearName.toLowerCase().includes(searchTerm) ||
            cert.certNumber.toLowerCase().includes(searchTerm) ||
            cert.inspector.toLowerCase().includes(searchTerm) ||
            cert.notes.toLowerCase().includes(searchTerm)
        );
    });
}

// Render certificates
function renderCertificates() {
    const listElement = document.getElementById('certificatesList');
    let certificatesToDisplay = certificates;

    // Apply status filter
    if (filteredStatus !== 'all') {
        certificatesToDisplay = certificatesToDisplay.filter(cert => cert.status === filteredStatus);
    }

    // Apply search filter
    const searchTerm = document.getElementById('searchInput').value;
    if (searchTerm) {
        certificatesToDisplay = searchCertificates(searchTerm);
    }

    if (certificatesToDisplay.length === 0) {
        listElement.innerHTML = '<div class="empty-state"><p>No certificates found. Try adjusting your filters or add a new one!</p></div>';
        return;
    }

    listElement.innerHTML = certificatesToDisplay.map(cert => createCertificateCard(cert)).join('');
}

// Create certificate card HTML
function createCertificateCard(cert) {
    const dueDate = new Date(cert.nextDue);
    const today = new Date();
    const isExpiring = dueDate < today;

    const statusClass = cert.status.toLowerCase();

    return `
        <div class="certificate-card ${statusClass}">
            <div class="certificate-header">
                <h3 class="certificate-title">${escapeHtml(cert.gearName)}</h3>
                <span class="status-badge ${statusClass}">${cert.status}</span>
            </div>

            <div class="certificate-info">
                <div class="info-row">
                    <span class="info-label">Certificate #:</span>
                    <span class="info-value">${escapeHtml(cert.certNumber)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Inspection Date:</span>
                    <span class="info-value">${formatDate(cert.inspectionDate)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Next Due:</span>
                    <span class="info-value ${isExpiring ? 'style="color: #ef4444; font-weight: bold;"' : ''}">${formatDate(cert.nextDue)}</span>
                </div>
                ${cert.inspector ? `
                <div class="info-row">
                    <span class="info-label">Inspector:</span>
                    <span class="info-value">${escapeHtml(cert.inspector)}</span>
                </div>
                ` : ''}
            </div>

            ${cert.notes ? `
            <div class="certificate-notes">
                <strong>Notes:</strong> ${escapeHtml(cert.notes)}
            </div>
            ` : ''}

            <div class="certificate-actions">
                <button class="btn-small btn-edit" onclick="editCertificate(${cert.id})">✏️ Edit</button>
                <button class="btn-small btn-delete" onclick="deleteCertificate(${cert.id})">🗑️ Delete</button>
            </div>
        </div>
    `;
}

// Update statistics
function updateStats() {
    const totalCount = certificates.length;
    const validCount = certificates.filter(c => c.status === 'Valid').length;
    const expiredCount = certificates.filter(c => c.status === 'Expired').length;

    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('validCount').textContent = validCount;
    document.getElementById('expiredCount').textContent = expiredCount;
}

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
            scrollToSection(targetId);
        });
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            renderCertificates();
        });
    }
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#667eea'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
