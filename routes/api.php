<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\MatchController;
use App\Http\Controllers\Api\V1\OverlayController;
use App\Http\Controllers\Api\V1\WalletController;
use App\Http\Controllers\Api\V1\TemplateController;
use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\TeamController;
use App\Http\Controllers\Api\V1\ReportController;

Route::prefix('v1')->middleware('throttle:60,1')->group(function () {
    // Public Auth with strict rate limit
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register']);
        Route::post('/auth/login', [AuthController::class, 'login']);
    });

    // Public OBS Overlay State
    Route::get('/overlay/{token}/state', [OverlayController::class, 'getStateByToken']);
    Route::get('/templates/public', [TemplateController::class, 'index']);

    // Protected Routes (Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Matches & Score Control
        Route::get('/matches', [MatchController::class, 'index']);
        Route::post('/matches', [MatchController::class, 'store']);
        Route::get('/matches/{match}', [MatchController::class, 'show']);
        Route::post('/matches/{match}/score', [MatchController::class, 'score']);
        Route::post('/matches/{match}/undo', [MatchController::class, 'undo']);
        Route::get('/matches/{match}/events', [MatchController::class, 'events']);

        // Team Management
        Route::get('/teams', [TeamController::class, 'index']);
        Route::post('/teams', [TeamController::class, 'store']);
        Route::put('/teams/{team}', [TeamController::class, 'update']);
        Route::delete('/teams/{team}', [TeamController::class, 'destroy']);

        // Reports & Analytics
        Route::get('/reports/summary', [ReportController::class, 'summary']);

        // Wallet & Marketplace
        Route::get('/wallet', [WalletController::class, 'summary']);
        Route::get('/wallet/transactions', [WalletController::class, 'transactions']);
        Route::get('/wallet/packages', [WalletController::class, 'packages']);
        Route::post('/wallet/checkout', [WalletController::class, 'checkoutPackage']);
        Route::post('/templates/purchase', [WalletController::class, 'purchaseTemplate']);
        Route::post('/matches/{match}/template-settings', [TemplateController::class, 'saveSettings']);

        // Admin Routes
        Route::get('/admin/stats', [AdminController::class, 'stats']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::put('/admin/users/{user}', [AdminController::class, 'updateRole']);
    });
});
