<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Web\HomeController;
use App\Http\Middleware\AuthSpace;

require base_path('routes/web/_app.php');
require base_path('routes/web/_sign.php');
require base_path('routes/web/_users.php');
require base_path('routes/web/_projects.php');
require base_path('routes/web/_tasks.php');
require base_path('routes/web/_notes.php');
require base_path('routes/web/_notifications.php');
require base_path('routes/web/_automates.php');
require base_path('routes/web/_automates-scheduler.php');
require base_path('routes/web/_settings.php');
require base_path('routes/web/_search.php');
require base_path('routes/web/_agenda.php');
require base_path('routes/web/_chat.php');

Route::middleware([AuthSpace::class])->group(function () {
    Route::get('/', [HomeController::class, 'index'])
        ->name('web.home.index');
    Route::post('/search-projects-data', [HomeController::class, 'searchProjectsData'])
        ->name('web.home.search-projects-data');
});

Route::get('/set-session', function (Request $request) {
    $remember = true;
    $request->session()->invalidate();
 
    $request->session()->regenerateToken();
    if(Auth::attempt(['email' => 'test@example.com', 'password' => '123456', ], $remember))
    {
        $request->session()->regenerate();
        //dd('done');
        //dd(Auth::check());
    }
    //Session::put('test_key', 'This is a test value');
    return 'Session value set';
});

Route::get('/get-session', function (Request $request) {
    //dd(Auth::check(), $request->user());
    //$value = Session::get('test_key', 'Default value');
    if (Auth::check())
        return "Session value: $value";
    return "Session value: false";
});

Route::get('/del-session', function (Request $request) {
    //dd(Auth::check(), $request->user());
    Auth::logout();
 
    //$request->session()->invalidate();
 
    //$request->session()->regenerateToken();
    return "Session value: out";
});