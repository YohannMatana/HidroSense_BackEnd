import { useEffect, useState } from "react";
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

    useEffect(() => {
        fetch("/api/umidade")
            .then((res) => res.json())
            .then((data) => setDados(data))
            .catch((error) => console.error("Erro ao buscar dados:", error));
    }, []);

    const enviarLimite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch("/api/set-limite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ limite }),
            });
            alert("Limite enviado!");
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
                        <h2 className="text-xl font-semibold mb-4">Monitor de Umidade</h2>
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
