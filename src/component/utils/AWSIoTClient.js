const awsIot = (process.env.NODE_ENV != 'test') ? window.require('aws-iot-device-sdk') : require('aws-iot-device-sdk');
const path = (process.env.NODE_ENV != 'test') ? window.require('path') : require('path');
const certsFolderPath = path.resolve('certs');

class AWSIoTClient {

  connect(configs, clientId) {
    return new Promise((resolve, reject) => {
      this.device = awsIot.device({
        keyPath: `${certsFolderPath}/${configs.keyFileName}`,
        certPath: `${certsFolderPath}/${configs.certFileName}`,
        caPath: `${certsFolderPath}/${configs.caFileName}`,
        clientId: clientId || configs.clientId,
        region: configs.region,
        host: configs.host
      });

      this.device.on("connect", () => {
        console.log("Connected to AWS IoT");
        resolve();
      });
      this.device.on('error', (error) => {
        console.log('error', error);
      });
      this.device.on('reconnect', () => {
        console.log('reconnect');
      });
      this.device.on('offline', () => {
        console.log('offline');
      });
    });
  }

  subscribe(topic, options, listenerFunction, caller) {
    this.device.subscribe(topic, options, () => {
      console.log("Subscribed: " + topic);
      this.device.on('message', (topic, payload) => {
        listenerFunction(topic, payload, caller);
      });
    });
  }

  publish(topic, message, options, callback) {
    this.device.publish(topic, JSON.stringify(message), options, function (err) {
      if (!err) {
        console.log("published successfully: " + topic);
      }
      callback(err);
    });
  }

  disconnect() {
    this.device.end();
  }
}

module.exports = AWSIoTClient;
