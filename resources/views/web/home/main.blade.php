@extends('web.page.main')

@section('title', env('APP_NAME'))

@section('extra-head')
    <link rel="canonical" href="{{ env('APP_URL') }}/">
    <link rel="shortlink" href="{{ env('APP_URL') }}">
    <meta name="description" content="..." />
@endsection

@section('content')

    <div id="home"></div>
    
</form>

@endsection

@section('extra-body')
    @vite([
        'resources/js/web/home/main.jsx',
    ])
@endsection

