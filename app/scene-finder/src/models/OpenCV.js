'use strict';

/**
 * OpenCV.js
 * https://docs.opencv.org/3.4/d5/d10/tutorial_js_root.html
 */

/* eslint-disable */  // require 'cv' is defined.
export default class OpenCV {
  constructor(canvasId) {
    if (!canvasId) throw Error('no canvas id.');

    this.canvasId = canvasId;
  }

  /**
   * Check if opencv is ready.
   */
  static isOpenCVready(scriptTagId) {
    if (typeof(cv) != 'undefined') return true;
    if (scriptTagId) {
      const el = document.getElementById(scriptTagId);
      if (el) return true;
    }

    return false;
  }

  /**
   * Load opencv.js.
   */
  static loadOpenCVjs(parentTagId, openCVjsUrl = 'script/opencv/opencv.js') {
    const scriptTagId = 'opencvjs-script-tag-id';

    if (this.isOpenCVready(scriptTagId)) return;

    const onloadFunction = () => { console.log('opencv.js loaded'); };

    // add script tag
    const scriptTag = document.createElement('script');
    scriptTag.id = scriptTagId;
    scriptTag.type = 'text/javascript';
    scriptTag.src = openCVjsUrl;
    scriptTag.onload = onloadFunction;
    document.getElementById(parentTagId).appendChild(scriptTag);
  }

  /**
   * Show the image.
   */
  imshow(imgElement) {
    const mat = cv.imread(imgElement);

    cv.imshow(this.canvasId, mat);

    mat.delete();
  }

  /**
   * Show the gray scaled image.
   */
  imshowGray(imgElement) {
    const mat = cv.imread(imgElement);

    cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
    cv.imshow(this.canvasId, mat);

    mat.delete();
  }

  /**
   * Process the video.
   */
  vdshow(videoElement, fps = 120, maxFrame = 1 * 60 * 1000) {
    videoElement.play();

    const cap = new cv.VideoCapture(videoElement);
    const src = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
    const dst = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC1);

    console.log('cap start');
    const self = this;
    vdshowProcess(0);

    function vdshowProcess(crrFrame) {
      // video end
      if (videoElement.paused || crrFrame > maxFrame) {
        console.log('cap end');
        src.delete();
        dst.delete();
        videoElement.pause();
        return;
      }
  
      // show video frame image
      cap.read(src);
      // cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
      // cv.imshow(self.canvasId, dst);
      cv.imshow(self.canvasId, src);
      
      // next frame
      const frameDiff = 1000/fps;
      setTimeout(() => {
        vdshowProcess(crrFrame + frameDiff);
      }, frameDiff);
    }
  }

}
