export type Tab = 'instant' | 'schedule' | 'recent' | 'settings'

export interface Schedule {
  id: string
  time: string
  message: string
  days: Day[]
  enabled: boolean
}

export type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface TTSSettings {
  voice: SpeechSynthesisVoice | null
  rate: number
  volume: number
}
