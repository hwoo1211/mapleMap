/* This function is to fetch data from the maplestory.io in json form*/
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

var selection = document.querySelector('#world')
var pts = document.getElementById("points")

selection.onchange = function() {
    var url;
    var val = selection.value
    while (pts.firstChild)
    {
        pts.removeChild(pts.firstChild)
    }

    switch(val) {
        case 'maple':
            url = 'https://maplestory.io/api/KMST/1101/map/worldmap/WorldMap'
            document.querySelector('#mapvis').src = 'images/WorldMap.png'
            break;
        case 'grandis':
            url = 'https://maplestory.io/api/KMST/1101/map/worldmap/GWorldMap'
            document.querySelector('#mapvis').src = 'images/GWorldMap.png'
            break;
        case 'arcane': 
            url = 'https://maplestory.io/api/KMST/1101/map/worldmap/WorldMap082'
            document.querySelector('#mapvis').src = 'images/WorldMap082.png'
            break;
        default: 
            alert('Try again later');
            break;
    }

    let mapinfo_json = JSON.parse(Get(url));
    let origin = mapinfo_json["baseImage"][0]["origin"]["value"]
    let points = [];
    for(let i = 0; i < mapinfo_json["maps"].length; i++)
    {
        let point = [origin["x"]+mapinfo_json["maps"][i]["spot"]["value"]["x"], origin["y"]+mapinfo_json["maps"][i]["spot"]["value"]["y"]]
        let imgstr = "<img src='images/mapImage_0.png' class='pts' style='position: absolute; left: " + (point[0]-10).toString() + "px ; top: " + (point[1]-10).toString() + "px;'>"

        document.getElementById('points').innerHTML += imgstr
        //points.push(point)
    }

    
}

