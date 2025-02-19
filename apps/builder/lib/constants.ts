import { bellota, breeSerif, domine, ebGaramond, inter, notoSans } from '@/lib/fonts'

export const ACCENT_COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981']
export const BG_COLORS = ['#202020', '#363636', '#FFFFFF']

export const RADIUS_NAME_VALUE_MAP = {
  '-': '0px',
  S: '1px',
  M: '2px',
  L: '4px',
  XL: '8px'
}

export const FONT_OPTIONS = [
  { label: 'Inter', value: inter.style.fontFamily },
  { label: 'Noto Sans', value: notoSans.style.fontFamily },
  { label: 'Domine', value: domine.style.fontFamily },
  { label: 'EB Garamond', value: ebGaramond.style.fontFamily },
  { label: 'Bree Serif', value: breeSerif.style.fontFamily },
  { label: 'Bellota', value: bellota.style.fontFamily }
]
