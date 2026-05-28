import { useState, useEffect, useCallback } from 'react'
import type { TTSSettings } from '../types'

export function useTTS() {
  const [settings, setSettings] = useState<TTSSettings>({
    voice: null,
    rate: 1,
    volume: 1,
  })
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    const loadVoices = () => {
      const available = speechSynthesis.getVoices()
      setVoices(available)
      const korean = available.find((v) => v.lang.startsWith('ko'))
      if (korean) setSettings((s) => ({ ...s, voice: korean }))
    }

    loadVoices()
    speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [])

  const speak = useCallback(
    (text: string) => {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = settings.voice
      utterance.rate = settings.rate
      utterance.volume = settings.volume
      utterance.lang = 'ko-KR'
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    },
    [settings],
  )

  const stop = useCallback(() => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking, voices, settings, setSettings }
}
