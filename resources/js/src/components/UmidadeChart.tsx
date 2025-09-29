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

/**
 * Tipos
 */
type UmidadeApiItem = {
  id: number;
  valor: number | string;        // pode vir como string do backend
  created_at: string;            // ISO ou "YYYY-MM-DD HH:mm:ss"
  updated_at?: string;
};

type ChartPoint = {
  id: number;
  valor: number;
  time: number;       // timestamp (ms) - facilita sort/comparações
  timeLabel: string;  // string já formatada para exibição no eixo X
};

type UmidadesChartProps = {
  url?: string;             // endpoint para pegar os dados
  pollInterval?: number | null; // em ms, se quiser polling; null = sem polling
  timeLocaleOptions?: Intl.DateTimeFormatOptions; // opicional para formatar timeLabel
};

/**
 * Componente
 */
const defaultTimeFormat: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const parseApiItemToPoint = (
  item: UmidadeApiItem,
  localeOptions: Intl.DateTimeFormatOptions
): ChartPoint => {
  // garante que 'valor' seja number
  const valor = typeof item.valor === "string" ? Number(item.valor) : item.valor ?? 0;

  // tenta parse do created_at; se falhar usa Date.now()
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
}: UmidadesChartProps) {
  const [data, setData] = useState<ChartPoint[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // fetch function
  const fetchData = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": "Bearer ...", // se precisar
        },
        signal,
        // credentials: "include", // se usar cookies / sanctum
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const json: UmidadeApiItem[] = await res.json();

      // mapa para ChartPoint com ordenação por time
      const parsed = json
        .map((item) => parseApiItemToPoint(item, timeLocaleOptions))
        .sort((a, b) => a.time - b.time);

      setData(parsed);
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") {
        // fetch abortado — ignora
        return;
      }
      console.error(err);
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
  }, [url, pollInterval, JSON.stringify(timeLocaleOptions)]); // re-fetch se url/pollInterval/options mudarem

  if (loading) return <div>Carregando dados...</div>;
  if (error) return <div style={{ color: "red" }}>Erro: {error}</div>;
  if (!data || data.length === 0) return <div>Nenhum dado disponível</div>;

  return (
    <div style={{ width: "100%", height: 360 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timeLabel"
            minTickGap={10}
            interval="preserveStartEnd"
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => `Hora: ${label}`}
            formatter={(value, name) => [`${value}`, name === "valor" ? "Valor" : String(name)]}
          />
          <Line type="monotone" dataKey="valor" stroke="#206abeff" strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
