<?php

use App\Http\Controllers\Api\UmidadeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Umidade;
use App\Http\Controllers\MqttController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/umidade', function () {
    return Umidade::latest()->take(4)->get();
});

Route::get('/limite', function () {

});

Route::get('/umidades', [UmidadeController::class, 'index'])->name('api.umidades');

Route::post('/set-limite', [MqttController::class, 'setLimite']);

Route::post('/send-telegram', [\App\Http\Controllers\Api\TelegramController::class, 'send']);
