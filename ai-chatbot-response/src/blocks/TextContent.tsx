import type { TextContentData } from '../types';

export default function TextContent({ text }: TextContentData) {
  return (
    <p className="text-[16px] text-brq-gray-700 leading-[1.7] whitespace-pre-line">
      {text}
    </p>
  );
}
