import { ArrowLeft, X } from 'lucide-react';
import ChatBubble from './components/ChatBubble';
import SummaryText from './components/SummaryText';
import SourceBox from './components/SourceBox';
import DepositSection from './components/DepositSection';
import DateRangeSection from './components/DateRangeSection';
import RelatedQuestions from './components/RelatedQuestions';

function App() {
  return (
    <div className="flex flex-col min-h-screen min-h-dvh bg-white">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b border-border-light">
        <button className="p-1">
          <ArrowLeft size={20} className="text-text-primary" />
        </button>
        <span className="text-[15px] font-semibold text-text-primary">AI 아나보 상세</span>
        <button className="p-1">
          <X size={20} className="text-text-primary" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
        <ChatBubble />
        <SummaryText />
        <SourceBox />
        <DepositSection />
        <DateRangeSection />
        <RelatedQuestions />
      </div>
    </div>
  );
}

export default App;
