const mapElement = document.getElementById("map");

if (mapElement) {

  var map = L.map('map').setView([0, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  if (typeof Coordinates !== "undefined" && Coordinates.length === 2) {

    const lat = Coordinates[1];   // MongoDB fix
    const lon = Coordinates[0];

    map.setView([lat, lon], 9);

    L.marker([lat, lon])
      .addTo(map)
      .bindPopup("Location 📍")
      .openPopup();

  } else {
    console.error("Coordinates not found");
  }

}