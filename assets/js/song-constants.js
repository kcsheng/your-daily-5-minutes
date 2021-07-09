
// Vars for where we are storing authorization tokens in local storage
const LS_USR_ACCESS_TOKEN = 'ydfmSpotifyUserAccessToken'; // access token used for user driven Spotify API Requests
const LS_USR_REFRESH_TOKEN = 'ydfmSpotifyUserRefreshToken'; // refresh token used for to regenerate User Access Tokens
const LS_CLIENT_ACCESS_TOKEN = 'ydfmSpotifyClientAccessToken'; // access token used for user driven Spotify API Requests
const LS_REDIRECT_URI = 'ydfmSpotifyRedirectURI'; // access token used for user driven Spotify API Requests
const LS_SONG_PREF_REC_SEED = 'ydfmSpotifyRecSeedArtistTrack';
const LS_SPOTIFY_API_KEY_B64 = 'SpotifyAPIKeyBase64';

const SPOTIFY_AUTH_REDIRECT_PAGE = 'complete-spotify-auth.html'; // page that handles the redirect for spotify authorization
const SPOTIFY_ICON_LOCATION = './assets/img/spotify/Spotify_Icon_CMYK_Green.png' // location for spotify image
const SPOTIFY_NO_PLAYER = 0;
const SPOTIFY_WEB_PLAYER = 1;
const SPOTIFY_REMOTE_PLAYER = 2;
const SPOTIFY_WEB_PLAYER_DEVICE_NAME = 'Your Daily 5 [Web Player]';
const SPOTIFY_USER_AUTH_PERMISSIONS = 'streaming%20user-read-private%20user-read-email%20user-read-playback-state';

const FA_PLAY_ICON = 'fa-play-circle';
const FA_PAUSE_ICON = 'fa-pause-circle';