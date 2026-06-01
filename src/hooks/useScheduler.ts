import { useState, useEffect, useRef } from 'react'
import type { Schedule, Day } from '../types'
import { ALL_DAYS } from '../constants'
import { supabase } from '../lib/supabase'

function todayDay(): Day {
  const days = ALL_DAYS
  return days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
}

export function useScheduler(speak: (text: string) => void) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const spokenRef = useRef<Set<string>>(new Set())

  // 초기 로드
  useEffect(() => {
    supabase
      .from('schedules')
      .select('id, time, message, days, enabled')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setSchedules(data as Schedule[])
        setLoading(false)
      })
  }, [])

  // 자동 재생 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const today = todayDay()
      const key = `${hhmm}`

      schedules.forEach((s) => {
        if (!s.enabled) return
        if (s.time !== hhmm) return
        if (!s.days.includes(today)) return
        if (spokenRef.current.has(key + s.id)) return
        spokenRef.current.add(key + s.id)
        speak(s.message)
      })

      if (now.getSeconds() === 0) {
        spokenRef.current.clear()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [schedules, speak])

  const addSchedule = async (s: Omit<Schedule, 'id'>) => {
    const { data } = await supabase
      .from('schedules')
      .insert(s)
      .select('id, time, message, days, enabled')
      .single()
    if (data) setSchedules((prev) => [...prev, data as Schedule])
  }

  const updateSchedule = async (id: string, updates: Partial<Schedule>) => {
    await supabase
      .from('schedules')
      .update({ ...updates, update_at: new Date().toISOString() })
      .eq('id', id)
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  const deleteSchedule = async (id: string) => {
    await supabase.from('schedules').delete().eq('id', id)
    setSchedules((prev) => prev.filter((s) => s.id !== id))
  }

  return { schedules, loading, addSchedule, updateSchedule, deleteSchedule }
}
