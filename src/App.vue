<template>
  <header id="site-header">
      <h1>EFT-builds</h1>
      <div class="controls">
          <label for="weapon-select">Select Weapon:</label>
          <select id="weapon-select" v-model="store.selectedWeaponId" @change="store.handleWeaponChange">
              <option value="" disabled v-if="store.allWeaponsData.length === 0">Loading weapons...</option>
              <option v-for="weapon in store.allWeaponsData" :key="weapon.id" :value="weapon.id">
                {{ weapon.name }}
              </option>
          </select>
      </div>
  </header>

  <main class="main-container">
      <section id="weapon-display">
          <img
            v-if="store.selectedWeapon"
            :src="store.selectedWeapon.imageLink"
            :alt="store.selectedWeapon.shortName"
            id="weapon-image"
          >
          <p v-else>Your assembled weapon will appear here.</p>
      </section>

      <aside id="stats-sidebar">
          <h2>Build Statistics & Optimization</h2>
          <div class="stat-group">
              <label for="slider-weight">Weight:</label>
              <span id="stat-weight" class="stat-value">{{ store.currentStats.weight }} kg</span>
              <input type="range" id="slider-weight" min="0" max="100" :value="mapStatToSlider(parseFloat(store.currentStats.weight), store.STAT_RANGES.weight.min, store.STAT_RANGES.weight.max)" class="stat-slider" disabled>
          </div>
           <div class="stat-group">
              <label for="slider-ergonomics">Ergonomics:</label>
              <span id="stat-ergonomics" class="stat-value">{{ store.currentStats.ergonomicsModifier }} pts</span>
              <input type="range" id="slider-ergonomics" min="0" max="100" :value="mapStatToSlider(parseFloat(store.currentStats.ergonomicsModifier), store.STAT_RANGES.ergonomics.min, store.STAT_RANGES.ergonomics.max)" class="stat-slider" disabled>
          </div>
          <!-- Add other stat groups here -->
      </aside>
  </main>

  <footer id="parts-selection-area">
      <h2>Available Parts</h2>
      <p>List of parts will load here...</p>
  </footer>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useWeaponStore } from './stores/weaponStore';

function mapStatToSlider(value: number, minRange: number, maxRange: number) {
    if (typeof value !== 'number' || isNaN(value)) return 50; 
    const sliderValue = ((value - minRange) / (maxRange - minRange)) * 100;
    return Math.max(0, Math.min(100, sliderValue));
}

// ... (mapStatToSlider function and store initialization code above) ...
const store = useWeaponStore();

onMounted(async () => {
  await store.fetchWeaponsData();
  
  if (store.allWeaponsData.value && store.allWeaponsData.value.length > 0) {
      store.selectedWeaponId = store.allWeaponsData.value[0].id; // Use [0].id for first item
      store.handleWeaponChange();
  }
});
</script>


<style scoped>
/* All your previous scoped CSS remains here */
#site-header {
    background-color: #1a2a3a;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
/* ... etc ... */
</style>
