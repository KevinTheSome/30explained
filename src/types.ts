export interface Card {
  id: string
  icon: string
  color: string
}

export type Locale = 'en' | 'lv'
export type Translations = Record<string, string>
