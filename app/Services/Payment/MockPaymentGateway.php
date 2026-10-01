<?php

namespace App\Services\Payment;

use App\Models\Payment;
use App\Models\User;
use App\Services\WalletService;
use Illuminate\Support\Str;

class MockPaymentGateway implements PaymentGatewayInterface
{
    protected WalletService $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    public function createPayment(User $user, float $amount, string $currency, array $metadata = []): Payment
    {
        $transactionId = 'MOCK_' . strtoupper(Str::random(12));

        $payment = Payment::create([
            'user_id' => $user->id,
            'coin_package_id' => $metadata['coin_package_id'] ?? null,
            'gateway' => 'mock',
            'transaction_id' => $transactionId,
            'amount' => $amount,
            'currency' => $currency,
            'status' => 'completed', // Auto-complete for mock test
            'gateway_payload' => $metadata,
        ]);

        // Auto credit wallet if package ID is provided
        if (!empty($metadata['coins'])) {
            $this->walletService->credit(
                $user,
                (int)$metadata['coins'],
                "Purchased " . ($metadata['package_name'] ?? 'Coin Package'),
                (string)$payment->id,
                'payment'
            );
        }

        return $payment;
    }

    public function verifyPayment(string $transactionId): bool
    {
        $payment = Payment::where('transaction_id', $transactionId)->first();
        return $payment && $payment->status === 'completed';
    }

    public function refundPayment(string $transactionId): bool
    {
        $payment = Payment::where('transaction_id', $transactionId)->first();
        if ($payment) {
            $payment->update(['status' => 'refunded']);
            return true;
        }
        return false;
    }
}
