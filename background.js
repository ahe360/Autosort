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

function determineNewPath(fileName, items) {
    let destination = '';

    // Check which extension end of file matches with
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

// Add the listener outside of the onCreated handler
chrome.downloads.onDeterminingFilename.addListener(function onDeterminingFilename(item, suggest) {
    console.log('Determining filename for item:', item);
    console.log('downloadItem:', item);
    chrome.storage.sync.get(['images', 'videos', 'music', 'documents'], function(items) {
        const fileName = extractFileName(item.finalUrl || item.url);
        console.log('File name with params:', fileName);
        const cleanFileName = extractFileName(fileName);
        console.log('Clean file name:', cleanFileName);
        const newPath = determineNewPath(cleanFileName, items);
        if (newPath) {
            console.log('New path:', newPath);
            suggest({ filename: newPath });
            console.log('Filename suggestion:', newPath);
            chrome.downloads.onDeterminingFilename.removeListener(onDeterminingFilename);
        }
    });
});

// Listener for downloads
chrome.downloads.onCreated.addListener(function(downloadItem) {
    console.log('Download created:', downloadItem);
    // This part is now moved to the onDeterminingFilename listener
});
