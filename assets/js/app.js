var app = angular.module('cupwatch', []);

app.controller('MainCtrl', function($scope, $http) {

    var ref = new Firebase('https://cupwatch.firebaseio.com/');
    var global = {
        _WW: window.innerWidth,
        _WH: window.innerHeight,

        iframeBaseUrl: 'https://www.youtube-nocookie.com/embed/',
        iframeParam: '?autoplay=1&controls=0&disablekb=1&rel=0&showinfo=0'
    };

    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    $scope.vote = 0;

    $scope.videos = [];

    $scope.videosHighlight = [];

    $scope.searchResults = [];

    $scope.videoCurrent = null;

    $scope.upVote = function ($event) {
        var videoId = $event.currentTarget.parentElement.parentElement.attributes['2'].value;

        var votesRef = ref.child("videos/" + videoId + "/vote");
        
        votesRef.transaction(function(currentVote) {
            // for (var i = 0; i < $scope.videos.length; i++) {
            //     if ($scope.videos[i].id == videoId) {
            //         $scope.videos[i].vote = currentVote + 1;
            //         break;
            //     };
            // };

            // for (var i = 0; i < $scope.videosHighlight.length; i++) {
            //     if ($scope.videosHighlight[i].id == videoId) {
            //         $scope.videosHighlight[i].vote = currentVote + 1;
            //         break;
            //     };
            // };

            return currentVote + 1;
        });
    };

    $scope.downVote = function () {
        $scope.vote--;
    };

    $scope.videosId = [];

    $('.disable').on('click touchend touchstart', function(e){
        e.preventDefault();
    });

    $(document).on('click touchstart touchend', function(e){
        var target = $(e.target);
        if ($('.search-form').has(target).length) {
            $('.search-result-list').fadeIn(0);
        }else{
            $('.search-result-list').fadeOut(0);
        }
    });

    $('.search-input').keyup(function(){
       var val = $(this).val();

        if(val.length > 0){
            $.ajax({
                url: 'assets/php/search.php',
                type: 'POST',
                data: 'q=' + val,
                success: function (data) {
                    data = JSON.parse(data);

                    if(data.code == 200){
                        $scope.searchResults = [];

                        for(var i = 0; i < data.data.length; i++){
                            var v = data.data[i];

                            var id = v.id.videoId;
                            var title = v.vidData.title;
                            var img = v.thumb;

                            var result = {
                                id: id,
                                title: title,
                                image: img,
                                vote: 0
                            };

                            $scope.searchResults.push(result);
                        }

                        $scope.$apply();
                    }else{

                    }
                },
                error: function(data){
                    console.log(data);
                }
            });
        }
    });

    function search(val) {
        var request = gapi.client.youtube.search.list({
            q: val,
            part: 'snippet'
        });

        request.execute(function(response) {
            var str = JSON.stringify(response.result);

            $scope.searchResults = [];

            for(var i = 0; i < response.result.items.length; i++){
                var v = response.result.items[i];

                var id = v.id.videoId;
                var channelId = v.snippet.channelTitle;
                var title = v.snippet.title;
                var img = v.snippet.thumbnails.high.url;

                var result = {
                    id: id,
                    channelId: channelId,
                    title: title,
                    image: img,
                    vote: 0
                };

                $scope.searchResults.push(result);
            }

            $scope.$apply();

        });
    }

    $(document).on('click', '.search-result-item', function(){
        var id = $(this).attr('id');
        var img = $(this).find('img').attr('src');
        var title = $(this).find('span').text();

        var video = {
            id: id,
            title: title,
            image: img,
            vote: 0
        };

        if($scope.videosHighlight.length < 3){
            $scope.videosHighlight.push(video);

            if($scope.videosHighlight.length == 1){
                $scope.videoCurrent = video;
                var url = global.iframeBaseUrl + video.id + global.iframeParam;

                initPlayer(id);
            }
        }else{
            $scope.videos.push(video);
        }

        $scope.$apply();

        var videosRef = ref.child("videos/" + video.id);
        videosRef.set({
            title: video.title,
            vote: video.vote
        });
    });

    var player;
    function initPlayer(id) {
        player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: id,
            playerVars: {
                'autoplay': 1,
                'controls': 1,
                'rel' : 0,
                'disablekb': 1,
                'showinfo': 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event) {
        event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED){
            var lastVideos = $scope.videoCurrent;
            var index = $scope.videos.indexOf($scope.videoCurrent);
            var indexHL = $scope.videosHighlight.indexOf($scope.videoCurrent);

            if(index != -1){
                $scope.videos.splice(index, 1);
            }

            if(indexHL != -1){
                $scope.videosHighlight.splice(indexHL, 1);
            }

            if($scope.videosHighlight[0]){
                $scope.videoCurrent = $scope.videosHighlight[0];

                player.loadVideoById($scope.videoCurrent.id);

                var videosRef = ref.child("videos/" + lastVideos.id);
                videosRef.remove();
            }else{
                $('#player').remove();
                $('<div id="player"></div>').appendTo($('.videos-current'));
            }

            $scope.$apply();
        }
    }

});