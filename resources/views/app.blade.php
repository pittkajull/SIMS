<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/png" href="{{ asset('assets/img/logo/logo.png') }}">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <!-- Hapus class bg-gray-100 atau bg-white di sini, biarkan transparan -->
    <body class="font-sans antialiased m-0 p-0">
        @inertia
    </body>
</html>