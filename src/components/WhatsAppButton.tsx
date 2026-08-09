interface Props {
  phoneDigits: string; // international format, digits only, e.g. 221771234567
  message?: string;
  floating?: boolean;
}

export default function WhatsAppButton({ phoneDigits, message, floating = true }: Props) {
  if (!phoneDigits) return null;
  const href = `https://wa.me/${phoneDigits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  if (!floating) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="btn-primary">
        WhatsApp
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-espresso dark:bg-caramel text-cream dark:text-ink shadow-soft flex items-center justify-center hover:scale-105 transition-transform duration-300 ease-silk"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Zm0 18a7.96 7.96 0 0 1-4.06-1.11l-.29-.17-3 .79.8-2.93-.19-.3A7.96 7.96 0 1 1 12 20Zm4.4-5.6c-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.4-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z" />
      </svg>
    </a>
  );
}
