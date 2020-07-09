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

function chooseColor(mag) {
    switch (mag) {
    case 0 < mag <= 1:
      return '#0051a2';
    case 1 < mag <= 2:
      return '#585377';
    case 2 < mag <= 3:
      return '#715469';
    case 3 < mag <= 4:
      return '#875364';
    case 4 < mag <= 5:
      return '#9b5062';
    case 5 < mag <= 6:
    return '#af4c63';
    case 6 < mag <= 7:
    return '#c24666';
    case 7 < mag <= 8:
    return '#d63c6a';
    case 8 < mag <= 9:
    return '#ea2c70';
    case 9 < mag <= 10:
    return '#ff0077';
    default:
      return "black";
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
      var colors = ['#0051a2', '#585377', '#715469', '#875364', '#9b5062', '#af4c63', '#c24666', '#d63c6a', '#ea2c70', '#ff0077'];
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