// variable for JSON tracking configuration
var confStreamingAnalytics;

// variable for beacon object
var streamTag;

// variable for Youtube player object
var player;

// memorize the position each second (hack to send the correct position in pause event during a seek action)
var last_position = 0;


// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: 'M7lc1UVf-VE',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}


// The API will call this function when the video player is ready.
function onPlayerReady(event) {
	// This code loads the Mediametrie JS code asynchronously.
	var eS = document.createElement('script');
	eS.type = 'text/javascript';
	eS.async = true;
	eS.src = '//prof.estat.com/js/mu-integration-5.2.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(eS, s);
	
	// eSloaded method is called when the Mediametrie library is loaded 
	if(eS.addEventListener) { // for all browsers except old IEs (< 9)
		eS.addEventListener('load', function(){
			eSloaded();
		}, false)
	} else { // for old IEs only
		eS.onreadystatechange = function () {
			if (eS.readyState in {complete: 1, loaded: 1}) {
				eSloaded();
			}
		};
	}
	
	// Measure object configuration
	confStreamingAnalytics = {
		serial: 241041208720,
		measure: "streaming",
		implementation: "replay",
		streaming: {
			playerObj: player,
			diffusion: "replay",
			callbackPosition: getTimerDisplay,
			playerName: "player",
			streamName: player.getVideoData().title,
			streamDuration: player.getDuration()
		},
		levels: {
			level_1: "Film",
			level_2: "Cinema"
		}
	};

	// Hack to send the correct position in pause event during a seek action
	listenPosition = setInterval(function(){
		last_position = Math.round(getTimerDisplay(player));
	}, 1000);


}

// Instanciate the beacon object when Mediametrie library is fully loaded
eSloaded = function(){
	streamTag = new eStatTag(confStreamingAnalytics);
};

// Callback called by the beacon to get the player position
var getTimerDisplay = function (player) {
	videoPosition = Math.round(player.getCurrentTime());
	return videoPosition;
}

// The Youtube API calls this function when the player's state changes.
function onPlayerStateChange(event) {
	switch (event.data) {
		case YT.PlayerState.PLAYING:
		streamTag.notifyPlayer('play');
		break;
		case YT.PlayerState.PAUSED:
		streamTag.notifyPlayer('pause', last_position);
		break;
		case YT.PlayerState.ENDED:
		streamTag.notifyPlayer('stop');
		break;
	}
}
