import { useEffect, useState, useRef } from "react";
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DadosUmidade {
    id: number;
    valor: number;
    created_at: string;
}

export default function Dashboard() {
    const [dados, setDados] = useState<DadosUmidade[]>([]);
    const [limite, setLimite] = useState("");
    const [limiteAtual, setLimiteAtual] = useState<number | null>(null);
    const [isAutoUpdate, setIsAutoUpdate] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const buscarLimiteAtual = async () => {
        try {
            const response = await fetch('/api/limite');
            if (response.ok) {
                const data = await response.json();
                setLimiteAtual(data.limite);
            }
        } catch (error) {
            console.error('Erro ao buscar limite atual:', error);
        }
    };

    const buscarDados = async (showLoading = false) => {
        if (showLoading) setIsLoading(true);
        try {
            const response = await fetch("/api/umidade");
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const data = await response.json();
            setDados(data);
            setLastUpdate(new Date());
            setError(null); // Limpar erro em caso de sucesso
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
            setError(`Falha ao carregar dados: ${errorMessage}`);
            
            // Se houver erro durante auto-update, pausar para evitar spam de requests
            if (!showLoading && isAutoUpdate) {
                setIsAutoUpdate(false);
            }
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    useEffect(() => {
        // Buscar dados iniciais
        buscarDados(true);
        buscarLimiteAtual();
    }, []);

    useEffect(() => {
        if (isAutoUpdate) {
            // Configurar polling automático a cada 5 segundos
            intervalRef.current = setInterval(() => {
                buscarDados(false);
            }, 5000);
        } else {
            // Limpar interval se auto-update estiver desabilitado
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        // Cleanup function
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isAutoUpdate]);

    const enviarLimite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch("/api/set-limite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ limite }),
            });
            alert("Limite enviado!");
            // Atualizar o limite atual após envio
            buscarLimiteAtual();
            setLimite(""); // Limpar o campo
        } catch (error) {
            console.error("Erro ao enviar limite:", error);
            alert("Erro ao enviar limite!");
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Monitor de Umidade" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    {/* Card de Dados de Umidade */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Monitor de Umidade</h2>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={isAutoUpdate ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setIsAutoUpdate(!isAutoUpdate)}
                                >
                                    {isAutoUpdate ? " Pausar" : " Retomar"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => buscarDados(true)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "" : ""} Atualizar
                                </Button>
                            </div>
                        </div>
                        
                        {/* Indicador de status */}
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className={`w-2 h-2 rounded-full ${
                                error ? 'bg-red-500' : 
                                isAutoUpdate ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                            }`}></div>
                            <span>
                                {error ? 'Erro na conexão' :
                                 isAutoUpdate ? 'Atualizando automaticamente' : 'Atualização pausada'}
                                {lastUpdate && ` • Última atualização: ${lastUpdate.toLocaleTimeString()}`}
                            </span>
                        </div>
                        
                        {/* Exibir erro se houver */}
                        {error && (
                            <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}
                        
                        <div className="max-h-96 overflow-y-auto">
                            {dados.length > 0 ? (
                                <ul className="space-y-2">
                                    {dados.map((d) => (
                                        <li key={d.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(d.created_at).toLocaleString()}
                                            </span>
                                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                                {d.valor}%
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">Nenhum dado disponível</p>
                            )}
                        </div>
                    </Card>

                    {/* Card de Configuração de Limite */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Configurar Limite</h2>
                        {limiteAtual !== null && (
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    Limite atual: <span className="font-medium">{limiteAtual}%</span>
                                </p>
                            </div>
                        )}
                        <form onSubmit={enviarLimite} className="space-y-4">
                            <div>
                                <Label htmlFor="limite">Novo limite (%):</Label>
                                <Input
                                    id="limite"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={limite}
                                    onChange={(e) => setLimite(e.target.value)}
                                    placeholder="Digite o limite de umidade"
                                    className="mt-1"
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Enviar Limite
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Área adicional para futuras expansões */}
                <div className="relative min-h-[200px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="p-6">
                        <h3 className="text-lg font-medium mb-2">Estatísticas</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Área reservada para gráficos e estatísticas futuras
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
