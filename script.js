// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Copy Server IP Functionality
function copyIP() {
    const serverIP = 'reals.lat';
    navigator.clipboard.writeText(serverIP).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalHTML = copyBtn.innerHTML;
        
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
        }, 2000);
        
        // Show notification
        showNotification('Server IP copied to clipboard!');
    }).catch(() => {
        showNotification('Failed to copy IP. Please copy manually: reals.lat');
    });
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #FF69B4, #E91E63);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(255, 105, 180, 0.3);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Animated Counter for Statistics
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            
            // Animate stats counters
            if (entry.target.classList.contains('stats')) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.dataset.target);
                    animateCounter(stat, target);
                });
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
    }
});

// Parallax Effect for Hero Background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        const rate = scrolled * -0.5;
        heroBackground.style.transform = `translate3d(0, ${rate}px, 0)`;
    }
});

// Real Server Status using mcsrvstat.us API
function updateServerStatus() {
    const statusIndicator = document.querySelector('.status-dot');
    const playerCount = document.getElementById('player-count');
    const serverIP = 'reals.lat';
    
    // Show loading state
    playerCount.textContent = 'Loading...';
    
    // Fetch server status from API
    fetch(`https://api.mcsrvstat.us/3/${serverIP}`, {
        method: 'GET',
        headers: {
            'User-Agent': 'Reals Network Website (reals.lat)'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('API request failed');
        }
        return response.json();
    })
    .then(data => {
        if (data.online) {
            statusIndicator.classList.add('online');
            statusIndicator.classList.remove('offline');
            statusIndicator.style.background = '#4CAF50';
            
            const currentPlayers = data.players?.online || 0;
            const maxPlayers = data.players?.max || 1000;
            
            playerCount.textContent = `${currentPlayers}/${maxPlayers} players online`;
            
            // Show server version if available
            const versionElement = document.getElementById('server-version');
            const versionText = document.getElementById('version-text');
            if (data.version && versionElement && versionText) {
                versionText.textContent = `Version: ${data.version}`;
                versionElement.style.display = 'flex';
            }
            
            // Update server statistics if available
            updateServerStats(data);
        } else {
            statusIndicator.classList.remove('online');
            statusIndicator.classList.add('offline');
            statusIndicator.style.background = '#f44336';
            playerCount.textContent = 'Server offline';
            
            // Hide version when offline
            const versionElement = document.getElementById('server-version');
            if (versionElement) {
                versionElement.style.display = 'none';
            }
        }
    })
    .catch(error => {
        console.error('Error fetching server status:', error);
        statusIndicator.classList.remove('online');
        statusIndicator.classList.add('offline');
        statusIndicator.style.background = '#f44336';
        playerCount.textContent = 'Status unavailable';
    });
}

// Update server statistics with real data
function updateServerStats(serverData) {
    // Update current online players stat
    const onlineNowStat = document.querySelector('[data-target="500"]');
    if (onlineNowStat && serverData.players?.online !== undefined) {
        const currentPlayers = serverData.players.online;
        onlineNowStat.setAttribute('data-target', currentPlayers);
        animateCounter(onlineNowStat, currentPlayers, 1000);
    }
    
    // You can add more real statistics here when available
    // For example, if you have access to more detailed server APIs
}

// Particle System for Hero Section
function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    hero.appendChild(particlesContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #FF69B4;
            border-radius: 50%;
            opacity: 0.6;
            animation: float-particle ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: 100%;
        `;
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 15000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 2000);
}

// Add particle animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes float-particle {
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Mouse Movement Parallax Effect
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const moveX = (mouseX - 0.5) * 20;
    const moveY = (mouseY - 0.5) * 20;
    
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateServerStatus();
    createParticles();
    
    // Update server status every 5 minutes (API cache time)
    setInterval(updateServerStatus, 5 * 60 * 1000);
    
    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search (if you add search later)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Focus search input when implemented
    }
    
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const hamburger = document.querySelector('.hamburger');
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
    }
    
    // Parallax effect
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground && scrolled < window.innerHeight) {
        const rate = scrolled * -0.3;
        heroBackground.style.transform = `translate3d(0, ${rate}px, 0)`;
    }
}, 16));

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

console.log('🎮 Reals Network website loaded successfully!');
console.log('🚀 Welcome to the ultimate Minecraft PvP experience!');
