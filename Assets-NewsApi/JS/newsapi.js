$(document).ready(function(){

    function shuffle(array) {
        var currentIndex = array.length,  randomIndex;
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
        const apiKey = 'b81303861fdb4c548b144102d6650a78';
                console.log(query);
        let url = "https://newsapi.org/v2/top-headlines?q="+query+"&apiKey="+apiKey;
        console.log(url);
     
        if(query !== "")
        {
                //getting data from API and lod it to the Div 
            return $.ajax({
                //requesting data 
                url: url,
                method: "GET",
                dataType:"json",
                beforeSend: function(){
                    //we can show loder hhera
                },       
                success: function(news)
                {
                    console.log(news)
                    //this function will output  the search result
                    let output ="";
                    let latestNews = shuffle(news.articles).slice(0,4);
                    let postLimit=5;
                    let largeScrenColWidth = 12/postLimit;
                    console.log(latestNews);
                    for( var i=0; i < latestNews.length ; i++)
                    {
                                            
                        output +=`<br><div class = "col l$(largeScrenColWidth) m6 s12">
                            <div class="card medium hoverable">
                            <div Class="card-image">
                                <img src="${latestNews[i].urlToImage}" class="responsive-img" alt="${latestNews[i].title}">
                            </div>
                            <div class="card-content">
                            <span class="card-title activator"><i class="material-icons right">more_vert</i></span>
                          
                            <h6 class="truncate">Title: 
                            <a href="${latestNews[i].url}" title="${latestNews[i].title}">${latestNews[i].title}</a></h6>
                                <p><b>Author</b>: ${latestNews[i].author} </p>
                                <p><b>News source</b>: ${latestNews[i].source.name} </p>
                                <p><b>Published</b>: ${latestNews[i].publishedAt} </p>
                                </div>
                        
                                <div class="card-reveal">
                                <span class="card-title"><i class="material-icons right">close</i></span>
                                <p><b>title</b>: ${latestNews[i].title} <b>tite</b>: ${latestNews[i].description}</p>
                            </div>     
                            </div>
                            </div>
                            
      `;
      //<div class="card-action">
        //                      <a href="${latestNews[i].url}" target="_blank" class="btn">Read More</a>
         //                   </div>
                    }
                    if(output !==""){
                        $("#newsResults").html(output);
                    }
                    else{
                        $("#newsResults").html("There is no News!!");
                      }
                    

                },
                error: function()
                {
                    $("#newsResults").html("Error Occured during news load");
                }

            });

        }
    }

    function clearInput() {
        $("#searchQuery").val("");    
    }

    //on Page load, call this function
    function renderButtons() {
        //empty topic buttons div
        $(".topic-buttons").empty();
        

        const savedButtons = JSON.parse(localStorage.getItem("savedButtons")) || [];
        
        new Set(savedButtons).forEach(topic => {
            const button = $("<button class=''>");

            button.text(topic)
            //add a click handler
            button.on("click", function(event){
                event.preventDefault();
                // grab the value of btn,

                // set buttn value to input 
                $("#searchQuery").val(topic);
                // run the query
                searchApi(topic);

            })
            
            $(".topic-buttons").append(button);
        })
        

    }

    function createPreferenceButton(query) {
        const savedButtons = JSON.parse(localStorage.getItem("savedButtons")) || [];
        if (!savedButtons.includes(query.toLowerCase())) {
            savedButtons.push(query.toLowerCase());
        }
        
        console.log(savedButtons);
        localStorage.setItem("savedButtons", JSON.stringify(savedButtons));
        renderButtons();
    }

    renderButtons();

    $("#searchBtn").on("click", function(e){
        e.preventDefault();
        //document.getElementById('.video').style.visibility = "hidden";
       // document.getElementById('.music').style.visibility = "hidden";
        
        let query = $("#searchQuery").val();
          searchApi(query).then(() => {
            clearInput();
            createPreferenceButton(query);
        })

    });

    const videoEl = document.querySelector(".video");
    const musicEl = document.querySelector(".music");
    const newsEl = document.querySelector(".news");


    $("#news").on("click", function(event){
        console.log('heya')
        // hide video and music

        videoEl.classList.add('hide');

        musicEl.classList.add('hide');
        newsEl.classList.remove("hide");
        // expand news card
        newsEl.setAttribute('style', 'width: 80vw');
        

    });

    $("#btn-close-news").on("click", function(){
        console.log('blur');
        // show video and music
        videoEl.classList.remove("hide");
        musicEl.classList.remove("hide");
    })
});
