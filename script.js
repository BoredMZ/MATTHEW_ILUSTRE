// Skill descriptions for modal
const skillDescriptions = {
    'HTML5': 'The standard language for creating web pages and web applications.',
    'CSS3': 'A style sheet language used for describing the look and formatting of a document written in HTML.',
    'JavaScript': 'A programming language that enables interactive web pages and dynamic content.',
    'PHP': 'A popular general-purpose scripting language especially suited to web development.',
    'Python': 'A versatile programming language known for its readability and broad library support.',
    'C#': 'A modern, object-oriented programming language developed by Microsoft.',
    'Windows': 'A widely used operating system developed by Microsoft.',
    'Linux': 'A family of open-source Unix-like operating systems.',
    'AI/Robotics': 'The field of creating intelligent machines and automation.',
    'C': 'A powerful general-purpose programming language.',
    'C++': 'An extension of C that includes object-oriented features.',
    'Leadership': 'The ability to guide, inspire, and influence others.',
    'Adaptable': 'Able to adjust to new conditions and challenges with ease.',
    'Determined': 'Persistent in achieving goals despite obstacles.',
    'Open-minded': 'Willing to consider new ideas and perspectives.',
    'Team Oriented': 'Works well and collaborates effectively with others.',
    'Curiosity': 'A strong desire to learn, explore, and understand new things.',
    'Adventuring': 'Eager to seek out new experiences and embrace challenges.',
    'Self-aware': 'Conscious of your own strengths, weaknesses, and emotions.'
};

const skillModal = document.getElementById('skill-modal');
const skillModalTitle = document.getElementById('skill-modal-title');
const skillModalDesc = document.getElementById('skill-modal-desc');
const skillModalClose = document.getElementById('skill-modal-close');

// Use event delegation for skill icon clicks (works for duplicated carousel icons in both carousels)
['carousel-track', 'carousel-track-personality'].forEach(trackId => {
    const el = document.getElementById(trackId);
    if (el) {
        // Assign unique animation delay to every icon for wave effect
        el.querySelectorAll('.skill-icon').forEach((icon, idx) => {
            icon.style.animationDelay = (0.4 * idx) + 's';
            icon.style.cursor = 'pointer';
        });
        el.addEventListener('click', (e) => {
            const icon = e.target.closest('.skill-icon');
            if (icon) {
                const title = icon.getAttribute('title');
                skillModalTitle.textContent = title;
                skillModalDesc.textContent = skillDescriptions[title] || '';
                skillModal.style.display = 'flex';
            }
        });
    }
});
if (skillModalClose) {
    skillModalClose.addEventListener('click', () => {
        skillModal.style.display = 'none';
    });
}
window.addEventListener('click', (e) => {
    if (e.target === skillModal) {
        skillModal.style.display = 'none';
    }
});
// Carousel animation for skill icons (works for both carousels)
// Draggable and animated carousel
function startCarousel(carouselTrack, reverse = false, pingPong = false) {
    let pos = 0;
    let speed = 0.5;
    let animating = true;
    let drag = false;
    let startX = 0;
    let lastX = 0;
    let isDragging = false;
    let dragMoved = false;
    let dragThreshold = 5;
    let direction = reverse ? 1 : -1;
    // Only duplicate icons for skill carousel (not personality)
    if (!pingPong) {
        const icons = Array.from(carouselTrack.children);
        let minWidth = carouselTrack.parentElement ? carouselTrack.parentElement.offsetWidth : 0;
        let iconsWidth = carouselTrack.scrollWidth;
        let times = 1;
        while (iconsWidth < minWidth * 2) {
            icons.forEach(icon => {
                carouselTrack.appendChild(icon.cloneNode(true));
            });
            iconsWidth = carouselTrack.scrollWidth;
            times++;
            if (times > 10) break; // safety
        }
    }
    function loop() {
        if (animating && !drag) {
            pos += speed * direction;
            // Ping-pong logic for personality carousel
            if (pingPong) {
                const minPos = Math.min(0, carouselTrack.parentElement.offsetWidth - carouselTrack.scrollWidth);
                const maxPos = 0;
                if (pos < minPos) {
                    pos = minPos;
                    direction *= -1;
                } else if (pos > maxPos) {
                    pos = maxPos;
                    direction *= -1;
                }
            } else {
                if (Math.abs(pos) > carouselTrack.scrollWidth / 2) {
                    pos = 0;
                }
            }
            carouselTrack.style.transform = `translateX(${pos}px)`;
        }
        requestAnimationFrame(loop);
    }
    // Pause on mouse hover
    carouselTrack.addEventListener('mouseenter', () => {
        animating = false;
    });
    carouselTrack.addEventListener('mouseleave', () => {
        if (!drag) animating = true;
    });
    // Improved drag logic: allow drag from anywhere, add drag threshold, prevent accidental icon click
    carouselTrack.addEventListener('mousedown', (e) => {
        drag = true;
        isDragging = false;
        dragMoved = false;
        animating = false;
        startX = e.clientX;
        lastX = startX;
        carouselTrack.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', (e) => {
        if (!drag) return;
        const dx = e.clientX - lastX;
        if (!isDragging && Math.abs(e.clientX - startX) > dragThreshold) {
            isDragging = true;
        }
        if (isDragging) {
            dragMoved = true;
            lastX = e.clientX;
            pos += dx;
            carouselTrack.style.transform = `translateX(${pos}px)`;
        }
    });
    window.addEventListener('mouseup', (e) => {
        if (drag) {
            drag = false;
            animating = true;
            carouselTrack.style.cursor = '';
        }
    });
    // Prevent accidental click on icon after drag
    carouselTrack.addEventListener('click', (e) => {
        if (dragMoved) {
            e.stopImmediatePropagation();
            dragMoved = false;
        }
    }, true);
    // Touch events
    carouselTrack.addEventListener('touchstart', (e) => {
        drag = true;
        isDragging = false;
        dragMoved = false;
        animating = false;
        startX = e.touches[0].clientX;
        lastX = startX;
    });
    window.addEventListener('touchmove', (e) => {
        if (!drag) return;
        const dx = e.touches[0].clientX - lastX;
        if (!isDragging && Math.abs(e.touches[0].clientX - startX) > dragThreshold) {
            isDragging = true;
        }
        if (isDragging) {
            dragMoved = true;
            lastX = e.touches[0].clientX;
            pos += dx;
            carouselTrack.style.transform = `translateX(${pos}px)`;
        }
    });
    window.addEventListener('touchend', (e) => {
        if (drag) {
            drag = false;
            animating = true;
        }
    });
    // Prevent accidental tap on icon after drag
    carouselTrack.addEventListener('touchend', (e) => {
        if (dragMoved) {
            e.stopImmediatePropagation();
            dragMoved = false;
        }
    }, true);
    loop();
}
const carouselTrack = document.getElementById('carousel-track');
if (carouselTrack) startCarousel(carouselTrack);
const carouselTrackPersonality = document.getElementById('carousel-track-personality');
if (carouselTrackPersonality) startCarousel(carouselTrackPersonality, false, true);
// Fun overlay on profile photo hover (afro or shades)
const funOverlay = document.getElementById('fun-overlay');
const overlayContainer = document.querySelector('.photo-overlay-container');
if (overlayContainer && funOverlay) {
    overlayContainer.addEventListener('mouseenter', () => {
        funOverlay.src = 'shades.png';
        funOverlay.style.display = 'block';
        setTimeout(() => funOverlay.classList.add('visible'), 10);
    });
    overlayContainer.addEventListener('mouseleave', () => {
        funOverlay.classList.remove('visible');
        setTimeout(() => funOverlay.style.display = 'none', 500);
    });
}
// Add your social links here
const socialLinks = [
    { href: 'https://linkedin.com/in/yourprofile', icon: 'fab fa-linkedin' },
    { href: 'https://github.com/yourprofile', icon: 'fab fa-github' },
    { href: 'mailto:your.email@example.com', icon: 'fas fa-envelope' }
];

// Typing effect for tagline
const subtitle = document.querySelector('.subtitle');
const tagline = subtitle ? subtitle.textContent : '';
let i = 0;
if (subtitle) subtitle.textContent = '';
function typeWriter() {
    if (i < tagline.length) {
        subtitle.textContent += tagline.charAt(i);
        i++;
        setTimeout(typeWriter, 80);
    }
}
typeWriter();

// Smooth scroll for nav links
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Insert social icons
const socialDiv = document.querySelector('.social-icons');
socialLinks.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.target = '_blank';
    a.innerHTML = `<i class="${link.icon}"></i>`;
    socialDiv.appendChild(a);
});

// Fade-in animation for sections
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            sec.classList.add('visible');
        }
    });
});

// Easter egg: Reveal fun facts with confetti when profile photo is clicked 5 times
let photoClicks = 0;
const profilePhoto = document.querySelector('.profile-photo');
const funFacts = document.getElementById('fun-facts');
const ringProgress = document.getElementById('ring-progress');
const maxClicks = 3;
const ringCircumference = 2 * Math.PI * 60; // r=60
if (ringProgress) {
    ringProgress.style.strokeDasharray = ringCircumference;
    ringProgress.style.strokeDashoffset = ringCircumference;
}
function updateRing() {
    if (ringProgress) {
        const percent = Math.min(photoClicks / maxClicks, 1);
        ringProgress.style.strokeDashoffset = ringCircumference * (1 - percent);
    }
}
function resetRing() {
    if (ringProgress) {
        ringProgress.style.strokeDashoffset = ringCircumference;
    }
}
function launchConfetti() {
    // Simple confetti effect
    for (let i = 0; i < 60; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.background = `hsl(${Math.random()*360}, 80%, 60%)`;
        conf.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 2000);
    }
}
if (profilePhoto) {
    profilePhoto.addEventListener('click', () => {
        photoClicks++;
        updateRing();
        if (photoClicks === maxClicks) {
            if (funFacts) funFacts.style.display = 'block';
            launchConfetti();
            setTimeout(() => {
                photoClicks = 0;
                resetRing();
            }, 2000);
        }
    });
}

// Debugging for sign-in and content rendering
console.log('Script loaded.');
window.onload = function() {
    console.log('Window loaded.');
    // Debug Firebase Auth
    if (firebase && firebase.auth) {
        firebase.auth().onAuthStateChanged(function(user) {
            console.log('Auth state changed:', user);
            window.isAdmin = !!user && user.email === 'mqtthewilustre@gmail.com';
            console.log('isAdmin:', window.isAdmin);
            if (window.toggleAdminUI) window.toggleAdminUI();
        });
    } else {
        console.log('Firebase Auth not found.');
    }
    // Debug Firestore loading
    if (window.db) {
        window.db.collection('projects').orderBy('title').onSnapshot(snapshot => {
            console.log('Projects snapshot:', snapshot.docs);
            if (window.renderProjects) window.renderProjects(snapshot.docs);
        });
        window.db.collection('experience').orderBy('years').onSnapshot(snapshot => {
            console.log('Experience snapshot:', snapshot.docs);
            if (window.renderExperience) window.renderExperience(snapshot.docs);
        });
    } else {
        console.log('Firestore not found.');
    }
    // Debug sign-in button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.onclick = () => {
            console.log('Sign in button clicked.');
            firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
        };
    } else {
        console.log('Login button not found.');
    }
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            console.log('Sign out button clicked.');
            firebase.auth().signOut();
        };
    } else {
        console.log('Logout button not found.');
    }
};
