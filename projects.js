// Handles project card rendering, preview modal, and admin controls
console.log('projects.js loaded');
// Use global projList and addForm from init.js
// Toggles project form between edit and add mode
function setFormMode(isEdit) {
    const formTitle = document.querySelector('#add-project-form h3');
    const submitBtn = document.querySelector('#add-project-form button[type="submit"]');
    if (isEdit) {
        if (formTitle) formTitle.textContent = 'Edit Project';
        if (submitBtn) submitBtn.textContent = 'Confirm Edit';
    } else {
        if (formTitle) formTitle.textContent = 'Add New Project';
        if (submitBtn) submitBtn.textContent = 'Add Project';
    }
}
function renderProjects(projects) {
    console.log('Rendering projects:', projects);
    projList.innerHTML = '';
    projects.forEach(doc => {
        const data = doc.data();
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h3>${data.title}</h3>
            <p class="project-desc">${data.desc}</p>
            <a href="${data.link}" class="project-link" target="_blank">View Project</a>
            ${data.previewUrl ? `<button class="preview-project-btn" data-preview="${data.previewUrl}" style="margin:8px 8px 0 0; background:#4caf50; color:#fff; border:none; border-radius:6px; padding:6px 16px; font-weight:bold; cursor:pointer;">Preview</button>` : ''}
            ${isAdmin ? `<button class="edit-project-btn" data-id="${doc.id}" style="margin-top:10px; background:#ffd700; color:#222; border:none; border-radius:6px; padding:6px 16px; font-weight:bold; cursor:pointer;">Edit</button>` : ''}
        `;
        projList.appendChild(card);
    });
    document.querySelectorAll('.preview-project-btn').forEach(btn => {
        btn.onclick = function() {
            const previewUrl = btn.getAttribute('data-preview');
            console.log('Preview button clicked:', previewUrl);
            showPreviewModal(previewUrl);
        };
    });
    if (isAdmin) {
        document.querySelectorAll('.edit-project-btn').forEach(btn => {
            btn.onclick = function() {
                const id = btn.getAttribute('data-id');
                db.collection('projects').doc(id).get().then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        document.getElementById('project-title').value = data.title;
                        document.getElementById('project-desc').value = data.desc;
                        document.getElementById('project-link').value = data.link;
                        document.getElementById('project-preview-filename').value = data.previewUrl ? data.previewUrl.replace('img/video/', '') : '';
                        addProjForm.style.display = '';
                        editProjId = id;
                        setFormMode(true);
                    }
                });
            };
        });
    }
}
function showPreviewModal(previewUrl) {
    // Separate logic for image and video preview
    const ext = previewUrl.split('.').pop().toLowerCase();
    const contentDiv = document.getElementById('project-preview-content');
    if (!contentDiv) {
        console.log('No contentDiv found for preview modal.');
        return;
    }
    contentDiv.innerHTML = '';
    if (["jpg","jpeg","png","gif","webp"].includes(ext)) {
        // Image preview logic
        const img = document.createElement('img');
        img.src = previewUrl;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.borderRadius = '8px';
        img.alt = 'Project Preview Image';
        img.onerror = function() {
            contentDiv.innerHTML = '<div style="color:#fff;">Image not found or unsupported format.</div>';
        };
        contentDiv.appendChild(img);
    } else if (["mp4","webm","ogg"].includes(ext)) {
        // Video preview logic
        const video = document.createElement('video');
        video.src = previewUrl;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '100%';
        video.style.borderRadius = '8px';
        contentDiv.appendChild(video);
    } else {
        contentDiv.innerHTML = `<a href="${previewUrl}" target="_blank" style="color:#ffd700;">Open Preview</a>`;
    }
    document.getElementById('project-preview-modal').style.display = 'flex';
    attachPreviewCloseHandler();
}
function attachPreviewCloseHandler() {
    const previewModal = document.getElementById('project-preview-modal');
    const closePreviewBtn = document.getElementById('close-preview-btn');
    if (closePreviewBtn) {
        closePreviewBtn.onclick = function() {
            previewModal.style.display = 'none';
            const contentDiv = document.getElementById('project-preview-content');
            if (contentDiv) contentDiv.innerHTML = '';
        };
    }
}
window.renderProjects = renderProjects;
window.attachPreviewCloseHandler = attachPreviewCloseHandler;
window.showPreviewModal = showPreviewModal;
attachPreviewCloseHandler();
console.log('projects.js initialized');
