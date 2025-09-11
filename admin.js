// Handles admin UI toggling for projects and experience
window.onload = function() {
    const addProjectBtn = document.getElementById('add-project-btn');
    const addForm = document.getElementById('add-project-form');
    const addExpBtn = document.getElementById('add-experience-btn');
    const addExpForm = document.getElementById('add-experience-form');
    function toggleAdminUI(isAdmin) {
        // Projects
        if (addProjectBtn) {
            addProjectBtn.style.display = isAdmin ? '' : 'none';
        }
        if (addForm) addForm.style.display = 'none';
        // Experience
        if (addExpBtn) {
            addExpBtn.style.display = isAdmin ? '' : 'none';
        }
        if (addExpForm) addExpForm.style.display = 'none';
        // Hide preview upload for non-admin
        const previewUpload = document.getElementById('preview-upload-container');
        if (previewUpload) previewUpload.style.display = isAdmin ? '' : 'none';
    }
    window.toggleAdminUI = toggleAdminUI;
    // Show forms when admin buttons are clicked
    if (addProjectBtn && addForm) {
        addProjectBtn.onclick = function() {
            addForm.style.display = (addForm.style.display === 'none' || addForm.style.display === '') ? 'block' : 'none';
        };
    }
    if (addExpBtn && addExpForm) {
        addExpBtn.onclick = function() {
            addExpForm.style.display = (addExpForm.style.display === 'none' || addExpForm.style.display === '') ? 'block' : 'none';
        };
    }
    console.log('admin.js initialized');
}
