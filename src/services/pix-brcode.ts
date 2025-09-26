// src/libs/pix-brcode.ts
// Gera Pix Copia-e-Cola (EMV) ESTÁTICO (PIM=11), com valor opcional, e CRC16-IBM.
// Compatível com Nubank / apps que validam estrito.

function tlv(id: string, value: string) {
  const len = value.length.toString().padStart(2, '0')
  return id + len + value
}

function removeAcentos(s: string) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

// CRC16/IBM (poly 0x1021), ASCII sobre toda a string até "6304"
function crc16(payload: string) {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021
      else crc <<= 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export type PixParams = {
  chave: string // sua chave Pix (e-mail, telefone, aleatória, CPF/CNPJ)
  nome: string // recebedor (<= 25 chars no payload)
  cidade: string // <= 15 chars, sem acentos no payload
  valor?: number // ex.: 129.90 (ponto decimal)
  descricao?: string // descrição opcional (<= 50 chars)
}

/**
 * Gera payload EMV Pix estático (PIM=11). Inclui valor (54) se fornecido.
 * Usa TXID "***" (estático mais compatível).
 */
export function gerarPixCopiaEColaEstatico({
  chave,
  nome,
  cidade,
  valor,
  descricao
}: PixParams) {
  // Campos do Merchant Account Information (ID 26)
  const gui = tlv('00', 'br.gov.bcb.pix')
  const k = tlv('01', chave.trim())
  const desc = descricao ? tlv('02', removeAcentos(descricao).slice(0, 50)) : ''
  const mai = tlv('26', gui + k + desc)

  const pfi = tlv('00', '01') // Payload Format Indicator
  const pim = tlv('01', '11') // Point of Initiation Method: 11 = estático

  const mcc = tlv('52', '8398') // Merchant Category Code (Organizações de Caridade)
  const cur = tlv('53', '986') // BRL
  const amt =
    typeof valor === 'number' && valor > 0
      ? tlv('54', valor.toFixed(2)) // sempre . (ponto) e 2 casas
      : ''

  const ctry = tlv('58', 'BR') // País

  // Nome/Cidade sem acento e tamanhos seguros (mínimo 2 chars para evitar rejeição)
  const nomeLimpo = removeAcentos(nome).trim()
  const cidadeLimpa = removeAcentos(cidade).trim()

  const nm = tlv(
    '59',
    nomeLimpo.length >= 2 ? nomeLimpo.slice(0, 25) : 'Presente Casamento'
  )
  const ct = tlv(
    '60',
    cidadeLimpa.length >= 2 ? cidadeLimpa.slice(0, 15) : 'Sao Paulo'
  )

  // Additional Data Field Template (62) com TXID vazio (mais compatível)
  const adf = tlv('62', '')

  // Monta sem CRC (63) primeiro
  const semCRC =
    pfi + pim + mai + mcc + cur + amt + ctry + nm + ct + adf + '6304'
  const crc = crc16(semCRC)
  return semCRC + crc // <- Copia e Cola
}
