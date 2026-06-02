import { useState } from 'react'
import { TEMPLATES } from '../constants'

interface Props {
  speak: (text: string) => void
  isSpeaking: boolean
  onAddRecent: (text: string) => void
  presetMessages: string[]
}

export function InstantTab({ speak, isSpeaking, onAddRecent, presetMessages }: Props) {
  const [templateIndex, setTemplateIndex] = useState(0)
  const [templateVar, setTemplateVar] = useState('')
  const [freeText, setFreeText] = useState('')

  const playCustom = (text: string) => {
    if (!text.trim()) return
    speak(text)
    onAddRecent(text)
  }

  const buildTemplateMessage = () => {
    return TEMPLATES[templateIndex].template.replace(/\$\{[^}]+\}/, templateVar)
  }

  const handleTemplateVarChange = (value: string) => {
    const { inputType } = TEMPLATES[templateIndex]
    if (inputType === 'number' && value !== '' && !/^\d+$/.test(value)) return
    if (inputType === 'text' && /\d/.test(value)) return
    setTemplateVar(value)
  }

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6">
      {/* Preset messages */}
      <section>
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3">기본 문장</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {presetMessages.map((msg) => (
            <button
              key={msg}
              onClick={() => { speak(msg); onAddRecent(msg) }}
              disabled={isSpeaking}
              className="w-full text-left px-4 py-3 md:py-5 md:text-base rounded-xl bg-white border border-gray-200 text-gray-800 font-medium shadow-sm active:scale-95 transition-transform disabled:opacity-50"
            >
              {msg}
            </button>
          ))}
        </div>
      </section>

      {/* Custom sections: side by side on tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Template */}
        <section className="flex flex-col">
          <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3">템플릿 문장</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 space-y-3 flex-1">
            <select
              value={templateIndex}
              onChange={(e) => { setTemplateIndex(Number(e.target.value)); setTemplateVar('') }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base text-gray-800"
            >
              {TEMPLATES.map((t, i) => (
                <option key={i} value={i}>
                  {t.label}
                </option>
              ))}
            </select>
            <input
              type={TEMPLATES[templateIndex].inputType}
              placeholder={TEMPLATES[templateIndex].inputType === 'number' ? '번호 입력' : '음료명 입력'}
              value={templateVar}
              onChange={(e) => handleTemplateVarChange(e.target.value)}
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
        <section className="flex flex-col">
          <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3">직접 입력</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 space-y-3 flex-1">
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
    </div>
  )
}
