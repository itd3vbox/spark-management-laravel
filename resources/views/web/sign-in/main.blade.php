<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>@yield('title')</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
        <link rel="manifest" href="/favicon/site.webmanifest">
        <style>
            :root {
                --color-1: #000000;
                --color-2: #ffffff;
                --color-3: #3b3b49;
                --color-4: #70536f;
                --color-5: #b36a80;
                --color-6: #eb8a79;
                --color-7: #ffbb6a;
                --color-8: #f9f871;

                --color-11: #555063;
                --color-12: #555063;
                --color-13: #73667e;
                --color-14: #947c97;
                --color-15: #b792b0;
                --color-16: #dba9c6;
            }

            * {
                margin: 0;
                padding: 0;
            }

            a {
                text-decoration: none;
            }

            button {
                outline: none;
                border: none;
                cursor: pointer;
            }

            html,
            body {
                width: 100%;
                height: 100vh;
                overflow: hidden;
                display: flex;
                justify-content: center;
                background-color: var(--color-11);
            }
        </style>
        @yield('extra-head')
        @viteReactRefresh
        @vite([
            'resources/js/app.js',
            'resources/js/web/sign-in/main.jsx',
        ])
    </head>
    <body>
        <div id="sign-in"></div>
    </body>
</html>