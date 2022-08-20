// Create the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})


// Create a baseMaps object.
var baseMaps = {
  "Street Map": street
};


// Define a map object.
var myMap = L.map("map", {
  center: [39.0902, -110.7129],
  zoom: 4,
  layers: [street]
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 50, 100, 200, 500, 800, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br><br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
L.control.layers(baseMaps, {}).addTo(myMap);

  
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function getColor(d) {
  return d > 1000 ? '#800026' :
          d > 800  ? '#BD0026' :
          d > 500  ? '#E31A1C' :
          d > 200  ? '#FC4E2A' :
          d > 100   ? '#FD8D3C' :
          d > 50   ? '#FEB24C' :
          d > 10   ? '#FED976' :
                    '#FFEDA0';
};

// Store the API query variables.

var url_used = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


// Assemble the API query URL.
var url = url_used;

  
// Get the data with d3.
d3.json(url).then(function(response) {
  // Loop through the earthquake array, and create one marker for each city object.
  var earthquakes = response.features;
  for (var i = 0; i < earthquakes.length; i++) {
    if (earthquakes[i].properties.mag < 0){
      console.log("negative magnitude, skipping");
      continue;
    };

    // Conditionals for country gdp_pc
    var depth = earthquakes[i].geometry.coordinates[2];
    var color = getColor(depth);
    console.log(depth);

    // Add circles to the map.
    var coords = [earthquakes[i].geometry.coordinates[1],earthquakes[i].geometry.coordinates[0]];

    var size = earthquakes[i].properties.mag * 50000;

    L.circle(coords, {
      fillOpacity: 0.5,
      color: 'Green',
      fillColor: color,
      // Adjust the radius.
      radius: size
    }).bindPopup(`<h1>${earthquakes[i].properties.place}</h1> <hr> <h3>Magnitute: ${earthquakes[i].properties.mag}</h3><hr> <h3>Depth: ${earthquakes[i].geometry.coordinates[2]}</h3>`).addTo(myMap);
  }
});
