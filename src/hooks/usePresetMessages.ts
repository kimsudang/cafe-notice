import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PRESET_MESSAGES } from '../constants'

type PresetRow = { id: string; message: string; sort_order: number }

export function usePresetMessages() {
  const [rows, setRows] = useState<PresetRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('preset_messages')
      .select('id, message, sort_order')
      .order('sort_order', { ascending: true })
      .then(async ({ data }) => {
        if (data && data.length > 0) {
          setRows(data as PresetRow[])
        } else {
          const toInsert = PRESET_MESSAGES.map((message, i) => ({ message, sort_order: i + 1 }))
          const { data: inserted } = await supabase
            .from('preset_messages')
            .insert(toInsert)
            .select('id, message, sort_order')
            .order('sort_order', { ascending: true })
          if (inserted) setRows(inserted as PresetRow[])
        }
        setLoading(false)
      })
  }, [])

  const addPreset = async (text: string) => {
    const nextOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 1
    const { data } = await supabase
      .from('preset_messages')
      .insert({ message: text, sort_order: nextOrder })
      .select('id, message, sort_order')
      .single()
    if (data) setRows((prev) => [...prev, data as PresetRow])
  }

  const deletePreset = async (index: number) => {
    const row = rows[index]
    await supabase.from('preset_messages').delete().eq('id', row.id)
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  const reorderPresets = async (orderedIds: string[]) => {
    const reordered = orderedIds.map((id, i) => {
      const row = rows.find((r) => r.id === id)!
      return { ...row, sort_order: i + 1 }
    })
    setRows(reordered)
    await supabase
      .from('preset_messages')
      .upsert(reordered.map(({ id, sort_order }) => ({ id, sort_order })))
  }

  return {
    presetMessages: rows.map((r) => r.message),
    presetItems: rows.map(({ id, message }) => ({ id, message })),
    loading,
    addPreset,
    deletePreset,
    reorderPresets,
  }
}
