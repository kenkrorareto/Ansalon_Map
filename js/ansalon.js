// Create a map using Leaflet's Simple CRS for non-geographic coordinates
var map = L.map('map', {
    crs: L.CRS.Simple,    // Coordinate Reference System for flat images
    minZoom: -6,          // Minimum zoom level
    maxZoom: 2,           // Maximum zoom level
    zoomDelta: 0.5,       // Step zoom increment/decrement
    zoomSnap: 0.5         // Snap zoom levels to 0.5 increments
});

// Define the bounds of the image in pixel coordinates (top-left, bottom-right)
var bounds = [[0, 0], [1672, 2340.57]];  // Bounds from the configuration

// Add the image to the map as a layer
var image = L.imageOverlay('images/ansalon.png', bounds).addTo(map);

// Set the default view (initial center and zoom)
map.setView([836, 1170.28571]);  // Center and default zoom level

// Fit the map to the bounds of the image
map.fitBounds(bounds);
map.setMaxBounds(bounds);
// map.dragging.disable();

// Fetch marker data from external JSON file
fetch('markers.json')
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data.points)) {
            data.points.forEach(function (marker) {
                var latLng = [marker.loc[0], marker.loc[1]]; // Leaflet uses [latitude, longitude] order
                var leafletMarker = L.marker(latLng).addTo(map);

                // Set the tooltip to show the content of the `link` field
                if (marker.tooltip === "hover") {
                    leafletMarker.bindTooltip(marker.link, {
                        permanent: false,    // Tooltip disappears when not hovering
                        direction: 'auto'    // Tooltip direction automatically adjusts
                    });
                }
            });
        } else {
            console.error('Data is not an array:', data);
        }

        if (Array.isArray(data.lines)) {
            data.lines.forEach(function (line) {
                var linePoints = [line.start, line.end];
                L.polyline(linePoints, {
                    color: line.color || 'black',
                    weight: line.weight || 3,
                    opacity: line.opacity || 1.0,
                    dashArray: '5, 10'
                }).addTo(map);
            });
        } else {
            console.error('Lines data is not an array:', data.lines);
        }
    })
    .catch(error => console.error('Error loading marker data:', error));