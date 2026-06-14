<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useI18n } from "./composables/useI18n";
import { useCardZoom } from "./composables/useCardZoom";
import CardGrid from "./components/CardGrid.vue";
import CardZoomed from "./components/CardZoomed.vue";

const { t, toggleLocale } = useI18n();
const { zoomedCard, sourceRect, isZoomed, zoomIn, zoomOut, onZoomEnd } =
      useCardZoom();

function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape" && isZoomed.value) {
            zoomOut();
      }
}

function handleCode() {
      window.open("https://github.com/KevinTheSome/30explained", "_blank");
}

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));
</script>

<template>
      <div class="app">
            <header class="header">
                  <h1 class="title">{{ t("app.title") }}</h1>
                  <button class="lang-btn" @click="toggleLocale">
                        {{ t("lang.toggle") }}
                  </button>
                  <button class="lang-btn" @click="handleCode">
                        <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-github"
                              viewBox="0 0 16 16"
                        >
                              <path
                                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
                              />
                        </svg>
                  </button>
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
      gap: 1rem;
      margin-bottom: 2rem;
}

.title {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--highlight-color);
}

.lang-btn {
      padding: 0.4rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: var(--highlight-color);
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
