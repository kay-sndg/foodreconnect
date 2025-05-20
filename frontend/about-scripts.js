// about-scripts.js

// Requesting user's location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showNearbyFood, handleError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showNearbyFood(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Call the backend API here to get food items near the user's location
    console.log("User's Latitude: " + lat + " and Longitude: " + lon);
}

function handleError(error) {
    console.error("Error occurred. Error code: " + error.code);
    alert("Unable to retrieve your location. Please try again.");
}

document.addEventListener('DOMContentLoaded', function () {
    // Call getUserLocation function when page loads
    getUserLocation();
});
