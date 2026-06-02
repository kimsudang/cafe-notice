import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { TTSSettings } from '../types'
import { GOOGLE_TTS_VOICES } from '../constants'

interface PresetItem {
  id: string
  message: string
}

interface Props {
  settings: TTSSettings
  setSettings: React.Dispatch<React.SetStateAction<TTSSettings>>
  speak: (text: string) => void
  presetMessages: string[]
  presetItems: PresetItem[]
  addPreset: (text: string) => void
  deletePreset: (index: number) => void
  reorderPresets: (orderedIds: string[]) => void
}

function SortableItem({ item, onDelete }: { item: PresetItem; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing px-1 touch-none"
        aria-label="순서 변경"
      >
        ⠿
      </button>
      <span className="text-sm md:text-base text-gray-800 flex-1">{item.message}</span>
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none px-1"
        aria-label="삭제"
      >
        ×
      </button>
    </li>
  )
}

export function SettingsTab({ settings, setSettings, speak, presetItems, addPreset, deletePreset, reorderPresets }: Props) {
  const [newPhrase, setNewPhrase] = useState('')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleAdd = () => {
    const trimmed = newPhrase.trim()
    if (!trimmed) return
    addPreset(trimmed)
    setNewPhrase('')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = presetItems.findIndex((item) => item.id === active.id)
    const newIndex = presetItems.findIndex((item) => item.id === over.id)
    const newOrder = arrayMove(presetItems, oldIndex, newIndex)
    reorderPresets(newOrder.map((item) => item.id))
  }

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6">
      <section>
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3">기본 문구 관리</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 space-y-4">
          {presetItems.length < 6 ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="새 문구를 입력하세요"
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm md:text-base"
              />
              <button
                onClick={handleAdd}
                disabled={!newPhrase.trim()}
                className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm md:text-base font-semibold disabled:opacity-40"
              >
                추가
              </button>
            </div>
          ) : (
            <p className="text-sm md:text-base text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              최대 문장의 개수는 6개입니다. 추가 등록을 원하면 기존 항목을 삭제하고 등록하세요.
            </p>
          )}
          {presetItems.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">등록된 문구가 없습니다.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={presetItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                  {presetItems.map((item, i) => (
                    <SortableItem key={item.id} item={item} onDelete={() => deletePreset(i)} />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </section>

      <div className="md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
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
    </div>
  )
}
