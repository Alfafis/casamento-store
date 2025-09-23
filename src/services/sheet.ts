// src/libs/sheets.ts
import axios from 'axios'

const ENDPOINT = import.meta.env.VITE_SHEETS_ENDPOINT as string
const API_TOKEN = import.meta.env.VITE_API_TOKEN as string | undefined // opcional

if (!ENDPOINT) {
  throw new Error('SHEETS_ENDPOINT não configurado (VITE_SHEETS_ENDPOINT)')
}

type Gift = { id: string; title: string; price: number; image?: string }
type OK<T = unknown> = { ok: true } & T
type ERR = { ok: false; error?: string }

const http = axios.create({
  baseURL: ENDPOINT,
  timeout: 12_000,
  headers: API_TOKEN ? { 'X-Token': API_TOKEN } : undefined // se usar token no Apps Script
})

/** monta URL preservando query existente e adicionando action= */
function withAction(action: string) {
  const url = new URL(ENDPOINT)
  url.searchParams.set('action', action)
  return url.toString()
}

export async function getGifts(): Promise<Gift[]> {
  try {
    // GET simples. Não envie headers de CORS aqui.
    const url = withAction('gifts')
    const { data } = await http.get<OK<{ items: Gift[] }> | ERR>(url)
    if (!data?.ok)
      throw new Error(
        ('error' in data && data.error) || 'Falha ao carregar itens'
      )
    return Array.isArray(data.items) ? data.items : []
  } catch (err: any) {
    // mensagens mais úteis no console e para UI
    const msg =
      err?.response?.data?.error ||
      err?.message ||
      'Erro ao carregar lista de presentes'
    console.error('[getGifts] ', msg, err?.response?.data)
    throw new Error(msg)
  }
}

export async function sendRSVP(payload: {
  nome: string
  email: string
  celular: string
  qtdeConvidados: number
  convidados: string[]
  observacoes?: string
}) {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // <- evita preflight
    body: JSON.stringify({ type: 'rsvp', ...payload })
  })
  const j = await r.json().catch(() => ({}))
  if (!j?.ok) throw new Error(j?.error || 'Falha ao enviar RSVP')
}

export async function sendGift(payload: {
  nome?: string
  email?: string
  valor: number
  itemId: string
  itemTitulo: string
  mensagem?: string
}) {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // <- evita preflight
    body: JSON.stringify({ type: 'presente', status: 'reservado', ...payload })
  })
  const j = await r.json().catch(() => ({}))
  if (!j?.ok) throw new Error(j?.error || 'Falha ao registrar presente')
}
