<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\CoinPackage;
use App\Models\ScoreboardTemplate;
use App\Models\UserTemplatePurchase;
use App\Services\WalletService;
use App\Services\Payment\MockPaymentGateway;
use Illuminate\Http\Request;
use Exception;

class WalletController extends Controller
{
    protected WalletService $walletService;
    protected MockPaymentGateway $paymentGateway;

    public function __construct(WalletService $walletService, MockPaymentGateway $paymentGateway)
    {
        $this->walletService = $walletService;
        $this->paymentGateway = $paymentGateway;
    }

    public function summary(Request $request)
    {
        $user = $request->user();
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id], ['balance_coins' => 100]);

        return response()->json([
            'status' => 'success',
            'wallet' => $wallet,
            'purchased_templates' => UserTemplatePurchase::where('user_id', $user->id)
                ->pluck('scoreboard_template_id'),
        ]);
    }

    public function transactions(Request $request)
    {
        $user = $request->user();
        $wallet = Wallet::where('user_id', $user->id)->first();
        
        $transactions = $wallet ? WalletTransaction::where('wallet_id', $wallet->id)
            ->orderBy('id', 'desc')
            ->get() : [];

        return response()->json([
            'status' => 'success',
            'data' => $transactions,
        ]);
    }

    public function packages()
    {
        $packages = CoinPackage::where('is_active', true)->get();

        return response()->json([
            'status' => 'success',
            'data' => $packages,
        ]);
    }

    public function checkoutPackage(Request $request)
    {
        $validated = $request->validate([
            'coin_package_id' => 'required|exists:coin_packages,id',
        ]);

        $user = $request->user();
        $package = CoinPackage::findOrFail($validated['coin_package_id']);

        $totalCoins = $package->coins + $package->bonus_coins;

        // Process Mock Checkout
        $payment = $this->paymentGateway->createPayment($user, $package->price_usd, 'USD', [
            'coin_package_id' => $package->id,
            'package_name' => $package->name,
            'coins' => $totalCoins,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Coin package purchased successfully!',
            'payment' => $payment,
            'wallet' => $user->fresh('wallet')->wallet,
        ]);
    }

    public function purchaseTemplate(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:scoreboard_templates,id',
        ]);

        $user = $request->user();
        $template = ScoreboardTemplate::findOrFail($validated['template_id']);

        // Check if already purchased
        $existing = UserTemplatePurchase::where('user_id', $user->id)
            ->where('scoreboard_template_id', $template->id)
            ->first();

        if ($existing) {
            return response()->json([
                'status' => 'info',
                'message' => 'Template already unlocked!',
            ]);
        }

        if (!$template->is_premium || $template->price_coins <= 0) {
            UserTemplatePurchase::create([
                'user_id' => $user->id,
                'scoreboard_template_id' => $template->id,
                'price_paid' => 0,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Free template unlocked!',
            ]);
        }

        try {
            $this->walletService->debit(
                $user,
                $template->price_coins,
                "Unlocked Premium Template: {$template->name}",
                (string)$template->id,
                'template_purchase'
            );

            UserTemplatePurchase::create([
                'user_id' => $user->id,
                'scoreboard_template_id' => $template->id,
                'price_paid' => $template->price_coins,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => "Successfully unlocked {$template->name}!",
                'wallet' => $user->fresh('wallet')->wallet,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
