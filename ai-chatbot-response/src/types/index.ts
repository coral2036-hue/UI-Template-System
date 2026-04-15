// ─── Category & Model ───
export type Category = 'general' | 'analysis' | 'forecast' | 'anomaly' | 'consult';

export interface Model {
  id: string;
  name: string;
  provider: string;
}

// ─── Modal ───
export type ModalType =
  | 'model-select'
  | 'api-setting'
  | 'share'
  | 'kakao-preview'
  | 'email'
  | 'confirm'
  | 'financial-todo'
  | 'question-answer';

// ─── Toast ───
export interface ToastState {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

// ─── Messages ───
export interface UserMessage {
  id: string;
  role: 'user';
  text: string;
  attachments?: { name: string; type: string; url: string }[];
}

export interface AIMessage {
  id: string;
  role: 'ai';
  text?: string;
  blocks: Block[];
  btnType: 'report' | 'report-save' | 'anomaly' | 'consult' | 'general' | 'no-data' | 'none';
}

export type Message = UserMessage | AIMessage;

// ─── Block Types ───
export type BlockType =
  | 'text-content'
  | 'report-header'
  | 'number-stat'
  | 'summary-cards'
  | 'data-table'
  | 'bar-chart'
  | 'line-chart'
  | 'alert-box'
  | 'callout'
  | 'pattern-analysis'
  | 'steps'
  | 'key-value'
  | 'approval-box'
  | 'source-box'
  | 'related-questions'
  | 'date-range'
  | 'empty-state'
  | 'sql-query';

// ─── Block Data Interfaces ───
export interface TextContentData {
  text: string;
}

export interface ReportHeaderData {
  category: string;
  title: string;
  subtitle?: string;
  date: string;
  icon?: string;
}

export interface NumberStatItem {
  label: string;
  value: string | number;
  diff?: string;
  trend?: 'up' | 'down';
  color?: string;
}

export interface NumberStatData {
  items: NumberStatItem[];
}

export interface SummaryCardItem {
  label: string;
  value: string;
  sub?: string;
}

export interface SummaryCardsData {
  cards: SummaryCardItem[];
}

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  type?: 'badge' | 'score' | 'text';
}

export interface BadgeValue {
  text: string;
  color: string;
}

export interface ScoreValue {
  value: number;
  max?: number;
}

export interface DataTableData {
  title?: string;
  caption?: string;
  captionBadge?: string;
  columns: TableColumn[];
  rows: Record<string, string | number | BadgeValue | ScoreValue>[];
  maxRows?: number;
}

export interface BarChartDataPoint {
  label: string;
  value: number;
}

export interface BarChartData {
  title?: string;
  data: BarChartDataPoint[];
  color?: string;
  datasets?: { name: string; data: number[]; color?: string }[];
}

export interface LineChartSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface LineChartData {
  title?: string;
  series: LineChartSeries[];
  labels: string[];
}

export interface AlertBoxData {
  level: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
}

export interface CalloutData {
  type: 'tip' | 'note' | 'important' | 'danger';
  title?: string;
  text: string;
}

export interface PatternItem {
  level: 'critical' | 'warning' | 'normal';
  title: string;
  description: string;
}

export interface PatternAnalysisData {
  title?: string;
  items: PatternItem[];
}

export interface StepItem {
  title: string;
  description: string;
}

export interface StepsData {
  title?: string;
  items: StepItem[];
}

export interface KeyValueItem {
  key: string;
  value: string;
}

export interface KeyValueData {
  items: KeyValueItem[];
}

export interface ApprovalLine {
  role: string;
  name: string;
}

export interface ApprovalBoxData {
  lines: ApprovalLine[];
}

export interface SourceLink {
  name: string;
  description?: string;
  url?: string;
}

export interface SourceBoxData {
  text?: string;
  links: SourceLink[];
  downloadable?: boolean;
}

export interface RelatedQuestionsData {
  items: string[];
}

export interface DateRangeData {
  description?: string;
  note?: string;
  startDate: string;
  endDate: string;
  editable?: boolean;
  reQueryLabel?: string;
}

export interface EmptyStateData {
  message: string;
  description?: string;
}

export interface SqlQueryData {
  label?: string;
  query: string;
}

// ─── Block Union ───
export type Block =
  | { type: 'text-content'; data: TextContentData }
  | { type: 'report-header'; data: ReportHeaderData }
  | { type: 'number-stat'; data: NumberStatData }
  | { type: 'summary-cards'; data: SummaryCardsData }
  | { type: 'data-table'; data: DataTableData }
  | { type: 'bar-chart'; data: BarChartData }
  | { type: 'line-chart'; data: LineChartData }
  | { type: 'alert-box'; data: AlertBoxData }
  | { type: 'callout'; data: CalloutData }
  | { type: 'pattern-analysis'; data: PatternAnalysisData }
  | { type: 'steps'; data: StepsData }
  | { type: 'key-value'; data: KeyValueData }
  | { type: 'approval-box'; data: ApprovalBoxData }
  | { type: 'source-box'; data: SourceBoxData }
  | { type: 'related-questions'; data: RelatedQuestionsData }
  | { type: 'date-range'; data: DateRangeData }
  | { type: 'empty-state'; data: EmptyStateData }
  | { type: 'sql-query'; data: SqlQueryData };

// ─── Financial Todo ───
export type FinancialTodoType = 'task' | 'question';

export interface FinancialTodoSchedule {
  hasReminder: boolean;
  reminderTime?: string; // "HH:mm"
  repeat: 'once' | 'daily' | 'weekly' | 'monthly';
  repeatEndDate?: string; // "YYYY-MM-DD"
  notificationId?: string;
}

export interface ExecutionLog {
  timestamp: string; // ISO timestamp
  status: 'pending' | 'generating' | 'completed' | 'error';
  message?: string;
  duration?: number; // milliseconds
}

export interface QuestionAnswer {
  answer: string;
  generatedAt: string; // ISO timestamp
  aiModel: string; // 'structured' | 'claude' | 'openai' | 'gemini'
  executionLog: ExecutionLog[];
}

export interface FinancialTodo {
  id: string;
  type: FinancialTodoType; // 'task' | 'question'
  title?: string; // required for 'task' type
  question?: string; // required for 'question' type
  category: string;
  dueDate: string; // "YYYY-MM-DD"
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  schedule?: FinancialTodoSchedule;
  description?: string;

  // Question-specific fields
  autoGenerate?: boolean;
  answer?: QuestionAnswer;

  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// ─── App State ───
export type SubPanelType = 'recent' | 'report' | 'settings' | 'financial-todo';
export type PageView = 'chat' | 'financial-todo';
export type ViewMode = 'calendar' | 'list' | 'timeline';

export interface AppState {
  selectedCategory: Category;
  selectedModel: Model;
  subPanelOpen: SubPanelType | null;
  modal: ModalType | null;
  messages: Message[];
  loading: boolean;
  toast: ToastState | null;
}
