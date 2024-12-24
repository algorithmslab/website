function loadJSON(filePath, callback) {
    const request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open('GET', filePath, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                callback(JSON.parse(request.responseText));
            } else {
                console.error(`Failed to load JSON file: ${filePath}`);
            }
        }
    };
    request.onerror = function () {
        console.error(`Error occurred while fetching JSON file: ${filePath}`);
    };
    request.send(null);
}
