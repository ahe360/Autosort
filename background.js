const imageExtensions = ['.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.png', '.gif', '.webp',
                        '.tiff', '.tif', '.psd', '.raw', '.arw', '.cr2', '.nrw', '.k25', '.bmp', 
                        '.dib', '.heif', '.heic', '.ind', '.indd', '.indt', '.jp2', '.j2k', '.jpf',
                        '.jpf', '.jpx', '.jpm', '.mj2', '.svg', '.svgz', '.ai', '.eps', '.ico'];

const videoExtensions = ['.webm', '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.ogg', '.mp4', '.mp4v',
                        '.m4v', '.avi', '.wmv', '.mov', '.qt', '.flv', '.swf', '.avchd'];

const audioExtensions = ['.m4a', '.flac', 'mp3', '.wav', '.wma', '.aac'];

const documentExtensions = ['.doc', '.docx', '.odt', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx'];

// Listener for downloads
chrome.downloads.onCreated.addListener(function(downloadedItem) {
    chrome.storage.sync.get(['images', 'videos', 'music', 'documents'], function(items) {
        const fileName = downloadedItem.filename.toLowerCase();
        let destination = '';

        // Checks if the end of a file name matches with any of the specified extensions 
        if (imageExtensions.some(ext => fileName.endsWith(ext))) {
            destination = items.images || '';
        } else if (videoExtensions.some(ext => fileName.endsWith(ext))) {
            destination = items.videos || '';
        } else if (audioExtensions.some(ext => fileName.endsWith(ext))) {
            destination = items.music || '';
        } else if (documentExtensions.some(ext => fileName.endsWith(ext))) {
            destination = items.documents || '';
        } 

        if (destination) {
            const newPath = '${destination}\\${downloadedItem.filename}';
            chrome.downloads.onDeterminingFileName.addListener(function(item, suggest) {
                if (item.id === downloadItem.id) {
                    suggest({ filename: newPath });
                }
            });
        }
    });
});