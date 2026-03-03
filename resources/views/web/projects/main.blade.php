@extends('web.page.main')

@section('title', 'Projects')

@section('extra-head')
@endsection

@section('content')

    <div id="projects"></div>

@endsection

@section('extra-body')
    @vite([
        'resources/js/web/projects/home/main.jsx',
    ])
@endsection
