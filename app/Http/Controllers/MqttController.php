<?php

namespace App\Http\Controllers;

use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use Illuminate\Http\Request;

class MqttController extends Controller
{
    public function setLimite(Request $request) {
        $request->validate([
            'limite' => 'required|integer|min:0|max:100'
        ]);
        
        $limite = (int) $request->input('limite');

        try {
            $server = 'broker.hivemq.com';
            $port = 1883;
            $clientId = 'LaravelPublisher_' . uniqid();

            $mqtt = new MqttClient($server, $port, $clientId);
            $mqtt->connect(new ConnectionSettings, true);

            $mqtt->publish('hidrosense/limite', (string)$limite, 0);

            $mqtt->disconnect();

            // Retorna JSON para API
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'success',
                    'message' => "Novo limite enviado: {$limite}%",
                    'limite' => $limite
                ]);
            }

            // Retorna redirect para web
            return back()->with('success', "Novo limite enviado: {$limite}%");
            
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Erro ao enviar limite via MQTT: ' . $e->getMessage()
                ], 500);
            }
            
            return back()->with('error', 'Erro ao enviar limite via MQTT: ' . $e->getMessage());
        }
    }
}
