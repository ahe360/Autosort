console.log('Service worker is running');

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
    console.log('Download created:', downloadedItem);
    chrome.storage.sync.get(['images', 'videos', 'music', 'documents'], function(items) {
        console.log('Storage items:', items);
        const url = downloadedItem.url;
        console.log('Download URL:', url);
        const fileNameWithParams = url.substring(url.lastIndexOf('/') + 1).toLowerCase();
        console.log('File name with params:', fileNameWithParams);
        const cleanFileName = fileNameWithParams.split('?')[0]; // Strip out query parameters
        console.log('Clean file name:', cleanFileName);

        if (!cleanFileName) {
            console.error('Filename not found in downloadedItem:', downloadedItem);
            return;
        }

        let destination = '';

        console.log('Image Extensions:', imageExtensions);
        console.log('Video Extensions:', videoExtensions);
        console.log('Audio Extensions:', audioExtensions);
        console.log('Document Extensions:', documentExtensions);

        // Checks if the end of a file name matches with any of the specified extensions 
        if (imageExtensions.some(ext => cleanFileName.endsWith(ext))) {
            destination = items.images || '';
            console.log('Image detected:', cleanFileName, 'Destination', destination);
        } else if (videoExtensions.some(ext => cleanFileName.endsWith(ext))) {
            destination = items.videos || '';
            console.log('Video detected:', cleanFileName, 'Destination:', destination);
        } else if (audioExtensions.some(ext => cleanFileName.endsWith(ext))) {
            destination = items.music || '';
            console.log('Audio detected:', cleanFileName, 'Destination:', destination);
        } else if (documentExtensions.some(ext => cleanFileName.endsWith(ext))) {
            destination = items.documents || '';
            console.log('Document detected:', cleanFileName, 'Destination:', destination);
        } else {
            console.log('No matching extension found for:', cleanFileName);
        }

        if (destination) {
            const newPath = '${destination}\\${cleanFileName}';
            console.log('New path:', newPath);
            chrome.downloads.onDeterminingFileName.addListener(function(item, suggest) {
                if (item.id === downloadedItem.id) {
                    suggest({ filename: newPath });
                    console.log('Filename suggestion:', newPath);
                }
            });
        }
    });
});