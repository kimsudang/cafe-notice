import { useState } from 'react'
import { PRESET_MESSAGES, TEMPLATES } from '../constants'

interface Props {
  speak: (text: string) => void
  isSpeaking: boolean
}

export function InstantTab({ speak, isSpeaking }: Props) {
  const [templateIndex, setTemplateIndex] = useState(0)
  const [templateVar, setTemplateVar] = useState('')
  const [freeText, setFreeText] = useState('')
  const [recentLog, setRecentLog] = useState<string[]>([])

  const playCustom = (text: string) => {
    if (!text.trim()) return
    speak(text)
    setRecentLog((prev) => {
      const next = [text, ...prev.filter((m) => m !== text)].slice(0, 3)
      return next
    })
  }

  const buildTemplateMessage = () => {
    return TEMPLATES[templateIndex].template.replace('${number}', templateVar)
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Preset messages */}
      <section>
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3">기본 문장</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {PRESET_MESSAGES.map((msg) => (
            <button
              key={msg}
              onClick={() => speak(msg)}
              disabled={isSpeaking}
              className="w-full text-left px-4 py-3 md:py-5 md:text-base rounded-xl bg-white border border-gray-200 text-gray-800 font-medium shadow-sm active:scale-95 transition-transform disabled:opacity-50"
            >
              {msg}
            </button>
          ))}
        </div>
      </section>

      {/* Custom sections: side by side on tablet */}
      <div className="md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
        {/* Template */}
        <section>
          <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3">템플릿 문장</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 space-y-3 h-full">
            <select
              value={templateIndex}
              onChange={(e) => setTemplateIndex(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base text-gray-800"
            >
              {TEMPLATES.map((t, i) => (
                <option key={i} value={i}>
                  {t.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="번호 입력"
              value={templateVar}
              onChange={(e) => setTemplateVar(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base"
            />
            <p className="text-sm md:text-base text-gray-500">{buildTemplateMessage()}</p>
            <button
              onClick={() => playCustom(buildTemplateMessage())}
              disabled={isSpeaking || !templateVar.trim()}
              className="w-full py-2 md:py-3 rounded-lg bg-amber-500 text-white font-semibold md:text-base active:scale-95 transition-transform disabled:opacity-50"
            >
              재생
            </button>
          </div>
        </section>

        {/* Free text */}
        <section>
          <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3">직접 입력</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 space-y-3 h-full">
            <textarea
              placeholder="재생할 문장을 입력하세요."
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base resize-none"
            />
            <button
              onClick={() => playCustom(freeText)}
              disabled={isSpeaking || !freeText.trim()}
              className="w-full py-2 md:py-3 rounded-lg bg-amber-500 text-white font-semibold md:text-base active:scale-95 transition-transform disabled:opacity-50"
            >
              재생
            </button>
          </div>
        </section>
      </div>

      {/* Recent log */}
      {recentLog.length > 0 && (
        <section>
          <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3">최근 재생</h2>
          <div className="grid gap-2 md:grid-cols-3">
            {recentLog.map((msg, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-4"
              >
                <span className="text-sm md:text-base text-gray-700 flex-1 mr-3 line-clamp-1">{msg}</span>
                <button
                  onClick={() => playCustom(msg)}
                  disabled={isSpeaking}
                  className="shrink-0 px-3 py-1 md:px-4 md:py-2 rounded-lg bg-gray-100 text-sm md:text-base text-gray-700 font-medium active:scale-95 transition-transform disabled:opacity-50"
                >
                  재생
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
