import type { KeyValueData } from '../types';

export default function KeyValue({ items }: KeyValueData) {
  return (
    <div className="bg-brq-white border border-brq-border rounded-lg p-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex py-3 border-b border-brq-gray-100 last:border-b-0"
        >
          <span className="w-[140px] shrink-0 text-[14px] text-brq-gray-500">{item.key}</span>
          <span className="text-[14px] text-brq-gray-900 flex-1">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
