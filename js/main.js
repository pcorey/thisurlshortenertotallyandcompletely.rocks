$(function() {

    var tustacr  = new TUSTACR('https://popping-fire-8957.firebaseio.com/tustacr');
    var request  = window.location.search.substr(1);
    var url      = null;

    var back     = $('.back');
    var box      = $('#box');
    var backSpan = back.find('span');
    var input    = $('input');

    function showError(error) {
        back.addClass('error');
        backSpan.text(error);
        box.addClass('show-back');
    }

    function prependProtocol(url) {
        if (!url.match(/^[a-zA-Z]+:\/\//)) {
            return 'http://'+url;
        }
        return url;
    }

    function handleSuccess(key, url) {
        var code = key.toString(32);
        backSpan.html('<a href="/?' + code + 
            '">thisurlshortenertotallyandcompletely.rocks/'+code+'</a>');
        back.removeClass('error');
        box.toggleClass('show-back');
    }

    function submit() {
        url = prependProtocol(input.val());
        tustacr.getKeyFromURL(url, handleSuccess, showError);
    }

    $('#shorten').click(submit);
    input.keypress(function(e) {
        if (e.which == 13) {
            submit();
        }
    });

    $('#again').click(function() {
        input.val('').focus();
        $('#box').removeClass('show-back');
    });

    if (request) {
        tustacr.getURLFromKey(parseInt(request, 32), function(url) {
            if (url) {
                window.location.replace(url);
            }
            else {
                showError('Whoops! I can\'t find that URL!');
            }
        });
    }

});