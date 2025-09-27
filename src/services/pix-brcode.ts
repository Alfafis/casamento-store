function tlv(id: string, value: string) {
  const len = value.length.toString().padStart(2, '0')
  return id + len + value
}

function removeAcentos(s: string) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

// Normaliza chave (básico) — ajuste conforme seu caso
function normalizarChave(chave: string) {
  let k = chave.trim()
  // telefone: tira tudo que não dígito e prefixa + se tiver DDI
  if (/^\+?\d[\d\s().-]+$/.test(k)) {
    const digits = k.replace(/\D/g, '')
    // assume Brasil se vier com 13 dígitos (55 + 11 dígitos) ou já vier com 12/13…
    if (digits.startsWith('55')) return `+${digits}`
    // se parecer número BR sem DDI (10-11 dígitos), prefixe 55
    if (digits.length >= 10 && digits.length <= 11) return `+55${digits}`
    return `+${digits}`
  }
  // cpf/cnpj: só dígitos
  if (/^\d{11}$/.test(k) || /^\d{14}$/.test(k)) return k
  // e-mail: lowercase
  if (/^[^@]+@[^@]+$/.test(k)) return k.toLowerCase()
  // chave aleatória (UUID): mantém
  return k
}

// CRC16 CCITT-FALSE
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

export type PixParams = {
  chave: string
  nome: string
  cidade: string
  valor?: number
  descricao?: string
}

/** Pix estático (PIM=11), com TXID = "***" para máxima compatibilidade */
export function gerarPixCopiaEColaEstatico({
  chave,
  nome,
  cidade,
  valor,
  descricao
}: PixParams) {
  // Merchant Account Information (26)
  const gui = tlv('00', 'br.gov.bcb.pix')
  const k = tlv('01', normalizarChave(chave))
  const desc = descricao ? tlv('02', removeAcentos(descricao).slice(0, 50)) : ''
  const mai = tlv('26', gui + k + desc)

  const pfi = tlv('00', '01') // Payload Format Indicator
  const pim = tlv('01', '11') // PIM: 11 = estático

  const mcc = tlv('52', '0000') // <- mais seguro que 8398
  const cur = tlv('53', '986') // BRL

  const amt =
    typeof valor === 'number' && valor > 0 ? tlv('54', valor.toFixed(2)) : ''

  const ctry = tlv('58', 'BR')

  const nomeLimpo = removeAcentos(nome).trim()
  const cidadeLimpa = removeAcentos(cidade).trim()

  const nm = tlv(
    '59',
    (nomeLimpo.length >= 2 ? nomeLimpo : 'Presente Casamento').slice(0, 25)
  )
  const ct = tlv(
    '60',
    (cidadeLimpa.length >= 2 ? cidadeLimpa : 'Sao Paulo').slice(0, 15)
  )

  // Additional Data Field (62) com TXID (05) = "***"
  const adf = tlv('62', tlv('05', '***')) // <- chave da compatibilidade

  // Monta sem CRC primeiro
  const semCRC =
    pfi + pim + mai + mcc + cur + amt + ctry + nm + ct + adf + '6304'
  const crc = crc16(semCRC)
  return semCRC + crc
}
