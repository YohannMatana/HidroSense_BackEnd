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

});

Route::post('/set-limite', [MqttController::class, 'setLimite']);