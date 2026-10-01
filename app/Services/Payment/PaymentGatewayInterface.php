<?php

namespace App\Services\Payment;

use App\Models\Payment;
use App\Models\User;

interface PaymentGatewayInterface
{
    public function createPayment(User $user, float $amount, string $currency, array $metadata = []): Payment;
    public function verifyPayment(string $transactionId): bool;
    public function refundPayment(string $transactionId): bool;
}
