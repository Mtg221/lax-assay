interface Props {
  name: string;
  hex: string;
  selected: boolean;
  available: boolean;
  onSelect: () => void;
}

export default function ColorSwatch({ name, hex, selected, available, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={available ? onSelect : undefined}
      disabled={!available}
      title={available ? name : `${name} — rupture de stock`}
      className={`group flex items-center gap-2 px-1 py-1 rounded-full transition-all duration-200 ${
        available ? "cursor-pointer" : "cursor-not-allowed opacity-40"
      }`}
    >
      <span
        className={`relative w-8 h-8 rounded-full border transition-all duration-200 ${
          selected ? "ring-2 ring-offset-2 ring-caramel dark:ring-offset-ink" : "ring-0 border-line dark:border-espresso"
        }`}
        style={{ backgroundColor: hex }}
      >
        {!available && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-[140%] h-px bg-espresso/70 dark:bg-cream/70 rotate-45" />
          </span>
        )}
      </span>
      <span className="text-xs uppercase tracking-wide">{name}</span>
    </button>
  );
}
