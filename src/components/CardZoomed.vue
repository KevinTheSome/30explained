<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import type { Card } from "../types";
import { useI18n } from "../composables/useI18n";
const props = defineProps<{
      card: Card;
      sourceRect: DOMRect | null;
      visible: boolean;
}>();

const emit = defineEmits<{
      close: [];
      animationEnd: [];
}>();

const { t } = useI18n();
const overlay = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const animating = ref(false);

const assetModules = import.meta.glob<{ default: string }>("../assets/*", {
      eager: true,
      query: "?url",
});

onMounted(async () => {
      if (props.visible && props.sourceRect) {
            animating.value = true;
            await nextTick();

            const el = content.value;
            if (!el) return;

            const sx = props.sourceRect.width / window.innerWidth;
            const sy = props.sourceRect.height / window.innerHeight;
            const dx = props.sourceRect.left;
            const dy = props.sourceRect.top;

            el.style.transformOrigin = "top left";
            el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
            el.style.opacity = "0";

            requestAnimationFrame(() => {
                  el.style.transform = "";
                  el.style.opacity = "";
                  animating.value = false;
            });
      }
});

watch(
      () => props.visible,
      (visible) => {
            if (visible) return;
            if (!props.sourceRect) {
                  emit("animationEnd");
                  return;
            }
            if (animating.value) {
                  emit("animationEnd");
                  return;
            }

            animateOut();
      },
);

function handleClose() {
      if (!props.sourceRect) {
            emit("close");
            emit("animationEnd");
            return;
      }

      animating.value = true;
      emit("close");

      animateOut();
}

function animateOut() {
      const el = content.value;
      if (!el || !props.sourceRect) {
            emit("animationEnd");
            return;
      }

      const sx = props.sourceRect.width / window.innerWidth;
      const sy = props.sourceRect.height / window.innerHeight;
      const dx = props.sourceRect.left;
      const dy = props.sourceRect.top;

      el.addEventListener(
            "transitionend",
            () => {
                  animating.value = false;
                  emit("animationEnd");
            },
            { once: true },
      );

      el.style.transformOrigin = "top left";
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      el.style.opacity = "0";
}

const processedDesc = computed(() => {
      const raw = t(`card.${props.card.id}.desc`);
      if (!raw) return "";
      let html = raw.replace(/(?:\\n|\n|\/n)/g, "<br>");
      html = html.replace(
            /src="\.\/assets\/([^"]+)"/g,
            (_, filename: string) => {
                  const mod = assetModules[`../assets/${filename}`];
                  return `src="${mod?.default || filename}"`;
            },
      );
      return html;
});

function onBackdropClick(e: MouseEvent) {
      if (e.target === overlay.value) {
            handleClose();
      }
}
</script>

<template>
      <Teleport to="body">
            <div
                  v-if="visible || animating"
                  ref="overlay"
                  class="overlay"
                  :class="{ visible: visible }"
                  @click="onBackdropClick"
            >
                  <div
                        ref="content"
                        class="content"
                        :style="{ '--card-color': card.color }"
                  >
                        <button class="close-btn" @click="handleClose">
                              {{ t("zoom.close") }}
                        </button>
                        <span class="content-icon">{{ card.icon }}</span>
                        <h2 class="content-title">
                              {{ t(`card.${card.id}.title`) }}
                        </h2>
                        <div class="content-desc" v-html="processedDesc"></div>
                  </div>
            </div>
      </Teleport>
</template>

<style scoped>
.overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0);
      transition: background 0.3s ease;
}

.overlay.visible {
      background: rgba(0, 0, 0, 0.5);
}

.content {
      position: relative;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 6rem 3rem 3rem;
      overflow: hidden;
      background: linear-gradient(
            135deg,
            var(--card-color) 0%,
            rgba(250, 250, 250, 0.1) 100%
      );
      transition:
            transform 0.4s ease,
            opacity 0.3s ease;
}

.close-btn {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      padding: 0.5rem 1.25rem;
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: var(--highlight-color);
      font-size: 1rem;
      font-family: inherit;
      cursor: pointer;
      backdrop-filter: blur(4px);
      transition: background 0.2s;
}

.close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
}

.content-icon {
      font-size: 5rem;
      line-height: 1;
}

.content-title {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--highlight-color);
      text-align: center;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.content-desc {
      flex: 1;
      width: 100%;
      max-width: 600px;
      margin: 0;
      padding-right: 0.5rem;
      overflow-y: auto;
      font-size: 1.2rem;
      line-height: 1.6;
      color: var(--highlight-color);
      text-align: left;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

@media (max-width: 480px) {
      .content {
            padding: 4rem 1.25rem 1.25rem;
            gap: 1rem;
      }

      .close-btn {
            top: auto;
            right: auto;
            bottom: 1.5rem;
            left: 50%;
            transform: translateX(-50%);
            padding: 0.75rem 2rem;
            font-size: 1rem;
      }

      .content-icon {
            font-size: 3rem;
      }

      .content-title {
            font-size: 1.5rem;
      }

      .content-desc {
            font-size: 0.95rem;
            padding-right: 0.25rem;
      }
}
</style>

<style>
.content-desc img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
      display: block;
      margin: 1rem auto;
}
</style>
