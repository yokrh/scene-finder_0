'use strict';

/**
 * OpenCV class.
 *
 * Wrapper of OpenCV.js
 * https://docs.opencv.org/4.1.1/d5/d10/tutorial_js_root.html
 *
 * Policy:
 * static method: needn't canvas.
 * instance method: need canvas.
 *
 * Note:
 * Create option class for cvtColor, if the option contains many args.
 *
 * Warning:
 * It's hard to use OpenCV.js... Using other language one is preferred.
 * Some method is not supported and it's easy to cause memory leak.
 */
/* eslint no-undef: 0 */  // disable waring that "error: 'cv' is not defined (no-undef)".

const scriptTagId = 'opencvjs-script-tag-id';

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
    if (OpenCV.isOpenCVready(scriptTagId)) return;

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
   * Calc image similarity with image histogram.
   * No 'calc_similarity' method in OpenCV.js...
   *
   * Get histogram.
   * https://docs.opencv.org/4.1.1/d7/d32/tutorial_js_histogram_begins.html
   */
  static calcImageSimilarity(imageMat1, imageMat2) {
    const imageHist1 = new cv.Mat();
    const imageHist2 = new cv.Mat();

    // cv.cvtColor(matVec1, matVec1, cv.COLOR_RGBA2GRAY, 0);
    // cv.cvtColor(matVec2, matVec2, cv.COLOR_RGBA2GRAY, 0);
    const matVec1 = new cv.MatVector();
    matVec1.push_back(imageMat1);
    const matVec2 = new cv.MatVector();
    matVec2.push_back(imageMat2);

    const mask = new cv.Mat();
    const accumulate = false;
    const channels = [0];
    const histSize = [256];
    const ranges = [0, 255];
    cv.calcHist(matVec1, channels, mask, imageHist1, histSize, ranges, accumulate);
    cv.calcHist(matVec2, channels, mask, imageHist2, histSize, ranges, accumulate);

    const similarity = cv.compareHist(imageHist1, imageHist2, 0);

    imageHist1.delete();
    imageHist2.delete();
    matVec1.delete();
    matVec2.delete();
    mask.delete();
    return similarity;
  }

  /**
   * Get image mats from video.
   * Take an image for each frame.
   */
  static vdextractImageMats(
    videoElement,
    option = { gray: false },
    fps = 1,  // unstable
    maxFrame = 1000,  // unstable
    speed = 10  // unstable
  ){
    fps *= speed;

    videoElement.play();
    videoElement.playbackRate = speed;

    const res = [];
    const cap = new cv.VideoCapture(videoElement);
    const videoMainProcessPromise = function() {
      return new Promise((resolve) => {
        // add image mat to res
        const mat = OpenCV.getImageMatFromCap(videoElement, cap, option);
        res.push(mat);
        resolve();
      });
    };

    return new Promise((resolve) => {
      // simulate video
      const crrFrame = 0;
      console.log('cap start');
      OpenCV.simulateVideoPlay(
        videoElement,
        videoMainProcessPromise,
        fps,
        maxFrame,
        crrFrame
      )
      .then(() => {
        resolve(res);
      });
    });
  }

  /**
   * Simulate video play.
   * Unfortunately, the fps cannot be stable. (Maybe because of memory)
   * Hence, the time of the maxFrame can be different for each run.
   */
  static simulateVideoPlay(
    videoElement,
    videoMainProcessPromise,
    fps,
    maxFrame,
    crrFrame
  ){
    return new Promise((resolve) => {
      // video end
      if (videoElement.paused
        // || crrFrame > maxFrame
      ) {
        console.log('cap end', crrFrame);
        // videoElement.pause();
        resolve();
        return;
      }

      // main process
      videoMainProcessPromise()
      // next frame
      .then(() => {
        const timeDiff = 1000 / fps;
        setTimeout(() => {
          OpenCV.simulateVideoPlay(
            videoElement,
            videoMainProcessPromise,
            fps,
            maxFrame,
            crrFrame + 1
          )
          .then(() => resolve());
        }, timeDiff);
      });
    });
  }

  /**
   * Get image mat from video capture
   */
  static getImageMatFromCap(videoElement, cap, option = { gray: false }) {
    const mat = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
    cap.read(mat);

    if (option.gray) cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
    return mat;
  }

  /**
   * Get image mat from image element
   */
  static getImageMat(imgElement, option = { gray: false }) {
    const mat = cv.imread(imgElement);

    if (option.gray) cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
    return mat;
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
   * Deprecated. Use {@link OpenCV#imshowFromMat() imshowFromMat}
   */
  // imshowFromElement(imgElement, option = { gray: false }) {
  //   const mat = OpenCV.getImageMat(imgElement);
  //   this.imshowFromMat(mat, option);
  // }

  /**
   * Show the video.
   */
  vdshowFromElement(
    videoElement,
    option = { gray: false },
    fps = 120,  // unstable
    maxFrame = 1000,  // unstable
    speed = 1  // unstable
  ){
    fps *= speed;

    videoElement.play();
    videoElement.playbackRate = speed;

    const self = this;
    const cap = new cv.VideoCapture(videoElement);
    const videoMainProcessPromise = function() {
      return new Promise((resolve) => {
        // show video frame image
        const mat = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
        cap.read(mat);
        self.imshowFromMat(mat, option);
        resolve();
      });
    };

    // simulate video
    const crrFrame = 0;
    console.log('cap start');
    OpenCV.simulateVideoPlay(
      videoElement,
      videoMainProcessPromise,
      fps,
      maxFrame,
      crrFrame
    );
  }
}
