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
    var colors = ['#ffffe0', '#ffe3af', '#ffc58a', '#ffa474', '#fa8366', '#ed635c', '#db4551', '#c52840', '#aa0e27', '#8b0000']
    if (magnitude) {
        mag = magnitude.toString().substring(0,1).toString()
    } else {
        mag = "11"
    }
    if (mag == '0') {
      return colors[0];
    }
    if (mag == '1') {
        return colors[1];
    }
    if (mag == '2') {
        return colors[2];
    }
    if (mag == '3') {
        return colors[3];
    }
    if (mag == '4') {
        return colors[4];
    }
    if (mag == '5') {
        return colors[5];
    }
    if (mag == '6') {
        return colors[6];
    }
    if (mag == '7') {
        return colors[7];
    }
    if (mag == '8') {
        return colors[8];
    }
    if (mag == '9') {
        return colors[9];
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
      var colors = ['#ffffe0', '#ffe3af', '#ffc58a', '#ffa474', '#fa8366', '#ed635c', '#db4551', '#c52840', '#aa0e27', '#8b0000'];
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