<?php $loader = require 'vendor/autoload.php'; ?>

<!DOCTYPE html>
<html ng-app="cupwatch">
<head>
    <title>CupWatch</title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <meta charset="utf-8">
    <link rel="stylesheet" href="assets/css/normalize.css" />
    <link rel="stylesheet" href="assets/css/style.css" />
    <link href='http://fonts.googleapis.com/css?family=Roboto:400,300' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="assets/css/font-awesome.min.css">
</head>
<body ng-controller="MainCtrl">

<header class="header">
    <div class="wrapper">
        <a href="index.php" title="Homepage" class="logo"><img src="assets/img/logo.png" alt="CupWatch"/></a>
        <form action="" method="post" class="search-form">
            <input type="text" class="search-input" placeholder="Rechercher une vidéo..." id="q" name="q" autocomplete="off"/>
            
            <ul class="search-result-list">
               <li class="search-result-item" ng-repeat="result in searchResults" id="{{result.id}}">
                   <a href="#" class="disable">
                       <img ng-src="{{result.image}}" alt=""/>
                       <span>{{result.title}}</span>
                   </a>
               </li>
            </ul>
        </form>
    </div>
</header>

<div class="videos">
    <div class="wrapper">
        <div class="videos-current">
            <div id="player"></div>
        </div>

        <ul class="videos-next">
            <li class="videos-next-item" ng-repeat="vid in videosHighlight | limitTo:3 | orderBy:vid.vote" data-id="{{vid.id}}">
                <div class="videos-next-item-thumb" ng-style="{'background':'url('+vid.image+')', 'background-size': 'cover'}"></div>
                <div class="videos-next-item-dec">
                    <p class="videos-next-item-title">{{vid.title}}</p>
<!--                    <p class="videos-next-item-author">De: <span>Kevin Razy</span></p>-->
                </div>
                <div class="videos-next-item-vote">
                    <span class="vote-number">{{ vid.vote }}</span>
                    <a href="#" ng-click="upVote($event)" class="vote-action">Voter</a>
                </div>
            </li>
        </ul>

        <div class="clearfix"></div>
    </div>
</div>

<div class="mosaic">
    <ul class="mosaic-list">
        <li class="mosaic-item" ng-repeat="video in videos | orderBy:video.vote" data-id="video.id">
            <div class="mosaic-item-thumb" ng-style="{'background':'url('+video.image+')', 'background-size': 'cover'}"></div>
            <div class="mosaic-item-desc">
                <h2 class="mosaic-item-title">{{video.title}}</h2>
                <div class="mosaic-item-vote">
                    <a href="#" ng-click="upVote()" class="vote-action">Voter</a>
                    <span class="vote-number"></span>
                </div>
            </div>
        </li>
    </ul>
    <div class="clearfix"></div>
</div>

<script src="assets/js/vendor/jquery.min.js"></script>
<script src="assets/js/vendor/angular.min.js"></script>
<script src="https://cdn.firebase.com/js/client/2.2.7/firebase.js"></script>
<script src="assets/js/vendor/auth.js"></script>
<script src="https://apis.google.com/js/client.js?onload=googleApiClientReady" type="text/javascript"></script>
<script src="assets/js/app.js"></script>
</body>
</html>