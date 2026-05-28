import { useState } from 'react'
import type { Schedule, Day } from '../types'
import { DAY_LABELS, ALL_DAYS, PRESET_MESSAGES } from '../constants'

interface Props {
  schedules: Schedule[]
  addSchedule: (s: Omit<Schedule, 'id'>) => void
  updateSchedule: (id: string, updates: Partial<Schedule>) => void
  deleteSchedule: (id: string) => void
}

const emptyForm = (): Omit<Schedule, 'id'> => ({
  time: '09:00',
  message: PRESET_MESSAGES[0],
  days: [...ALL_DAYS],
  enabled: true,
})

export function ScheduleTab({ schedules, addSchedule, updateSchedule, deleteSchedule }: Props) {
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  const toggleDay = (day: Day) => {
    setForm((f) => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
    }))
  }

  const handleAdd = () => {
    if (!form.message.trim()) return
    addSchedule(form)
    setForm(emptyForm())
    setShowForm(false)
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base md:text-lg font-semibold text-gray-700">자동 재생 스케줄</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg bg-amber-500 text-white text-sm md:text-base font-semibold"
        >
          {showForm ? '취소' : '+ 추가'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 md:grid md:grid-cols-2 md:gap-6 space-y-4 md:space-y-0">
          <div className="space-y-4">
            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-500 mb-1 block">재생 시간</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base w-full"
              />
            </div>
            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-500 mb-1 block">재생 문장</label>
              <select
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base w-full"
              >
                {PRESET_MESSAGES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
                <option value="">직접 입력...</option>
              </select>
              {!PRESET_MESSAGES.includes(form.message) && (
                <input
                  type="text"
                  placeholder="재생할 문장 입력"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="mt-2 border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base w-full"
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-500 mb-2 block">반복 요일</label>
              <div className="flex gap-1.5 md:gap-2">
                {ALL_DAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`flex-1 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                      form.days.includes(day)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {DAY_LABELS[day]}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleAdd}
              disabled={!form.message.trim() || form.days.length === 0}
              className="w-full py-2 md:py-3 rounded-lg bg-amber-500 text-white font-semibold md:text-base disabled:opacity-50"
            >
              스케줄 저장
            </button>
          </div>
        </div>
      )}

      {schedules.length === 0 ? (
        <p className="text-center text-gray-400 text-sm md:text-base py-8 md:py-16">
          등록된 스케줄이 없습니다.
        </p>
      ) : (
        <div className="grid gap-2 md:gap-3 md:grid-cols-2">
          {schedules.map((s) => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl md:text-3xl font-bold text-gray-800">{s.time}</span>
                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    onClick={() => updateSchedule(s.id, { enabled: !s.enabled })}
                    className={`relative w-11 h-6 md:w-14 md:h-7 rounded-full transition-colors ${s.enabled ? 'bg-amber-500' : 'bg-gray-200'}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow transition-transform ${s.enabled ? 'translate-x-5 md:translate-x-7' : ''}`}
                    />
                  </button>
                  <button
                    onClick={() => deleteSchedule(s.id)}
                    className="text-gray-400 text-sm md:text-base px-2 py-1 rounded-lg hover:bg-gray-100"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-600 mb-2 line-clamp-1">{s.message}</p>
              <div className="flex gap-1 md:gap-1.5">
                {ALL_DAYS.map((day) => (
                  <span
                    key={day}
                    className={`text-xs md:text-sm px-1.5 py-0.5 rounded ${
                      s.days.includes(day) ? 'bg-amber-100 text-amber-700' : 'text-gray-300'
                    }`}
                  >
                    {DAY_LABELS[day]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
