import type { Model } from '../types';
import { DEFAULT_MODELS } from '../constants/models';
import ModalOverlay from './ModalOverlay';
import { useState } from 'react';

interface Props {
  currentModel: Model;
  onSelect: (model: Model) => void;
  onClose: () => void;
}

export default function ModelSelectModal({ currentModel, onSelect, onClose }: Props) {
  const [selected, setSelected] = useState(currentModel.id);

  return (
    <ModalOverlay title="AI 모델 선택" onClose={onClose}>
      <div className="flex flex-col gap-2 mb-6">
        {DEFAULT_MODELS.map((m) => (
          <label
            key={m.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all
              ${selected === m.id ? 'border-brq-accent bg-brq-accent-light' : 'border-brq-border hover:bg-brq-gray-50'}`}
          >
            <input
              type="radio"
              name="model"
              value={m.id}
              checked={selected === m.id}
              onChange={() => setSelected(m.id)}
              className="accent-brq-accent"
            />
            <span className="text-[14px] text-brq-gray-900 flex-1">{m.name}</span>
            <span className="text-[12px] text-brq-gray-400">{m.provider}</span>
            {m.id === DEFAULT_MODELS[0].id && (
              <span className="text-[11px] text-brq-accent bg-brq-accent-light px-2 py-0.5 rounded font-bold">추천</span>
            )}
          </label>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="h-9 px-4 rounded-[20px] text-[13px] text-brq-gray-600 bg-brq-gray-100 hover:bg-brq-gray-200 transition-colors">
          취소
        </button>
        <button
          onClick={() => {
            const model = DEFAULT_MODELS.find((m) => m.id === selected);
            if (model) onSelect(model);
            onClose();
          }}
          className="h-9 px-4 rounded-[20px] text-[13px] text-white bg-brq-accent hover:bg-brq-accent-dark transition-colors"
        >
          적용
        </button>
      </div>
    </ModalOverlay>
  );
}
