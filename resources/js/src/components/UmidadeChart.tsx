// src/components/UmidadesChart.tsx
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type UmidadeApiItem = {
  id: number;
  valor: number | string;
  created_at: string;
  updated_at?: string;
};

type ChartPoint = {
  id: number;
  valor: number;
  time: number;
  timeLabel: string;
};

type UmidadesChartProps = {
  url?: string;
  pollInterval?: number | null;
  timeLocaleOptions?: Intl.DateTimeFormatOptions;
  limit?: number;
};

const defaultTimeFormat: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const parseApiItemToPoint = (
  item: UmidadeApiItem,
  localeOptions: Intl.DateTimeFormatOptions
): ChartPoint => {
  const valor = typeof item.valor === "string" ? Number(item.valor) : item.valor ?? 0;
  const parsed = new Date(item.created_at);
  const timestamp = Number.isNaN(parsed.getTime()) ? Date.now() : parsed.getTime();
  const timeLabel = new Date(timestamp).toLocaleTimeString([], localeOptions);
  return {
    id: item.id,
    valor: Number.isNaN(Number(valor)) ? 0 : Number(valor),
    time: timestamp,
    timeLabel,
  };
};

export default function UmidadesChart({
  url = "/umidades",
  pollInterval = null,
  timeLocaleOptions = defaultTimeFormat,
  limit = 10,
}: UmidadesChartProps) {
  const [data, setData] = useState<ChartPoint[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (signal?: AbortSignal, tryFetchAll = false) => {
    try {
      setLoading(true);
      setError(null);

      // Se tryFetchAll === true, tenta adicionar um queryparam para pedir mais itens
      const fetchUrl = tryFetchAll ? `${url}${url.includes('?') ? '&' : '?'}limit=1000` : url;

      const res = await fetch(fetchUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal,
        cache: "no-cache", // força não usar cache do browser
        // credentials: 'include' // habilite se usar cookies / sanctum
      });

      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

      const json: UmidadeApiItem[] = await res.json();

      // debug: conte quantos itens vieram do backend
      console.debug("[UmidadesChart] fetch url:", fetchUrl);
      console.debug("[UmidadesChart] backend raw length:", json?.length ?? 0, json);

      const parsed = (json ?? [])
        .map((item) => parseApiItemToPoint(item, timeLocaleOptions))
        .sort((a, b) => a.time - b.time);

      console.debug("[UmidadesChart] parsed length:", parsed.length, parsed.map(p => p.timeLabel));

      const limited = limit > 0 ? parsed.slice(-limit) : parsed;

      console.debug("[UmidadesChart] limited length (após slice):", limited.length, limited.map(p => p.timeLabel));

      setData(limited);

      // Se o backend retornou menos do que o limite e ainda não estávamos forçando fetchAll,
      // tenta pedir mais (debug) — isso ajuda a descobrir se a API está paginando.
      if (!tryFetchAll && (json?.length ?? 0) < limit) {
        console.warn(`[UmidadesChart] backend retornou ${json?.length ?? 0} registros, menor que limit=${limit}. Tentando uma segunda chamada com ?limit=1000 para diagnosticar (remova isso em produção se API não aceitar).`);
        // tenta novamente pedindo mais (não await aqui para evitar bloquear UI excessivamente)
        fetchData(signal, true).catch(err => console.debug("[UmidadesChart] fetchData retry failed", err));
      }
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return;
      console.error("[UmidadesChart] fetch error", err);
      setError((err as Error).message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    let pollId: number | undefined;
    if (pollInterval && pollInterval > 0) {
      pollId = window.setInterval(() => fetchData(controller.signal), pollInterval);
    }

    return () => {
      controller.abort();
      if (pollId) window.clearInterval(pollId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, pollInterval, JSON.stringify(timeLocaleOptions), limit]);

  if (loading) return <div>Carregando dados...</div>;
  if (error) return <div style={{ color: "red" }}>Erro: {error}</div>;
  if (!data || data.length === 0) return <div>Nenhum dado disponível</div>;

  return (
    <div style={{ width: "100%", height: 360 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeLabel" minTickGap={10} interval="preserveStartEnd" tick={{ fontSize: 12 }} />
          <YAxis label={{ value: "% de umidade", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
          <Tooltip labelFormatter={(label) => `Hora: ${label}`} formatter={(value, name) => [`${value}`, name === "valor" ? "Valor" : String(name)]} />
          <Line type="monotone" dataKey="valor" stroke="#206abeff" strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
