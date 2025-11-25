<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Umidade;
use Illuminate\Http\Request;

class UmidadeController extends Controller
{
    public function index(Request $request)
    {
        // Seleciona somente os campos necessários e ordena
        $dados = Umidade::select('id', 'valor', 'created_at')
            ->orderBy('created_at', 'asc')
            // ->latest(10)
            ->get();

        // Opcional: transformar created_at para string ISO (facilita no frontend)
        $dados = $dados->map(function ($r) {
            return [
                'id' => $r->id,
                'valor' => (float)$r->valor,
                'created_at' => $r->created_at->toIso8601String(),
            ];
        });

        return response()->json($dados);
    }

    public function storeUmidade(Request $request)
    {
        // Valida os dados recebidos
        $validated = $request->validate([
            'node_id' => 'required|string',
            'humidity' => 'required|numeric|min:0|max:100',
            'rssi' => 'required|numeric',
        ]);

        // Cria um novo registro de umidade
        $umidade = Umidade::create([
            'node_id' => $validated['node_id'],
            'valor' => (int) $validated['humidity'],
            'rssi' => (int) $validated['rssi'],
        ]);

        // Retorna resposta de sucesso
        return response()->json([
            'success' => true,
            'message' => 'Dados de umidade salvos com sucesso',
            'data' => [
                'id' => $umidade->id,
                'node_id' => $umidade->node_id,
                'humidity' => $umidade->valor,
                'rssi' => $umidade->rssi,
                'created_at' => $umidade->created_at->toIso8601String(),
            ],
        ], 201);
    }
}
