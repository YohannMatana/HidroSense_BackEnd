<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Leitura;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/umidade', function () {
    return Leitura::latest()->take(10)->get();
});

Route::post('/set-limite', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'limite' => 'required|integer|min:0|max:100'
    ]);
    // aqui você pode salvar no banco ou publicar via MQTT
    return response()->json(['status' => 'ok', 'limite' => $request->limite]);
});