import { ref, type Ref } from 'vue'
import type { Card } from '../types'

export function useCardZoom() {
  const zoomedCard: Ref<Card | null> = ref(null)
  const sourceRect: Ref<DOMRect | null> = ref(null)
  const isZoomed = ref(false)

  function zoomIn(card: Card, rect: DOMRect) {
    zoomedCard.value = card
    sourceRect.value = rect
    isZoomed.value = true
  }

  function zoomOut() {
    isZoomed.value = false
  }

  function onZoomEnd() {
    zoomedCard.value = null
    sourceRect.value = null
  }

  return { zoomedCard, sourceRect, isZoomed, zoomIn, zoomOut, onZoomEnd }
}
