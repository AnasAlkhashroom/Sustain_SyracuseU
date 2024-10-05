// Initialize the OpenLayers map focused on Syracuse University
var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM() // OpenStreetMap as the base layer
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([-76.1358, 43.0389]), // Center around Syracuse University
      zoom: 17, // Close zoom level for a detailed view
      maxZoom: 19 // Maximum zoom level
    })
  });
  
  // Define the boundaries for Syracuse University
  var extent = ol.proj.transformExtent(
    [-76.1389, 43.0345, -76.1326, 43.0385], // Southwest and Northeast corners
    'EPSG:4326', // Source projection (longitude/latitude)
    'EPSG:3857' // Target projection (Web Mercator)
  );
  
  // Set the map extent to restrict panning
  map.getView().fit(extent, { duration: 0 }); // Fit the view to the extent
  
  // Show loading indicator
  function showLoading() {
    document.getElementById('loading').style.display = 'block';
  }
  
  function hideLoading() {
    document.getElementById('loading').style.display = 'none';
  }
  
  // Create a polygon feature for Syracuse University boundary (for visual reference)
  const syracuseCoords = [
    [-76.1389, 43.0345], // Southwest corner
    [-76.1336, 43.0345], // Southeast corner
    [-76.1326, 43.0385], // Northeast corner
    [-76.1383, 43.0385], // Northwest corner
    [-76.1389, 43.0345]  // Closing the polygon
  ];
  
  // Create a polygon feature
  const syracusePolygon = new ol.geom.Polygon([syracuseCoords.map(coord => ol.proj.fromLonLat(coord))]);
  const syracuseFeature = new ol.Feature(syracusePolygon);
  
  // Create a vector source and layer for the polygon
  const vectorSource = new ol.source.Vector({
    features: [syracuseFeature]
  });
  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 0, 0.5)' // Yellow fill with 50% opacity
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 255, 0, 1)', // Yellow stroke
        width: 2
      })
    })
  });
  
  // Add the polygon layer to the map
  map.addLayer(vectorLayer);
  
  // Function to add a recycling bin or eco-friendly store marker
  function addResourceMarker(lat, lng, label) {
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat])),
      name: label
    });
  
    var vectorSource = new ol.source.Vector({
      features: [marker]
    });
  
    var markerVectorLayer = new ol.layer.Vector({
      source: vectorSource
    });
  
    map.addLayer(markerVectorLayer);
  
    // Custom icon for the marker
    marker.setStyle(new ol.style.Style({
      image: new ol.style.Icon({
        src: 'https://img.icons8.com/color/48/000000/recycle.png', // Use your desired icon URL
        scale: 0.1 // Adjust scale as needed
      })
    }));
  
    // Info window on marker click
    marker.on('click', function() {
      alert('Location: ' + label);
    });
  }
  
  // Sample data for recycling bins and eco-friendly stores around Syracuse University
  const resources = [
    { name: "Recycling Bin 1", lat: 43.0360, lng: -76.1370 },
    { name: "Recycling Bin 2", lat: 43.0370, lng: -76.1365 },
    { name: "Eco-Friendly Store", lat: 43.0355, lng: -76.1350 },
    { name: "Recycling Bin 3", lat: 43.0380, lng: -76.1380 }
  ];
  
  // Add markers for each resource
  resources.forEach(resource => {
    addResourceMarker(resource.lat, resource.lng, resource.name);
  });
  
  // Handle geolocation success
  function success(position) {
    hideLoading();
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
  
    // Restrict the view to the defined extent
    if (ol.extent.containsCoordinate(extent, ol.proj.fromLonLat([lng, lat]))) {
      var view = map.getView();
      view.setCenter(ol.proj.fromLonLat([lng, lat]));
  
      // Set a zoom level for better focus on the user's location
      view.setZoom(17); // Zoom closer to the buildings
  
      addResourceMarker(lat, lng, 'You are here');
    } else {
      alert('You are outside the Syracuse University area.');
    }
  }
  
  // Handle geolocation error
  function error() {
    hideLoading();
    alert('Unable to retrieve your location. Please check your browser settings.');
  }
  
  // Locate the user when button is clicked
  document.getElementById('locateMe').addEventListener('click', () => {
    showLoading();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      hideLoading();
      alert('Geolocation is not supported by your browser.');
    }
  });
  
  // Toggle dark mode
  document.getElementById('themeToggle').addEventListener('change', (event) => {
    document.body.classList.toggle('dark-mode', event.target.checked);
  });
  