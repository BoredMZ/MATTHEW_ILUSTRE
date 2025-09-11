// init.js: Handles all initialization (Firebase, global variables, auth, Firestore listeners)
console.log('init.js loaded');
// Firebase config and initialization
const firebaseConfig = {
  apiKey: "AIzaSyAri5tv-KLDt7yAXRsuONDefFbj79AVlo4",
  authDomain: "matthew-ilustre.firebaseapp.com",
  projectId: "matthew-ilustre",
  storageBucket: "matthew-ilustre.firebasestorage.app",
  messagingSenderId: "1021382948967",
  appId: "1:1021382948967:web:e5161bf2eab970163abcc2",
  measurementId: "G-5SR182E3XM"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
let isAdmin = false;
let editExpId = null;
let editProjId = null;
const expList = document.getElementById('experience-list');
const projList = document.querySelector('.project-list');
const addExpForm = document.getElementById('add-experience-form');
const addProjForm = document.getElementById('add-project-form');

// Auth state
firebase.auth().onAuthStateChanged(user => {
    console.log('Auth state changed:', user);
    if (user) {
        // Check if user is admin
        isAdmin = user.email === 'mqtthewilustre@gmail.com'; // TODO: Replace with your real admin email
        window.toggleAdminUI(isAdmin);
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = '';
    } else {
        isAdmin = false;
        window.toggleAdminUI(false);
        document.getElementById('login-btn').style.display = '';
        document.getElementById('logout-btn').style.display = 'none';
    }
});

// Sign-in/out button logic
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
loginBtn.onclick = function() {
    console.log('Sign in button clicked.');
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
        console.log('Signed in:', result.user);
    }).catch(error => {
        console.error('Sign-in error:', error);
    });
};
logoutBtn.onclick = function() {
    console.log('Sign out button clicked.');
    firebase.auth().signOut().then(() => {
        console.log('Signed out');
    });
};

// Firestore listeners
function listenForProjects() {
    db.collection('projects').orderBy('title').onSnapshot(snapshot => {
        console.log('Projects snapshot:', snapshot.docs);
        window.renderProjects(snapshot.docs);
    });
}
function listenForExperience() {
    db.collection('experience').orderBy('years').onSnapshot(snapshot => {
        console.log('Experience snapshot:', snapshot.docs);
        window.renderExperience(snapshot.docs);
    });
}
listenForProjects();
listenForExperience();
// Make all main sections visible after DOM is loaded
document.querySelectorAll('section').forEach(section => {
    section.classList.add('visible');
});

document.addEventListener('DOMContentLoaded', function() {
    function showSkillModal(title, desc) {
        const modal = document.getElementById('skill-modal');
        document.getElementById('skill-modal-title').textContent = title;
        document.getElementById('skill-modal-desc').textContent = desc;
        modal.style.display = 'flex';
    }
    document.querySelectorAll('.skill-icon').forEach(icon => {
        icon.onclick = function() {
            const title = icon.getAttribute('title');
            let desc = '';
            switch(title) {
                case 'HTML5': desc = 'HTML5 is the standard markup language for creating web pages.'; break;
                case 'CSS3': desc = 'CSS3 is used for styling and designing web pages.'; break;
                case 'JavaScript': desc = 'JavaScript enables interactive web features and dynamic content.'; break;
                case 'PHP': desc = 'Server-side scripting for web development.'; break;
                case 'Python': desc = 'Python is a versatile, high-level programming language.'; break;
                case 'C#': desc = 'C# is a modern, object-oriented programming language developed by Microsoft.'; break;
                case 'Windows': desc = 'Popular operating system for PCs.'; break;
                case 'Linux': desc = 'Open-source operating system for servers and desktops.'; break;
                case 'AI/Robotics': desc = 'AI/Robotics involves intelligent automation and machine learning.'; break;
                case 'C': desc = 'C is a foundational programming language for system and application development.'; break;
                case 'C++': desc = 'C++ extends C with object-oriented features for complex software.'; break;
                case 'Leadership': desc = 'Ability to guide and inspire teams.'; break;
                case 'Adaptable': desc = 'Quick to adjust to new situations.'; break;
                case 'Determined': desc = 'Persistent in achieving goals.'; break;
                case 'Open-minded': desc = 'Willing to consider new ideas.'; break;
                case 'Team Oriented': desc = 'Works well in collaborative environments.'; break;
                case 'Curiosity': desc = 'Eager to learn and explore.'; break;
                case 'Adventuring': desc = 'Enjoys new experiences and challenges.'; break;
                case 'Self-aware': desc = 'Understands own strengths and weaknesses.'; break;
                default: desc = 'Skill description.';
            }
            showSkillModal(title, desc);
        };
    });
    document.getElementById('skill-modal-close').onclick = function() {
        document.getElementById('skill-modal').style.display = 'none';
    };
    const profilePhoto = document.querySelector('.profile-photo');
    const funOverlay = document.getElementById('fun-overlay');
    const funFacts = document.getElementById('fun-facts');
    const ringProgress = document.getElementById('ring-progress');
    let funState = 0;
    // Set ring to have no color by default
    if (ringProgress) {
        ringProgress.setAttribute('stroke', 'none');
        ringProgress.setAttribute('stroke-dashoffset', '377'); // full offset (empty)
    }
    // Show fun overlay on hover
    profilePhoto.addEventListener('mouseenter', function() {
        funOverlay.src = 'shades.png';
        funOverlay.style.display = 'block';
    });
    profilePhoto.addEventListener('mouseleave', function() {
        funState = 0;
        if (ringProgress) {
            ringProgress.setAttribute('stroke', 'none');
            ringProgress.setAttribute('stroke-dashoffset', '377'); // empty
        }
        funOverlay.style.display = 'none';
        if (funFacts) funFacts.style.display = 'none';
    });
    profilePhoto.addEventListener('click', function() {
        funState = (funState + 1) % 4;
        // Animate ring fill
        if (ringProgress) {
            if (funState === 1) {
                ringProgress.setAttribute('stroke', '#ffd700');
                ringProgress.setAttribute('stroke-dashoffset', (377 * 2/3).toString()); // 1/3 filled
            } else if (funState === 2) {
                ringProgress.setAttribute('stroke', '#ffd700');
                ringProgress.setAttribute('stroke-dashoffset', (377 * 1/3).toString()); // 2/3 filled
            } else if (funState === 3) {
                ringProgress.setAttribute('stroke', '#ffd700');
                ringProgress.setAttribute('stroke-dashoffset', '0'); // full ring
            } else {
                ringProgress.setAttribute('stroke', 'none');
                ringProgress.setAttribute('stroke-dashoffset', '377'); // empty
            }
        }
        if (funState === 1) {
            funOverlay.src = 'shades.png';
            funOverlay.style.display = 'block';
            if (funFacts) funFacts.style.display = 'none';
        } else if (funState === 2) {
            funOverlay.style.display = 'none';
            if (funFacts) funFacts.style.display = 'none';
        } else if (funState === 3) {
            funOverlay.style.display = 'none';
            if (funFacts) funFacts.style.display = '';
            // Confetti animation
            for (let i = 0; i < 30; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.background = `hsl(${Math.random()*360},80%,60%)`;
                confetti.style.animationDuration = (1.5 + Math.random()*1.5) + 's';
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 2200);
            }
        } else {
            funOverlay.style.display = 'none';
            if (funFacts) funFacts.style.display = 'none';
        }
    });
    // Add project form submit
    const addProjForm = document.getElementById('add-project-form');
    if (addProjForm) {
        // Upload preview button logic (PHP local upload)
        const uploadBtn = document.getElementById('upload-preview-btn');
        const fileInput = document.getElementById('project-preview-file');
        const filenameInput = document.getElementById('project-preview-filename');
        if (uploadBtn && fileInput && filenameInput) {
            uploadBtn.addEventListener('click', function() {
                const file = fileInput.files[0];
                if (!file) {
                    alert('Please select a file to upload.');
                    return;
                }
                uploadBtn.disabled = true;
                uploadBtn.textContent = 'Uploading...';
                const formData = new FormData();
                formData.append('file', file);
                fetch('upload.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        filenameInput.value = 'img/video/' + data.filename;
                        alert('Preview uploaded!');
                    } else {
                        alert('Error uploading preview: ' + data.error);
                    }
                    uploadBtn.textContent = 'Upload Preview';
                    uploadBtn.disabled = false;
                })
                .catch(err => {
                    alert('Error uploading preview: ' + err.message);
                    uploadBtn.textContent = 'Upload Preview';
                    uploadBtn.disabled = false;
                });
            });
        }
        addProjForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('project-title').value;
            const desc = document.getElementById('project-desc').value;
            const link = document.getElementById('project-link').value;
            // Use the correct path for images/videos
            let previewVal = document.getElementById('project-preview-filename').value.trim();
            let previewUrl = previewVal.startsWith('img/') ? previewVal : 'img/' + previewVal;
            if (editProjId) {
                db.collection('projects').doc(editProjId).update({
                    title,
                    desc,
                    link,
                    previewUrl
                }).then(() => {
                    addProjForm.reset();
                    addProjForm.style.display = 'none';
                    editProjId = null;
                    setFormMode(false);
                    alert('Project updated!');
                }).catch(err => {
                    alert('Error updating project: ' + err.message);
                });
            } else {
                db.collection('projects').add({
                    title,
                    desc,
                    link,
                    previewUrl
                }).then(() => {
                    addProjForm.reset();
                    addProjForm.style.display = 'none';
                    alert('Project added!');
                }).catch(err => {
                    alert('Error adding project: ' + err.message);
                });
            }
        });
    }
    // Add experience form submit
    const addExpForm = document.getElementById('add-experience-form');
    if (addExpForm) {
        addExpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('exp-title').value;
            const years = document.getElementById('exp-years').value;
            const desc = document.getElementById('exp-desc').value;
            db.collection('experience').add({
                title,
                years,
                desc
            }).then(() => {
                addExpForm.reset();
                addExpForm.style.display = 'none';
                alert('Experience added!');
            }).catch(err => {
                alert('Error adding experience: ' + err.message);
            });
        });
    }
});

function animateCarouselTrack(trackSelector, speed = 0.7) {
    const track = document.querySelector(trackSelector);
    if (!track) return;
    // Duplicate icons for seamless infinite loop
    if (!track.dataset.cloned) {
        track.innerHTML += track.innerHTML;
        track.dataset.cloned = 'true';
    }
    let offset = 0;
    const singleWidth = track.scrollWidth / 2;
    let paused = false;
    track.addEventListener('mouseenter', () => { paused = true; });
    track.addEventListener('mouseleave', () => { paused = false; });
    function loop() {
        if (!paused) {
            offset += speed;
            track.style.transform = `translateX(-${offset}px)`;
            if (offset >= singleWidth) {
                offset = 0;
            }
        }
        requestAnimationFrame(loop);
    }
    loop();
}
animateCarouselTrack('#carousel-track', 0.7);

console.log('Initialization complete.');
