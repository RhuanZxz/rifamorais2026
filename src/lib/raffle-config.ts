export const RAFFLE_TOTAL = 1500;
export const RAFFLE_PRICE = 5;
export const RAFFLE_TITLE = "Rifa Professor Morais";
export const WHATSAPP_NUMBER = "5531993253768";
export const PIX_KEY = "+55 31 99325-3768";
export const PIX_NAME = "Letícia Caroline";

export function parseNumberInput(input: string, max = RAFFLE_TOTAL): number[] {
  const out = new Set<number>();
  for (const raw of input.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (raw.includes("-")) {
      const [a, b] = raw.split("-").map((n) => parseInt(n.trim(), 10));
      if (Number.isInteger(a) && Number.isInteger(b)) {
        const lo = Math.max(1, Math.min(a, b));
        const hi = Math.min(max, Math.max(a, b));
        for (let i = lo; i <= hi; i++) out.add(i);
      }
    } else {
      const n = parseInt(raw, 10);
      if (Number.isInteger(n) && n >= 1 && n <= max) out.add(n);
    }
  }
  return [...out].sort((a, b) => a - b);
}

export function formatNumber(n: number): string {
  return n.toString().padStart(4, "0");
}

export function buildWhatsAppLink(nome: string, telefone: string, numeros: number[]): string {
  const total = numeros.length * RAFFLE_PRICE;
  const msg = [
    `Olá! Quero reservar números na ${RAFFLE_TITLE}.`,
    ``,
    `Nome: ${nome}`,
    `Telefone: ${telefone}`,
    `Números (${numeros.length}): ${numeros.map(formatNumber).join(", ")}`,
    `Total: R$ ${total},00`,
    ``,
    `Já realizei o Pix e estou enviando o comprovante em seguida. 💚`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
