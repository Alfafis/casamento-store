// Gera Pix estático (PIM=11) “à prova de banco”
const enc = new TextEncoder()
const byteLen = (s: string) => enc.encode(s).length

function tlv(id: string, value: string) {
  const len = byteLen(value)
  if (len > 99) throw new Error(`Valor do TLV ${id} excede 99 bytes`)
  return id + String(len).padStart(2, '0') + value
}

function removeAcentos(s: string) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function crc16(payload: string) {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function normalizarChave(chave: string) {
  let k = chave.trim()
  if (/^\+?\d[\d\s().-]+$/.test(k)) {
    // telefone
    const d = k.replace(/\D/g, '')
    if (d.startsWith('55')) return `+${d}`
    if (d.length >= 10 && d.length <= 11) return `+55${d}`
    return `+${d}`
  }
  if (/^\d{11}$/.test(k) || /^\d{14}$/.test(k)) return k // cpf/cnpj
  if (/^[^@\s]+@[^@\s]+$/.test(k)) return k.toLowerCase() // e-mail
  return k // aleatória etc.
}

export type PixParams = {
  chave: string
  nome: string
  cidade: string
  valor?: number
  descricao?: string
  txid?: string // default ***
}

export function gerarPixCopiaEColaEstatico({
  chave,
  nome,
  cidade,
  valor,
  descricao,
  txid = '***'
}: PixParams) {
  // ----- 26 (MAI): calc “budget” ≤ 99 bytes -----
  const gui = tlv('00', 'br.gov.bcb.pix') // 18 bytes
  const k = tlv('01', normalizarChave(chave)) // 4 + |chave|
  const base26 = gui + k
  // espaço restante para "02" = 99 - bytes(base26) - 4 (overhead do 02)
  const remaining = 99 - byteLen(base26) - 4
  const descVal = descricao
    ? removeAcentos(descricao).slice(0, Math.max(0, remaining))
    : ''
  const desc = descVal ? tlv('02', descVal) : ''
  const mai = tlv('26', base26 + desc) // garante ≤ 99

  // Demais campos
  const pfi = tlv('00', '01')
  const pim = tlv('01', '11')
  const mcc = tlv('52', '0000')
  const cur = tlv('53', '986')
  const amt =
    typeof valor === 'number' && valor > 0 ? tlv('54', valor.toFixed(2)) : ''
  const ctry = tlv('58', 'BR')
  const nm = tlv('59', (removeAcentos(nome).trim() || 'Recebedor').slice(0, 25))
  const ct = tlv(
    '60',
    (removeAcentos(cidade).trim() || 'Sao Paulo').slice(0, 15)
  )
  const adf = tlv('62', tlv('05', txid.trim() || '***')) // TXID

  // CRC
  const semCRC =
    pfi + pim + mai + mcc + cur + amt + ctry + nm + ct + adf + '6304'
  const crc = crc16(semCRC)
  return semCRC + crc
}
