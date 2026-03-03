@extends('web.page.main')

@section('title', 'Automates')

@section('extra-head')
@endsection

@section('content')

    <div id="automates"></div>

@endsection

@section('extra-body')
    @vite([
        'resources/js/web/automates/home/main.jsx',
    ])
@endsection

