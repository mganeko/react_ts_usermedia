import React from 'react';
import ReactDOM from 'react-dom';
import Video from './video'; // video.tsx

import { MouseEvent } from 'react';

import './index.css';

// ------ App class ------

class App extends React.Component {
  localStream: MediaStream | null;

  constructor(props: object) {
    super(props);
    this.localStream = null;
    this.state = {
      playing: false,
    };

    // This binding is necessary to make `this` work in the callback
    this.startVideo = this.startVideo.bind(this);
    this.stopVideoHandler = this.stopVideoHandler.bind(this);
    this.stopVideo = this.stopVideo.bind(this);
  }

  componentDidMount() {
    console.log('App DidMound()');
  }

  componentWillUnmount() {
    console.log('App WillUnmount()');
    if (this.localStream) {
      this.stopVideo();
    }
  }

  // -----------

  startVideo(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log('start Video');
    if (this.localStream) {
      console.warn('localVideo ALREADY started');
      return;
    }

    const constraints = { video: true, audio: false };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        this.localStream = stream;
        this.setState({ playing: true });
      })
      .catch(err => console.error('media ERROR:', err));
  }

  stopVideoHandler(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log('stop Video');
    this.stopVideo();
  }

  stopVideo() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
      this.setState({ playing: false });
    }
  }

  render() {
    console.log('App render()');
    return (
      <div className="App" >
        React getUserMedia example<br />
        <button onClick={this.startVideo}> Start Video</button >
        <button onClick={this.stopVideoHandler}>Stop Video</button>
        <div className="VideoContainer">
          <Video id={"local_video"} width={"240px"} height={"180px"} stream={this.localStream} volume={0} controls={false}>
          </Video>
        </div>
      </div >
    );
  }
}

// ====================== ReactDOM rendering ====================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
