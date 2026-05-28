import { useState, useEffect, useRef } from 'react'
import type { Schedule, Day } from '../types'
import { ALL_DAYS } from '../constants'

function todayDay(): Day {
  const days = ALL_DAYS
  return days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
}

export function useScheduler(speak: (text: string) => void) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const spokenRef = useRef<Set<string>>(new Set())

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

      // clear spoken log on minute change
      if (now.getSeconds() === 0) {
        spokenRef.current.clear()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [schedules, speak])

  const addSchedule = (s: Omit<Schedule, 'id'>) => {
    setSchedules((prev) => [...prev, { ...s, id: crypto.randomUUID() }])
  }

  const updateSchedule = (id: string, updates: Partial<Schedule>) => {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id))
  }

  return { schedules, addSchedule, updateSchedule, deleteSchedule }
}
