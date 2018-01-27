import React from 'react'
import {unmountComponentAtNode} from 'react-dom'
import Component from '../index'
var expect = require("chai").expect;
import config from '../config.defaults'
import AWSIoTClient from '../utils/AWSIoTClient'

const awsIotClient = new AWSIoTClient();
awsIotClient.connect(config.awsIoTConfigs);

describe('Component', () => {
  let node;

  beforeEach(() => {
    // node = document.createElement('div')
  });

  afterEach(() => {
    // unmountComponentAtNode(node)
  });

  it("getting the messages from iot", function () {
    awsIotClient.subscribe('AlyaSmartMirror:youtube_module', {}, () => {

    });
  });
  it("goes next", function () {
      awsIotClient.publish('AlyaSmartMirror:youtube_module', {'skill': 'next'}, {}, (err) => {
        expect(err).to.be.null;
      });
  });
  it("pauses video", function () {
    awsIotClient.publish('AlyaSmartMirror:youtube_module', {'skill': 'close_video'}, {}, () => {
    });
  });
});