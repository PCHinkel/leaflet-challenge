// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});
  
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: API_KEY
}).addTo(myMap);

function chooseColor(magnitude) {
    var mag = "0"
    if (magnitude) {
        mag = magnitude.toString().substring(0,1).toString()
    } else {
        mag = "11"
    }
    switch (mag) {
    case mag == '0':
      return "#3388ff";
    case mag == '1':
      return "#3388ff";
    case mag == '2':
      return "#3388ff";
    case mag == '3':
      return "#3388ff";
    case mag == '4':
      return "#3388ff";
    case mag == '5':
      return "gray";
    case mag == '6':
      return "darkgreen";
    case mag == '7':
      return "pink";
    case mag == '8':
      return "brown";
    case mag == '9':
      return "slateblue";
    default:
      return "white";
    }
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Loop through locations and create circles
    for (var i = 0; i < earthquakeData.length; i++) {
        console.log(earthquakeData[i]);
        // Setting the marker radius for the state by passing population into the markerSize function
        L.circle([earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]], {
            stroke: false,
            fillOpacity: 0.75,
            color: chooseColor(earthquakeData[i].properties.mag),
            fillColor: chooseColor(earthquakeData[i].properties.mag),
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its population
            radius: earthquakeData[i].properties.mag*10000
        }).bindPopup("<h1>" + "Location: " + earthquakeData[i].properties.place + "</h1> <hr> <h3>Magnitude: " + earthquakeData[i].properties.mag + "</h3>").addTo(myMap);
    }

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = ["0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9","9-10"];
      var colors = ["gold", "blue", "green", "yellow", "orange", "grey", "darkgreen", "pink", "brown", "slateblue"];
      var labels = [];
  
      // Add min & max
      var legendInfo = "<h1>Earthquake Magnitude</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + 0 + "</div>" +
          "<div class=\"max\">" + 10 + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(myMap);
}