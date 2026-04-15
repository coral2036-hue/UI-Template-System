import type { SourceBoxData } from '../types';
import { Download, ExternalLink } from 'lucide-react';

export default function SourceBox({ text, links, downloadable }: SourceBoxData) {
  return (
    <div className="bg-brq-gray-50 border border-brq-border rounded-md px-4 py-3">
      {text && <p className="text-[14px] font-semibold text-brq-gray-900 mb-2">{text}</p>}
      <ul className="space-y-1.5">
        {links.map((link, i) => (
          <li key={i} className="flex items-center gap-2 text-[13px]">
            {downloadable ? (
              <Download size={14} className="text-brq-accent shrink-0" />
            ) : (
              <ExternalLink size={14} className="text-brq-accent shrink-0" />
            )}
            <span className="text-brq-accent hover:underline cursor-pointer">{link.name}</span>
            {link.description && (
              <span className="text-brq-gray-400">— {link.description}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
