@extends('web.page.main')

@section('title', 'Settings')

@section('extra-head')
@endsection

@section('content')

    <div id="settings"></div>

@endsection

@section('extra-body')
    @vite([
        'resources/js/web/settings/main.jsx',
    ])
@endsection
