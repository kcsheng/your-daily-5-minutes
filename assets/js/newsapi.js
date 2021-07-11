$(document).ready(function () {
    renderButtons();
    $('#news-article').hide();

    // load previously saved preferences for news
    if (!(localStorage.getItem('savedButtons') === null || localStorage.getItem('savedButtons') === 'undefined')) {
        var options = JSON.parse(localStorage.getItem('savedButtons'));
        var selectBox = $("select#news-pref-select");
        options.forEach((option) => {
            var option = new Option(option, option, true, true);
            selectBox.append(option).trigger('change');
            selectBox.trigger({ type: 'select2:select', params: { data: option } });
        })
    }

    // handler for clicking the card
    $(document).on("click", '.news-card', (event) => {
        console.log('news clicked', $(event.target).closest('.news-card').data('newsurl'))
        $('#news-iframe').attr('src',$(event.target).closest('.news-card').data('newsurl'));
        $('#news-article').show();
        $('#newsRow').hide();
    });

    $('#back-to-results').on('click', () => {
        $('#news-article').hide();
        $('#newsRow').show();
        $('#news-iframe').attr('src','');
    })

    $("#news-pref-select").select2({
        tags: true
    });

    function shuffle(array) {
        var currentIndex = array.length, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function searchApi(query) {
        //b81303861fdb4c548b144102d6650a78
        const apiKey = '010a2da8b8934a4b98619a8b89ac4267';//'59882bca0c60494f8922187779d44479'; //'59882bca0c60494f8922187779d44479';
        console.log(query);
        let url = "https://newsapi.org/v2/top-headlines?q=" + encodeURIComponent(query) + "&apiKey=" + apiKey;
        console.log(url);

        if (query !== "") {
            //getting data from API and lod it to the Div 
            return $.ajax({
                //requesting data 
                url: url,
                method: "GET",
                dataType: "json",
                beforeSend: function () {
                    //we can show loder hhera
                },
                success: function (news) {
                    console.log(news)
                    //this function will output  the search result
                    let output = "";
                    let latestNews = shuffle(news.articles).slice(0, 4);
                    let postLimit = 5;
                    let largeScrenColWidth = 12 / postLimit;
                    console.log(latestNews);
                    for (var i = 0; i < latestNews.length; i++) {
                        var newsCard = $('<div>');
                        newsCard.addClass('news-card')
                        newsCard.data('newsurl', latestNews[i].url);

                        var newsImage = $('<img>');
                        newsImage.attr('src', latestNews[i].urlToImage);
                        newsImage.attr('alt', latestNews[i].title);
                        newsImage.addClass('news-image');
                        var newsTitle = $('<h3>');
                        newsTitle.text(latestNews[i].title);
                        var newsAuthor = $('<span>');
                        newsAuthor.text(latestNews[i].author);
                        var newsSource = $('<span>');
                        newsSource.text(latestNews[i].source.name);
                        newsSource.addClass('news-source');
                        var newsPublishDate = $('<span>');
                        newsPublishDate.text(moment(latestNews[i].publishedAt).fromNow());
                        newsPublishDate.addClass('news-date');
                        var newsDescription = $('<p>');
                        newsDescription.text(latestNews[i].description);

                        var divSourceDate = $('<div>');
                        divSourceDate.addClass('news-source-date');
                        divSourceDate.append(newsSource);
                        divSourceDate.append(' - ');
                        divSourceDate.append(newsPublishDate);

                        newsCard.append(newsImage);
                        newsCard.append(newsTitle);
                        newsCard.append(divSourceDate);
                        newsCard.append(newsDescription);
                        

                        $("#newsResults").append(newsCard);
                    }
                    if (latestNews.length > 0) {
                        $(".title-news").html("News")
                    }
                    else {

                        $(".title-news").html("There is no news on this topic today!");

                    }
                },
                error: function () {
                    $(".title-news").html("Error Occured during news load");
                }

            });

        }
    }

    //on Page load, call this function
    function renderButtons() {
        //empty topic buttons div
        $(".topic-buttons").empty();
        if (!(localStorage.getItem('savedButtons') === null || localStorage.getItem('savedButtons') === 'undefined')) {
            var savedButtons = JSON.parse(localStorage.getItem("savedButtons")) || [];
        } else {
            var savedButtons = [];
        }
    
        new Set(savedButtons).forEach(topic => {
            const button = $("<button class=''>");
            button.text(topic)
            //add a click handler
            button.on("click", function (event) {
                event.preventDefault();
                // grab the value of btn,
                // set buttn value to input 
                $("#newsResults").empty();
                // run the query
                searchApi(topic);
            })


            $(".topic-buttons").append(button);
        })

    }
    
    $(".news-keyword-save").on("click", function (e) {
        e.preventDefault();
        localStorage.setItem("savedButtons", JSON.stringify($('#news-pref-select').val()));
        renderButtons();
    });

    // const videoEl = document.querySelector(".video");
    //const musicEl = document.querySelector(".music");
    //const newsEl = document.querySelector(".news");
    /* $(".news-search").on("click", function(event){
         console.log('heya')
         // hide video and music
 
       //  videoEl.classList.add('hide');
 
       //  musicEl.classList.add('hide');
       //  newsEl.classList.remove("hide");
         // expand news card
         //newsEl.setAttribute('style', 'width: 80vw');
         
     });*/

});
