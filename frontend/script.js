async function fetchNearbyFood() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    try {
      const res = await fetch(`https://your-backend.onrender.com/api/food/nearby?lat=${lat}&lng=${lng}`);
      const data = await res.json();

      const list = document.getElementById('food-list');
      list.innerHTML = '';

      data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'food-card';
        div.innerHTML = `
          <h3>${item.title}</h3>
          <img src="${item.image}" alt="${item.title}" />
          <p>${item.description}</p>
        `;
        list.appendChild(div);
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch food data.");
    }
  });
}
