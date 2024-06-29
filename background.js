chrome.runtime.onInstalled.addListener(function() {
    console.log('Service worker is running.');
  });
  
  const imageExtensions = ['.jpeg', '.jpg', '.gif', '.png', '.svg', '.webp', '.tiff', '.tif', '.psd', '.raw', '.arw', '.cr2', '.nrw', '.k25', '.bmp', '.dib', '.heif', '.heic'];
  const videoExtensions = ['.mp4', '.mkv', '.webm', '.flv', '.vob', '.ogv', '.ogg', '.drc', '.gifv', '.mng', '.avi', '.mts', '.m2ts', '.ts', '.mov', '.qt', '.wmv', '.yuv', '.rm', '.rmvb', '.asf', '.amv', '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.svi', '.3gp', '.3g2', '.mxf', '.roq', '.nsv', '.f4v', '.f4p', '.f4a', '.f4b'];
  const documentExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.odt', '.ods', '.odp', '.rtf', '.txt', '.wpd', '.tex', '.epub'];
  const audioExtensions = ['.mp3', '.wav', '.aac', '.flac', '.ogg', '.wma', '.m4a', '.aiff', '.alac'];
  
  function extractFilename(url) {
    let urlParts = url.split('/');
    const filenameWithParams = urlParts[urlParts.length - 1];
    return filenameWithParams.split('?')[0];
  }
  
  function determineNewPath(filename, items) {
    let destination = '';
    
    if (imageExtensions.some(ext => filename.endsWith(ext))) {
      destination = items.images || '';
    } else if (videoExtensions.some(ext => filename.endsWith(ext))) {
      destination = items.videos || '';
    } else if (documentExtensions.some(ext => filename.endsWith(ext))) {
      destination = items.documents || '';
    } else if (audioExtensions.some(ext => filename.endsWith(ext))) {
      destination = items.music || '';
    }
    
    console.log(`Destination: ${destination}`);
    return destination ? `${destination}\\${filename}` : '';
  }
  
  chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
    chrome.storage.sync.get(['images', 'videos', 'music', 'documents'], function(items) {
        const cleanFilename = extractFilename(item.url);
        const newPath = determineNewPath(cleanFilename, items);
      
        if (newPath) {
            suggest({filename: newPath});
        }
    });
});  