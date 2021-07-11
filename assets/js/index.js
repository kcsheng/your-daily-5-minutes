const moonPath = "M38 19C38 29.4934 29.4934 38 19 38C8.50659 38 0 29.4934 0 19C0 8.50659 8.50659 0 19 0C29.4934 0 38 8.50659 38 19Z";
const sunPath = "M11 19C11 29.4934 19.5 38.9936 19.5 38.9936C9.00659 38.9936 0.5 30.487 0.5 19.9936C0.5 9.50015 9.00659 0.99356 19.5 0.99356C19.5 -0.00645276 11 8.50659 11 19Z";

const darkMode = document.querySelector("#dark_mode");

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

const menu = document.getElementById('menuIcon');
let toggle = false;
var ldBody = document.getElementById('ldChange');
var ldCards = document.getElementsByClassName('cards');
var changeLogo = $('#ydfmLogo');
var path = document.getElementById('path');
let wave = new Wave();

if(localStorage.getItem('ldMode')=='dark') {
    dark();
    path.setAttribute('d','M11 19C11 29.4934 19.5 38.9936 19.5 38.9936C9.00659 38.9936 0.5 30.487 0.5 19.9936C0.5 9.50015 9.00659 0.99356 19.5 0.99356C19.5 -0.00645276 11 8.50659 11 19Z')
}

if(localStorage.getItem('ldMode')=='light') {
    light();
    path.setAttribute('d','M38 19C38 29.4934 29.4934 38 19 38C8.50659 38 0 29.4934 0 19C0 8.50659 8.50659 0 19 0C29.4934 0 38 8.50659 38 19Z')
}

function reload() {
    location.reload();
}

function mtt() {
    document.getElementById('mainContent').setAttribute('class','hidden');
    document.getElementById('ydfmLogo').setAttribute('class','hidden');
    document.getElementsByClassName('.mtt')
    document.querySelector('.mtt').classList.remove('class','hidden');
    document.querySelector('.mtt').classList.add('class','container-text');
    // $('.mtt').removeAttr('class','hidden');
    // $('.mtt').attr('class','container-text');
}

function dark() {
    toggle = true;
                menu.classList.add('class','invert');
                darkMode.classList.add('class','invert');
                localStorage.setItem('ldMode','dark');
				ldBody.classList.add('class','dark');
                ldBody.classList.remove('class','light');
                for (i=0;i<ldCards.length;i++) {
                    ldCards[i].classList.add('class','light');
                    ldCards[i].classList.remove('class','dark');
                }
                changeLogo.attr('src',"assets/img/logo dark.png");
}

function light() {
    toggle= false;
                menu.classList.remove('class','invert');
                darkMode.classList.remove('class','invert');
                localStorage.setItem('ldMode','light');
				ldBody.classList.add('class','light');
                ldBody.classList.remove('class','dark');
                for (i=0;i<ldCards.length;i++) {
                    ldCards[i].classList.add('class','dark');
                    ldCards[i].classList.remove('class','light');
                }
                changeLogo.attr('src',"assets/img/logo light.png");

}

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
            if(!toggle){
                dark();

			}else{
				light();
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

        function settings() {
            $('#settings').modal({
                fadeDuration: 1000,
                fadeDelay: 0.50
            });
        }

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

        
        function openNav() {
            document.getElementById("mySidenav").style.width = "250px";
            };

        
        menuIcon = document.getElementById('menuIcon')
        menuIcon.addEventListener('click',function() {
            openNav();
        });

        $( function() {
            $( "#tabs" ).tabs();
            checkAndRedirectAPIKeys();
          } );
          


        function closeNav() {
            document.getElementById("mySidenav").style.width = "0";
            };


        var suvaImg = document.getElementById('suva');
        var ronImg = document.getElementById('ron');
        var kcImg = document.getElementById('kc');
        var tikaImg = document.getElementById('tika');
        suvaImg.addEventListener('mouseover', function() {
            suvaImg.setAttribute('src',"assets/img/suvatest.png");
            suvaImg.classList.add('class','photoCardEnlargen');
            suvaImg.classList.remove('class','photoCardSmallen');
            suvaImg.classList.add('class','removeBorder');
        }) 
        suvaImg.addEventListener('mouseleave', function() {
            suvaImg.setAttribute('src',"assets/img/suva.jpg");
            suvaImg.classList.add('class','photoCardSmallen');
            suvaImg.classList.remove('class','photoCardEnlargen');

        })

        ronImg.addEventListener('mouseover', function() {
            ronImg.setAttribute('src',"assets/img/rontest.png");
            ronImg.classList.add('class','photoCardEnlargen');
            ronImg.classList.remove('class','photoCardSmallen');
        }) 
        ronImg.addEventListener('mouseleave', function() {
            ronImg.setAttribute('src',"assets/img/ron.jpg");
            ronImg.classList.add('class','photoCardSmallen');
            ronImg.classList.remove('class','photoCardEnlargen');

        })

        kcImg.addEventListener('mouseover', function() {
            kcImg.setAttribute('src',"assets/img/kctest.png");
            kcImg.classList.add('class','photoCardEnlargen');
            kcImg.classList.remove('class','photoCardSmallen');
        }) 
        kcImg.addEventListener('mouseleave', function() {
            kcImg.setAttribute('src',"assets/img/KC.png");
            kcImg.classList.add('class','photoCardSmallen');
            kcImg.classList.remove('class','photoCardEnlargen');

        })

        
        tikaImg.addEventListener('mouseover', function() {
            tikaImg.setAttribute('src',"assets/img/tikatest.png");
            tikaImg.classList.add('class','photoCardEnlargen');
            tikaImg.classList.remove('class','photoCardSmallen');
        }) 
        tikaImg.addEventListener('mouseleave', function() {
            tikaImg.setAttribute('src',"assets/img/tika.jpg");
            tikaImg.classList.add('class','photoCardSmallen');
            tikaImg.classList.remove('class','photoCardEnlargen');

        })

        

        
