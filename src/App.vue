<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from './composables/useI18n'
import { useCardZoom } from './composables/useCardZoom'
import CardGrid from './components/CardGrid.vue'
import CardZoomed from './components/CardZoomed.vue'

const { t, toggleLocale } = useI18n()
const { zoomedCard, sourceRect, isZoomed, zoomIn, zoomOut, onZoomEnd } = useCardZoom()

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isZoomed.value) {
    zoomOut()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">{{ t('app.title') }}</h1>
      <button class="lang-btn" @click="toggleLocale">{{ t('lang.toggle') }}</button>
    </header>
    <main class="main">
      <CardGrid @zoom="(card, rect) => zoomIn(card, rect)" />
    </main>
    <CardZoomed
      v-if="zoomedCard"
      :card="zoomedCard"
      :source-rect="sourceRect"
      :visible="isZoomed"
      @close="zoomOut"
      @animation-end="onZoomEnd"
    />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 1rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
}

.title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.lang-btn {
  position: absolute;
  right: -5rem;
  padding: 0.4rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 0.9rem;
  font-family: inherit;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}

.lang-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.main {
  display: flex;
  justify-content: center;
  width: 100%;
}

@media (max-width: 480px) {
  .title {
    font-size: 1.75rem;
  }
  .lang-btn {
    position: static;
  }
}
</style>
