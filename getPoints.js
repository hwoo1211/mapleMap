/* This function is to fetch data from the maplestory.io in json form*/
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

var selection = document.querySelector('#world')

selection.onchange = function() {
    var url;
    var val = selection.value

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

}

