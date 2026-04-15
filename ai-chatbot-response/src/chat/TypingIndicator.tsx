export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-brq-white border border-brq-border rounded-[4px_16px_16px_16px] px-4 py-3 flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-brq-gray-400"
            style={{
              animation: 'brq-typing-dot 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
