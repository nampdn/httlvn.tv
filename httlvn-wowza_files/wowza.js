// Wrap in anonymous function so the embed code doesn't pollute global scope
(function() {

    var wowza_player;

    function player_load() {
    var config = {
      "license": "PTRL1-mkACG-K3ttT-v74XR-6djew-DAJMR",
      "sourceURL": "https://cdn3.wowza.com/1/UFhEblh4UDZUclBN/NXNRYnJn/hls/live/playlist.m3u8",
      "autoPlay": false,
      "volume":"75",
      "mute":false,
      "loop":false,
      "audioOnly":false,
      "uiShowQuickRewind":true,
      "uiShowDurationVsTimeRemaining":true,
      "uiShowBitrateSelector":true,
      "uiQuickRewindSeconds":"30",
      "width": "640",
      "responsive": "true",
      "posterFrameURL": "",
      "uiPosterFrameFillMode":"stretch",
      "uiShowChannelBug": "false",
      "uiChannelBugURL": "",
      "uiChannelBugLocation": "topright",
      "uiDVRMinDuration": 180000,
      "uiEnableDVR": false,
      "liveStartTimestamp": ""
    };


    // Get the player container to make it responsive or fixed width
    var el = document.getElementById('wowza_player');
    // was a width specified in config? and if so, do we have a conflicting responsive setting?
    if(config.responsive == "true"){
      // fail gracefully  by removing  the height attribute, as we set aspect ratio for responsive
      if(config.height){
        delete config['height'];
      }
      if(config.width){
        delete config['width'];
      }
      // set the player to be responsive
      // set the player to fill the width of it's container and maintain a 16:9 aspect ratio
      el.setAttribute("style","width:100%;padding:0 0 56.25% 0;height:0;");
    } else {
      // maintian 16:9 aspect ratio
      config.height = config.width * .5625;
      // Set player style for a fixed width player
      el.style.width = config.width + "px";
      el.style.height = config.height + "px";
    }

    // Call to the WSP js wrapper to render WSP in a div with the ID 'wowza_player' which we provide via the embed script
    wowza_player = WowzaPlayer.create('wowza_player',config);
    wowza_player.onMetadata(function (event)
      {
        console.log("INFO: onMetaData event:" + event.type + ":" + event.description);
        console.log(event);
      }
    );
  }

  // Load the WSP JS wrapper asynchorniously
  function load(){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    // once the script has loaded attach the player to a the 'wowza_player' div in the DOM
    script.onload = player_load;
    // get the below url from config
    script.src = "https://s3.amazonaws.com/wcl-wowza-player/prod/latest/wowzaplayer.min.js";
    // place script tag in document head
    document.getElementsByTagName("head")[0].appendChild(script);

    // Insert the inline CSS so that we can style the player
    var node = document.createElement('style');
    node.innerHTML = '#wowza_player-CountdownTimer .wowza_player-Position-Center {\n  height: 95px !important;\n  width: 280px !important;\n  font-size: 18px !important;\n  top: 70px !important;\n  left: 0 !important;\n  font-weight: bold;\n  line-height: 25px;\n  padding-left: 40px;\n  padding-top: 10px;\n  border-radius: 0px 20px 20px 0px;\n  background: rgba(0,0,0,0.5);\n  color: #FFFFFF;\n  z-index: 1000;\n}\n\n#wowza_player-CountdownTimer #wowza_player-CountdownTimerGroup {\n  background: none;\n  border: none;\n  border-radius: none;\n  top: 12px !important;\n  left: -70px !important;\n}\n';
    document.getElementsByTagName("head")[0].appendChild(node);
  }

  if (window.attachEvent) {
    // if we have a window and can attach an event then run the load function
    window.attachEvent('onload', load);
  } else {
    // otherwise attach to the load event
    window.addEventListener('load', load, false);
  }

})();
