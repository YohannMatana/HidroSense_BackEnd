<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;

class TelegramController extends Controller
{
    public function send(Request $request, TelegramService $telegram)
    {
        $data = $request->validate([
            'umidade' => 'required|numeric',
            'limite' => 'required|numeric',
            'action' => 'nullable|string|in:ON,OFF',
        ]);

        $chatId = config('services.telegram.chat_id') ?? env('TELEGRAM_CHAT_ID');
        if (!$chatId) {
            return response()->json(['status' => 'error', 'message' => 'Telegram chat_id não configurado'], 500);
        }

    $umidade = $data['umidade'];
    $limite = $data['limite'];
    $action = $data['action'] ?? 'ON';

    $message = "Alerta HidroSense:\n";
    $message .= "Umidade atual: {$umidade}%\n";
    $message .= "Limite configurado: {$limite}%\n";
    $message .= "A bomba foi acionada automaticamente: {$action}.";

        // Opcional: publicar comando MQTT para ligar a bomba
        try {
            $server = 'broker.hivemq.com';
            $port = 1883;
            $clientId = 'LaravelPublisher_Bomba_' . uniqid();

            $mqtt = new MqttClient($server, $port, $clientId);
            $mqtt->connect(new ConnectionSettings, true);

            $payload = json_encode(['action' => $action, 'umidade' => $umidade, 'limite' => $limite]);
            $mqtt->publish('hidrosense/bomba', $payload, 0);

            $mqtt->disconnect();
        } catch (\Exception $e) {
            // registrar e continuar — não bloquear envio de telegram caso o MQTT falhe
            report($e);
        }

        $resp = $telegram->sendMessage($chatId, $message);

        if ($resp->successful()) {
            return response()->json(['status' => 'success', 'message' => 'Mensagem enviada ao Telegram e comando MQTT publicado']);
        }

        return response()->json(['status' => 'error', 'message' => 'Falha ao enviar mensagem ao Telegram', 'response' => $resp->body()], 500);
    }
}
