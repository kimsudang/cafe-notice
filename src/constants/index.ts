export const PRESET_MESSAGES = [
  '영업 마감 10분 전입니다.',
  '잠시 후 영업이 종료됩니다.',
  '음료 준비에 잠시 시간이 걸리고 있습니다.',
  '자리를 정리해 주시면 감사하겠습니다.',
]

export const TEMPLATES = [
  { label: '번호 호출', template: '${number}번 손님, 음료 나왔습니다.' },
  { label: '대기 안내', template: '${number}번 손님, 잠시만 기다려 주세요.' },
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
