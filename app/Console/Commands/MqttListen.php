<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use App\Models\Umidade;


class MqttListen extends Command
{

    protected $signature = 'mqtt:listen';
    protected $description = 'Assina tópicos MQTT e salva os dados no banco';

    public function handle()
    {
        $server = 'broker.hivemq.com';
        $port = 1883;
        $clientId = 'LaravelSubscriber_' . uniqid();

        $connectionSettings = (new ConnectionSettings);

        $mqtt = new MqttClient($server, $port, $clientId);

        $mqtt->connect($connectionSettings, true);

        //assina o topico de umidade

        $mqtt->subscribe('hidrosense/umidade', function (string $topic, string $message) {
            $this->info("Recebido em [$topic]: $message");

            //salva no banco
           $umidade = Umidade::create([
                'valor' => (int)$message,
            ]);
        }, 0);

        //assina o topico de limite 
        $mqtt->subscribe('hidrosense/limite', function(string $topic, string $message) {
            $this->info("Recebido em [$topic]: $message");
            
            $ultimaUmidade = Umidade::latest()->first();
            $ultimaUmidade->update(['limite' => (int)$message]);
        }, 0);

        //Loop pra manter rodando
        
        $mqtt->loop(true);
    }
}
