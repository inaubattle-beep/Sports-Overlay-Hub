<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\GameMatch;
use App\Models\Team;
use App\Models\Player;
use App\Models\ScoreboardTemplate;
use App\Models\UserTemplatePurchase;
use App\Models\WalletTransaction;
use App\Models\Payment;
use App\Models\AuditLog;
use App\Services\WalletService;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats(Request $request)
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'status' => 'success',
            'stats' => [
                'total_users' => User::count(),
                'active_matches' => GameMatch::where('status', 'live')->count(),
                'total_matches' => GameMatch::count(),
                'total_teams' => Team::count(),
                'total_players' => Player::count(),
                'total_templates' => ScoreboardTemplate::count(),
                'template_purchases' => UserTemplatePurchase::count(),
                'total_payments' => Payment::where('status', 'completed')->sum('amount'),
                'coins_distributed' => WalletTransaction::where('type', 'credit')->sum('amount'),
            ],
            'recent_users' => User::orderBy('id', 'desc')->take(5)->get(),
            'recent_matches' => GameMatch::with(['sport', 'user'])->orderBy('id', 'desc')->take(5)->get(),
            'recent_audit_logs' => AuditLog::with('user')->orderBy('id', 'desc')->take(10)->get(),
        ]);
    }

    public function users(Request $request)
    {
        $this->authorizeAdmin($request);

        $users = User::with(['wallet', 'teams'])->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $users,
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'role' => 'required|in:super_admin,admin,moderator,user',
            'status' => 'required|in:active,suspended',
        ]);

        $user->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'User role and status updated successfully',
            'data' => $user,
        ]);
    }

    public function adjustCoins(Request $request, User $user, WalletService $walletService)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'amount' => 'required|integer|min:1|max:10000',
            'type' => 'required|in:credit,debit',
            'reason' => 'nullable|string',
        ]);

        if ($validated['type'] === 'credit') {
            $walletService->credit($user, $validated['amount'], 'admin_grant', $validated['reason'] ?? 'Admin granted coins');
        } else {
            $walletService->debit($user, $validated['amount'], 'admin_deduct', $validated['reason'] ?? 'Admin deducted coins');
        }

        return response()->json([
            'status' => 'success',
            'message' => 'User coin balance updated successfully',
            'user' => $user->load('wallet'),
        ]);
    }

    private function authorizeAdmin(Request $request)
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, ['super_admin', 'admin', 'superadmin'])) {
            abort(403, 'Unauthorized. Super Admin access required.');
        }
    }
}

