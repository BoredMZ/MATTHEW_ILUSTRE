// Handles experience rendering and admin controls
console.log('experience.js loaded');
function renderExperience(experiences) {
    console.log('Rendering experience:', experiences);
    expList.innerHTML = '';
    experiences.forEach(doc => {
        const data = doc.data();
        const entry = document.createElement('div');
        entry.className = 'job';
        entry.innerHTML = `
            <h3>${data.title}</h3>
            <span>${data.years}</span>
            <p>${data.desc}</p>
            ${isAdmin ? `<button class=\"edit-exp-btn\" data-id=\"${doc.id}\" style=\"margin-top:10px; background:#ffd700; color:#222; border:none; border-radius:6px; padding:6px 16px; font-weight:bold; cursor:pointer;\">Edit</button>` : ''}
        `;
        expList.appendChild(entry);
    });
    if (isAdmin) {
        document.querySelectorAll('.edit-exp-btn').forEach(btn => {
            btn.onclick = function() {
                const id = btn.getAttribute('data-id');
                db.collection('experience').doc(id).get().then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        document.getElementById('exp-title').value = data.title;
                        document.getElementById('exp-years').value = data.years;
                        document.getElementById('exp-desc').value = data.desc;
                        addExpForm.style.display = '';
                        editExpId = id;
                        setExpFormMode(true);
                    }
                });
            };
        });
    }
}
window.renderExperience = renderExperience;
console.log('experience.js initialized');
