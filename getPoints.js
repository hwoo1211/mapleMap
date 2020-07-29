/* HTML DOM Elements */

var wSelection = document.querySelector('#world')           // World selection dropdown box
var tSelection = document.querySelector('#town')            // Town selection dropdown box
var linkImage = document.getElementsByClassName('linkImgs') // 
var link = document.getElementById('links')                 // 
var pts = document.getElementById("points")                 // All map points
var backButton = document.querySelector('#back')            // Back button
var mapImage = document.getElementById("mapvis")

/* Other global variables*/

var wMapRegEx = /[A-Z]*WorldMap[0-9]*/
let history = []
let towns = []  // Array of current towns
var isWorldChanged = true;  // Did wSelection option change?
var isTownChanged = false   // Did tSelection option change? 
var isBackPressed = false;
var baseWorldMapUrl = 'https://maplestory.io/api/KMST/1101/map/worldmap/' // WorldMap URL
var baseMapUrl = 'https://maplestory.io/api/KMST/1101/map/'               // Map URL
var url; // Temp url variable that will be used throughout the code
var folder; // Folder to fetch the image from

/* Event Listeners */

// World Selection Dropdown Box Event
wSelection.addEventListener("change", function () { // When this box experiences change
    initializeDropdown();         // Delete extraneous towns in tSelect dropdown box
    isWorldChanged = true
    folder = getFolderName()
    mapChange(wSelection.value)   // Change to appropriate map
    loadMap()                     // Then get the points
});

// Town Seleciton Dropdown Box Event
tSelection.addEventListener("change", function () { // When this box experiences change
    history.push(wMapRegEx.exec(mapImage.src))
    getTownList();
    folder = getFolderName()
    if (tSelection.value != 'default') // If the selected option is not default
    {
        mapChange(tSelection.value)   // Then change to appropriate map
        loadMap()                     // Then get the points
    }
});

// Back Button event

backButton.addEventListener("click", function () { // dummy function for now; doesn't do anything
    tSelection.value = 'default'
    isBackPressed = true;
    let backMap = history.pop();
    if(backMap != undefined)
    {
        getTownList();
        folder = getFolderName(backMap)
        mapChange(backMap)
        loadMap();
    }
    else
        alert("This is the parent map")

    isBackPressed = false;
})



/* All the functions required for this js file */

/* This function is to fetch data from the maplestory.io in json form*/
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function Get(url){
    var request = new XMLHttpRequest(); // Instantiate new request
    request.open("GET",url,false);      // Open URL
    request.send(null);
    if (request.status != 404)          // If the status is good
    {
        return request.responseText;    // return the text of the request
    }
    else
        return null;                    // In case of 404, discard. 
}

// Function that returns the town name according to the map number. 
function getTownName(mapNum) { 
    let tempMap = baseMapUrl + mapNum.toString();
    let tempMapinfo_json = JSON.parse(Get(tempMap))
    let name = tempMapinfo_json["name"]

    if(name != null)
        return name.toString()
    else    
        return null
}

// Initialization  of the tSelection dropdown box. 
function initializeDropdown() {  
    while (tSelection.options.length != 1)
    {
        tSelection.options.remove(tSelection.options.length - 1) // Remove every element except 'default'
    }
    tSelection.value = 'default'; // Then select the default option

    
}

// Loading all the points on the map 
function loadPoints(jsn_file, originCoords) {
    let mapLength = jsn_file["maps"].length
    for(let i = 0; i < mapLength; i++)
    {
        let type = jsn_file["maps"][i]["type"] // This gives the type of point (town, starforce, etc)
        let mapId = jsn_file["maps"][i][""]
        // This is the coordinate for the point
        let point = [originCoords["x"]+jsn_file["maps"][i]["spot"]["value"]["x"], 
                     originCoords["y"]+jsn_file["maps"][i]["spot"]["value"]["y"]]
        
        // String to add to the HTML
        let imgstr = "<img src='images/points/mapImage_" + type + ".png'" + // this is image source
                "id='" + i + "'" +  // Id of the image
                "class='pts' style='position: absolute; left: " + // This places the points on the right place on the map
                (point[0]-returnSize(type)).toString() + "px ; top: " + (point[1]-returnSize(type)).toString() + "px;'>"

        // Add to HTML
        pts.innerHTML += imgstr
    }
}

// Loading highlight images per JSON file

function loadHighlightImages(jsn_file, originCoords) {
    let linkLength = jsn_file["links"].length
    // This loop below could be a function imo
    for (let j = 0; j < linkLength; j++)
    {
        var opt = document.createElement("option")

        opt.text = jsn_file["links"][j]["toolTip"]
        opt.value = jsn_file["links"][j]["linksTo"]
        
        // how do i resolve the below if-else statements

        let tList = []
        for (elem of tSelection.options)
        {
            tList.push(elem.value)
        }

        let idx = tList.indexOf(folder)

        if (isTownChanged && !towns.includes(opt.text))
        {
            opt.id = 'tOption-a'
            tSelection.options.add(opt, idx + 1);
            towns.push(opt.value)
        }
        else if (!towns.includes(opt.text) || isWorldChanged)
        {
            opt.id = 'tOption'
            tSelection.options.add(opt);
        }
        /*else
        {
            opt.id = 'tOption'
            tSelection.options.add(opt);
        }*/

        // The below could be a function as well

        let point = [originCoords["x"]-jsn_file["links"][j]["linkImage"]["origin"]["value"]["x"], 
        originCoords["y"]-jsn_file["links"][j]["linkImage"]["origin"]["value"]["y"]]

        let imgstr = "<img src='images/linkImages/" + folder + "/linkImg_" + j + ".png'" + 
                    " id='" + jsn_file["links"][j]["linksTo"] + "'" + 
                    " class='linkImgs'" + 
                    " style='position: absolute;" + 
                            "top: " + point[1] + "px;" + 
                            "left: " + point[0] + "px;" +
                            "opacity: 0;" + 
                            "z-index: " + 0 + ";'" + 
                    " onmouseover='this.style.opacity = 1.0;'" + 
                    " onmouseout='this.style.opacity = 0;'" + 
                    " onclick='history.push(wMapRegEx.exec(mapImage.src)); " + 
                    "          getTownList();" + 
                    "          folder = this.id; " + 
                    "          mapChange(this.id); " + 
                    "          loadMap();'>" // this is image source
        
        // Add to HTML
        document.getElementById('links').innerHTML += imgstr
       
    }
}

/* This function takes care of loading the points on the map*/

function loadMap() {

    while (pts.firstChild) // Remove all points from the screen
    {
        pts.removeChild(pts.firstChild)
    }
    while (link.firstChild)
    {
        link.removeChild(link.firstChild)
    }
    
    let mapinfo_json = JSON.parse(Get(url)); // Fetch JSON file 
    let origin = mapinfo_json["baseImage"][0]["origin"]["value"] // Find the origin of the map file
    
    loadPoints(mapinfo_json, origin)
    loadHighlightImages(mapinfo_json, origin)
    changeZVal()
    isTownChanged = false;
    isWorldChanged = false;
}

function getFolderName (backMap) {
    backMap = backMap || undefined
    if (tSelection.value === 'default')
    {
        if (isBackPressed)
        {
            return backMap
        }
        else 
            return wSelection.value
    }
    else  
        return tSelection.value
}


// Change the map based on the option given
function mapChange(val) {
    url = baseWorldMapUrl + val;
    document.querySelector('#mapvis').src = 'images/wMaps/' + val + '.png' 
}

function getTownList() {
    towns = []
    isTownChanged = true;
    for(let i = 0; i < tSelection.options.length; i++)
    {
        towns.push(tSelection.options[i].text)
    }
    
}


/* This function returns the radius of each point necessary for
    the point on the map to adjust correctly */

function returnSize (num) {
    switch(num)
    {
        case 0:
        case 2:
            return 10

        case 1:
        case 28:
            return 7

        case 3:
            return 6.5

        case 5: 
            return 32.5

        case 11:
            return 9

        case 12: 
            return 11.5

        case 29:
            return 9.5

        default:
            return 10
    }
}

function changeZVal() {
    for (img of linkImage)
    {
        if (img.naturalWidth > 150)
        {
            img.style.zIndex = "3"
        }
        else 
        {
            img.style.zIndex = "4"
        }
    }
}


// Functions to be run on initial load
mapChange(wSelection.value)
folder = getFolderName()
loadMap(); 