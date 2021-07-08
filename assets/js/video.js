const randomVideoBtn = $("#random-video");
const knowledgeBtn = $("#knowledge-video");
const gamingSelect = $("#gaming");
const sportsSelect = $("#sports");
const entertainmentSelect = $("#entertainment");
const lifestyleSelect = $("#lifestyle");
const societySelect = $("#society");
const gamingBtn = $("#gaming-button");
const sportsBtn = $("#sports-button");
const entertainmentBtn = $("#entertainment-button");
const lifestyleBtn = $("#lifestyle-button");
const societyBtn = $("#society-button");
const memoContainer = $("#memo-btn-container");
const allMemoBtns = $("#memo-btn-container button");
const videoIframe = $(".iframe-video");
const videoStartBtn = $("#video");
const backToMainBtn = $("#back-to-main-btn");
let apiKey = "";
let url = "";
let baseUrl = "";
function setBaseUrl(apiKey) {
  baseUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=short&videoEmbeddable=true&videoSyndicated=true&key=${apiKey}`;
}
// Ask for api key if exists in local storage, if not, generate one.
function checkApiKey() {
  let storedKey = localStorage.getItem("apiKey");
  let keyEntered = "";
  if (storedKey) {
    setBaseUrl(storedKey);
  } else {
    let exitApiCheckLoop = false;
    while (!exitApiCheckLoop) {
      keyEntered = window.prompt(
        "Please enter your API key to access the video:"
      );
      if (keyEntered.length != 39) {
        window.alert("The key entered is invalid!");
      } else {
        localStorage.setItem("apiKey", keyEntered);
        setBaseUrl(keyEntered);
        exitApiCheckLoop = true;
      }
    }
  }
}
// Action required when clicking on start video
videoStartBtn.on("click", showVideoContainer);
function showVideoContainer(e) {
  e.stopPropagation();
  checkApiKey();
  videoContainer = $('.video-container');
  videoContainer.removeClass("hidden");
  url = baseUrl + `&maxResults=3&topicId=%2Fm%2F01k8wb&relevanceLanguage=en`;
  showVideo();
}
//Action required when clikcing on back to main

const mainButtons2 = document.querySelector('.mainButtons');
backToMainBtn.on("click", hideVideoContainer);
function hideVideoContainer(e) {
  e.stopImmediatePropagation();
  videoContainer = $(e.target).parent().parent();
  videoContainer.addClass("hidden");
  mainButtons2.classList.remove('class','hidden');

}

// Create memory buttons
gamingSelect.on("change", createCardBtn);
sportsSelect.on("change", createCardBtn);
entertainmentSelect.on("change", createCardBtn);
lifestyleSelect.on("change", createCardBtn);
societySelect.on("change", createCardBtn);

function createCardBtn(e) {
  if (e.target === gamingSelect[0]) {
    let gameTopic = gamingSelect.val();
    remember("gaming", gameTopic);
  } else if (e.target === sportsSelect[0]) {
    let sportsTopic = sportsSelect.val();
    remember("sports", sportsTopic);
  } else if (e.target === entertainmentSelect[0]) {
    let entertainmentTopic = entertainmentSelect.val();
    remember("entertainment", entertainmentTopic);
  } else if (e.target === lifestyleSelect[0]) {
    let lifestyleTopic = lifestyleSelect.val();
    remember("lifestyle", lifestyleTopic);
  } else if (e.target === societySelect[0]) {
    let societyTopic = societySelect.val();
    remember("society", societyTopic);
  }
}

function remember(category, topic) {
  localStorage.setItem(category, topic);
  setRememberButtons();
}

function setRememberButtons() {
  let categories = [
    "gaming",
    "sports",
    "entertainement",
    "lifestyle",
    "society",
  ];
  let isStored = Object.keys(localStorage).some((key) =>
    categories.includes(key)
  );
  if (isStored) {
    for (let i = 0; i < localStorage.length; i++) {
      let category = localStorage.key(i);
      let topic = localStorage.getItem(category);
      for (let j = 0; j < allMemoBtns.length; j++) {
        if (allMemoBtns[j].dataset.category === category) {
          allMemoBtns[j].innerText =
            // capitalise the output
            topic.charAt(0).toUpperCase() + topic.slice(1);
        }
      }
    }
  }
}
// Recall the button last used
setRememberButtons();

// Click events for video play
memoContainer.on("click", "button", createApiUrl);

function createApiUrl(e) {
  if (e.target === randomVideoBtn[0]) {
    let randomTerms =
      "vlog,gaming,haul,comedy,skit,challenge,unboxing,education,tutorial,fashion,top,commentary,product%20review,how%20to,meme,reaction,Q%26A,interview,sport,sports,animation,event,recipe,collection,prank,parody,best,soothing,health,fitness,DIY,compilation,news,infotainment,cooking,travel,asmr,tiktok,tik%20tok";
    let randomTermsArr = randomTerms.split(",");
    let searchTerm =
      randomTermsArr[Math.floor(Math.random() * randomTermsArr.length)];
    url = baseUrl + `&maxResults=3&q=${searchTerm}`;
    console.log(url);
  } else if (e.target === knowledgeBtn[0]) {
    url = baseUrl + `&maxResults=3&topicId=%2Fm%2F01k8wb&relevanceLanguage=en`;
    console.log(url);
  } else if (e.target === gamingBtn[0]) {
    let gameTopic = gamingBtn.text().toLowerCase();
    let baseGameUrl =
      baseUrl + `&maxResults=3&relevanceLanguage=en` + `&topicId=`;
    let gameTopicIdMapping = {
      gaming: `%2Fm%2F0bzvm2`,
      action: `%2Fm%2F025zzc`,
      adventure: `%2Fm%2F02ntfj`,
      casual: `%2Fm%2F0b1vjn`,
      music: `%2Fm%2F02hygl`,
      puzzle: `%2Fm%2F04q1x3q`,
      racing: `%2Fm%2F01sjng`,
      roleplay: `%2Fm%2F0403l3g`,
      simulation: `%2Fm%2F021bp2`,
      sports: `%2Fm%2F022dc6`,
      strategy: `%2Fm%2F03hf_rm`,
    };
    url = baseGameUrl + gameTopicIdMapping[gameTopic];
    console.log(url);
  } else if (e.target === sportsBtn[0]) {
    let sportsTopic = sportsBtn.text().toLowerCase();
    let baseSportsUrl =
      baseUrl + `&maxResults=3&relevanceLanguage=en` + `&topicId=`;
    let sportsTopicIdMapping = {
      sports: `%2Fm%2F06ntj`,
      usFootball: `%2Fm%2F06ntj`,
      baseball: `%2Fm%2F06ntj`,
      basketball: `%2Fm%2F06ntj`,
      boxing: `%2Fm%2F06ntj`,
      cricket: `%2Fm%2F09xp_`,
      football: `%2Fm%2F02vx4`,
      golf: `%2Fm%2F037hz`,
      iceHockey: `%2Fm%2F03tmr`,
      martialArts: `%2Fm%2F01h7lh`,
      motorsports: `%2Fm%2F0410tth`,
      tennis: `%2Fm%2F07bs0`,
      volleyball: `%2Fm%2F07_53`,
    };
    url = baseSportsUrl + sportsTopicIdMapping[sportsTopic];
    console.log(url);
  } else if (e.target === entertainmentBtn[0]) {
    let entertainmentTopic = entertainmentBtn.text().toLowerCase();
    let baseEntertainmentUrl =
      baseUrl + `&maxResults=3&relevanceLanguage=en` + `&topicId=`;
    let entertainmentTopicIdMapping = {
      entertainment: `%2Fm%2F02jjt`,
      humor: `%2Fm%2F09kqc`,
      movies: `%2Fm%2F02vxn`,
      performingArts: `%2Fm%2F05qjc`,
      wrestling: `%2Fm%2F066wd`,
      tvshows: `%2Fm%2F0f2f9`,
    };
    url =
      baseEntertainmentUrl + entertainmentTopicIdMapping[entertainmentTopic];
    console.log(url);
  } else if (e.target === lifestyleBtn[0]) {
    let lifestyleTopic = lifestyleBtn.text().toLowerCase();
    let baseLifestyleUrl =
      baseUrl + `&maxResults=3&relevanceLanguage=en` + `&topicId=`;
    let lifestyleTopicIdMapping = {
      lifestyle: `%2Fm%2F019_rr`,
      fashion: `%2Fm%2F032tl`,
      fitness: `%2Fm%2F027x7n`,
      food: `%2Fm%2F02wbm`,
      hobby: `%2Fm%2F03glg`,
      pets: `%2Fm%2F068hy`,
      beauty: `%2Fm%2F041xxh`,
      technology: `%2Fm%2F07c1v`,
      tourism: `%2Fm%2F07bxq`,
      vehicles: `%2Fm%2F07yv9`,
    };
    url = baseLifestyleUrl + lifestyleTopicIdMapping[lifestyleTopic];
    console.log(url);
  } else if (e.target === societyBtn[0]) {
    let societyTopic = societyBtn.text().toLowerCase();
    let baseSocietyUrl =
      baseUrl + `&maxResults=3&relevanceLanguage=en` + `&topicId=`;
    let societyTopicIdMapping = {
      society: `%2Fm%2F098wr`,
      business: `%2Fm%2F09s1f`,
      health: `%2Fm%2F0kt51`,
      military: `%2Fm%2F01h6rj`,
      politics: `%2Fm%2F05qt0`,
      religion: `%2Fm%2F06bvp`,
    };
    url = baseSocietyUrl + societyTopicIdMapping[societyTopic];
    console.log(url);
  }

  console.log("connecting to fetch api...");
  showVideo();
}

function showVideo() {
  fetch(url)
    .then((res) => res.json()) //need to deal with bad api request here, if clients api is wrong what do we do
    .then(function (data) {
      //go back to check api key if not working properly
      let videoCollection = data.items;
      let videoPicked =
        videoCollection[Math.floor(Math.random() * videoCollection.length)];
      let videoSource = `https://www.youtube.com/embed/${videoPicked.id.videoId}`;
      videoIframe.attr("src", videoSource);
    })
    .catch((err) => console.log(err));
}
