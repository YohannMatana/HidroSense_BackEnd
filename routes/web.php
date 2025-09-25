<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MqttController;
use App\Models\Umidade;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/umidade', function () {
    $dados = Umidade::latest()->take(20)->get();
    return view('umidade', compact('dados'));
});

Route::post('/set-limite', [MqttController::class, 'setLimite']);


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
