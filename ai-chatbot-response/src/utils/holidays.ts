// 한국 공휴일 데이터 (YYYY-MM-DD 형식)
export const koreanHolidays: Record<string, { name: string; icon: string }> = {
  // 2026년
  '2026-01-01': { name: '신정', icon: '🎆' },
  '2026-02-17': { name: '설날', icon: '🏮' },
  '2026-02-18': { name: '설날', icon: '🏮' },
  '2026-02-19': { name: '설날', icon: '🏮' },
  '2026-03-01': { name: '3.1절', icon: '🇰🇷' },
  '2026-04-15': { name: '국회의원선거일', icon: '🗳️' },
  '2026-05-05': { name: '어린이날', icon: '🎈' },
  '2026-05-15': { name: '부처님오탄날', icon: '🙏' },
  '2026-06-06': { name: '현충일', icon: '🕯️' },
  '2026-08-15': { name: '광복절', icon: '🇰🇷' },
  '2026-09-24': { name: '추석', icon: '🎃' },
  '2026-09-25': { name: '추석', icon: '🎃' },
  '2026-09-26': { name: '추석', icon: '🎃' },
  '2026-10-03': { name: '개천절', icon: '🇰🇷' },
  '2026-10-09': { name: '한글날', icon: '🔤' },
  '2026-12-25': { name: '크리스마스', icon: '🎄' },
};

// 특정 날짜의 공휴일 정보 조회
export function getHolidayInfo(dateStr: string): { name: string; icon: string } | null {
  return koreanHolidays[dateStr] || null;
}

// 공휴일 여부 확인
export function isHoliday(dateStr: string): boolean {
  return dateStr in koreanHolidays;
}

// 요일에 따른 기본 배경색 (일요일은 기본적으로 강조)
export function getDayBackgroundColor(dayOfWeek: number, isHol: boolean): string {
  if (isHol) {
    return 'bg-red-50'; // 공휴일: 연한 빨강
  }
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return 'bg-blue-50'; // 토일: 연한 파랑
  }
  return 'bg-white'; // 평일: 흰색
}

// 요일에 따른 텍스트색 (공휴일이면 빨강)
export function getDayTextColor(dayOfWeek: number, isHol: boolean): string {
  if (isHol) {
    return 'text-red-700'; // 공휴일: 빨강
  }
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return 'text-blue-700'; // 토일: 파랑
  }
  return 'text-gray-600'; // 평일: 회색
}
