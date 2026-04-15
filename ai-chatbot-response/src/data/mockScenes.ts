import type { Message, Block } from '../types';

let _id = 0;
const uid = () => `msg_${++_id}`;

// ─── S1: General (일반질의) ───
const generalBlocks: Block[] = [
  {
    type: 'text-content',
    data: { text: '이번 주 법인카드 사용 내역을 조회했습니다.\n총 12건의 거래가 확인되며, 아래에서 상세 내역을 확인하실 수 있습니다.' },
  },
  {
    type: 'data-table',
    data: {
      title: '법인카드 사용 내역',
      columns: [
        { key: 'date', label: '거래일', align: 'center' },
        { key: 'merchant', label: '가맹점', align: 'left' },
        { key: 'amount', label: '금액', align: 'right' },
        { key: 'status', label: '상태', align: 'center', type: 'badge' },
      ],
      rows: [
        { date: '2026.04.13', merchant: '스타벅스 여의도점', amount: '5,400원', status: { text: '승인', color: '#16A34A' } },
        { date: '2026.04.12', merchant: '교보문고 광화문', amount: '32,000원', status: { text: '승인', color: '#16A34A' } },
        { date: '2026.04.12', merchant: 'CU 편의점', amount: '8,900원', status: { text: '승인', color: '#16A34A' } },
        { date: '2026.04.11', merchant: '택시 (카카오T)', amount: '15,600원', status: { text: '승인', color: '#16A34A' } },
        { date: '2026.04.10', merchant: '이마트 여의도', amount: '87,200원', status: { text: '검토중', color: '#CA8A04' } },
      ],
    },
  },
  {
    type: 'related-questions',
    data: {
      items: [
        '이번 달 카드 사용 한도는 얼마인가요?',
        '지난 달과 비교해서 사용금액 추이를 알려주세요',
        '검토중인 거래의 상세 내역을 확인하고 싶어요',
      ],
    },
  },
];

// ─── S2: Analysis (분석) ───
const analysisBlocks: Block[] = [
  {
    type: 'report-header',
    data: {
      category: '분석',
      title: '2026년 4월 법인카드 분석 리포트',
      subtitle: '부서별 사용 현황 및 패턴 분석',
      date: '2026.04.13',
      icon: '📊',
    },
  },
  {
    type: 'number-stat',
    data: {
      items: [
        { label: '총 사용건수', value: '156건', diff: '+12.5%', trend: 'up' },
        { label: '총 사용금액', value: '4,820만원', diff: '+8.3%', trend: 'up' },
        { label: '건당 평균', value: '30.9만원', diff: '-2.1%', trend: 'down' },
        { label: '한도 잔여', value: '1,180만원', diff: '-15.4%', trend: 'down' },
      ],
    },
  },
  {
    type: 'pattern-analysis',
    data: {
      title: '사용 패턴 분석',
      items: [
        { level: 'critical', title: '교통비 급증', description: '전월 대비 교통비가 45% 증가했습니다. 택시 이용 빈도 점검이 필요합니다.' },
        { level: 'warning', title: '접대비 한도 근접', description: '접대비 한도의 87%를 사용했습니다. 잔여 한도 78만원입니다.' },
        { level: 'normal', title: '소모품비 안정', description: '소모품비는 전월과 유사한 수준을 유지하고 있습니다.' },
      ],
    },
  },
  {
    type: 'data-table',
    data: {
      title: '부서별 사용 현황',
      columns: [
        { key: 'dept', label: '부서', align: 'left' },
        { key: 'count', label: '건수', align: 'center' },
        { key: 'amount', label: '금액', align: 'right' },
        { key: 'ratio', label: '비중', align: 'center' },
      ],
      rows: [
        { dept: '경영지원팀', count: 45, amount: '1,520만원', ratio: '31.5%' },
        { dept: '영업1팀', count: 38, amount: '1,280만원', ratio: '26.6%' },
        { dept: 'IT개발팀', count: 32, amount: '890만원', ratio: '18.5%' },
        { dept: '마케팅팀', count: 28, amount: '750만원', ratio: '15.6%' },
        { dept: '인사팀', count: 13, amount: '380만원', ratio: '7.8%' },
      ],
    },
  },
  {
    type: 'alert-box',
    data: {
      level: 'warning',
      title: '한도 초과 주의',
      message: '영업1팀의 접대비가 월 한도의 92%에 도달했습니다.\n초과 시 결재 승인이 필요합니다.',
    },
  },
  {
    type: 'bar-chart',
    data: {
      title: '월별 사용 추이',
      data: [
        { label: '1월', value: 3200 },
        { label: '2월', value: 2800 },
        { label: '3월', value: 4100 },
        { label: '4월', value: 4820 },
      ],
    },
  },
  {
    type: 'source-box',
    data: {
      text: '데이터 출처',
      links: [
        { name: 'ERP 법인카드 관리시스템', description: '실시간 사용내역' },
        { name: '부서별 한도 관리대장', description: '2026년 기준' },
      ],
    },
  },
  {
    type: 'related-questions',
    data: {
      items: [
        '지난 분기 대비 변화 추이를 분석해주세요',
        '부서별 한도 조정 시뮬레이션을 해주세요',
        '이상 거래 패턴은 없나요?',
      ],
    },
  },
];

// ─── S3: Forecast (예측) ───
const forecastBlocks: Block[] = [
  {
    type: 'report-header',
    data: {
      category: '예측',
      title: '2026년 Q2 자금흐름 예상보고서',
      subtitle: '월별 입출금 예측 분석',
      date: '2026.04.13',
      icon: '📈',
    },
  },
  {
    type: 'data-table',
    data: {
      title: '월별 자금흐름 예측',
      columns: [
        { key: 'month', label: '월', align: 'center' },
        { key: 'inflow', label: '입금 예상', align: 'right' },
        { key: 'outflow', label: '출금 예상', align: 'right' },
        { key: 'balance', label: '잔액 예상', align: 'right' },
      ],
      rows: [
        { month: '4월', inflow: '12.5억', outflow: '9.8억', balance: '15.2억' },
        { month: '5월', inflow: '11.8억', outflow: '10.2억', balance: '16.8억' },
        { month: '6월', inflow: '13.2억', outflow: '11.5억', balance: '18.5억' },
      ],
    },
  },
  {
    type: 'callout',
    data: {
      type: 'important',
      title: '유의사항',
      text: '예측 데이터는 최근 6개월 거래 패턴과 계절성을 반영한 AI 예측값입니다.\n실제 자금흐름은 시장 상황에 따라 변동될 수 있습니다.',
    },
  },
  {
    type: 'bar-chart',
    data: {
      title: '월별 입출금 추이',
      datasets: [
        { name: '입금', data: [125000, 118000, 132000], color: '#2563EB' },
        { name: '출금', data: [98000, 102000, 115000], color: '#DC2626' },
      ],
      data: [
        { label: '4월', value: 125000 },
        { label: '5월', value: 118000 },
        { label: '6월', value: 132000 },
      ],
    },
  },
  {
    type: 'related-questions',
    data: {
      items: [
        '하반기 자금 흐름도 예측해주세요',
        '자금 부족이 예상되는 시기는 언제인가요?',
        '예측 정확도는 어느 정도인가요?',
      ],
    },
  },
];

// ─── S4: Anomaly (이상거래) ───
const anomalyBlocks: Block[] = [
  {
    type: 'data-table',
    data: {
      title: '이상거래 탐지 현황',
      caption: '최근 7일 기준',
      columns: [
        { key: 'date', label: '거래일', align: 'center' },
        { key: 'account', label: '계좌', align: 'left' },
        { key: 'amount', label: '금액', align: 'right' },
        { key: 'status', label: '상태', align: 'center', type: 'badge' },
        { key: 'score', label: '위험도', align: 'center', type: 'score' },
      ],
      rows: [
        { date: '2026.04.13', account: '기업운영 110-***-1234', amount: '5,000,000원', status: { text: '위험', color: '#DC2626' }, score: { value: 95 } },
        { date: '2026.04.12', account: '급여계좌 110-***-5678', amount: '12,300,000원', status: { text: '주의', color: '#CA8A04' }, score: { value: 82 } },
        { date: '2026.04.12', account: '투자계좌 110-***-9012', amount: '3,200,000원', status: { text: '주의', color: '#CA8A04' }, score: { value: 85 } },
        { date: '2026.04.11', account: '운영자금 110-***-3456', amount: '800,000원', status: { text: '정상', color: '#16A34A' }, score: { value: 45 } },
        { date: '2026.04.10', account: '기업운영 110-***-1234', amount: '2,150,000원', status: { text: '정상', color: '#16A34A' }, score: { value: 62 } },
      ],
    },
  },
  {
    type: 'related-questions',
    data: {
      items: [
        '위험 등급 거래의 상세 내역을 보여주세요',
        '지난 달 이상거래 통계를 알려주세요',
        '특정 계좌의 거래 이력을 조회해주세요',
      ],
    },
  },
];

// ─── S5: Consult (상담) ───
const consultBlocks: Block[] = [
  {
    type: 'text-content',
    data: { text: '법인 계좌 등록 방법을 안내드립니다.\n아래 절차를 순서대로 진행해 주세요.' },
  },
  {
    type: 'steps',
    data: {
      title: '법인 계좌 등록 절차',
      items: [
        { title: '사업자등록증 준비', description: '최근 3개월 이내 발급된 사업자등록증 사본을 준비합니다.' },
        { title: '온라인 신청서 작성', description: '기업뱅킹 > 계좌관리 > 신규계좌 등록 메뉴에서 신청서를 작성합니다.' },
        { title: '서류 업로드', description: '사업자등록증, 법인인감증명서, 대표자 신분증 사본을 업로드합니다.' },
        { title: '승인 대기', description: '영업일 기준 1~2일 내 심사가 완료됩니다. 승인 결과는 SMS로 안내됩니다.' },
      ],
    },
  },
  {
    type: 'source-box',
    data: {
      text: '참고 자료',
      links: [
        { name: '법인계좌 등록 매뉴얼', description: 'PDF 다운로드', url: '#' },
        { name: '필요 서류 체크리스트', description: '엑셀 다운로드', url: '#' },
      ],
      downloadable: true,
    },
  },
  {
    type: 'related-questions',
    data: {
      items: [
        '계좌 등록 후 바로 사용 가능한가요?',
        '해외 송금 계좌도 등록할 수 있나요?',
        '필요 서류가 누락되면 어떻게 되나요?',
      ],
    },
  },
];

// ─── S6: Report (보고서) ───
const reportBlocks: Block[] = [
  {
    type: 'approval-box',
    data: {
      lines: [
        { role: '작성자', name: '김대리' },
        { role: '검토', name: '박과장' },
        { role: '승인', name: '이부장' },
      ],
    },
  },
  {
    type: 'report-header',
    data: {
      category: '보고서',
      title: '2026년 1분기 자금현황 보고서',
      subtitle: '경영지원팀 작성',
      date: '2026.04.13',
      icon: '📋',
    },
  },
  {
    type: 'text-content',
    data: { text: '2026년 1분기 자금 운용 현황을 보고드립니다.\n전분기 대비 총 자산이 5.2% 증가했으며, 주요 지표는 아래와 같습니다.' },
  },
  {
    type: 'number-stat',
    data: {
      items: [
        { label: '총 자산', value: '152.3억', diff: '+5.2%', trend: 'up' },
        { label: '총 부채', value: '43.8억', diff: '-2.1%', trend: 'down' },
        { label: '순이익', value: '8.7억', diff: '+12.3%', trend: 'up' },
        { label: '영업이익률', value: '15.8%', diff: '+1.5%p', trend: 'up' },
      ],
    },
  },
  {
    type: 'data-table',
    data: {
      title: '분기별 실적 비교',
      columns: [
        { key: 'item', label: '항목', align: 'left' },
        { key: 'q4', label: 'Q4 2025', align: 'right' },
        { key: 'q1', label: 'Q1 2026', align: 'right' },
        { key: 'change', label: '증감', align: 'center' },
      ],
      rows: [
        { item: '매출', q4: '45.2억', q1: '48.7억', change: '+7.7%' },
        { item: '영업이익', q4: '6.8억', q1: '7.7억', change: '+13.2%' },
        { item: '순이익', q4: '5.1억', q1: '5.8억', change: '+13.7%' },
        { item: '자기자본이익률', q4: '12.3%', q1: '13.8%', change: '+1.5%p' },
      ],
    },
  },
  {
    type: 'bar-chart',
    data: {
      title: '분기별 매출 추이',
      data: [
        { label: 'Q2 2025', value: 4100 },
        { label: 'Q3 2025', value: 4350 },
        { label: 'Q4 2025', value: 4520 },
        { label: 'Q1 2026', value: 4870 },
      ],
    },
  },
  {
    type: 'alert-box',
    data: {
      level: 'info',
      title: '참고사항',
      message: '상기 데이터는 잠정 집계 기준이며, 최종 확정 수치는 4월 말 결산 후 업데이트됩니다.',
    },
  },
  {
    type: 'source-box',
    data: {
      text: '출처',
      links: [
        { name: 'ERP 재무관리 시스템', description: '2026.04.13 기준' },
        { name: '분기 결산 보고서', description: '경영기획팀' },
      ],
    },
  },
  {
    type: 'related-questions',
    data: {
      items: [
        '전년 동기 대비 상세 비교를 해주세요',
        '2분기 예상 실적을 알려주세요',
        '부서별 비용 분석을 해주세요',
      ],
    },
  },
];

// ─── S7: No Data (데이터 없음) ───
const noDataBlocks: Block[] = [
  {
    type: 'source-box',
    data: {
      text: '출처 정보',
      links: [
        { name: '지표', description: '입금금액, 출금금액, 거래후잔액' },
        { name: '조건', description: "거래일자 >= '20260401', 거래일자 <= '20260414', 계좌구분 = '예적금'" },
      ],
    },
  },
  {
    type: 'empty-state',
    data: {
      message: '조회 결과가 없습니다',
      description: '조회 조건을 변경하거나 아래 관련 질문을 눌러 다시 시도해보세요!',
    },
  },
  {
    type: 'sql-query',
    data: {
      query: `SELECT com_nm, card_co_nm, card_no, use_dt, use_tm, mrcnt_nm, appr_no, trsc_dv, curr_cd, dmst_
FROM (SELECT card.com_nm, card.card_co_nm, card.card_no, card.acqs_dt, card.use_tm, card.curr_
FROM (SELECT com_nm, card_co_nm, card_no, use_dt, use_tm, mrcnt_nm, appr_no, trsc_dv, curr_cd,
FROM branchq_get_all_card_trsc('WCNSTEST1'::varchar, 'WCNSTEST1'::varchar, ''::varchar, '20260
WHERE acqs_dt >= '20260101'
  AND acqs_dt <= '20260331'

GROUP BY com_nm, card_co_nm, card_no, use_dt, use_tm, mrcnt_nm, appr_no, trsc_dv, curr_cd, dms
ORDER BY com_nm ASC, card_co_nm ASC, card_no ASC, acqs_dt DESC NULLS LAST, use_tm DESC NULLS L`,
    },
  },
  {
    type: 'related-questions',
    data: {
      items: [
        '이번 달 수시입출금 거래내역을 알려줘',
        '예적금 계좌 현황을 조회해줘',
        '전체 계좌 잔액을 알려줘',
      ],
    },
  },
];

// ─── Scene Conversations ───
export type SceneKey = 'general' | 'analysis' | 'forecast' | 'anomaly' | 'consult' | 'report' | 'no-data';

interface SceneConversation {
  userQuery: string;
  aiText?: string;
  blocks: Block[];
  btnType: 'report' | 'report-save' | 'anomaly' | 'consult' | 'general' | 'no-data' | 'none';
}

export const SCENE_DATA: Record<SceneKey, SceneConversation> = {
  general: {
    userQuery: '이번 주 법인카드 사용 내역을 조회해줘',
    aiText: undefined,
    blocks: generalBlocks,
    btnType: 'general',
  },
  analysis: {
    userQuery: '4월 법인카드 분석 리포트를 작성해줘',
    aiText: '분석 리포트를 생성했습니다.',
    blocks: analysisBlocks,
    btnType: 'report',
  },
  forecast: {
    userQuery: '2분기 자금흐름 예상보고서를 만들어줘',
    aiText: '자금흐름 예측 보고서를 작성했습니다.',
    blocks: forecastBlocks,
    btnType: 'report',
  },
  anomaly: {
    userQuery: '최근 이상거래 현황을 알려줘',
    aiText: '최근 7일간 이상거래 탐지 현황입니다.',
    blocks: anomalyBlocks,
    btnType: 'anomaly',
  },
  consult: {
    userQuery: '법인 계좌 등록 방법을 알려줘',
    aiText: undefined,
    blocks: consultBlocks,
    btnType: 'consult',
  },
  report: {
    userQuery: '1분기 자금현황 보고서를 작성해줘',
    aiText: '보고서를 생성했습니다.',
    blocks: reportBlocks,
    btnType: 'report-save',
  },
  'no-data': {
    userQuery: '이번 달 예적금 거래내역 알려줘',
    aiText: '원하시는 조건으로 조회하였으나 데이터가 없는 것으로 확인되었습니다. 다른 조건으로 조회해보세요!',
    blocks: noDataBlocks,
    btnType: 'no-data',
  },
};

// ─── Build Messages from Scene ───
export function buildSceneMessages(sceneKey: SceneKey): Message[] {
  const scene = SCENE_DATA[sceneKey];
  return [
    {
      id: uid(),
      role: 'user',
      text: scene.userQuery,
    },
    {
      id: uid(),
      role: 'ai',
      text: scene.aiText,
      blocks: scene.blocks,
      btnType: scene.btnType,
    },
  ];
}

// ─── Keyword Matching ───
const KEYWORD_MAP: { keywords: string[]; scene: SceneKey }[] = [
  { keywords: ['이상', '거래', '탐지', '위험', '신고', '의심'], scene: 'anomaly' },
  { keywords: ['분석', '리포트', '패턴', '현황분석', '추이'], scene: 'analysis' },
  { keywords: ['예측', '자금흐름', '예상', '전망', '시뮬레이션'], scene: 'forecast' },
  { keywords: ['등록', '방법', '절차', '상담', '안내', '가이드', '매뉴얼'], scene: 'consult' },
  { keywords: ['보고서', '작성', '분기', '결산', '승인', '결재'], scene: 'report' },
  { keywords: ['예적금', '정기예금', '적금', '정기적금'], scene: 'no-data' },
  { keywords: ['조회', '카드', '사용', '내역', '잔액', '계좌', '거래내역'], scene: 'general' },
];

export function matchSceneByKeyword(text: string): SceneKey {
  const normalized = text.toLowerCase();
  let bestMatch: SceneKey = 'general';
  let bestScore = 0;

  for (const entry of KEYWORD_MAP) {
    const score = entry.keywords.filter((kw) => normalized.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry.scene;
    }
  }
  return bestMatch;
}

// ─── Build AI Response (for sendMessage) ───
export function buildAIResponse(sceneKey: SceneKey): Message {
  const scene = SCENE_DATA[sceneKey];
  return {
    id: `ai_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    role: 'ai',
    text: scene.aiText,
    blocks: scene.blocks,
    btnType: scene.btnType,
  };
}

// ─── Welcome Screen Recommended Questions (all) ───
export const RECOMMENDED_QUESTIONS = [
  { text: '이번 주 법인카드 사용 내역을 조회해줘', category: 'general' as const },
  { text: '4월 법인카드 분석 리포트를 만들어줘', category: 'analysis' as const },
  { text: '최근 이상거래 현황을 알려줘', category: 'anomaly' as const },
  { text: '법인 계좌 등록 방법을 알려줘', category: 'consult' as const },
];

// ─── Category-specific Recommended Questions ───
export const CATEGORY_QUESTIONS: Record<SceneKey, string[]> = {
  general: [
    '이번 주 법인카드 사용 내역을 조회해줘',
    '이번 달 계좌 잔액 현황을 알려줘',
    '최근 거래내역을 보여줘',
  ],
  analysis: [
    '4월 법인카드 분석 리포트를 작성해줘',
    '부서별 지출 현황을 분석해줘',
    '월별 사용 추이를 보여줘',
  ],
  forecast: [
    '2분기 자금흐름 예상보고서를 만들어줘',
    '다음 달 예상 지출을 알려줘',
    '하반기 자금 전망을 분석해줘',
  ],
  anomaly: [
    '최근 이상거래 현황을 알려줘',
    '위험 등급 거래를 조회해줘',
    '의심 거래 패턴을 분석해줘',
  ],
  consult: [
    '법인 계좌 등록 방법을 알려줘',
    '해외 송금 절차를 안내해줘',
    '카드 한도 변경 방법을 알려줘',
  ],
  report: [
    '1분기 자금현황 보고서를 작성해줘',
    '월간 결산 보고서를 만들어줘',
    '부서별 비용 보고서를 생성해줘',
  ],
  'no-data': [
    '이번 달 예적금 거래내역 알려줘',
    '정기예금 만기 현황을 조회해줘',
    '적금 입금 내역을 보여줘',
  ],
};
