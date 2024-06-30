console.log('Service worker is running');
chrome.runtime.onInstalled.addListener(function() {
    console.log("Service worker installed");
});

const imageExtensions = ['.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.png', '.gif', '.webp', '.tiff', '.tif', '.psd', '.raw', '.arw', '.cr2', '.nrw', '.k25', '.bmp', '.dib', '.heif', '.heic', '.ind', '.indd', '.indt', '.jp2', '.j2k', '.jpf', '.jpx', '.jpm', '.mj2', '.svg', '.svgz', '.ai', '.eps', '.ico'];
const videoExtensions = ['.webm', '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.ogg', '.mp4', '.mp4v', '.m4v', '.avi', '.wmv', '.mov', '.qt', '.flv', '.swf', '.avchd'];
const audioExtensions = ['.m4a', '.flac', 'mp3', '.wav', '.wma', '.aac'];
const documentExtensions = ['.doc', '.docx', '.odt', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx'];

function extractFileName(url) {
    const urlParts = url.split('/');
    const fileNameWithParams = urlParts[urlParts.length - 1];
    return fileNameWithParams.split('?')[0].split('&')[0];
}

function sanitizeFileName(fileName) {
    return fileName.replace(/[<>:"/\\|?*]/g, '_'); // Replace invalid characters with underscores
}

function ensureDirectoryExists(directory) {
    // This function is a placeholder. In a real implementation, you would need
    // to ensure the directory exists on the file system.
    // For example, using a native messaging host to interact with the file system.
    return true;
}

function determineNewPath(fileName, items) {
    let destination = '';

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

    if (destination) {
        console.log(`Safe filename detected. Destination: ${destination}`);
        const safeFileName = sanitizeFileName(fileName);
        const fullPath = destination.replace(/\//g, '\\') + '\\' + safeFileName; // Fixing the path separator to backslashes
        console.log(`Full path: ${fullPath}`);
        if (ensureDirectoryExists(destination)) {
            return fullPath;
        } else {
            console.error('Destination directory does not exist:', destination);
        }
    }

    console.log('No valid destination. Using original filename:', fileName);
    return fileName;
}

chrome.downloads.onDeterminingFilename.addListener(function(downloadItem, suggest) {
    console.log('Determining filename for item:', downloadItem);
    chrome.storage.sync.get(['images', 'videos', 'music', 'documents'], function(items) {
        const fileName = extractFileName(downloadItem.finalUrl || downloadItem.url);
        console.log('File name with params:', fileName);
        const cleanFileName = extractFileName(fileName);
        console.log('Clean file name:', cleanFileName);
        const newPath = determineNewPath(cleanFileName, items);
        if (newPath) {
            console.log('New path:', newPath);
            suggest({ filename: newPath });
            console.log('Filename suggestion:', newPath);
        } else {
            console.log('Using original filename:', cleanFileName);
            suggest({ filename: cleanFileName });
        }
    });
    return true; // Indicates that suggest will be called asynchronously
});
