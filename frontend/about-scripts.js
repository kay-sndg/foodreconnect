// about-scripts.js

document.addEventListener('DOMContentLoaded', function () {
    const browseFoodsLink = document.getElementById('browseFoodsLink');

    if (browseFoodsLink) {
        browseFoodsLink.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor jump
            getUserLocationAndRedirect();
        });
    }
});

// Get user's location and redirect to homepage with location info
function getUserLocationAndRedirect() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Redirect to index.html with lat/lon in URL hash
            window.location.href = `index.html#browse?lat=${lat}&lon=${lon}`;
        }, handleError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Fallback in case location can't be retrieved
function handleError(error) {
    console.error("Geolocation error:", error);
    alert("Unable to retrieve your location. Please try again.");
}
