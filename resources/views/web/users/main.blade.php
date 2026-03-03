@extends('web.page.main')

@section('title', 'Users')

@section('extra-head')
@endsection

@section('content')

    <div id="users" data-is-admin="{{ $data['isAdmin'] }}" data-auth='@json($auth)'></div>

@endsection

@section('extra-body')
    @vite([
        'resources/js/web/users/home/main.jsx',
    ])
@endsection
