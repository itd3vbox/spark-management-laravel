@extends('web.page.main')

@section('title', 'Notes')

@section('extra-head')
@endsection

@section('content')

    <div id="notes"></div>

@endsection

@section('extra-body')
    @vite([
        'resources/js/web/notes/home/main.jsx',
    ])
@endsection
