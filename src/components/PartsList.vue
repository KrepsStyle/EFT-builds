<!-- src/components/PartsList.vue: Component to display available parts in the footer -->

<template>
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
        <!-- We will add the 'Equip' button logic here later -->
      </li>
    </ul>
  </footer>
</template>

<script setup lang="ts">
import { useWeaponStore } from '@/stores/weaponStore'

const store = useWeaponStore()
</script>

<style scoped>
/* Move the CSS related to the footer parts list here */

#parts-selection-area {
  background-color: #1a2a3a;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
}

.parts-list {
  list-style-type: none;
  display: block;
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
