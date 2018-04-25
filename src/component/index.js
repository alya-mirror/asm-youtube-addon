import React, {Component} from 'react'
import Youtube from 'react-youtube';
import CoverFlow from 'coverflow-react';
import ReactTestUtils from 'react-dom/test-utils';
import ReactDOM from 'react-dom'
import config from './config.defaults'
import io from 'socket.io-client';

const AWSIoTclient = require('./utils/AWSIoTClient');
const SEARCH_VIDEO_TOPIC = 'AlyaSmartMirror';
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
    let self = this;
    this.state = {
      videoHidden: true,
      sliderHidden: true,
      settings: {
        width: '640',
        height: '390',
        autoplay:1
      }
    };
    this.socket = io('http://localhost:3100');
    this.socket.on('connect', function () {
      console.log('connected');
    });
    this.socket.on('disconnect', function () {
      console.log('disconnected');
    });
    this.socket.on('@alya-mirror/asm-youtube-addon', function (data) {
      const message = JSON.parse(data).data.addonSettings;
      let isAuto = 1;
      if(!message.autoPlay){
        isAuto = 0;
      }
      self.setState({
        settings: {
          width: message.width,
          theme : message.height,
          autoplay:isAuto
        }
      });
    });
    this.awsIotClient = new AWSIoTclient();
    this.awsIotClient.connect(config.awsIoTConfigs)
    .then(() => {
      this.awsIotClient.subscribe(SEARCH_VIDEO_TOPIC, {}, this.listenerFunction, this);
    });
  }

  listenerFunction(topic, payload, caller) {
    if (topic !== SEARCH_VIDEO_TOPIC) {
      console.log('different topic was sent');
      return;
    }
    let message = payload.toString();
    console.log('message', topic, message);
    message = JSON.parse(message);
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
        height: this.state.settings.height,
        width: this.state.settings.width,
        playerVars: {
          autoplay: this.state.settings.autoplay
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
