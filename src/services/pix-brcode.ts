// src/libs/pix-brcode.ts
// Gera Pix Copia-e-Cola (EMV) ESTÁTICO (PIM=11), com valor opcional, e CRC16-IBM.
// Compatível com Nubank / apps que validam estrito.

function tlv(id: string, value: string) {
  const len = value.length.toString().padStart(2, '0');
  return id + len + value;
}

function removeAcentos(s: string) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

// CRC16/IBM (poly 0x1021), ASCII sobre toda a string até "6304"
function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export type PixParams = {
  chave: string; // sua chave Pix (e-mail, telefone, aleatória, CPF/CNPJ)
  nome: string; // recebedor (<= 25 chars no payload)
  cidade: string; // <= 15 chars, sem acentos no payload
  valor?: number; // ex.: 129.90 (ponto decimal)
  descricao?: string; // ignorada no estático por compat, pode-se embutir em "26-02" se quiser
};

/**
 * Gera payload EMV Pix estático (PIM=11). Inclui valor (54) se fornecido.
 * Usa TXID "***" (estático mais compatível).
 */
export function gerarPixCopiaEColaEstatico({
  chave,
  nome,
  cidade,
  valor,
}: PixParams) {
  // Campos do Merchant Account Information (ID 26)
  const gui = tlv('00', 'br.gov.bcb.pix');
  const k = tlv('01', chave.trim());

  // Se quiser descrição, adicione "02": tlv("02", "texto-curto")
  const mai = tlv('26', gui + k);

  const pfi = tlv('00', '01'); // Payload Format Indicator
  const pim = tlv('01', '11'); // Point of Initiation Method: 11 = estático

  const mcc = tlv('52', '0000'); // Merchant Category Code (genérico)
  const cur = tlv('53', '986'); // BRL
  const amt =
    typeof valor === 'number'
      ? tlv('54', valor.toFixed(2)) // sempre . (ponto) e 2 casas
      : '';

  const ctry = tlv('58', 'BR'); // País

  // Nome/Cidade sem acento e tamanhos seguros
  const nm = tlv('59', removeAcentos(nome).slice(0, 25) || 'RECEBEDOR');
  const ct = tlv('60', removeAcentos(cidade).slice(0, 15) || 'SAO PAULO');

  // Additional Data Field Template (62) com TXID "***" (estático)
  const tx = tlv('05', '***');
  const adf = tlv('62', tx);

  // Monta sem CRC (63) primeiro
  const semCRC =
    pfi + pim + mai + mcc + cur + amt + ctry + nm + ct + adf + '6304';
  const crc = crc16(semCRC);
  return semCRC + crc; // <- Copia e Cola
}
