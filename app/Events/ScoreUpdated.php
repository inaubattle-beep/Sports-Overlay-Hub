<?php

namespace App\Events;

use App\Models\GameMatch;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ScoreUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public GameMatch $match;
    public array $state;

    public function __construct(GameMatch $match)
    {
        $this->match = $match;
        $this->state = $match->current_state ?? [];
    }

    public function broadcastOn(): array
    {
        $channels = [
            new Channel('match.' . $this->match->id),
        ];

        // Also broadcast to public OBS overlay tokens
        foreach ($this->match->broadcastOutputs as $output) {
            if ($output->is_active) {
                $channels[] = new Channel('overlay.' . $output->token);
            }
        }

        return $channels;
    }

    public function broadcastWith(): array
    {
        return [
            'match_id' => $this->match->id,
            'name' => $this->match->name,
            'status' => $this->match->status,
            'sport' => $this->match->sport->code ?? 'football',
            'state' => $this->state,
            'homeTeam' => [
                'name' => $this->match->homeTeam->name ?? 'HOME',
                'short_name' => $this->match->homeTeam->short_name ?? 'HOM',
                'color' => $this->match->homeTeam->primary_color ?? '#2563eb',
            ],
            'awayTeam' => [
                'name' => $this->match->awayTeam->name ?? 'AWAY',
                'short_name' => $this->match->awayTeam->short_name ?? 'AWY',
                'color' => $this->match->awayTeam->primary_color ?? '#dc2626',
            ],
            'updated_at' => now()->toIso8601String(),
        ];
    }
}
