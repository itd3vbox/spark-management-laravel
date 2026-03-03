@extends('web.page.main')

@section('title', 'Notifications')

@section('extra-head')
@endsection

@section('content')

    <div id="notifications"></div>

@endsection

@section('extra-body')
    @vite([
        'resources/js/web/automates/notifications/main.jsx',
    ])
@endsection

