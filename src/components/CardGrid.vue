<script setup lang="ts">
import { cards } from '../data/cards'
import type { Card } from '../types'
import CardItem from './CardItem.vue'

const emit = defineEmits<{
  zoom: [card: Card, rect: DOMRect]
}>()
</script>

<template>
  <div class="grid">
    <CardItem
      v-for="card in cards"
      :key="card.id"
      :card="card"
      @zoom="(card, rect) => emit('zoom', card, rect)"
    />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  max-width: 720px;
  width: 100%;
  padding: 1rem;
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
