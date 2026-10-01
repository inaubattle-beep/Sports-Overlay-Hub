<?php

namespace App\Services;

use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;
use Exception;

class WalletService
{
    /**
     * Credit coins to user wallet.
     */
    public function credit(User $user, int $amount, string $description, ?string $referenceId = null, ?string $referenceType = null): Wallet
    {
        if ($amount <= 0) {
            throw new Exception("Credit amount must be positive.");
        }

        return DB::transaction(function () use ($user, $amount, $description, $referenceId, $referenceType) {
            $wallet = Wallet::where('user_id', $user->id)->lockForUpdate()->first();

            if (!$wallet) {
                $wallet = Wallet::create(['user_id' => $user->id, 'balance_coins' => 0]);
            }

            $wallet->balance_coins += $amount;
            $wallet->save();

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'credit',
                'amount' => $amount,
                'balance_after' => $wallet->balance_coins,
                'description' => $description,
                'reference_id' => $referenceId,
                'reference_type' => $referenceType,
            ]);

            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'wallet_credit',
                'resource_type' => 'wallet',
                'resource_id' => (string)$wallet->id,
                'payload_after' => ['balance' => $wallet->balance_coins, 'added' => $amount],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $wallet;
        });
    }

    /**
     * Debit coins from user wallet with lockForUpdate to prevent double-spending.
     */
    public function debit(User $user, int $amount, string $description, ?string $referenceId = null, ?string $referenceType = null): Wallet
    {
        if ($amount <= 0) {
            throw new Exception("Debit amount must be positive.");
        }

        return DB::transaction(function () use ($user, $amount, $description, $referenceId, $referenceType) {
            $wallet = Wallet::where('user_id', $user->id)->lockForUpdate()->first();

            if (!$wallet || $wallet->balance_coins < $amount) {
                throw new Exception("Insufficient coin balance.");
            }

            $wallet->balance_coins -= $amount;
            $wallet->save();

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'debit',
                'amount' => $amount,
                'balance_after' => $wallet->balance_coins,
                'description' => $description,
                'reference_id' => $referenceId,
                'reference_type' => $referenceType,
            ]);

            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'wallet_debit',
                'resource_type' => 'wallet',
                'resource_id' => (string)$wallet->id,
                'payload_after' => ['balance' => $wallet->balance_coins, 'deducted' => $amount],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return $wallet;
        });
    }
}
