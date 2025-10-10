<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Umidade;
use Illuminate\Http\Request;
use App\Services\TelegramService;

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

    public function send($message)
    {
        $telegram = new TelegramService();

        $chatId = '5377587183';

        $response = $telegram->sendMessage($chatId, $message);

        return $response->json();
    }

    public function turnOn()
    {

    }
}
