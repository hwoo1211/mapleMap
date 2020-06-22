/* HTML DOM Elements */

var wSelection = document.querySelector('#world')   // World selection dropdown box
var tSelection = document.querySelector('#town')    // Town selection dropdown box
var pts = document.getElementById("points")         // All map points

/* Other global variables*/

var links = []  // Array of maps of links
var baseWorldMapUrl = 'https://maplestory.io/api/KMST/1101/map/worldmap/' // WorldMap URL
var baseMapUrl = 'https://maplestory.io/api/KMST/1101/map/'               // Map URL
var url; // Temp url variable that will be used throughout the code
var val // Temp variable 

/* Event Listeners */

// World Selection Dropdown Box Event
wSelection.addEventListener("change", function () { // When this box experiences change
    initializeDropdown();         // Delete extraneous towns in tSelect dropdown box
    mapChange(wSelection.value)   // Change to appropriate map
    loadMap()                     // Then get the points
});

// Town Seleciton Dropdown Box Event
tSelection.addEventListener("change", function () { // When this box experiences change
    if(tSelection.value != 'default') // If the selected option is not default
    {
        mapChange(tSelection.value)   // Then change to appropriate map
        loadMap()                     // Then get the points
    }
});



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

/* This function takes care of loading the points on the map*/

function loadMap() {
    links = []     // Empty the array

    while (pts.firstChild) // Remove all points from the screen
    {
        pts.removeChild(pts.firstChild)
    }

    let mapinfo_json = JSON.parse(Get(url)); // Fetch JSON file 
    let origin = mapinfo_json["baseImage"][0]["origin"]["value"] // Find the origin of the map file
    for(let i = 0; i < mapinfo_json["maps"].length; i++)
    {
        let type = mapinfo_json["maps"][i]["type"] // This gives the type of point (town, starforce, etc)

        // This is the coordinate for the point
        let point = [origin["x"]+mapinfo_json["maps"][i]["spot"]["value"]["x"], origin["y"]+mapinfo_json["maps"][i]["spot"]["value"]["y"]]
        
        // String to add to the HTML
        let imgstr = "<img src='images/points/mapImage_" + type + ".png'" + // this is image source
                /*"id='" + getTownName(mapinfo_json["maps"][i]["mapNumbers"][0]) + "'" +*/  // Id of the image
                "class='pts' style='position: absolute; left: " + // This places the points on the right place on the map
                (point[0]-returnSize(type)).toString() + "px ; top: " + (point[1]-returnSize(type)).toString() + "px;'>"

        // Add to HTML
        document.getElementById('points').innerHTML += imgstr
    }

    // Add to the tSelect Dropdown box
    let towns = []
    for (let j = 0; j < mapinfo_json["links"].length; j++)
    {
        var opt = document.createElement("option")

        opt.text = mapinfo_json["links"][j]["toolTip"]
        opt.value = mapinfo_json["links"][j]["linksTo"]
        opt.id = 'tOption'

        if(!towns.includes(opt.text))
        {
            towns.push(opt.text)
            tSelection.options.add(opt);
        }
        else
            continue
    }
}


// Change the map based on the option given
function mapChange(val) {
    url = baseWorldMapUrl + val;
    document.querySelector('#mapvis').src = 'images/wMaps/' + val + '.png' 
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



// Functions to be run on initial load
mapChange(wSelection.value)
loadMap(); 

