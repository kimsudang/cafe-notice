import type { TTSSettings } from '../types'
import { GOOGLE_TTS_VOICES } from '../constants'

interface Props {
  settings: TTSSettings
  setSettings: React.Dispatch<React.SetStateAction<TTSSettings>>
  speak: (text: string) => void
}

export function SettingsTab({ settings, setSettings, speak }: Props) {
  return (
    <div className="p-4 md:p-6 md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
      <section>
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3">음성 설정</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 space-y-5">
          <div>
            <label className="text-xs md:text-sm font-semibold text-gray-500 mb-1 block">목소리</label>
            <select
              value={settings.voiceName}
              onChange={(e) => setSettings((s) => ({ ...s, voiceName: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base"
            >
              {GOOGLE_TTS_VOICES.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs md:text-sm font-semibold text-gray-500 mb-1 block">
              속도 ({settings.rate.toFixed(1)}x)
            </label>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={settings.rate}
              onChange={(e) => setSettings((s) => ({ ...s, rate: Number(e.target.value) }))}
              className="w-full accent-amber-500 md:h-2"
            />
          </div>

          <div>
            <label className="text-xs md:text-sm font-semibold text-gray-500 mb-1 block">
              볼륨 ({Math.round(settings.volume * 100)}%)
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.volume}
              onChange={(e) => setSettings((s) => ({ ...s, volume: Number(e.target.value) }))}
              className="w-full accent-amber-500 md:h-2"
            />
          </div>

          <button
            onClick={() => speak('안녕하세요, 테스트 음성입니다.')}
            className="w-full py-2 md:py-3 rounded-lg bg-gray-100 text-gray-700 text-sm md:text-base font-medium"
          >
            테스트 재생
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3">안내</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6 space-y-3">
          <p className="text-sm md:text-base text-amber-800">
            음성 재생 시 음악 앱과 소리가 겹칠 수 있습니다. 재생 전 음악을 수동으로 끄거나
            볼륨을 낮춰 주세요.
          </p>
          <p className="text-sm md:text-base text-amber-800">
            자동 재생 스케줄은 브라우저 탭이 열려 있는 동안에만 동작합니다.
          </p>
        </div>
      </section>
    </div>
  )
}
