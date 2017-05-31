;(function ($, window) {

    var defaults = {
        ratio: 16/9, 
        videoId: '', 
        mute: false,
        repeat: true,
        width: $(window).width(),
        wrapperZIndex: 99,
        increaseVolumeBy: 10,
        start: 0
    };

    var tubular = function(node, options) { 
        var options = $.extend({}, defaults, options),
            $body = $('body') 
            $node = $(node); 

         var tubularContainer = '<div id="tubular-container" style="overflow: hidden; position: fixed; z-index: 1; width: 100%; height: 100%"><div id="tubular-player" style="position: absolute"></div></div><div id="tubular-shield" style="width: 100%; height: 100%; z-index: 2; position: absolute; left: 0; top: 0;"></div>';

        $('html,body').css({'width': '100%', 'height': '100%'});
        $body.prepend(tubularContainer);
        $node.css({position: 'relative', 'z-index': options.wrapperZIndex});

        window.player;
        window.onYouTubeIframeAPIReady = function() {
            player = new YT.Player('tubular-player', {
                width: options.width,
                height: Math.ceil(options.width / options.ratio),
                videoId: options.videoId,
                playerVars: {
                    controls: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    wmode: 'transparent'
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        window.onPlayerReady = function(e) {
            resize();
            if (options.mute) e.target.mute();
            e.target.seekTo(options.start);
            e.target.playVideo();
        }

        window.onPlayerStateChange = function(state) {
            if (state.data === 0 && options.repeat) { 
                player.seekTo(options.start); 
            }
        }

        var resize = function() {
            var width = $(window).width(),
                pWidth, 
                height = $(window).height(),
                pHeight, 
                $tubularPlayer = $('#tubular-player');

            if (width / options.ratio < height) { 
                pWidth = Math.ceil(height * options.ratio); 
                $tubularPlayer.width(pWidth).height(height).css({left: (width - pWidth) / 2, top: 0}); 
            } else { 
                pHeight = Math.ceil(width / options.ratio); 
                $tubularPlayer.width(width).height(pHeight).css({left: 0, top: (height - pHeight) / 2}); 
            }

        }

       
    }

    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    $.fn.tubular = function (options) {
        return this.each(function () {
            if (!$.data(this, 'tubular_instantiated')) { 
                $.data(this, 'tubular_instantiated', 
                tubular(this, options));
            }
        });
    }

})(jQuery, window);