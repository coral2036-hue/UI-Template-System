const questions = [
  '만기도래한 예적금 계좌를 해지하고 싶은데 어떻게 처리해야 하나요?',
  '예적금 대신 다른 상품으로 자금을 운용할 수 있는 방법은?',
  '현재 보유 중인 모든 금융상품의 만기 현황을 한눈에 보고 싶어',
];

export default function RelatedQuestions() {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      <span className="text-xs font-semibold text-text-secondary">관련 질문</span>
      <div className="flex flex-col gap-2">
        {questions.map((q, i) => (
          <button
            key={i}
            className="w-full border border-border-light rounded-xl px-4 py-2.5 text-[12px] text-text-primary text-left hover:bg-bg-surface transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
