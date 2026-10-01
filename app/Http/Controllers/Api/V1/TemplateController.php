<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ScoreboardTemplate;
use App\Models\TemplateSetting;
use App\Models\UserTemplatePurchase;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $templates = ScoreboardTemplate::with('sport')
            ->where('is_active', true)
            ->get();

        $purchasedIds = $user ? UserTemplatePurchase::where('user_id', $user->id)
            ->pluck('scoreboard_template_id')
            ->toArray() : [];

        $data = $templates->map(function ($tpl) use ($purchasedIds) {
            $unlocked = !$tpl->is_premium || in_array($tpl->id, $purchasedIds);
            return array_merge($tpl->toArray(), [
                'is_unlocked' => $unlocked,
            ]);
        });

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    public function saveSettings(Request $request, $matchId)
    {
        $validated = $request->validate([
            'scoreboard_template_id' => 'required|exists:scoreboard_templates,id',
            'custom_config' => 'required|array',
        ]);

        $setting = TemplateSetting::updateOrCreate(
            ['match_id' => $matchId],
            [
                'scoreboard_template_id' => $validated['scoreboard_template_id'],
                'custom_config' => $validated['custom_config'],
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Template settings saved',
            'data' => $setting,
        ]);
    }
}
