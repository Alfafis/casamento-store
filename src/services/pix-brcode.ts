// Gera Pix Copia-e-Cola (EMV) com valor e CRC16.
// Referência: BR Code (EMV) + Pix (br.gov.bcb.pix)
function pad2(n: number) {
  return n.toString().padStart(2, '0');
}
function tlv(id: string, value: string) {
  const len = value.length.toString().padStart(2, '0');
  return id + len + value;
}

// CRC16-IBM (polynomial 0x1021) sobre toda a string até "6304"
function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export type PixParams = {
  chave: string; // sua chave Pix Nubank
  nome: string; // recebedor (máx. 25)
  cidade: string; // sem acentos (máx. 15 recomendado)
  valor?: number; // ex.: 129.90
  txid?: string; // até 25 chars
  descricao?: string; // opcional (curta)
};

export function gerarPixCopiaECola({
  chave,
  nome,
  cidade,
  valor,
  txid = 'NU' + Date.now().toString().slice(-8),
  descricao,
}: PixParams) {
  // GUI do Bacen
  const gui = tlv('00', 'br.gov.bcb.pix');
  // Chave Pix
  const k = tlv('01', chave);
  // Descrição (opcional)
  const desc = descricao ? tlv('02', descricao) : '';
  // Merchant Account Information (ID 26)
  const mai = tlv('26', gui + k + desc);

  // Merchant Category Code (52) = 0000; Currency (53)=986; Country (58)=BR
  const mcc = tlv('52', '0000');
  const cur = tlv('53', '986');
  const ct = tlv('58', 'BR');

  // Nome (59) máx. 25; Cidade (60) recomend. 15
  const nomeLimpo = nome
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .slice(0, 25);
  const cidadeLimpa = cidade
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .slice(0, 15);
  const nm = tlv('59', nomeLimpo || 'RECEBEDOR');
  const cd = tlv('60', cidadeLimpa || 'SAO PAULO');

  // Valor (54) opcional; formate com 2 casas
  const val = valor !== undefined ? tlv('54', valor.toFixed(2)) : '';

  // TXID (ID 05 dentro do campo 62 - Additional Data Field Template)
  const tx = tlv('05', txid.slice(0, 25));
  const adf = tlv('62', tx);

  // Payload Format Indicator (00)=01; Point of Initiation Method (01):
  //   - "12" = dinâmico (valor específico por transação)
  //   - "11" = estático
  const pfi = tlv('00', '01');
  const pim = tlv('01', valor !== undefined ? '12' : '11');

  // Monta sem CRC (63) primeiro
  const semCRC =
    pfi + pim + mai + mcc + cur + val + ct + nm + cd + adf + '6304';
  const crc = crc16(semCRC);

  return semCRC + crc; // <- isto é o Copia-e-Cola
}
