<!DOCTYPE html>
<html lang="en" class="{{ request()->is('overlay*') ? 'bg-transparent' : 'bg-[#0b0f19]' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sports Overlay Hub - Scoreboard & Broadcast Graphics SaaS</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body class="{{ request()->is('overlay*') ? 'bg-transparent' : 'bg-[#0b0f19] text-slate-100 min-h-screen' }}">
    <div id="app"></div>
</body>
</html>
