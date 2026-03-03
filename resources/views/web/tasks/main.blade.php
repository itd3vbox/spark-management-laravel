@extends('web.page.main')

@section('title', 'Tasks')

@section('extra-head')
@endsection

@section('content')

    <div id="tasks"></div>

@endsection

@section('extra-body')
    @vite([
        'resources/js/web/tasks/home/main.jsx',
    ])
@endsection
