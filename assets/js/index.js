const moonPath = "M38 19C38 29.4934 29.4934 38 19 38C8.50659 38 0 29.4934 0 19C0 8.50659 8.50659 0 19 0C29.4934 0 38 8.50659 38 19Z";
const sunPath = "M11 19C11 29.4934 19.5 38.9936 19.5 38.9936C9.00659 38.9936 0.5 30.487 0.5 19.9936C0.5 9.50015 9.00659 0.99356 19.5 0.99356C19.5 -0.00645276 11 8.50659 11 19Z";

const darkMode = document.querySelector("#dark_mode");
const settings = document.getElementById('settingsCog');

// check if API keys exist in localStorage. If not, redirect to page.
function checkAndRedirectAPIKeys(){
    if(
        !(
            localStorage.getItem("apiKey") && localStorage.getItem("apiKey").length == 39 &&
            localStorage.getItem(LS_SPOTIFY_API_KEY_B64) && localStorage.getItem(LS_SPOTIFY_API_KEY_B64) != 'undefined'
        )
    ){
        window.location.replace('./DemoSettings.html');
    }
}

let toggle = false;

darkMode.addEventListener("click", ()=>{

	const timeline = anime.timeline({
		duration : 750,
		easing : "easeOutExpo"
	});

timeline.add({
		targets:".moon",
		d:[{value: toggle ? moonPath: sunPath}] //moonPath ->sunpath
	})
		.add({
			targets:'#dark_mode',
			rotate : toggle? 0 : 320},"-=350")
			ldBody = document.getElementById('ldChange');
            ldCards = document.getElementsByClassName('cards');
			logoContainer = document.getElementById('logoDiv');
            if(!toggle){
				toggle = true;
                settings.classList.add('class','invert');
                darkMode.classList.add('class','invert');
				ldBody.classList.add('class','dark');
                ldBody.classList.remove('class','light');
                for (i=0;i<ldCards.length;i++) {
                    ldCards[i].classList.add('class','light');
                    ldCards[i].classList.remove('class','dark');
                }
                $('#logoDiv').children().remove();
                var changeLogo = document.createElement('img');
                changeLogo.setAttribute('class','svgLogo');
                changeLogo.setAttribute('src',"assets/img/logo dark.png");
                logoContainer.appendChild(changeLogo);
			}else{
				toggle= false;
                settings.classList.remove('class','invert');
                darkMode.classList.remove('class','invert');
				ldBody.classList.add('class','light');
                ldBody.classList.remove('class','dark');
                for (i=0;i<ldCards.length;i++) {
                    ldCards[i].classList.add('class','dark');
                    ldCards[i].classList.remove('class','light');
                }
                $('#logoDiv').children().remove();
                changeLogo = document.createElement('img');
                changeLogo.setAttribute('class','svgLogo');
                changeLogo.setAttribute('src',"assets/img/logo light.png");
                logoContainer.appendChild(changeLogo);
			}
			
		});

        window.addEventListener('load',
        function() {
            if(!localStorage.getItem('gaming')) {
            $('#settings').modal({
                fadeDuration: 1000,
                fadeDelay: 0.50
            });
            }
            
        });
        var newsVideo = document.getElementById('newsVideo');
        var videoGraphic = document.getElementById('videoGraphic');       
        var musicGraphic = document.getElementById('musicGraphic');
        var news = document.getElementById('news');
        var music = document.getElementById('music');
        var video = document.getElementById('video');
        document.getElementById("news").addEventListener("mouseover", function() {
            newsVideo.classList.remove('class','fadeOut');
            news.classList.remove('class','fadein');
            newsVideo.classList.remove('class','hidden');
            newsVideo.classList.add('class','fadeIn');
            video.classList.add('class','fadeOut');
            music.classList.add('class','fadeOut');
            newsVideo.play();
        });
        
        document.getElementById("news").addEventListener("mouseleave", function() {
            newsVideo.classList.add('class','fadeOut');
            video.classList.remove('class','fadeOut');
            music.classList.remove('class','fadeOut');
            video.classList.add('class','fadeIn');
            music.classList.add('class','fadeIn');
            newsVideo.pause();
            
        });

        document.getElementById("video").addEventListener("mouseover", function() {
            videoGraphic.classList.remove('class','fadeOut');
            video.classList.remove('class','fadein');
            videoGraphic.classList.remove('class','hidden');
            videoGraphic.classList.add('class','fadeIn');
            news.classList.add('class','fadeOut');
            music.classList.add('class','fadeOut');
            videoGraphic.play();
        });
        
        document.getElementById("video").addEventListener("mouseleave", function() {
            videoGraphic.classList.add('class','fadeOut');
            news.classList.remove('class','fadeOut');
            music.classList.remove('class','fadeOut');
            news.classList.add('class','fadeIn');
            music.classList.add('class','fadeIn');
            videoGraphic.pause();

        });

        document.getElementById("music").addEventListener("mouseover", function() {
            musicGraphic.classList.remove('class','fadeOut');
            music.classList.remove('class','fadein');
            musicGraphic.classList.remove('class','hidden');
            musicGraphic.classList.add('class','fadeIn');
            video.classList.add('class','fadeOut');
            news.classList.add('class','fadeOut');
            musicGraphic.play();
        });
        
        document.getElementById("music").addEventListener("mouseleave", function() {
            musicGraphic.classList.add('class','fadeOut');
            video.classList.remove('class','fadeOut');
            news.classList.remove('class','fadeOut');
            news.classList.add('class','fadeIn');
            video.classList.add('class','fadeIn');
            musicGraphic.pause();
        });

        settings.addEventListener('click',function() {
            $('#settings').modal({
                fadeDuration: 1000,
                fadeDelay: 0.50
            });
        })

        video.addEventListener('click',function() {
            // video.classList.add('class','hidden');
            // music.classList.add('class','hidden');
            // news.classList.add('class','hidden');
            document.querySelector('.mainButtons').classList.add('class','hidden');
            // document.querySelector('video-container').classList.remove('class','hidden');
            
        })

        music.addEventListener('click',function() {
            // unhide the music panels
            //$('.music').removeClass('hidden');
            displayDevices();
            $('#selectSpotifyPlayer').modal({
                fadeDuration: 1000,
                fadeDelay: 0.50
            });
        })
        //onload
        $( function() {
            $( "#tabs" ).tabs();
          } );
        
          checkAndRedirectAPIKeys();