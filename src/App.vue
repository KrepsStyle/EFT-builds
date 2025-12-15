<template>
  <!-- 1. Header Area for site title and main weapon selection (Fixed position) -->
  <header id="site-header">
    <h1>EFT-builds</h1>
    <div class="controls">
      <label for="weapon-select">Select Weapon:</label>
      <select
        id="weapon-select"
        v-model="store.selectedWeaponId"
        @change="store.handleWeaponChange"
      >
        <option value="" disabled v-if="store.allWeaponsData.length === 0">
          Loading weapons...
        </option>
        <option v-for="weapon in store.allWeaponsData" :key="weapon.id" :value="weapon.id">
          {{ weapon.name }}
        </option>
      </select>
    </div>
  </header>

  <!-- 2. Main Container (Weapon Display and Stats Side-by-Side) -->
  <main class="main-container">
    <!-- Weapon Visualization Area (Takes up most space) -->
    <section id="weapon-display">
      <img
        v-if="store.selectedWeapon"
        :src="store.selectedWeapon.imageLink"
        :alt="store.selectedWeapon.shortName"
        id="weapon-image"
      />
      <p v-else>Your assembled weapon will appear here.</p>
    </section>

    <!-- Stats Sidebar (Now using the imported component) -->
    <StatsPanel />
  </main>

  <!-- 3. Parts Selection Area (Bottom bar/footer - one per line) -->
  <footer id="parts-selection-area">
    <h2>Available Parts ({{ store.selectedWeapon?.containsItems?.length || 0 }} items)</h2>

    <p v-if="!store.selectedWeapon">Select a weapon above to see parts.</p>
    <p v-else-if="store.selectedWeapon.containsItems.length === 0">
      No specific parts found for this weapon base.
    </p>

    <ul v-else class="parts-list">
      <li
        v-for="partWrapper in store.selectedWeapon.containsItems"
        :key="partWrapper.item.id"
        class="part-item"
      >
        <img
          :src="partWrapper.item.imageLink"
          :alt="partWrapper.item.shortName"
          class="part-image"
        />
        <span>{{ partWrapper.item.name }} (x{{ partWrapper.quantity }})</span>
      </li>
    </ul>
  </footer>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWeaponStore } from './stores/weaponStore'
import StatsPanel from './components/StatsPanel.vue'

const store = useWeaponStore()

onMounted(async () => {
  await store.fetchWeaponsData()

  if (store.allWeaponsData.value && store.allWeaponsData.value.length > 0) {
    store.selectedWeaponId = store.allWeaponsData.value.id
    store.handleWeaponChange()
  }
})
</script>

<style scoped>
/* Scoped CSS for layout, header, weapon display section, and footer part list */

#site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #1a2a3a;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#site-header h1 {
  color: #4da6ff;
}
.controls label {
  margin-right: 10px;
}
.controls select {
  padding: 8px;
  background-color: #0f1c2e;
  color: #e0e0e0;
  border: 1px solid #4da6ff;
  border-radius: 4px;
}

.main-container {
  display: flex;
  gap: 20px;
  margin-top: 80px; /* Offset for fixed header */
}

#weapon-display {
  flex-grow: 1;
  background-color: #1a2a3a;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#weapon-image {
  max-width: 100%;
  height: auto;
  border: 1px solid #4da6ff;
  padding: 10px;
}

/* Styles for the footer parts list */
#parts-selection-area {
  background-color: #1a2a3a;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
}

.parts-list {
  list-style-type: none;
  display: block; /* Ensures one item per line */
  padding: 0;
  margin: 0;
}

.part-item {
  display: flex;
  align-items: center;
  background-color: #2c3e50;
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #4da6ff33;
  margin-bottom: 5px;
  width: 100%;
}

.part-image {
  width: 30px;
  height: auto;
  margin-right: 10px;
  border-radius: 2px;
}
</style>
