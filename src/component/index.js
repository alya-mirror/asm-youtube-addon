import React, { Component } from 'react'
import Youtube from 'react-youtube';
import CoverFlow from 'coverflow-react';
import ReactTestUtils from 'react-dom/test-utils';
import ReactDOM from 'react-dom'
import config from './config.defaults'

const AWSIoTclient = require('./utils/AWSIoTClient');
<<<<<<< HEAD
const SEARCH_VIDEO_TOPIC = 'AlyaSmartMirror';
=======
const SEARCH_VIDEO_TOPIC = 'AlyaSmartMirror:youtube_module';
const alyaVoiceCommandsTopic = 'alya-data';
>>>>>>> master
const YoutubeSearch = require('youtube-node');

const youtubeSearch = new YoutubeSearch();
youtubeSearch.setKey(config.youtubeConfigs.key);

let videos = [];
let images = [];
let currentVideoID = null;
let currentIndex = 0;

class AlexaYoutube extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoHidden: true,
      sliderHidden: true,
    };
    this.awsIotClient = new AWSIoTclient();
    this.awsIotClient.connect(config.awsIoTConfigs)
      .then(() => {
        this.awsIotClient.subscribe(SEARCH_VIDEO_TOPIC, {}, this.listenerFunction, this);
        this.awsIotClient.subscribe(alyaVoiceCommandsTopic, {}, this.listenerFunction, this);
      });
  }

  listenerFunction(topic, payload, caller) {
    if ((topic !== SEARCH_VIDEO_TOPIC) && (topic !== alyaVoiceCommandsTopic)) {
      console.log('different topic was sent');
      return;
    }
    let message = JSON.parse(payload.toString());
    console.log('message', topic, message);
    let skill = message.skill;
    switch (skill) {
      case 'search_video':
        caller.getVideos(message.searchTerm);
        break;
      case 'next':
        caller.goNext();
        break;
      case 'previous':
        caller.goPrevious();
        break;
      case 'choose_video':
        caller.showVideo();
        break;
      case 'pause_video':
        caller.pauseVideo();
        break;
      case 'resume_video':
        caller.resumeVideo();
        break;
      case 'close_video':
        caller.closeVideo();
        break;
      default:
        break;
    }

    if (payload.type === 'matrix-voice-command') {
      let data = message.data;
      switch (data) {
        case 'alya next':
          caller.goNext();
          break;
        case 'alya previous':
          caller.goPrevious();
          break;
        case 'alya select video':
          caller.showVideo();
          break;
        case 'alya pause video':
          caller.pauseVideo();
          break;
        case 'alya resume video':
          caller.resumeVideo();
          break;
        case 'alya close video':
          caller.closeVideo()
      }
    }
  }

  showSlider() {
    this.getImages();
    this.setState({
      videoHidden: true,
      sliderHidden: false,
    });
  }

  showVideo() {
    this.setState({
      videoHidden: false,
      sliderHidden: true,
    });
  }

  onPlayerReady(event) {
    this.player = event.target;
  }

  pauseVideo() {
    if (!this.state.videoHidden && this.player) {
      this.player.pauseVideo();
    }
  }

  resumeVideo() {
    if (!this.state.videoHidden && this.player) {
      this.player.playVideo();
    }
  }

  closeVideo() {
    if (!this.state.videoHidden) {
      this.setState({
        videoHidden: true,
        sliderHidden: true,
      });
    }
  }

  goNext() {
    console.log('next has been said')
    if (!this.state.sliderHidden && currentIndex <= 50) {
      ReactTestUtils.Simulate.keyDown(ReactDOM.findDOMNode(this.refs.coverflow), {
        key: "keyDown",
        keyCode: 39,
        which: 39
      });
      currentIndex++;
      currentVideoID = videos[currentIndex].id.videoId;
      var ali = '';
    }

  }

  goPrevious() {
    if (!this.state.sliderHidden && currentIndex > 0) {
      ReactTestUtils.Simulate.keyDown(ReactDOM.findDOMNode(this.refs.coverflow), {
        key: "keyDown",
        keyCode: 37,
        which: 37
      });
      currentIndex--;
      currentVideoID = videos[currentIndex].id.videoId;
    }
  }

  getVideos(searchTerm) {
    youtubeSearch.search(searchTerm, 50, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }
      videos = result.items;
      currentIndex = 5;

      this.showSlider();
    });
  }


  getImages() {
    images = [];
    currentIndex = 5;
    currentVideoID = videos[5].id.videoId;
    videos.forEach((video) => {
      images.push(video.snippet.thumbnails.high.url);
    });
  }

  render() {
    let internalElement;
    if (!this.state.sliderHidden) {
      internalElement = <CoverFlow class='container' imagesArr={images} ref="coverflow" background="#00000"/>
    }
    else if (!this.state.videoHidden) {
      const opts = {
        height: '390',
        width: '640',
        playerVars: {
          autoplay: 1
        }
      };
      internalElement = <Youtube
        videoId={currentVideoID}
        opts={opts}
        onReady={this.onPlayerReady.bind(this)}
      />
    }
    else {
      internalElement = <div></div>
    }

    return (<div className='alexaYoutube'>
      {internalElement}
    </div>)
  }
}

export default AlexaYoutube;
