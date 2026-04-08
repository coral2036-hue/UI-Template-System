import StatsRow from './StatsRow';
import BarChart from './BarChart';
import AccountTable from './AccountTable';
import WarningBox from './WarningBox';

export default function DepositSection() {
  return (
    <div className="border border-border-light rounded-lg p-4 flex flex-col gap-3 w-full">
      <span className="text-sm font-semibold text-text-primary">예적금 현황</span>
      <StatsRow />
      <BarChart />
      <AccountTable />
      <WarningBox />
    </div>
  );
}
