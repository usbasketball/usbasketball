interface PlaceholderContentProps {
  description?: string;
}

export default function PlaceholderContent({ description }: PlaceholderContentProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-us-gray-light flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-us-gold">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-us-white/80 mb-2">Pagina in aanbouw</h2>
      {description && (
        <p className="text-us-white/50 text-sm max-w-sm">{description}</p>
      )}
    </div>
  );
}
