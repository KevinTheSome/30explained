import { ref, computed } from 'vue'
import type { Locale, Translations } from '../types'
import en from '../i18n/en'
import lv from '../i18n/lv'

const STORAGE_KEY = 'locale'

const locale = ref<Locale>((localStorage.getItem(STORAGE_KEY) as Locale) || 'en')

const translations: Record<Locale, Translations> = { en, lv }

function t(key: string): string {
  return translations[locale.value][key] ?? key
}

function setLocale(l: Locale) {
  locale.value = l
  localStorage.setItem(STORAGE_KEY, l)
}

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'lv' : 'en')
}

const otherLocale = computed<Locale>(() => locale.value === 'en' ? 'lv' : 'en')

export function useI18n() {
  return { locale, t, setLocale, toggleLocale, otherLocale }
}
