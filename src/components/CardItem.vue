<script setup lang="ts">
import { ref } from "vue";
import type { Card } from "../types";
import { useI18n } from "../composables/useI18n";

const props = defineProps<{
      card: Card;
}>();

const emit = defineEmits<{
      zoom: [card: Card, rect: DOMRect];
}>();

const { t } = useI18n();
const el = ref<HTMLElement | null>(null);

function handleClick() {
      if (el.value) {
            const rect = el.value.getBoundingClientRect();
            emit("zoom", props.card, rect);
      }
}
</script>

<template>
      <div
            ref="el"
            class="card"
            :style="{ '--card-color': card.color }"
            @click="handleClick"
      >
            <span class="card-icon">{{ card.icon }}</span>
            <h2 class="card-title">{{ t(`card.${card.id}.title`) }}</h2>
      </div>
</template>

<style scoped>
.card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.25);
      cursor: pointer;
      transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
      user-select: none;
      min-height: 180px;
}

.card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.card:active {
      transform: translateY(-1px);
}

.card-icon {
      font-size: 3rem;
      line-height: 1;
}

.card-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--highlight-color);
      text-align: center;
}
</style>
