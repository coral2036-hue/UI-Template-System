const rows = [
  { name: '거주자외화정기예금', balance: '6억', openDate: '2016-11-15', maturityDate: '2026-01-15', status: '만기도래' },
  { name: '상호부금(IBK신금맞춤적금)', balance: '8.5억', openDate: '2019-09-01', maturityDate: '2026-02-01', status: '만기도래' },
  { name: '추거래기업부금(자유적립식)', balance: '9.75억', openDate: '2019-05-16', maturityDate: '2026-03-10', status: '만기도래' },
  { name: '추거래기업부금(장기적립식)', balance: '9.25억', openDate: '2023-05-11', maturityDate: '2027-11-11', status: '정상' },
  { name: 'IBK적립식출금제(기업)', balance: '9.75억', openDate: '2024-05-16', maturityDate: '2027-05-16', status: '정상' },
];

export default function AccountTable() {
  return (
    <div className="flex flex-col w-full gap-2">
      <span className="text-[13px] font-semibold text-text-primary">예적금 계좌 상세</span>

      {/* Mobile Card List */}
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="border border-border-light rounded-lg px-3.5 py-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-text-primary flex-1 mr-2">{row.name}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                row.status === '만기도래'
                  ? 'bg-red-50 text-red-accent'
                  : 'bg-blue-50 text-primary-blue'
              }`}>
                {row.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-text-secondary">
              <span>잔액 <strong className="text-text-primary">{row.balance}</strong></span>
              <span>개설 {row.openDate}</span>
            </div>
            <div className="text-[11px] text-text-secondary">
              만기 <strong className={row.status === '만기도래' ? 'text-red-accent' : 'text-text-primary'}>{row.maturityDate}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
