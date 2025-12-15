<template>
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

  <main class="main-container">
    <!-- Use the new components here -->
    <WeaponViewer />
    <StatsPanel />
  </main>

  <!-- Use the new component here -->
  <PartsList />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWeaponStore } from './stores/weaponStore'
// Import the new components
import StatsPanel from './components/StatsPanel.vue'
import WeaponViewer from './components/WeaponViewer.vue'
import PartsList from './components/PartsList.vue'

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
/* Only keep global layout CSS here */

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
</style>
