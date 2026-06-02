import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PRESET_MESSAGES } from '../constants'

export function usePresetMessages() {
  const [presetMessages, setPresetMessages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('preset_messages')
      .select('id, message')
      .order('created_at', { ascending: true })
      .then(async ({ data }) => {
        if (data && data.length > 0) {
          setPresetMessages(data.map((r) => r.message))
        } else {
          // 첫 실행 시 기본 문구를 DB에 삽입
          const rows = PRESET_MESSAGES.map((message) => ({ message }))
          const { data: inserted } = await supabase
            .from('preset_messages')
            .insert(rows)
            .select('message')
            .order('created_at', { ascending: true })
          if (inserted) setPresetMessages(inserted.map((r) => r.message))
        }
        setLoading(false)
      })
  }, [])

  const addPreset = async (text: string) => {
    const { data } = await supabase
      .from('preset_messages')
      .insert({ message: text })
      .select('id, message')
      .single()
    if (data) setPresetMessages((prev) => [...prev, data.message])
  }

  const deletePreset = async (index: number) => {
    const message = presetMessages[index]
    const { data } = await supabase
      .from('preset_messages')
      .select('id')
      .eq('message', message)
      .limit(1)
      .single()
    if (data) {
      await supabase.from('preset_messages').delete().eq('id', data.id)
      setPresetMessages((prev) => prev.filter((_, i) => i !== index))
    }
  }

  return { presetMessages, loading, addPreset, deletePreset }
}
