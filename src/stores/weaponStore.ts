import { defineStore } from 'pinia';
import { ref } from 'vue';

// --- Configuration Constants ---
// Use the local proxy path defined in vite.config.ts
const API_URL = '/graphql'; 
const ALLOWED_KEYWORDS = ["default", "urbana"];
const STAT_RANGES = {
    weight: { min: 2.0, max: 6.0 }, // kg
    ergonomics: { min: 1, max: 100 },
    accuracy: { min: 0.1, max: 5.0 },
    sightingRange: { min: 50, max: 1000 },
    recoil_v: { min: 10, max: 200 },
    recoil_h: { min: 50, max: 500 },
    muzzleVelocity: { min: 300, max: 1000 }
};

// Define the Pinia Store
export const useWeaponStore = defineStore('weapon', () => {
  
  // --- Reactive State Variables ---
  const allWeaponsData = ref<any[]>([]); // Using 'any' for simplicity for now
  const selectedWeapon = ref<any>(null);
  const selectedWeaponId = ref<string>('');
  const currentStats = ref<any>({
    weight: '--',
    ergonomicsModifier: '--',
    accuracyModifier: '--',
    sightingRange: '--',
    verticalRecoil: '--',
    horizontalRecoil: '--',
    muzzleVelocity: '--'
  });

  // --- Actions (Functions to modify state) ---

  async function fetchWeaponsData() {
    const query = `{
      items(categoryNames: [AssaultCarbine, AssaultRifle, SniperRifle, GrenadeLauncher, Machinegun, MarksmanRifle, Handgun, Shotgun, SMG]) {
        id, shortName, name, imageLink, weight, ergonomicsModifier, accuracyModifier, recoilModifier, velocity,
        containsItems { item { id, name, shortName, imageLink, ergonomicsModifier }, quantity }
      }
    }`;

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

      // CORRECTION: Await the JSON response
      const jsonResponse = await response.json(); 
      const allItems = jsonResponse.data.items || [];

      const filteredWeaponsList = allItems.filter((item: any) => {
        const itemNameLower = item.name.toLowerCase();
        const includesKeyword = ALLOWED_KEYWORDS.some(keyword => itemNameLower.includes(keyword));
        const hasNullErgo = item.ergonomicsModifier === null || item.ergonomicsModifier === undefined;
        return includesKeyword && hasNullErgo;
      });

      allWeaponsData.value = filteredWeaponsList;
      allWeaponsData.value.sort((a, b) => a.name.localeCompare(b.name));

    } catch (error) {
        console.error("Error fetching weapon data:", error);
        // CRUCIAL: Stop execution if error occurs
        return; 
    }
  }

  function handleWeaponChange() {
      const id = selectedWeaponId.value;
      if (!id) return;

      const foundWeapon = allWeaponsData.value.find((w: any) => w.id === id);

      if (foundWeapon) {
          selectedWeapon.value = foundWeapon;

          let totalErgonomics = foundWeapon.ergonomicsModifier || 0;
          if (foundWeapon.containsItems) {
              foundWeapon.containsItems.forEach((partWrapper: any) => {
                  const part = partWrapper.item;
                  if (part) {
                      const partModifier = part.ergonomicsModifier || 0;
                      totalErgonomics += partModifier * partWrapper.quantity;
                  }
              });
          }

          currentStats.value = {
              ...foundWeapon,
              ergonomicsModifier: totalErgonomics.toFixed(2),
              weight: foundWeapon.weight?.toFixed(2),
              verticalRecoil: foundWeapon.recoilModifier?.toFixed(0),
              horizontalRecoil: foundWeapon.recoilModifier?.toFixed(0),
              muzzleVelocity: foundWeapon.velocity?.toFixed(0),
          };
      }
  }

  return { 
    allWeaponsData, selectedWeapon, selectedWeaponId, currentStats, 
    fetchWeaponsData, handleWeaponChange, STAT_RANGES
  };
});
