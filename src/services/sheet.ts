// src/libs/sheets.ts
import axios from 'axios';

const ENDPOINT = import.meta.env.VITE_SHEETS_ENDPOINT as string;
const API_TOKEN = import.meta.env.VITE_API_TOKEN as string | undefined; // opcional

if (!ENDPOINT) {
  throw new Error('SHEETS_ENDPOINT não configurado (VITE_SHEETS_ENDPOINT)');
}

type Gift = { id: string; title: string; price: number; image?: string };
type OK<T = unknown> = { ok: true } & T;
type ERR = { ok: false; error?: string };

const http = axios.create({
  baseURL: ENDPOINT,
  timeout: 12_000,
  headers: API_TOKEN ? { 'X-Token': API_TOKEN } : undefined, // se usar token no Apps Script
});

/** monta URL preservando query existente e adicionando action= */
function withAction(action: string) {
  const url = new URL(ENDPOINT);
  url.searchParams.set('action', action);
  return url.toString();
}

export async function getGifts(): Promise<Gift[]> {
  try {
    // GET simples. Não envie headers de CORS aqui.
    const url = withAction('gifts');
    const { data } = await http.get<OK<{ items: Gift[] }> | ERR>(url);
    if (!data?.ok)
      throw new Error(
        ('error' in data && data.error) || 'Falha ao carregar itens'
      );
    return Array.isArray(data.items) ? data.items : [];
  } catch (err: any) {
    // mensagens mais úteis no console e para UI
    const msg =
      err?.response?.data?.error ||
      err?.message ||
      'Erro ao carregar lista de presentes';
    console.error('[getGifts] ', msg, err?.response?.data);
    throw new Error(msg);
  }
}

export async function sendRSVP(payload: {
  nome: string;
  email: string;
  telefone: string;
  qtdeConvidados: number;
  convidados: string[];
  observacoes?: string;
}): Promise<void> {
  try {
    const url = withAction('rsvp');
    const { data } = await http.post<OK | ERR>(url, {
      type: 'rsvp',
      ...payload,
    });
    if (!data?.ok)
      throw new Error(
        ('error' in data && data.error) || 'Falha ao enviar RSVP'
      );
  } catch (err: any) {
    const msg = err?.response?.data?.error || err?.message || 'Erro no RSVP';
    console.error('[sendRSVP] ', msg, err?.response?.data);
    throw new Error(msg);
  }
}

export async function sendGift(payload: {
  itemId: string;
  itemTitulo: string;
  valor: number;
  nome?: string;
  email?: string;
  mensagem?: string;
}): Promise<void> {
  try {
    const url = withAction('gift');
    const { data } = await http.post<OK | ERR>(url, {
      type: 'presente',
      status: 'reservado',
      ...payload,
    });
    if (!data?.ok)
      throw new Error(
        ('error' in data && data.error) || 'Falha ao registrar presente'
      );
  } catch (err: any) {
    const msg =
      err?.response?.data?.error ||
      err?.message ||
      'Erro no registro de presente';
    console.error('[sendGift] ', msg, err?.response?.data);
    throw new Error(msg);
  }
}
