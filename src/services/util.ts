import { type ClassValue, clsx } from 'clsx';
import QRCode from 'qrcode';
import { twMerge } from 'tailwind-merge';

/**
 * Une classes condicionalmente (clsx) e resolve conflitos do Tailwind (twMerge).
 * Ex.: cn("p-2 p-4", cond && "bg-red-500") -> "p-4 bg-red-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

export async function toQRDataURL(payload: string) {
  return await QRCode.toDataURL(payload, { margin: 1, scale: 6 });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  } else {
    // Fallback para navegadores antigos ou contexto inseguro
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Evita rolagem no mobile
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  }
}
