<!-- src/components/WeaponViewer.vue: Component to display the main weapon image -->

<template>
  <section id="weapon-display">
    <!-- v-if shows the image only if a weapon is selected -->
    <img
      v-if="store.selectedWeapon"
      :src="store.selectedWeapon.imageLink"
      :alt="store.selectedWeapon.shortName"
      id="weapon-image"
    />
    <p v-else>Your assembled weapon will appear here.</p>
  </section>
</template>

<script setup lang="ts">
import { useWeaponStore } from '@/stores/weaponStore'

const store = useWeaponStore()
</script>

<style scoped>
/* Move the CSS related to #weapon-display and #weapon-image here */

#weapon-display {
  flex-grow: 1; /* Takes up the remaining space */
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
</style>
