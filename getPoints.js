/* HTML DOM Elements */

var wSelection = document.querySelector('#world')
var tSelection = document.querySelector('#town')
var pts = document.getElementById("points")

/* Other global variables*/

var links = []
var url;
var val

/* Event Listeners */

wSelection.addEventListener("change", loadMap);




/* All the functions required for this js file */

/* This function is to fetch data from the maplestory.io in json form*/
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function Get(url){
    var request = new XMLHttpRequest(); // a new request
    request.open("GET",url,false);
    request.send(null);
    return request.responseText;          
}

/* This function takes care of loading the points on the map*/

function loadMap() {
    val = wSelection.value
    tSelection.value = 'default'; 

    while (pts.firstChild)
    {
        pts.removeChild(pts.firstChild)
    }

    worldChange(val);

    let mapinfo_json = JSON.parse(Get(url));
    let origin = mapinfo_json["baseImage"][0]["origin"]["value"]
    for(let i = 0; i < mapinfo_json["maps"].length; i++)
    {
        let type = mapinfo_json["maps"][0]["type"]
        let point = [origin["x"]+mapinfo_json["maps"][i]["spot"]["value"]["x"], origin["y"]+mapinfo_json["maps"][i]["spot"]["value"]["y"]]
        let imgstr = "<img src='images/points/mapImage_" + type + ".png' class='pts' style='position: absolute; left: " + 
                (point[0]-returnSize(type)).toString() + "px ; top: " + (point[1]-returnSize(type)).toString() + "px;'>"

        document.getElementById('points').innerHTML += imgstr
    }
}

function worldChange(val) {
    switch(val) {
        case 'maple':
            url = 'https://maplestory.io/api/KMST/1101/map/worldmap/WorldMap'
            document.querySelector('#mapvis').src = 'images/wMaps/WorldMap.png'
            break;
        case 'grandis':
            url = 'https://maplestory.io/api/KMST/1101/map/worldmap/GWorldMap'
            document.querySelector('#mapvis').src = 'images/wMaps/GWorldMap.png'
            break;
        case 'arcane': 
            url = 'https://maplestory.io/api/KMST/1101/map/worldmap/WorldMap082'
            document.querySelector('#mapvis').src = 'images/wMaps/WorldMap082.png'
            break;
        default: 
            alert('Try again later');
            break;
    }
}

/*function townChange(val) {
    switch(val) {

    }
}*/


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


loadMap(); // Initialize the map

