/* HTML DOM Elements */

var wSelection = document.querySelector('#world')
var tSelection = document.querySelector('#town')
var pts = document.getElementById("points")

/* Other global variables*/

var links = []
var baseWorldMapUrl = 'https://maplestory.io/api/KMST/1101/map/worldmap/'
var baseMapUrl = 'https://maplestory.io/api/KMST/1101/map/'
var url;
var val

/* Event Listeners */

wSelection.addEventListener("change", function () {
    initializeDropdown();
    mapChange(wSelection.value)
    loadMap()
});
tSelection.addEventListener("change", function () {
    if(tSelection.value != 'default')
    {
        mapChange(tSelection.value)
        loadMap()
    }
});



/* All the functions required for this js file */

/* This function is to fetch data from the maplestory.io in json form*/
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function Get(url){
    var request = new XMLHttpRequest(); // a new request
    request.open("GET",url,false);
    request.send(null);
    if (request.status != 404)
    {
        
        return request.responseText;
    }
    else
        return null;           
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

function initializeDropdown() {
    while (tSelection.options.length != 1)
    {
        tSelection.options.remove(tSelection.options.length - 1)
    }
    tSelection.value = 'default';
}

/* This function takes care of loading the points on the map*/

function loadMap() {
    links = []
    

    while (pts.firstChild)
    {
        pts.removeChild(pts.firstChild)
    }

    let mapinfo_json = JSON.parse(Get(url));
    let origin = mapinfo_json["baseImage"][0]["origin"]["value"]
    for(let i = 0; i < mapinfo_json["maps"].length; i++)
    {
        let type = mapinfo_json["maps"][i]["type"]
        let point = [origin["x"]+mapinfo_json["maps"][i]["spot"]["value"]["x"], origin["y"]+mapinfo_json["maps"][i]["spot"]["value"]["y"]]
        let imgstr = "<img src='images/points/mapImage_" + type + ".png'" + 
                /*"id='" + getTownName(mapinfo_json["maps"][i]["mapNumbers"][0]) + "'" +*/
                "class='pts' style='position: absolute; left: " + 
                (point[0]-returnSize(type)).toString() + "px ; top: " + (point[1]-returnSize(type)).toString() + "px;'>"

        document.getElementById('points').innerHTML += imgstr
    }

    for (let j = 0; j < mapinfo_json["links"].length; j++)
    {
        var opt = document.createElement("option")

        opt.text = mapinfo_json["links"][j]["toolTip"]
        opt.value = mapinfo_json["links"][j]["linksTo"]

        tSelection.options.add(opt);
    }

    //let maps = []
    
    /*for (let k = 0; k < mapinfo_json["maps"].length; k++) 
    {
        let tempMap = baseMapUrl + mapinfo_json["maps"][k]["mapNumbers"][0].toString();
        let tempMapinfo_json = JSON.parse(Get(tempMap))
        maps.push(tempMapinfo_json["name"])


    }*/
}

function mapChange(val) {
    url = baseWorldMapUrl + val;
    document.querySelector('#mapvis').src = 'images/wMaps/' + val + '.png' 
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

mapChange(wSelection.value) // Initialize the map
loadMap(); 

