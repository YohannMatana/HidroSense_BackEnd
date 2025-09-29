<?php

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
    $limite = cache('hidrosense_limite', 40);
    return response()->json(['limite' => $limite]);
});

Route::post('/set-limite', [MqttController::class, 'setLimite']);