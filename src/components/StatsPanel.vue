<template>
  <aside id="stats-sidebar">
    <h2>Build Statistics & Optimization</h2>

    <!-- Weight Stat Group -->
    <div class="stat-group">
      <label for="slider-weight">Weight:</label>
      <span id="stat-weight" class="stat-value">{{ store.currentStats.weight }} kg</span>
      <input
        type="range"
        id="slider-weight"
        min="0"
        max="100"
        :value="
          mapStatToSlider(
            parseFloat(store.currentStats.weight),
            store.STAT_RANGES.weight.min,
            store.STAT_RANGES.weight.max,
          )
        "
        class="stat-slider"
        disabled
      />
    </div>

    <!-- Ergonomics Stat Group -->
    <div class="stat-group">
      <label for="slider-ergonomics">Ergonomics:</label>
      <span id="stat-ergonomics" class="stat-value"
        >{{ store.currentStats.ergonomicsModifier }} pts</span
      >
      <input
        type="range"
        id="slider-ergonomics"
        min="0"
        max="100"
        :value="
          mapStatToSlider(
            parseFloat(store.currentStats.ergonomicsModifier),
            store.STAT_RANGES.ergonomics.min,
            store.STAT_RANGES.ergonomics.max,
          )
        "
        class="stat-slider"
        disabled
      />
    </div>

    <!-- Add all other 5 stat groups here -->
  </aside>
</template>

<script setup lang="ts">
import { useWeaponStore } from '@/stores/weaponStore'

// Helper function definition is local to this component now
function mapStatToSlider(value: number, minRange: number, maxRange: number) {
  if (typeof value !== 'number' || isNaN(value)) return 50
  const sliderValue = ((value - minRange) / (maxRange - minRange)) * 100
  return Math.max(0, Math.min(100, sliderValue))
}

const store = useWeaponStore()
</script>

<style scoped>
/* Scoped CSS for the sidebar and all its internal elements */
#stats-sidebar {
  flex-basis: 300px;
  background-color: #2c3e50;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.stat-group {
  margin-bottom: 8px;
  padding-bottom: 5px;
  border-bottom: 1px solid #4da6ff33;
}

.stat-group label {
  display: block;
  font-size: 0.9em;
  color: #a0a0a0;
  margin-bottom: 2px;
}

.stat-value {
  font-weight: bold;
  color: #e0e0e0;
  display: block;
  margin-bottom: 3px;
}

.stat-slider {
  width: 100%;
  cursor: not-allowed;
  -webkit-appearance: none;
  height: 5px;
  background: #555;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.stat-slider:hover {
  opacity: 1;
}

.stat-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  background: #4da6ff;
  cursor: not-allowed;
  border-radius: 50%;
}
.stat-slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  background: #4da6ff;
  cursor: not-allowed;
  border-radius: 50%;
}
</style>
