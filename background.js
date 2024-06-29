console.log('Service worker is running');

const imageExtensions = ['.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.png', '.gif', '.webp',
                        '.tiff', '.tif', '.psd', '.raw', '.arw', '.cr2', '.nrw', '.k25', '.bmp', 
                        '.dib', '.heif', '.heic', '.ind', '.indd', '.indt', '.jp2', '.j2k', '.jpf',
                        '.jpf', '.jpx', '.jpm', '.mj2', '.svg', '.svgz', '.ai', '.eps', '.ico'];

const videoExtensions = ['.webm', '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.ogg', '.mp4', '.mp4v',
                        '.m4v', '.avi', '.wmv', '.mov', '.qt', '.flv', '.swf', '.avchd'];

const audioExtensions = ['.m4a', '.flac', 'mp3', '.wav', '.wma', '.aac'];

const documentExtensions = ['.doc', '.docx', '.odt', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx'];

function extractFileName(url) {
    const urlParts = url.split('/');
    const fileNameWithParams = urlParts[urlParts.length - 1];
    return fileNameWithParams.split('?')[0];
}
function determineNewPath(downloadItem) {
    chrome.storage.sync.get(['images', 'videos', 'music', 'documents'], function(items) {
        let fileName = downloadItem.filename.toLowerCase();
        if (!fileName) {
            fileName = extractFileName(downloadItem.finalUrl).toLowerCase();
        }
        let destination = '';
    
        // Checks if file extension matches any of the extensions
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
        }
    
        if (destination) {
          const newPath = `${destination}\\${fileName}`;
          console.log('New path:', newPath);
    
          chrome.runtime.onInstalled.addListener(function() {
            console.log("Service worker installed.");
          });
          chrome.downloads.onDeterminingFileName.addListener(function(item, suggest) {
            if (item.id === downloadItem.id) {
              suggest({ filename: newPath });
              console.log('Filename suggestion:', newPath);
            }
          });
        } else {
          console.log('No matching extension found for:', fileName);
        }
    });
}

// Listener for downloads
chrome.downloads.onCreated.addListener(function(downloadItem) {
    console.log('Download created:', downloadItem);
    determineNewPath(downloadItem);
});