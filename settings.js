// Google Sign In Handler
function handleGoogleSignIn(response) {
  const responsePayload = decodeJwtResponse(response.credential);
  console.log("ID: " + responsePayload.sub);
  console.log('Full Name: ' + responsePayload.name);
  console.log('Email: ' + responsePayload.email);
  console.log('Profile Picture: ' + responsePayload.picture);
  
  // Here you would typically send this info to your backend
  // For demo, we'll just update the UI
  document.getElementById('loginCard').innerHTML = `
    <img src="${responsePayload.picture}" alt="Profile" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 1rem;">
    <h3>Welcome, ${responsePayload.given_name}!</h3>
    <p>${responsePayload.email}</p>
    <button class="settings-btn" onclick="signOut()">
      <i class="fas fa-sign-out-alt"></i> Sign Out
    </button>
  `;
}

function decodeJwtResponse(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

function signOut() {
  google.accounts.id.disableAutoSelect();
  location.reload();
}

// Enhanced Modal Functions with scroll management
function showLoginModal() {
  const modal = document.getElementById('loginModal');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function showUpdatesModal() {
  const modal = document.getElementById('updatesModal');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function showAboutModal() {
  const modal = document.getElementById('aboutModal');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
  document.body.style.overflow = ''; // Restore scrolling
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
  }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
});

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.settings-card');
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
  });
});