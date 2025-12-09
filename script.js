// script.js: Main logic for the EFT-builds using the Tarkov.dev API

// Define the simple GET API endpoint for all items
const API_URL = 'api.tarkov.dev';
// My note: No proxy is used here. For local testing with VS Code Live Server, you MUST use a browser extension to disable CORS.


// Global variable to store the fetched data so it's accessible later
let allWeaponsData = [];


// 1. Asynchronous function to fetch weapon data from the API
async function fetchWeaponsData() {
    try {
        // Use the direct API URL for a simple GET request
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonResponse = await response.json();
        
        // Filter the items manually to get only the weapons we want
        const weaponCategories = ["Assault Rifle", "Submachine Gun", "Shotgun", "Pistol", "Marksman Rifle", "Sniper Rifle"];
        const filteredWeapons = jsonResponse.filter(item => {
            // Check if the item has a category that matches our list
            return item.types.some(type => weaponCategories.includes(type));
        });

        return filteredWeapons;

    } catch (error) {
        console.error("Error fetching weapon data:", error);
        // Return an empty array if the fetch fails
        return [];
    }
}

// 2. Function to populate the weapon selection dropdown menu
function populateWeaponSelect(weaponsList) {
    const selectElement = document.getElementById('weapon-select');
    selectElement.innerHTML = ''; // Clear "Loading..."

    if (weaponsList.length === 0) {
        const option = document.createElement('option');
        option.textContent = "Could not load weapons data";
        selectElement.appendChild(option);
        return;
    }

    // Sort the weapons alphabetically by name
    weaponsList.sort((a, b) => a.name.localeCompare(b.name));

    weaponsList.forEach(weapon => {
        const option = document.createElement('option');
        option.value = weapon.id;
        option.textContent = weapon.name;
        selectElement.appendChild(option);
    });
}


// 3. Function to update the statistics display on the sidebar
// This function expects the stats object from the API
function updateStatsDisplay(stats) {
    // My note: Using the specific IDs defined in index.html (singular English form confirmed)
    document.getElementById('stat-weight').textContent = `${stats.weight?.toFixed(2) || '--'} kg`;
    document.getElementById('stat-ergonomics').textContent = `${stats.ergonomics || '--'} pts`;
    document.getElementById('stat-accuracy').textContent = `${stats.accuracy?.toFixed(1) || '--'} MOA`;
    document.getElementById('stat-sighting-range').textContent = `${stats.sightingRange || '--'} m`;
    document.getElementById('stat-recoil-v').textContent = `${stats.verticalRecoil || '--'} pts`;
    document.getElementById('stat-recoil-h').textContent = `${stats.horizontalRecoil || '--'} pts`;
    document.getElementById('stat-muzzle-velocity').textContent = `${stats.muzzleVelocity || '--'} m/s`; 
}

// 4. Function to handle when a user selects a new weapon
function handleWeaponChange(event) {
    const selectedWeaponId = event.target.value;
    // Find the selected weapon in the global data array
    const selectedWeapon = allWeaponsData.find(w => w.id === selectedWeaponId);

    if (selectedWeapon) {
        // Update the stats sidebar with the selected weapon's base stats
        updateStatsDisplay(selectedWeapon);
        
        // Update the main image display using the imageLink from the API
        const weaponImage = document.getElementById('weapon-image');
        if (weaponImage) { 
            weaponImage.src = selectedWeapon.imageLink;
            weaponImage.alt = `Image of ${selectedWeapon.name}`;
            weaponImage.style.display = 'block'; // Make the image visible
        }
        
        // Hide the placeholder text
        const placeholderText = document.querySelector('#weapon-display p');
        if (placeholderText) placeholderText.style.display = 'none';
    }
}

// 5. Initialization: Run these functions when the script loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log("EFT-builds script loaded. Fetching data from API...");
    
    // Fetch the data and store it globally (await waits for the response)
    allWeaponsData = await fetchWeaponsData();
    populateWeaponSelect(allWeaponsData);
    
    // Add event listener for when a new weapon is selected
    document.getElementById('weapon-select').addEventListener('change', handleWeaponChange);

    // Trigger initial load for the first weapon in the list
    if (allWeaponsData.length > 0) {
        document.getElementById('weapon-select').dispatchEvent(new Event('change'));
    }
});
