document.addEventListener('DOMContentLoaded', function() {
    loadOptions();

    document.getElementById('saveButton').addEventListener('click', saveOptions);
});

// Function to load saved options from Chrome's storage and populate input fields
function loadOptions() {
    chrome.storage.sync.get(['images', 'videos', 'music', 'documents'], function(items) {
        // Set input fields to be retrieved values or empty strings if not yet defined by user
        document.getElementById('images').value = items.images || '';
        document.getElementById('videos').value = items.videos || '';
        document.getElementById('music').value = items.music || '';
        document.getElementById('documents').value = items.documents || '';
    });
}

// Function to save user-input values from input fields into Chrome's storage
function saveOptions() {
    // Retrieve values from input fields; key-value pairs with the value being user's input paths
    const images = document.getElementById('images').value;
    const videos = document.getElementById('videos').value;
    const music = document.getElementById('music').value;
    const documents = document.getElementById('documents').value;

    // Save values in Chrome's storage
    chrome.storage.sync.set({
        images: images,
        videos: videos,
        music: music,
        documents: documents
    }, function() {
        alert('Options saved.');
    });
}