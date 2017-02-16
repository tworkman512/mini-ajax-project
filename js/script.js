
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetStr = $("#street").val();
    var cityStr = $("#city").val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');



    // NYTimes AJAX request goes here
    var nytimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        nytimesUrl += '?' + $.param({
          'glocations': cityStr,
          'sort': "newest",
          'api-key': "7305d9cc4edf4eeb8339b776c1f0267d"
        });

    $.getJSON(nytimesUrl, function(data){
      $nytHeaderElem.text('New York Times Articles About ' + cityStr);

      articles = data.response.docs;
      for (var i = 0; i < articles.length; i++) {
        var article = articles[i];
        $nytElem.append('<li class="article">' +
          '<a href="' + article.web_url + '">' + article.headline.main +
            '</a>' +
          '<p>' + article.snippet + '</p>'+
        '</li>');
      };
    }).error(function(e){
      $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    // Wikipedia AJAX request goes here
    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + cityStr + "&format=json&callback=wikiCallback";

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      // jasonp: "callback",
      success: function(response){
        var articleList = response[1];

        for (var i = 0; i < articleList.length; i++) {
            articleStr = articleList[i];
            var url = "http://en.wikipedia.org/wiki/" + articleStr;
            $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
        };

        clearTimeout(wikiRequestTimeout);
      }
    });


    return false;
};

$('#form-container').submit(loadData);







// my google maps API key below
// AIzaSyClN0BkJez9nG0U-U9sOcLllB9eS6n7eKw

// my NYTimes API key for Article Search below
// 7305d9cc4edf4eeb8339b776c1f0267d
