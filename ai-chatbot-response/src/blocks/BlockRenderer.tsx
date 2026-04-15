import type { Block } from '../types';
import TextContent from './TextContent';
import ReportHeader from './ReportHeader';
import NumberStat from './NumberStat';
import SummaryCards from './SummaryCards';
import DataTable from './DataTable';
import BarChart from './BarChart';
import LineChart from './LineChart';
import AlertBox from './AlertBox';
import Callout from './Callout';
import PatternAnalysis from './PatternAnalysis';
import Steps from './Steps';
import KeyValue from './KeyValue';
import ApprovalBox from './ApprovalBox';
import SourceBox from './SourceBox';
import RelatedQuestions from './RelatedQuestions';
import DateRange from './DateRange';
import EmptyState from './EmptyState';
import SqlQuery from './SqlQuery';

interface BlockRendererProps {
  block: Block;
  onQuestionClick?: (q: string) => void;
}

export default function BlockRenderer({ block, onQuestionClick }: BlockRendererProps) {
  switch (block.type) {
    case 'text-content':
      return <TextContent {...block.data} />;
    case 'report-header':
      return <ReportHeader {...block.data} />;
    case 'number-stat':
      return <NumberStat {...block.data} />;
    case 'summary-cards':
      return <SummaryCards {...block.data} />;
    case 'data-table':
      return <DataTable {...block.data} />;
    case 'bar-chart':
      return <BarChart {...block.data} />;
    case 'line-chart':
      return <LineChart {...block.data} />;
    case 'alert-box':
      return <AlertBox {...block.data} />;
    case 'callout':
      return <Callout {...block.data} />;
    case 'pattern-analysis':
      return <PatternAnalysis {...block.data} />;
    case 'steps':
      return <Steps {...block.data} />;
    case 'key-value':
      return <KeyValue {...block.data} />;
    case 'approval-box':
      return <ApprovalBox {...block.data} />;
    case 'source-box':
      return <SourceBox {...block.data} />;
    case 'related-questions':
      return <RelatedQuestions {...block.data} onQuestionClick={onQuestionClick} />;
    case 'date-range':
      return <DateRange {...block.data} />;
    case 'empty-state':
      return <EmptyState {...block.data} />;
    case 'sql-query':
      return <SqlQuery {...block.data} />;
    default: {
      console.warn('Unknown block type:', (block as { type: string }).type);
      return null;
    }
  }
}
