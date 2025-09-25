<?php

namespace App\Http\Controllers;

use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use Illuminate\Http\Request;

class MqttController extends Controller
{
    public function setLimite(Request $request) {
        $limite = (int) $request->input('limite');

        $server = 'broker.hivemq.com';
        $port = 1883;
        $clientId = 'LaravelSubscriber_' . uniqid();

        $mqtt = new MqttClient($server, $port, $clientId);
        $mqtt->connect(new ConnectionSettings, true);

        $mqtt->publish('hidrosense/limite', (string)$limite, 0);

        $mqtt->disconnect();

        return back()->with('sucess', "Novo limite enviado: {$limite}%");
    }
}
