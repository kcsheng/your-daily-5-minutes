## Your-Daily-5-Minutes

---

A responsive app for an individual who seeks 5 minute entertainment by a video, a song, fun facts or news headlines. Your daily 5 minutes is a collaborative project of four team members.

### Branding(Tagline)

---

![the slogan for daily 5 minutes](./assets/img/slogan.png)

### User Story

---

As a busy person who has some free time available now, I would like to be able to quickly find an entertainment option amongst media presented on a site when I take a break from my current work.

### Acceptance Criteria

---

- WHEN I first visit the site<br>
  THEN I am presented with a choice of videos, songs, fun facts or news<br>
  THEN I am presented with a list of interests that will filter my results.

- WHEN I click on the preferences buttons<br>
  THEN I can change my media type<br>
  THEN I can change my interests

- WHEN I select my selection of results<br>
  THEN I am presented with card previews of my entertainment results

- WHEN I view the youtube card<br>
  THEN I see a thumbnail of the top recommended video (5 min max) matching my preferences
- WHEN I click on Video result<br>
  THEN I am able to view a video (5 min max)

- WHEN I view the news card<br>
  THEN I see the preview of the top news headline matching my preferences

- WHEN I click on the news card<br>
  THEN I am able to view a list news article headlines

- WHEN I click on a headline<br>
  THEN I am able to read the news article for that headline

- WHEN I view the music card<br>
  THEN I am presented with the ability to preview the first song recommended song in a web playback

### Initial wireframes/ideas

---

![wireframe1 for the project](./assets/img/wireframe1.png)

![wireframe2 for the project](./assets/img/wireframe2.png)

### Plan refinement

---

In the course of the app development, we have decided to remove the fun fact feature, as its value in substantiating our app is much lower than news, music and video.

### Media access instructions

---

As a frontend app without the backend support, to protect API keys and or auth tokens from exposing to the public, we utilise local storage.

- Music:
  You will need to generate a spotify API key to enable the Music functionality. In order to do this, you will need a spotify account and got to:
  https://developer.spotify.com/dashboard/applications
  <br> From there, create a new app and generate a base64 encoded string of in the format of `client_id:client_secret`. Add this to the Demo Settings page.
  In addition, in test mode only whitelisted users are allowed for API calls to be made on, this means if you are testing in test mode, you will need to whitelist any spotify accounts you are testing on that is not the account you generated the app on. You can whitelist users within the "Users and access" section of your app's dashboard.
- News: The API key for the newsAPI can be obtained by filling in the registration form at https://newsapi.org/register.
- Video: To access video, the user must have a valid youtube api key. To apply for youtube API, the user is required to have an account on the Google cloud platform and a named project associated with Youtube Data API v3. API key can be generated under credentials.

### Technologies used

---

- Third party APIs (NewsAPI, Spotify, YouTube)
- Javacript, jQuery, js library(anime) and CSS framework (materialize)
