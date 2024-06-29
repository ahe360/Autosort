console.log('Service worker is running');

const imageExtensions = ['.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.png', '.gif', '.webp', '.tiff', '.tif', '.psd', '.raw', '.arw', '.cr2', '.nrw', '.k25', '.bmp', '.dib', '.heif', '.heic', '.ind', '.indd', '.indt', '.jp2', '.j2k', '.jpf', '.jpx', '.jpm', '.mj2', '.svg', '.svgz', '.ai', '.eps', '.ico'];
const videoExtensions = ['.webm', '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.ogg', '.mp4', '.m4v', '.avi', '.wmv', '.mov', '.qt', '.flv', '.swf', '.avchd'];
const audioExtensions = ['.m4a', '.flac', '.mp3', '.wav', '.wma', '.aac'];
const documentExtensions = ['.doc', '.docx', '.odt', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx'];

function extractFileName(url) {
    const urlParts = url.split('/');
    const fileNameWithParams = urlParts[urlParts.length - 1];
    return fileNameWithParams.split('?')[0].split('&')[0];
}

function determineNewPath(fileName, items) {
    let destination = '';

    // Check if the end of a file matches with any of the specified extensions
    if (imageExtensions.some(ext => fileName.endsWith(ext))) {
        destination = items.images || '';
        console.log('Image detected:', fileName, 'Destination:', destination);
    } else if (videoExtensions.some(ext => fileName.endsWith(ext))) {
        destination = items.videos || '';
        console.log('Video detected:', fileName, 'Destination:', destination);
    } else if (audioExtensions.some(ext => fileName.endsWith(ext))) {
        destination = items.music || '';
        console.log('Audio detected:', fileName, 'Destination:', destination);
    } else if (documentExtensions.some(ext => fileName.endsWith(ext))) {
        destination = items.documents || '';
        console.log('Document detected:', fileName, 'Destination:', destination);
    } else {
        console.log('No matching extension found for:', fileName);
    }

    return destination ? `${destination}\\${fileName}` : '';
}

// Registering the onDeterminingFilename listener once
chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
    chrome.storage.sync.get(['images', 'videos', 'music', 'documents'], function(items) {
        const fileName = extractFileName(item.finalUrl || item.url);
        const cleanFileName = extractFileName(fileName);
        const newPath = determineNewPath(cleanFileName, items);

        if (newPath) {
            console.log('New path:', newPath);
            suggest({ filename: newPath });
            console.log('Filename suggestion:', newPath);
        }
    });
});

// Listener for downloads
chrome.downloads.onCreated.addListener(function(downloadItem) {
    console.log('Download created:', downloadItem);
    const fileName = extractFileName(downloadItem.finalUrl || downloadItem.url);
    console.log('File name with params:', fileName);
    const cleanFileName = extractFileName(fileName);
    console.log('Clean file name:', cleanFileName);
});

chrome.runtime.onInstalled.addListener(function() {
    console.log("Service worker installed");
});
