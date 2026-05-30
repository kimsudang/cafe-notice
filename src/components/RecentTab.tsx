interface Props {
  recentLog: string[]
  speak: (text: string) => void
  isSpeaking: boolean
  onAddRecent: (text: string) => void
}

export function RecentTab({ recentLog, speak, isSpeaking, onAddRecent }: Props) {
  const handlePlay = (text: string) => {
    speak(text)
    onAddRecent(text)
  }

  return (
    <div className="p-4 md:p-6">
      {recentLog.length === 0 ? (
        <p className="text-center text-gray-400 text-sm md:text-base mt-16">아직 재생 기록이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {recentLog.map((msg, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-4"
            >
              <span className="text-sm md:text-base text-gray-700 flex-1 mr-3 line-clamp-1">{msg}</span>
              <button
                onClick={() => handlePlay(msg)}
                disabled={isSpeaking}
                className="shrink-0 px-3 py-1 md:px-4 md:py-2 rounded-lg bg-gray-100 text-sm md:text-base text-gray-700 font-medium active:scale-95 transition-transform disabled:opacity-50"
              >
                재생
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
