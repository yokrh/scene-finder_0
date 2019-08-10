'use strict';

/**
 * OpenCV.js
 * https://docs.opencv.org/3.4/d5/d10/tutorial_js_root.html
 */

/* eslint-disable */  // require 'cv' is defined.
export default class OpenCV {
  constructor(canvasId) {
    if (!canvasId) throw Error('no canvas id.');

    // Canvas element id
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
   * Get image mats from video.
   */
  static vdextractImageMats(videoElement,
    option = { gray: false },
    fps = 10,
    maxFrame = 1 * 60 * 1000,
    speed = 10
  ){
    videoElement.play();
    videoElement.playbackRate = speed;
    const cap = new cv.VideoCapture(videoElement);
    const res = [];
1
    return new Promise((resolve) => {
      console.log('cap start');
      vdshowProcess(0)
      .then(() => {
        resolve(res);
      });
    });

    // add image mat to res
    function mainProcess() {
      return new Promise((resolve) => {
        const mat = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
        cap.read(mat);
        if (option.gray) cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
        res.push(mat);
        resolve();
      }); 
    }

    function vdshowProcess(crrFrame) {
      return new Promise((resolve) => {
        // video end
        if (videoElement.paused || crrFrame > maxFrame) {
          console.log('cap end');
          videoElement.pause();
          resolve();
          return;
        }
  
        // add image mat to res
        mainProcess()
        .then(() => {
          // next frame
          const frameDiff = 1000/fps;
          setTimeout(() => {
            vdshowProcess(crrFrame + frameDiff)
            .then(() => resolve());
          }, frameDiff);
        });
      });
    }
  }

  /**
   * Show the image mat.
   */
  imshowFromMat(mat, option = { gray: false }, deleteFlg = true) {
    if (option.gray) cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);

    cv.imshow(this.canvasId, mat);

    if (deleteFlg) mat.delete();
  }

  /**
   * Show the image.
   */
  imshowFromElement(imgElement, option = { gray: false }) {
    const mat = cv.imread(imgElement);
    this.imshowFromMat(mat, option);
  }

  /**
   * Show the video.
   */
  vdshowFromElement(videoElement,
    option = { gray: false },
    fps = 120,
    maxFrame = 1 * 60 * 1000,
    speed = 2
    ){

    videoElement.play();
    videoElement.playbackRate = speed;
    const cap = new cv.VideoCapture(videoElement);

    console.log('cap start');
    const self = this;
    vdshowProcess(0);

    // show video frame image
    function mainProcess() {
      const mat = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
      cap.read(mat);
      self.imshowFromMat(mat, option);
    }

    function vdshowProcess(crrFrame) {
      // video end
      if (videoElement.paused || crrFrame > maxFrame) {
        console.log('cap end');
        videoElement.pause();
        return;
      }

      // show video frame image
      mainProcess();

      // next frame
      const frameDiff = 1000/fps;
      setTimeout(() => {
        vdshowProcess(crrFrame + frameDiff);
      }, frameDiff);
    }
  }
}
