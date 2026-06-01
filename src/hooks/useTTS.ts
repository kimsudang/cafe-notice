import { useState, useRef, useCallback } from 'react'
import type { TTSSettings } from '../types'

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tts`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export function useTTS() {
  const [settings, setSettings] = useState<TTSSettings>({
    voiceName: 'ko-KR-Neural2-A',
    rate: 1,
    volume: 1,
  })
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(
    async (text: string) => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      setIsSpeaking(true)

      const res = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({ text, voiceName: settings.voiceName }),
      })

      if (!res.ok) {
        setIsSpeaking(false)
        return
      }

      const buffer = await res.arrayBuffer()
      const blob = new Blob([buffer], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.playbackRate = settings.rate
      audio.volume = settings.volume
      audioRef.current = audio

      audio.onended = () => {
        URL.revokeObjectURL(url)
        setIsSpeaking(false)
      }
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        setIsSpeaking(false)
      }

      audio.play()
    },
    [settings],
  )

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking, settings, setSettings }
}
