// Important note: For the purpose of the technologies
// usable in the project we are using local storage
// and javascript call outs when handling Auth tokens
// and Private Key API calls to spotify
// In a production build, these would be stored in back-end
// services, as to not expose PK and Auth Token info to the public
var is_authorized_preimum = false;
var spotify_sdk_ready = false;

var song_recommendations = [];

var player_ready = false;
var remote_player_device_id; // device ID of remote player
var playback_type = SPOTIFY_NO_PLAYER;

var web_player; // spotify player object


var access_token_valid = false; // tracks when to refresh access token


// virtual player object to handle actions if remote player or web player
var v_player = {
    web_player_device_id: null,
    remote_player_device_id: null,
    playback_type: playback_type,
    no_toggle: false,
    togglePlay: async function(){
        switch(this.playback_type){
            case SPOTIFY_WEB_PLAYER:
                return await web_player.togglePlay();
                break;
            case SPOTIFY_REMOTE_PLAYER:
                // get remote player playback info
                await refreshToken();
                var playback =  await fetchAndRetry(`https://api.spotify.com/v1/me/player?device_id=${this.remote_player_device_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + localStorage.getItem(LS_USR_ACCESS_TOKEN),
                    },
                }, true);
                var data = await playback.json();

                // check if playing
                if(!data.is_playing){
                    //resume
                    await refreshToken();
                    await fetchAndRetry(`https://api.spotify.com/v1/me/player/play?device_id=${this.remote_player_device_id}`, {
                        method: 'PUT',
                        body: JSON.stringify({}),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem(LS_USR_ACCESS_TOKEN)
                        },
                    },true);
                } else {
                    //pause
                    await refreshToken();
                    await fetchAndRetry(`https://api.spotify.com/v1/me/player/pause?device_id=${this.remote_player_device_id}`, {
                        method: 'PUT',
                        body: JSON.stringify({}),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem(LS_USR_ACCESS_TOKEN)
                        },
                    }, true);
                }
                break;
        }
        v_player.no_toggle = false;
    },
    getCurrentState: async function(){
        switch(this.playback_type){
            case SPOTIFY_WEB_PLAYER:
                return web_player.getCurrentState();
                break;
            case SPOTIFY_REMOTE_PLAYER:
                // get remote player playback info
                await refreshToken();
                var playback =  await fetchAndRetry(`https://api.spotify.com/v1/me/player?device_id=${this.remote_player_device_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + localStorage.getItem(LS_USR_ACCESS_TOKEN),
                    },
                }, true);
                var data = null;
                try{
                    data = await playback.json();
                } catch{}
//                console.log('data', data)
                if(data && data.hasOwnProperty('item') && data.item &&
                    data.item.hasOwnProperty('uri'))
                     return {track_window: {current_track: {uri: data.item.uri} }, paused: !data.is_playing}
                
                return null;
                break;

        }
    },
    setVolume: async function(vol){
        switch(this.playback_type){
            case SPOTIFY_WEB_PLAYER:
                web_player.setVolume(vol);
                break;
            case SPOTIFY_REMOTE_PLAYER:
                await refreshToken();
                fetchAndRetry(`https://api.spotify.com/v1/me/player/volume?device_id=${this.remote_player_device_id}&volume_percent=${Math.round(vol*100)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem(LS_USR_ACCESS_TOKEN)
                    },
                }, true);
                break;
        }
    },
    resume: async function(){
        switch(this.playback_type){
            case SPOTIFY_WEB_PLAYER:
                web_player.resume();
                break;
            case SPOTIFY_REMOTE_PLAYER:
                // get remote player playback info
                await refreshToken();
                var playback =  await fetchAndRetry(`https://api.spotify.com/v1/me/player?device_id=${this.remote_player_device_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + localStorage.getItem(LS_USR_ACCESS_TOKEN),
                    },
                }, true);
                var data = await playback.json();

                // if remote player is not playing
                if(!data.is_playing){
                    //resume playing
                    await refreshToken();
                    fetchAndRetry(`https://api.spotify.com/v1/me/player/play?device_id=${this.remote_player_device_id}`, {
                        method: 'PUT',
                        body: JSON.stringify({}),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem(LS_USR_ACCESS_TOKEN)
                        },
                    }, true);
                }
        }
    },
    pause: async function(){
        switch(this.playback_type){
            case SPOTIFY_WEB_PLAYER:
                web_player.pause();
                break;
            case SPOTIFY_REMOTE_PLAYER:
                // get remote player playback info
                await refreshToken();
                var playback =  await fetchAndRetry(`https://api.spotify.com/v1/me/player?device_id=${this.remote_player_device_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + localStorage.getItem(LS_USR_ACCESS_TOKEN),
                    },
                }, true);
                var data = await playback.json();

                // if remote player is playing
                if(data.is_playing){
                    //pause
                    await refreshToken();
                    fetchAndRetry(`https://api.spotify.com/v1/me/player/pause?device_id=${this.remote_player_device_id}`, {
                        method: 'PUT',
                        body: JSON.stringify({}),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem(LS_USR_ACCESS_TOKEN)
                        },
                    }, true);
                }
                break;
        }
    },
    play: async function(spotify_uri){
        var device_id = null;
        var bearer = null;
        switch(this.playback_type){
            case SPOTIFY_WEB_PLAYER:
                device_id = this.web_player_device_id;
                bearer = web_player._options.getOAuthToken;
                break;
            case SPOTIFY_REMOTE_PLAYER:
                device_id = this.remote_player_device_id;
                bearer = localStorage.getItem(LS_USR_ACCESS_TOKEN);
                break;
        }
        await refreshToken();
        fetchAndRetry(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotify_uri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem(LS_USR_ACCESS_TOKEN)
            },
        }, true);
        v_player.no_toggle = false;
    }
    
}


// variable to resume/pause if playing previously played
// to be used when loading videos or where the song needs to be paused temporarily
var was_playing_to_resume = false;

async function pauseIfPlaying(){
    var state = await v_player.getCurrentState();
    if(state &&state.hasOwnProperty('paused') && !state.paused){
        was_playing_to_resume = true;
        v_player.pause();
    }
    $(".music").css("pointer-events", "none");
}

async function resumeIfPlaying(){
    if(was_playing_to_resume){
        v_player.resume();
        showSongFeature();
        was_playing_to_resume = false;
    }
    $(".music").css("pointer-events", "auto");
}

var unmute_vol = 0;
async function toggleMute(){
    if($('.song-volume').slider('value') > 0){
        unmute_vol = $('.song-volume').slider('value');
        $('.song-volume').slider('value', 0);
        v_player.setVolume(0);
    } else {
        if(unmute_vol == 0)
            unmute_vol = 2;
        $('.song-volume').slider('value', unmute_vol);
        v_player.setVolume(unmute_vol/100);
    }
}

// update variable when spotify sdk is ready
window.onSpotifyWebPlaybackSDKReady = () => {
    spotify_sdk_ready = true;
}

initSongs();

async function initSongs() {

    initSongPreferences();
    // try load the player
    initAuthorizedFeatures();

    await getSpotifyClientCredentials()
    //refresh Token every hour
    setInterval(getSpotifyClientCredentials, 1000 * 60 * 60);


    // set handlers for next/previous
    $(document).on('click', '.next-song', function (e) {
        e.preventDefault();
        nextSong();
    });

    $(document).on('click', '.prev-song', function (e) {
        e.preventDefault();
        prevSong();
    });
}

var auth_listener_enabled = false;
function enableAuthListener(){
    if(!auth_listener_enabled){
        auth_listener_enabled = true;
        $(window).on('storage.authlistener', ev =>{
//            console.log('storage even fired', ev)
            if(ev.originalEvent.key != LS_USR_ACCESS_TOKEN && ev.originalEvent.key != LS_USR_REFRESH_TOKEN)
                return;
//            console.log('retrying auth');
            initAuthorizedFeatures();
        });
    }
}

function disableAuthListner(){
    if(auth_listener_enabled)
        $('window').off('storage.authlistener');
}

// function to attempt loading the Spotify Web Player
async function initAuthorizedFeatures() {
    // check if the user is authorized

    if (!isAuthorized()) {
        //if not authorized
        // display functionality to connect spotify premium
        showConnectSpotify();
        enableAuthListener();
    } else {
        // if authorized
        disableAuthListner();
        hideAuthorizeSpotify();

        // check if they have premium
        var isPremiumUser = await isPremium();
//        console.log('isPremium()', isPremiumUser);
        if (!isPremiumUser) {
            // if not premium, don't load the player
            // display any notifications regarding basic accounts not supported
            // for player functionality
            //showNotPremium();
        } else {
            // if premium try load the player
            is_authorized_preimum = true;
            loadPlayer();

        }

        // set listener for play buttons
        $(document).on('click', '.play-song', function (e) {
            e.preventDefault();
//            console.log('event fired')
            if(player_ready)
                playSong($(this).val());
        });
    }

    // load Song Recommendations
    generateSongRecommendations();

}

const play = ({
    spotify_uri,
    playerInstance: {
        _options: {
            getOAuthToken,
        }
    }
}) => {
    getOAuthToken(access_token => {
        fetchAndRetry(`https://api.spotify.com/v1/me/player/play?device_id=${player_device_id}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotify_uri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
        });
    });
};


async function playSong(play_uri) {
    var state = await v_player.getCurrentState();
    var alreadyPlaying = false;
    if (state === null)
        alreadyPlaying = false;
    else if (state.track_window.current_track.uri == play_uri)
        alreadyPlaying = true;
    if (!alreadyPlaying || v_player.no_toggle) {
//        console.log('playing ' + play_uri);
        v_player.play(play_uri);
        togglePlayPauseIcon(FA_PAUSE_ICON);
    } else {
        togglePlaySong();
    }
}


async function generateSongRecommendations() {
    var sArtists = "";
    var sGenre = "";
    var sTracks = "";
    $('.spotify-pref').val().forEach(val => {
        switch (val.split("-")[0].toLowerCase()) {
            case 'artist':
                if (sArtists === "")
                    sArtists = "&seed_artists=" + val.split("-")[1];
                else
                    sArtists += "," + val.split("-")[1];
                break;
            case 'track':
                if (sTracks === "")
                    sTracks = "&seed_tracks=" + val.split("-")[1];
                else
                    sTracks += "," + val.split("-")[1];
                break;
            case 'genre':
                if (sGenre === "")
                    sGenre = "&seed_genres=" + val.split("-")[1];
                else
                    sGenre += "," + val.split("-")[1];
                break;

        }
    })
    // returns array of {label: "Spotify Object Name [Type]", value: "<Spotify Type>-spotify object ID"}
    var bearer = 'Bearer ' + await getSpotifyClientCredentials();
    var qString = sArtists + sTracks + sGenre;

    //if recommendation settings filled out, generate the list
    if(qString != ""){
        $('#song-pref-error').text('');
        var response = await fetchAndRetry(`https://api.spotify.com/v1/recommendations?market=AU&limit=15&max_duration_ms=300000${qString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': bearer
            },
        });

        var data = {};
        if (response.ok)
            data = await response.json()

        $('#song-rec').empty();
        var hidden = false;
        // go through returned tracks
        data.tracks.forEach((track) => {
            displaySong(track, hidden);
            hidden = true; // only show the first song
        });
    } 
}

function displaySong(track, isHidden) {

    var title = track.name;
    var artists = "";
    //process artists
    track.artists.forEach((artist) => {
        if (!(artists === ""))
            artists += ", ";
        artists += artist.name;
    });
    var album = track.album.name;
    var album_image_url = track.album.images[2].url;
    // spotify doesn't provide any alt text
    // so no descriptive text can be added.
    var album_image_alt = `${track.album.name} album art`;
    var open_link = track.external_urls.spotify;
    var play_uri = track.uri;

    const elLi = $('<li>');
    const elTitle = $('<h3>');
    const elArtists = $('<h5>');
    const elAlbum = $('<h4>');
    const linkOpen = $('<a class="spotify-open" target=”_blank”>');
    const btnPlay = $('<button>');
    const playIcon = $('<i class="fa" aria-hidden="true"></i>');

    const divSongContainer = $('<div class="song-container">');
    const elImage = $(`<img class="song-image" src="${album_image_url}">`);
    const divSongDetails = $('<div class="song-details">');
    const divPlayerControls = $('<div class="song-controls">');
    const elSpotifyLogo = $(`<img class="spotify-logo" src="${SPOTIFY_ICON_LOCATION}">`)
    const spanSpotifyOpen = $('<span>');

    elTitle.text(title);
    elAlbum.text(album);
    elArtists.text(artists);
    elImage.attr('alt', album_image_alt);

    linkOpen.attr('href', open_link);
    spanSpotifyOpen.text('PLAY ON SPOTIFY');
    //linkPlay.text('[Play Song]');
    btnPlay.append(playIcon);
    btnPlay.addClass('play-song');
    playIcon.addClass(FA_PLAY_ICON);
    btnPlay.val(play_uri);
    elLi.addClass('song');
    if (isHidden)
        elLi.addClass('song-hidden');
    else
        elLi.addClass('song-current');
    divSongDetails.append(elTitle);
    divSongDetails.append(elAlbum);
    divSongDetails.append(elArtists);
    linkOpen.append(elSpotifyLogo);
    linkOpen.append(spanSpotifyOpen);
    divSongDetails.append(linkOpen);
    divPlayerControls.append(btnPlay);
    divSongContainer.append(elImage);
    divSongContainer.append(divSongDetails);
    elLi.append(divSongContainer);
    elLi.append(divPlayerControls);

    $('#song-rec').append(elLi);

}

function initSongPreferences() {
    $(".song-is-authorized").show();

    // load the pillbox for saving artist and track recommendations
    $("select.spotify-pref").select2({
        placeholder: 'Select up to five artists or songs to base recommendations on...',
        maximumSelectionLength: 5,
        ajax: {
            url: "https://api.spotify.com/v1/search",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term, // search term
                    type: "album,track,artist",
                    limit: 5,
                };
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": 'Bearer ' + localStorage.getItem(LS_CLIENT_ACCESS_TOKEN)
            },
            processResults: function (data, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data, except to indicate that infinite
                // scrolling can be used

                var returnList = [];
                if (data.hasOwnProperty('artists'))
                    returnList = returnList.concat({ "text": "Artists", "children": processSearchType(data['artists']["items"]) });
                if (data.hasOwnProperty('albums'))
                    returnList = returnList.concat({ "text": "Albums", "children": processSearchType(data['albums']["items"]) });
                if (data.hasOwnProperty('tracks'))
                    returnList = returnList.concat({ "text": "Tracks", "children": processSearchType(data['tracks']["items"]) });
                if (returnList.length === 0)
                    returnList = [];
//                console.log(returnList);
                var returnSearchResults = { "results": returnList }
                return returnSearchResults;

                //   params.page = params.page || 1;
                //   return {
                //     results: data.items,
                //     pagination: {
                //       more: (params.page * 30) < data.total_count
                //     }
                //   };
            },
            cache: true
        },
        minimumInputLength: 1
    });

    // load previously saved preferences
    loadSongPref();
}

function processSearchType(arr) {
    var retArray = [];
    arr.forEach(obj => {
        // return a list of labels and values for a given array of spotify objects
        retArray.push({ text: `${obj.name}`, id: `${obj.type}-${obj.id}` });
    })
//    console.log(retArray);
    return retArray;
}

// function to check if user has Authorized the app to their spotify account
function isAuthorized() {
//    console.log('LS_USR_ACCESS_TOKEN===', LS_USR_ACCESS_TOKEN)
    if (localStorage.getItem(LS_USR_ACCESS_TOKEN) === null || localStorage.getItem(LS_USR_ACCESS_TOKEN) === 'undefined') {
        is_authorized_preimum = false;
        return false;
    }
    // assume if an access token exists the user has authorized spotify
    return true;
}

// function to check if spotify user is premium
async function isPremium() {
    // refresh the user token
    await refreshToken();

    // make api call to check user details
    var response = await fetchAndRetry(`https://api.spotify.com/v1/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + localStorage.getItem(LS_USR_ACCESS_TOKEN),
        },
    }, true);
    var data = await response.json();

    //check if the user is a premium user
    if (data.hasOwnProperty('product') && data['product'] === 'premium') {
        spotify_user_premium = true;
        return true;
    }
    return false;
}

async function refreshToken() {
    // in any production implementation we would call a webservice endpoint on our end that
    // makes this call server to server.
    // for the purpose of this assignment we will just be making the call from the client
    // NOT recommended in production because it exposes the Cient Secret
    if(!access_token_valid)
    {
        var refresh_token = localStorage.getItem(LS_USR_REFRESH_TOKEN)
        var response = await fetchAndRetry(`https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${refresh_token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'basic ' + localStorage.getItem(LS_SPOTIFY_API_KEY_B64)
            },
        });
        var data = await response.json();
    //    console.log('data', data)
        localStorage.setItem(LS_USR_ACCESS_TOKEN, data['access_token']);
        if (data.hasOwnProperty('refresh_token'))
            localStorage.setItem(LS_USR_REFRESH_TOKEN, data['refresh_token']);
        if (data.hasOwnProperty('expires_in'))
        {
            access_token_valid = true;
            setTimeout(()=>{access_token_valid = false;}, (data.expires_in) * 1000)
        }
    }
}

function showConnectSpotify() {
    // display elements for connecting spotify
    //$(".song-is-authorized").hide();
    $(".song-not-authorized").show();
}

function hideAuthorizeSpotify() {
    $(".song-not-authorized").hide();
    $(".song-is-authorized").show();
}


function loadPlayer() {
    if (!spotify_sdk_ready) {
        // if sdk is not ready, retry later
        setTimeout(loadPlayer, 500);
    } else if (localStorage.getItem(LS_USR_ACCESS_TOKEN)) {
        //if ready
        if (spotify_user_premium) {
            refreshToken().then(() => {
                const token = localStorage.getItem(LS_USR_ACCESS_TOKEN);
                web_player = new Spotify.Player({
                    name: SPOTIFY_WEB_PLAYER_DEVICE_NAME,
                    getOAuthToken: cb => { cb(token); }
                });

                // Error handling
                web_player.addListener('initialization_error', ({ message }) => { console.error(message); });
                web_player.addListener('authentication_error', ({ message }) => { console.error(message); });
                web_player.addListener('account_error', ({ message }) => { console.error(message); });
                web_player.addListener('playback_error', ({ message }) => { console.error(message); });

                // Playback status updates
                web_player.addListener('player_state_changed', state => {
//                    console.log(state);
                });

                // Ready
                web_player.addListener('ready', ({ device_id }) => {
                    player_device_id = device_id;
                    v_player.web_player_device_id = device_id;
                    player_ready = true;

                    console.log('Ready with Device ID', device_id);
                    //show web player
                    $('.web-player-option').show();
                    //hide upgrade text
                    $('.spotify-basic-text').hide();
                    loadVolume();

                });

                // Not Ready
                web_player.addListener('not_ready', ({ device_id }) => {
                    player_device_id = '';
                    player_ready = false;
                    console.log('Device ID has gone offline', device_id);
                });

                // Connect to the player!
                web_player.connect();
            });
        }
    }
};

async function getSpotifyClientCredentials() {
    // note this should be a call to a back-end service to return this, not a front end call
    // as the client secret should not be exposed in a production site
    const response = await fetchAndRetry(`https://accounts.spotify.com/api/token?grant_type=client_credentials`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'basic ' + localStorage.getItem(LS_SPOTIFY_API_KEY_B64)
        },
    });
    const data = await response.json();
    localStorage.setItem(LS_CLIENT_ACCESS_TOKEN, data['access_token'])
    return data['access_token'];
}

function authorizeSpotifyUser(client_id, redirect_page, scope) {


    var redirect_uri = encodeURIComponent(window.location.href.split('/').slice(0, 3).join('/') + window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/')+1) + redirect_page);

    // store the location in local storage, this is used when getting the access token
    localStorage.setItem(LS_REDIRECT_URI, redirect_uri)
    return `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}`;

}

function linkSpotifyAccount() {
    window.open(authorizeSpotifyUser('f0fa3301c65247f591f757f288d71e01', SPOTIFY_AUTH_REDIRECT_PAGE, SPOTIFY_USER_AUTH_PERMISSIONS));
}

function saveSongPref() {
    var seed_data = $("select.spotify-pref").select2('data');
    localStorage.setItem(LS_SONG_PREF_REC_SEED, JSON.stringify(seed_data));
    // also regenerate song recommendations
    generateSongRecommendations();
}

// loads song preferences from local storage
function loadSongPref() {
    if (!(localStorage.getItem(LS_SONG_PREF_REC_SEED) === null || localStorage.getItem(LS_SONG_PREF_REC_SEED) === 'undefined')) {
        var options = JSON.parse(localStorage.getItem(LS_SONG_PREF_REC_SEED));
        var selectBox = $("select.spotify-pref");
        options.forEach((option) => {
            var option = new Option(option.text, option.id, true, true);
            selectBox.append(option).trigger('change');
            selectBox.trigger({ type: 'select2:select', params: { data: option } });
        })
    }
}

function loadVolume() {
    console.log('loading volume slider')
    v_player.setVolume(.75);
    $('.song-volume').slider({
        value: 75,
        step: 1,
        range: 'min',
        min: 0,
        max: 100,
        slide: function () {
            handleVolumeChange();
        },
        stop: function(){
            handleVolumeChange();
        }
    });
    $('#volume-icon').on('click.togglemute', () => {
        toggleMute();
    })

}

function handleVolumeChange(){
    var value = $(".song-volume").slider("value");
    v_player.setVolume(value / 100);
    console.log(value)
    if(value > 50){
        $('#volume-icon').removeClass();
        $('#volume-icon').addClass('fa fa-volume-up');
    } else if (value > 0){
        $('#volume-icon').removeClass();
        $('#volume-icon').addClass('fa fa-volume-down');
    } else {
        $('#volume-icon').removeClass();
        $('#volume-icon').addClass('fa fa-volume-off');
    }
}

// toggle pause/play of the song on the player
async function togglePlaySong() {
    
    await v_player.togglePlay().then(setTimeout(async () => {
        // site a timeout to account for the time it takes to transition state from pause to resume
        var state = await v_player.getCurrentState();
        console.log('state playpause',state)
        if(state.hasOwnProperty('paused') && !state.paused){
            console.log('Playing');
            togglePlayPauseIcon(FA_PAUSE_ICON);
        } else {
            console.log('Paused');
            // assume to show play icon if state comes back unpaused
            // or if it errors (due to lack of any other handling)
            togglePlayPauseIcon(FA_PLAY_ICON);
        }
    },600));

    

}

function togglePlayPauseIcon(type) {
    var iconPlay = $('.song-current .song-controls .play-song').children('i');
    if (type) {
        if (type == FA_PLAY_ICON) {
            iconPlay.removeClass(FA_PAUSE_ICON);
            iconPlay.addClass(FA_PLAY_ICON);
        } else {
            iconPlay.removeClass(FA_PLAY_ICON);
            iconPlay.addClass(FA_PAUSE_ICON);
        }

    } else if (iconPlay.hasClass(FA_PLAY_ICON)) {
        iconPlay.removeClass(FA_PLAY_ICON);
        iconPlay.addClass(FA_PAUSE_ICON);
    } else {
        iconPlay.removeClass(FA_PAUSE_ICON);
        iconPlay.addClass(FA_PLAY_ICON);
    }

    // set all other icons to play
    var otherPlay = $('.song-hidden .song-controls .play-song').children('i');
    otherPlay.removeClass(FA_PAUSE_ICON);
    otherPlay.addClass(FA_PLAY_ICON);
}

function nextSong() {
    // get the next item in li
    var currSong = $('.song-current');
    var nextSong = currSong.next();
    if (nextSong.length == 0) {
        // if nextSong is empty loop to the beginning
        nextSong = $('.song').first();
    }
    currSong.removeClass('song-current');
    currSong.addClass('song-hidden');
    nextSong.removeClass('song-hidden');
    nextSong.addClass('song-current');
}

function prevSong() {
    // get the next item in li
    var currSong = $('.song-current');
    var prevSong = currSong.prev();
    if (prevSong.length == 0) {
        // if nextSong is empty loop to the beginning
        prevSong = $('.song').last();
    }
    currSong.removeClass('song-current');
    currSong.addClass('song-hidden');
    prevSong.removeClass('song-hidden');
    prevSong.addClass('song-current');
}

// get list of devices to play music on
async function getSpotifyDevices(){
    refreshToken();
    var response = await fetchAndRetry(`https://api.spotify.com/v1/me/player/devices`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + localStorage.getItem(LS_USR_ACCESS_TOKEN),
        },
    }, true);
    var data = await response.json();

    //check if the user is a premium user
    if (data.hasOwnProperty('devices')) {
        return data.devices;
    }
    return [];
}

function displayDevices(){
    if($('.spotify-pref').val().length < 1){
        // open the settings modal
        $('#settings').modal({
            fadeDuration: 1000,
            fadeDelay: 0.50
        });
        $('#tabs-3').tabs('show');
        $('#song-pref-error').text('You must provide at least one song or artist');

    } else if(is_authorized_preimum){
        // if premium
        // show web player
        $('.web-player-option').show();
        //hide upgrade text
        $('.spotify-basic-text').hide();
        // clear current list of remote devices
        $('.spotify-remote-device').remove();
        $('.spotify-remote-device-heading').remove();
        getSpotifyDevices().then((devices) => {
            var deviceExists = false;
            // append to list
            devices.forEach(device => {
                // don't include our own web player
                if(device.name !== SPOTIFY_WEB_PLAYER_DEVICE_NAME ){
                    if(!deviceExists){
                        $('.spotify-devices').append($('<li class="player-select-heading spotify-remote-device-heading">Other Devices</li>'));
                        deviceExists = true;
                    }
                    var liDevice = $(`<li class="spotify-remote-device device-option" onClick="selectPlayer(SPOTIFY_REMOTE_PLAYER, '${device.id}');" rel="modal:close">`);
                    liDevice.text(`${device.name} [${device.type}]`);
                    $('.spotify-devices').append(liDevice);
                }
            })
        });
    } else {
        //hide webplayer option
        $('.spotify-basic-text').show();
        $('.web-player-option').hide();
    }
}

function showSongFeature(){
    $('.music').removeClass('hidden');
}

function hideSongFeature(){
    $('.music').addClass('hidden'); 
}

async function selectPlayer(type, device_id){
    playback_type = type;
    switch(type){
        case SPOTIFY_NO_PLAYER:
            disablePlayback();
            var state = await v_player.getCurrentState();
            if(state &&state.hasOwnProperty('paused') && !state.paused){
                v_player.pause();
                togglePlayPauseIcon(FA_PLAY_ICON);
            }
            break;
        case SPOTIFY_WEB_PLAYER:
            var state = await v_player.getCurrentState();
            if(!(
                v_player.playback_type == type) && 
                state &&state.hasOwnProperty('paused') &&  !state.paused
            ){
                v_player.pause();
                togglePlayPauseIcon(FA_PLAY_ICON);
            }
            enablePlayback();
            break;
        case SPOTIFY_REMOTE_PLAYER:
            var state = await v_player.getCurrentState();

            if(!(
                v_player.playback_type == type && 
                v_player.remote_player_device_id == device_id) && 
                state &&state.hasOwnProperty('paused') && !state.paused
            ){
                v_player.pause();
                togglePlayPauseIcon(FA_PLAY_ICON);
            }
            v_player.remote_player_device_id = device_id;
            v_player.no_toggle = true;
            enablePlayback();
            break;
    }

    v_player.playback_type = type;
    //close the current modal
    $.modal.close();
    //show the song feature
    showSongFeature();
}

function disablePlayback(){
    $('.volume-container').hide();
    $('.song-controls').hide();
}

function enablePlayback(){
    $('.volume-container').show();
    $('.song-controls').show();
}

// handle retry of API calls as Spotify intermittently sends erorrs
async function fetchAndRetry(url, option, doTokenRefresh = true, retries = 4, retried = false) {
    // try refresh client credentials on retry, just in case
    if(retried)
        await getSpotifyClientCredentials()
    
    if(doTokenRefresh && retried )
        await refreshToken();

    return fetch(url, option)
        .then(function(response) {
            if (response.ok) {
                return response;
            }else if (retries <= 0) {
                throw error;
            } else 
                return fetchAndRetry(url, option, refreshToken, retries - 1, true);
        });
}