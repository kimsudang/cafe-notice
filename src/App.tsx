import { useState } from "react";
import type { Tab } from "./types";
import { useTTS } from "./hooks/useTTS";
import { useScheduler } from "./hooks/useScheduler";
import { usePresetMessages } from "./hooks/usePresetMessages";
import { InstantTab } from "./components/InstantTab";
import { ScheduleTab } from "./components/ScheduleTab";
import { SettingsTab } from "./components/SettingsTab";
import { RecentTab } from "./components/RecentTab";

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "instant", label: "즉시 재생", icon: "▶" },
    { id: "recent", label: "최근 재생", icon: "🕐" },
    { id: "schedule", label: "자동 재생", icon: "⏰" },
    { id: "settings", label: "설정", icon: "⚙" },
];

function App() {
    const [activeTab, setActiveTab] = useState<Tab>("instant");
    const [recentLog, setRecentLog] = useState<string[]>([]);
    const { presetMessages, presetItems, addPreset, deletePreset, reorderPresets } = usePresetMessages();
    const { speak, stop, isSpeaking, settings, setSettings } = useTTS();
    const { schedules, loading, addSchedule, updateSchedule, deleteSchedule } = useScheduler(speak);

    const addToRecent = (text: string) => {
        setRecentLog((prev) => [text, ...prev.filter((m) => m !== text)].slice(0, 5));
    };

    return (
        <div className="flex flex-col min-h-svh bg-gray-50 md:max-w-4xl md:mx-auto">
            {/* Header */}
            <header className="bg-amber-500 px-4 py-3 md:px-8 md:py-4 flex items-center justify-between shadow-sm">
                <h1 className="text-white font-bold text-lg md:text-2xl">안내방송</h1>
                {isSpeaking && (
                    <button
                        onClick={stop}
                        className="px-3 py-1 md:px-5 md:py-2 rounded-lg bg-white/20 text-white text-sm md:text-base font-medium"
                    >
                        정지
                    </button>
                )}
            </header>

            {/* Body: sidebar (md+) or top tabs (mobile) */}
            <div className="flex flex-1 overflow-hidden">
                {/* Mobile: top tab bar */}
                <nav className="md:hidden flex bg-white border-b border-gray-200">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${
                                activeTab === tab.id ? "text-amber-600 border-b-2 border-amber-500" : "text-gray-500"
                            }`}
                        >
                            <span className="mr-1">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Tablet: left sidebar */}
                <nav className="hidden md:flex flex-col w-44 shrink-0 bg-white border-r border-gray-200 pt-4">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-5 py-4 text-base font-medium transition-colors text-left ${
                                activeTab === tab.id
                                    ? "text-amber-600 bg-amber-50 border-r-2 border-amber-500"
                                    : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <main className="flex-1 overflow-y-auto">
                    {activeTab === "instant" && (
                        <InstantTab speak={speak} isSpeaking={isSpeaking} onAddRecent={addToRecent} presetMessages={presetMessages} />
                    )}
                    {activeTab === "recent" && (
                        <RecentTab
                            recentLog={recentLog}
                            speak={speak}
                            isSpeaking={isSpeaking}
                            onAddRecent={addToRecent}
                        />
                    )}
                    {activeTab === "schedule" && (
                        <ScheduleTab
                            schedules={schedules}
                            loading={loading}
                            addSchedule={addSchedule}
                            updateSchedule={updateSchedule}
                            deleteSchedule={deleteSchedule}
                        />
                    )}
                    {activeTab === "settings" && (
                        <SettingsTab settings={settings} setSettings={setSettings} speak={speak} presetMessages={presetMessages} presetItems={presetItems} addPreset={addPreset} deletePreset={deletePreset} reorderPresets={reorderPresets} />
                    )}
                </main>
            </div>

            {/* Speaking indicator */}
            {isSpeaking && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-sm md:text-base font-medium px-4 py-2 rounded-full shadow-lg">
                    🔊 재생 중...
                </div>
            )}
        </div>
    );
}

export default App;
