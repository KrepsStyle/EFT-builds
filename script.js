// script.js: Lógica principal para o EFT-builds usando a API Tarkov.dev

// Define the GraphQL API endpoint exactly as requested by the user
const API_URL = 'https://api.tarkov.dev/graphql';

const ALLOWED_KEYWORDS = ["default", "urbana"]
// Define realistic min/max ranges for stats for the sliders (Tarkov values)
const STAT_RANGES = {
    weight: { min: 2.0, max: 6.0 }, // kg
    ergonomics: { min: 1, max: 100 }, // pts
    accuracy: { min: 0.1, max: 5.0 }, // MOA (lower is better, so this is reversed in UI logic later)
    sightingRange: { min: 50, max: 1000 }, // meters
    recoil_v: { min: 10, max: 200 }, // pts (lower is better)
    recoil_h: { min: 50, max: 500 }, // pts (lower is better)
    muzzleVelocity: { min: 300, max: 1000 } // m/s
};

// Global variable to store the fetched data so it's accessible later
let allWeaponsData = [];
// Global variable to store all fetched parts data (not used yet)
let allPartsData = [];


// 1. Asynchronous function to fetch item data from the API
async function fetchWeaponsData() {
    // My note: Using the user's exact provided nested query
    const query = `
    {
        items(categoryNames: [AssaultCarbine, AssaultRifle, SniperRifle, GrenadeLauncher, Machinegun, MarksmanRifle, Handgun, Shotgun, SMG]) {
            id
            shortName
            name
            imageLink
            weight
            ergonomicsModifier
            accuracyModifier
            recoilModifier
            velocity
            containsItems {
                item {
                    id
                    name
                    shortName
                    imageLink
                    ergonomicsModifier
                }
                quantity
            }
        }
    }
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        const allItems = jsonResponse.data.items || [];
        
// 1. Keep only weapons that have const ALLOWED_KEYWORDS in their name
        const filteredWeaponsList = allItems.filter(item => {
            const itemNameLower = item.name.toLowerCase();
             // The item must include at least one of the allowed keywords
            const includesKeyword = ALLOWED_KEYWORDS.some(keyword => itemNameLower.includes(keyword));
            
            // Additionally, maintain the original filter: item base ergonomics must be null
            const hasNullErgo = item.ergonomicsModifier === null || item.ergonomicsModifier === undefined;

            return includesKeyword && hasNullErgo;
        });
        // Return the final filtered list of weapons (only those with 'Default')
        return filteredWeaponsList;

    } catch (error) {
        console.error("Error fetching weapon data:", error);
        return [];
    }
}


// 2. Function to populate the weapon selection dropdown menu
function populateWeaponSelect(weaponsList) {
    const selectElement = document.getElementById('weapon-select');
    selectElement.innerHTML = ''; // Clear "Loading..."

    if (weaponsList.length === 0) {
        const option = document.createElement('option');
        option.textContent = "Could not load data or no items found";
        selectElement.appendChild(option);
        return;
    }

    // Sort the items alphabetically by name
    weaponsList.sort((a, b) => a.name.localeCompare(b.name));

    weaponsList.forEach(weapon => {
        const option = document.createElement('option');
        option.value = weapon.id;
        option.textContent = weapon.name;
        selectElement.appendChild(option);
    });
}

// Function to map a stat value to a 0-100 slider value using linear interpolation
function mapStatToSlider(value, minRange, maxRange) {
    const sliderValue = ((value - minRange) / (maxRange - minRange)) * 100;
    return Math.max(0, Math.min(100, sliderValue));
}


// 3. Function to update the statistics display on the sidebar
function updateStatsDisplay(stats) {
    // Property names must match the flattened object properties (e.g., stats.weight, stats.ergonomics)
    document.getElementById('stat-weight').textContent = `${stats.weight?.toFixed(2) || '--'} kg`;
    document.getElementById('stat-ergonomics').textContent = `${stats.ergonomicsModifier || '--'} pts`;
    document.getElementById('stat-accuracy').textContent = `${stats.accuracyModifier?.toFixed(1) || '--'} MOA`;
    // The sighting range field is missing in the new query
    document.getElementById('stat-sighting-range').textContent = `-- m`; 
    document.getElementById('stat-recoil-v').textContent = `${stats.verticalRecoil || '--'} pts`;
    document.getElementById('stat-recoil-h').textContent = `${stats.horizontalRecoil || '--'} pts`;
    document.getElementById('stat-muzzle-velocity').textContent = `${stats.muzzleVelocity || '--'} m/s`; 
    
    // Update sliders (examples below, need all 7 implemented)
    const weightSlider = document.getElementById('slider-weight');
    if (weightSlider && stats.weight) {
        weightSlider.value = mapStatToSlider(stats.weight, STAT_RANGES.weight.min, STAT_RANGES.weight.max);
        weightSlider.disabled = false; 
    }
    const ergonomicSlider = document.getElementById('slider-ergonomics');
    if (ergonomicSlider && typeof stats.ergonomicsModifier === 'number') {
        ergonomicSlider.value = mapStatToSlider(stats.ergonomicsModifier, STAT_RANGES.ergonomics.min, STAT_RANGES.ergonomics.max);
        ergonomicSlider.disabled = false;
    }
    // Add logic for accuracy, recoil, etc.
}

// 4. Function to visually display the list of parts
function displayParts(partsList) {
    const partsArea = document.getElementById('parts-selection-area');
    partsArea.innerHTML = '<h2>Available Parts</h2>'; // Clear previous list

    if (partsList.length === 0) {
        partsArea.innerHTML += '<p>No specific parts found for this item.</p>';
        return;
    }

    const listElement = document.createElement('ul');
    partsList.forEach(partWrapper => {
        const part = partWrapper.item;
        const listItem = document.createElement('li');
        
        // Display part name and quantity
        listItem.textContent = `${part.name} (x${partWrapper.quantity})`;
        
        // Optional: Add a small image thumbnail to the list item
        if (part.imageLink) {
            const partImage = document.createElement('img');
            partImage.src = part.imageLink;
            partImage.alt = part.shortName;
            partImage.style.width = '30px'; // Style the thumbnail size via JS for now
            partImage.style.marginRight = '10px';
            listItem.insertBefore(partImage, listItem.firstChild);
        }

        listElement.appendChild(listItem);
    });
    partsArea.appendChild(listElement);
}

// 5. Function to handle when a user selects a new item (UPDATED)
function handleWeaponChange(event) {
    const selectedWeaponId = event.target.value;
    // Find the selected weapon in the global data array (which now includes containsItems)
    const selectedWeapon = allWeaponsData.find(w => w.id === selectedWeaponId);

    if (selectedWeapon) {
        let totalErgonomics = selectedWeapon.ergonomicsModifier || 0;

        if (selectedWeapon.containsItems) {
            selectedWeapon.containsItems.forEach(partWrapper => {
                const part = partWrapper.item;

                if (part) {
                    const partModifier = part.ergonomicsModifier || 0;
                    totalErgonomics += partModifier * partWrapper.quantity;
                }
            });
        }

    const displayStats = {
        ...selectedWeapon,
        ergonomicsModifier: totalErgonomics
    };

    updateStatsDisplay(displayStats);

    const weaponImage = document.getElementById('weapon-image');
    if (weaponImage) { 
            weaponImage.src = selectedWeapon.imageLink;
            weaponImage.alt = `Image of ${selectedWeapon.name}`;
            weaponImage.style.display = 'block';
        }
        const placeholderText = document.querySelector('#weapon-display p');
        if (placeholderText) placeholderText.style.display = 'none';
        
        // My note: Now we just read the parts data we already have and display them
        displayParts(selectedWeapon.containsItems || []); 
    }
}


// 6. Initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log("EFT-builds script loaded. Fetching data from API...");
    allWeaponsData = await fetchWeaponsData() || [];
    // await fetchPartsData(); // Disabled for now until next feature
    populateWeaponSelect(allWeaponsData);
    document.getElementById('weapon-select').addEventListener('change', handleWeaponChange);

    if (allWeaponsData.length > 0) {
        document.getElementById('weapon-select').dispatchEvent(new Event('change'));
    }
});
