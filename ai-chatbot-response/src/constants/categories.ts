import type { Category } from '../types';

export interface CategoryInfo {
  id: Category;
  label: string;
  icon: string; // lucide-react icon name
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'general', label: '일반질의', icon: 'Building', description: '일반적인 업무 질의' },
  { id: 'analysis', label: '분석질의', icon: 'TrendingUp', description: '데이터 분석 및 리포트' },
  { id: 'forecast', label: '예측질의', icon: 'LineChart', description: '자금 흐름 예측' },
  { id: 'anomaly', label: '이상거래', icon: 'ShieldAlert', description: '이상거래 탐지' },
  { id: 'consult', label: '상담', icon: 'Headphones', description: '업무 상담 및 가이드' },
];

// Full list with 보고서 (for Welcome screen and InputBar tabs)
export const CATEGORIES_FULL = [
  ...CATEGORIES,
  { id: 'report' as const, label: '보고서', icon: 'FileText', description: '보고서 작성' },
];

export const SIDEBAR_NAV = [
  { id: 'new-chat', label: '새 채팅', icon: 'MessageSquare', action: 'new-chat' as const },
  { id: 'recent', label: '최근', icon: 'Clock', action: 'panel' as const, panel: 'recent' as const },
  { id: 'report', label: '리포트', icon: 'FileText', action: 'panel' as const, panel: 'report' as const },
  { id: 'settings', label: '설정', icon: 'Settings', action: 'panel' as const, panel: 'settings' as const },
] as const;
