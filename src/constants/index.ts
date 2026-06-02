export const PRESET_MESSAGES = [
  '영업 마감 10분 전입니다.',
  '잠시 후 영업이 종료됩니다.',
  '주문이 많아 키오스크 이용 부탁드립니다.',
  '가게 내에서 외부 음식은 취식 불가합니다.',
]

export const TEMPLATES = [
  { label: '번호 호출', template: '${number}번 손님, 음료 나왔습니다.', inputType: 'number' as const },
  { label: '음료 호출', template: '${string} 나왔습니다', inputType: 'text' as const },
]

export const DAY_LABELS: Record<string, string> = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  sat: '토',
  sun: '일',
}

export const ALL_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

export const GOOGLE_TTS_VOICES = [
  { name: 'ko-KR-Neural2-A', label: 'Neural2 여성 A (고품질)' },
  { name: 'ko-KR-Neural2-B', label: 'Neural2 여성 B (고품질)' },
  { name: 'ko-KR-Neural2-C', label: 'Neural2 남성 C (고품질)' },
  { name: 'ko-KR-Wavenet-A', label: 'WaveNet 여성 A' },
  { name: 'ko-KR-Wavenet-B', label: 'WaveNet 여성 B' },
  { name: 'ko-KR-Wavenet-C', label: 'WaveNet 남성 C' },
  { name: 'ko-KR-Wavenet-D', label: 'WaveNet 남성 D' },
  { name: 'ko-KR-Standard-A', label: 'Standard 여성 A' },
  { name: 'ko-KR-Standard-B', label: 'Standard 여성 B' },
  { name: 'ko-KR-Standard-C', label: 'Standard 남성 C' },
  { name: 'ko-KR-Standard-D', label: 'Standard 남성 D' },
]
