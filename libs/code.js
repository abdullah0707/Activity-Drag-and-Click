var canvas,
  stage,
  exportRoot,
  anim_container,
  dom_overlay_container,
  fnStartAnimation;

// var soundsArr;
var video, video_div;

var sounds = {};
var timerFrame = 0;

var QuzComplete = 1;

var soundStatus = true;
var currentSound = null;

var confirmAction = false;
var numOfAns = 4;

var numOfDragAns = 4,
  numOfPlaces = 2,
  currentQ = 1;

var score = 0,
  answerName = null;

var attempts = 0,
  maxAttempts = 3;

var counter = 0;

var overOut = [];
var retryV = false;
var soundQuzFb,
  soundStatus = true,
  statusGlop = null,
  currentSound = null;
var l = console.log;

function init() {
  canvas = document.getElementById("canvas");
  anim_container = document.getElementById("animation_container");
  dom_overlay_container = document.getElementById("dom_overlay_container");
  var comp = AdobeAn.getComposition("1C98AE37D16F0348BFAB345EBD6CA3F9");
  var lib = comp.getLibrary();
  var loader = new createjs.LoadQueue(false);
  loader.addEventListener("fileload", function (evt) {
    handleFileLoad(evt, comp);
  });
  loader.addEventListener("complete", function (evt) {
    handleComplete(evt, comp);
  });
  var lib = comp.getLibrary();
  loader.loadManifest(lib.properties.manifest);
}
function handleFileLoad(evt, comp) {
  var images = comp.getImages();
  if (evt && evt.item.type == "image") {
    images[evt.item.id] = evt.result;
  }
}
function handleComplete(evt, comp) {
  //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
  var lib = comp.getLibrary();
  var ss = comp.getSpriteSheet();
  var queue = evt.currentTarget;
  var ssMetadata = lib.ssMetadata;
  for (i = 0; i < ssMetadata.length; i++) {
    ss[ssMetadata[i].name] = new createjs.SpriteSheet({
      images: [queue.getResult(ssMetadata[i].name)],
      frames: ssMetadata[i].frames,
    });
  }
  exportRoot =
    new lib.SAMOE_GeLD_SEC_SEC_G12_STAT_SM1_L1_01_L3_01_Activity_LO03_O05_NGRD_V10();

  stage = new lib.Stage(canvas);
  //Registers the "tick" event listener.
  fnStartAnimation = function () {
    stage.addChild(exportRoot);
    stage.enableMouseOver(10);
    createjs.Touch.enable(stage);
    /* document.ontouchmove = function (e) {
           e.preventDefault();
       }*/
    stage.mouseMoveOutside = true;
    stage.update();
    createjs.Ticker.setFPS(lib.properties.fps);
    createjs.Ticker.addEventListener("tick", stage);
    prepareTheStage();
  };
  //Code to support hidpi screens and responsive scaling.
  function makeResponsive(isResp, respDim, isScale, scaleType) {
    var lastW,
      lastH,
      lastS = 1;
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function resizeCanvas() {
      var w = lib.properties.width,
        h = lib.properties.height;
      var iw = window.innerWidth,
        ih = window.innerHeight;
      var pRatio = window.devicePixelRatio || 1,
        xRatio = iw / w,
        yRatio = ih / h,
        sRatio = 1;
      if (isResp) {
        if (
          (respDim == "width" && lastW == iw) ||
          (respDim == "height" && lastH == ih)
        ) {
          sRatio = lastS;
        } else if (!isScale) {
          if (iw < w || ih < h) sRatio = Math.min(xRatio, yRatio);
        } else if (scaleType == 1) {
          sRatio = Math.min(xRatio, yRatio);
        } else if (scaleType == 2) {
          sRatio = Math.max(xRatio, yRatio);
        }
      }
      canvas.width = w * pRatio * sRatio;
      canvas.height = h * pRatio * sRatio;
      canvas.style.width =
        dom_overlay_container.style.width =
        anim_container.style.width =
        w * sRatio + "px";
      canvas.style.height =
        anim_container.style.height =
        dom_overlay_container.style.height =
        h * sRatio + "px";
      stage.scaleX = pRatio * sRatio;
      stage.scaleY = pRatio * sRatio;
      lastW = iw;
      lastH = ih;
      lastS = sRatio;
      stage.tickOnUpdate = false;
      stage.update();
      stage.tickOnUpdate = true;
      canvas.style.display = "block";

    }
  }
  makeResponsive(true, "both", true, 1);
  AdobeAn.compositionLoaded(lib.properties.id);
  fnStartAnimation();
  var video = document.querySelector("video");
  // video.play();
  video.addEventListener("ended", () => {
    exportRoot.gotoAndStop(2);
    video.style.display = "none";
    video.src = '';
    exportRoot.gotoAndPlay(2);
    unDimSound();
  });
  l("helloooo1");
}

function playFn() {
  stopAllSounds();
  sounds.clickSd.play();
  exportRoot.play();
}

function prepareTheStage() {
  overOut = [
    exportRoot["homeBtn"],
    exportRoot["nextBtnQuz"],
    exportRoot["confirmBtn"],
    exportRoot["nextBtn"],
    exportRoot["retryBtn"],
    exportRoot["startBtn"],
  ];
  for (var i = 0; i < overOut.length; i++) {
    console.log(i);
    overOut[i].cursor = "pointer";
    overOut[i].on("mouseover", over2);
    overOut[i].on("mouseout", out);
  }

  [
    "clickSd",
    "intro",
    "info",

    "timeFbSd",
    "timeOutSd",

    "quizSd",
    "quizSd2",
    "quizSd3",
    "quizSd4",

    "rightQ1",
    "rightQ2",
    "rightQ3",
    "rightQ4",

    "tryQ1",
    "tryQ2",
    "tryQ3",
    "tryQ4",

    "wrongQ1",
    "wrongQ2",
    "wrongQ3",
    "wrongQ4",
  ].forEach(
    (s) =>
    (sounds[s] = new Howl({
      src: [`sounds/${s}.mp3`],
    }))
  );

  for (var i = 1; i <= numOfAns; i++) {
    exportRoot["q4a" + i].clicked = false;
    exportRoot["q4a" + i].clickAns = null;
    exportRoot["q4a" + i].id = i;
    exportRoot["q4a" + i].placeNum = null;
    exportRoot["q4a" + i].ansNum = null;
  }

  for (var q = 1; q <= 3; q++) {
    for (var i = 1; i <= numOfDragAns; i++) {
      exportRoot["q" + q + "a" + i].id = i;
      exportRoot["q" + q + "a" + i].xPos = exportRoot["q" + q + "a" + i].x;
      exportRoot["q" + q + "a" + i].yPos = exportRoot["q" + q + "a" + i].y;
      exportRoot["q" + q + "a" + i].placeNum = null;
    }
  }
  for (var q = 1; q <= 3; q++) {
    for (var i = 1; i <= numOfPlaces; i++) {
      exportRoot["q" + q + "p" + i].id = i;
      exportRoot["q" + q + "p" + i].amIChecked = false;
      exportRoot["q" + q + "p" + i].ansNum = null;
    }
  }

  sounds.intro.once("end", () => dimSound());

  exportRoot["nextBtnQuz"].addEventListener("click", nextQFn);
  exportRoot["startBtn"].addEventListener("click", playFn);
  exportRoot["nextBtn"].addEventListener("click", playFn);

  exportRoot["muteBtn"].cursor = "pointer";
  exportRoot["muteBtn"].on("mouseover", over2);
  exportRoot["muteBtn"].on("mouseout", out);
  exportRoot["muteBtn"].addEventListener("click", () => playSound());

  exportRoot["soundBtn"].cursor = "pointer";
  exportRoot["soundBtn"].on("mouseover", over2);
  exportRoot["soundBtn"].on("mouseout", out);
  exportRoot["soundBtn"].addEventListener("click", () => muteSound());

  exportRoot.nextQuzComplete.cursor = "pointer";
  exportRoot.nextQuzComplete.addEventListener("click", nextQuzFn);
  exportRoot.nextQuzComplete.addEventListener("mouseover", over2);
  exportRoot.nextQuzComplete.addEventListener("mouseout", out);
  exportRoot.prevQuzComplete.cursor = "pointer";
  exportRoot.prevQuzComplete.addEventListener("click", prevQuzFn);
  exportRoot.prevQuzComplete.addEventListener("mouseover", over2);
  exportRoot.prevQuzComplete.addEventListener("mouseout", out);

  exportRoot["confirmBtn"].addEventListener("click", confirmFN);

  exportRoot["retryBtn"].addEventListener("click", retryFN);

  exportRoot["homeBtn"].addEventListener("click", () => {
    hideFB();
    unDimSound();
    playSound();
    stopAllSounds();
    currentQ = 1;
    score = 0;
    timerFrame = 0;
    QuzComplete = 1;
    soundStatus = true;
    currentSound = null;
    attempts = 0;
    counter = 0;
    clearInterval(timerInterval);
    exportRoot.gotoAndStop("startfla");
    exportRoot["timerSymb"]["timerInSymb"].alpha = 1;
    exportRoot["timerSymb"].gotoAndStop(timerFrame);

    for (var i = 1; i <= numOfAns; i++) {
      exportRoot["q4a" + i].alpha = 0;
    }
    for (var q = 1; q <= 3; q++) {
      for (var i = 1; i <= numOfDragAns; i++) {
        exportRoot["q" + q + "a" + i].id = i;
        exportRoot["q" + q + "a" + i].alpha = 0;
        exportRoot["q" + q + "a" + i].gotoAndStop(0);
        exportRoot["q" + q + "a" + i].x = exportRoot["q" + q + "a" + i].xPos;
        exportRoot["q" + q + "a" + i].y = exportRoot["q" + q + "a" + i].yPos;
        exportRoot["q" + q + "a" + i].placeNum = null;
        exportRoot.removeChild(exportRoot["q" + q + "a" + i]);
      }
    }
    for (var q = 1; q <= 3; q++) {
      for (var i = 1; i <= numOfPlaces; i++) {
        exportRoot["q" + q + "p" + i].id = i;
        exportRoot["q" + q + "p" + i].alpha = 0;
        exportRoot["q" + q + "p" + i].amIChecked = false;
        exportRoot["q" + q + "p" + i].ansNum = null;
        exportRoot.removeChild(exportRoot["q" + q + "p" + i]);
      }
    }
  });

  hideFB();
}

function stopAllSounds() {
  [
    "clickSd",
    "intro",
    "info",

    "timeFbSd",
    "timeOutSd",

    "quizSd",
    "quizSd2",
    "quizSd3",
    "quizSd4",

    "rightQ1",
    "rightQ2",
    "rightQ3",
    "rightQ4",

    "tryQ1",
    "tryQ2",
    "tryQ3",
    "tryQ4",

    "wrongQ1",
    "wrongQ2",
    "wrongQ3",
    "wrongQ4",
  ].forEach((s) => sounds[s].stop());
}

function hideFB() {
  exportRoot["wrongFB"].alpha = 0;
  exportRoot["rightFB"].alpha = 0;
  exportRoot["tryFB"].alpha = 0;
  exportRoot["timeOutFB"].alpha = 0;
  exportRoot["wrongFB"].playV = false;
  exportRoot["rightFB"].playV = false;
  exportRoot["tryFB"].playV = false;
  exportRoot["timeOutFB"].playV = false;
  exportRoot["retryBtn"].alpha = 0;
  exportRoot["retryBtn"].gotoAndStop(0);
  exportRoot["confirmBtn"].alpha = 0;
  exportRoot["confirmBtn"].gotoAndStop(0);
  exportRoot["nextBtnQuz"].alpha = 0;
  exportRoot["nextBtnQuz"].gotoAndStop(0);
  exportRoot["nextQuzComplete"].alpha = 0;
  exportRoot["hideSymb"].alpha = 0;
}

function activateButtons() {
  //exportRoot["hideSymb"].alpha = 0;
  for (var i = 1; i <= numOfDragAns; i++) {
    if (retryV) {
      exportRoot["q" + currentQ + "a" + i].gotoAndStop(0);
      exportRoot["q" + currentQ + "a" + i].placeNum = null;
      exportRoot["q" + currentQ + "a" + i].x = exportRoot["q" + currentQ + "a" + i].xPos;
      exportRoot["q" + currentQ + "a" + i].y = exportRoot["q" + currentQ + "a" + i].yPos;
      if (i < 3) {
        exportRoot["q" + currentQ + "p" + i].alpha = 1;
        exportRoot["q" + currentQ + "p" + i].ansNum = null;
      }
    }
    if (i < 3) {
      exportRoot["q" + currentQ + "p" + i].alpha = 1;
    }
    exportRoot["q" + currentQ + "a" + i].alpha = 1;
    exportRoot["q" + currentQ + "a" + i].cursor = "pointer";
    exportRoot["q" + currentQ + "a" + i].addEventListener("pressmove", moveFn);
    exportRoot["q" + currentQ + "a" + i].addEventListener("pressup", pressupFn);
    exportRoot["q" + currentQ + "a" + i].addEventListener("mouseover", over2);
    exportRoot["q" + currentQ + "a" + i].addEventListener("mouseout", out);
  }
  exportRoot["confirmBtn"].alpha = 0;
  exportRoot["confirmBtn"].cursor = "pointer";
  exportRoot["confirmBtn"].addEventListener("click", confirmFN);
}

function deactivateButtons() {
  for (var i = 1; i <= numOfDragAns; i++) {
    if (i < 3) {
      exportRoot["q" + currentQ + "p" + i].alpha = 0;
    }
    exportRoot["q" + currentQ + "a" + i].alpha = 0;
    exportRoot["q" + currentQ + "a" + i].cursor = "auto";
    exportRoot["q" + currentQ + "a" + i].removeEventListener("pressmove", moveFn);
    exportRoot["q" + currentQ + "a" + i].removeEventListener("pressup", pressupFn);
    exportRoot["q" + currentQ + "a" + i].removeEventListener("mouseover", over2);
    exportRoot["q" + currentQ + "a" + i].removeEventListener("mouseout", out);
  }
  exportRoot.confirmBtn.alpha = 0;
  exportRoot["confirmBtn"].cursor = "auto";
  exportRoot["confirmBtn"].removeEventListener("click", confirmFN);
}

function activateClick() {
  for (var i = 1; i <= numOfAns; i++) {
    exportRoot["q4a" + i].gotoAndStop(0);
    exportRoot["q4a" + i].alpha = 1;
    exportRoot["q4a" + i].clicked = true;
    exportRoot["q4a" + i].cursor = "pointer";
    exportRoot["q4a" + i].addEventListener("click", chooseAnsFn);
    exportRoot["q4a" + i].addEventListener("mouseover", over2);
    exportRoot["q4a" + i].addEventListener("mouseout", out);
  }
  confirmAction = false;
  exportRoot["confirmBtn"].alpha = 0;
  exportRoot["confirmBtn"].cursor = "pointer";
  exportRoot["confirmBtn"].addEventListener("click", confirmFN);
}

function deactivateClick() {
  for (var i = 1; i <= numOfAns; i++) {
    // exportRoot["q4a" + i].gotoAndStop(0);
    exportRoot["q4a" + i].alpha = 0;
    exportRoot["q4a" + i].cursor = "auto";
    exportRoot["q4a" + i].clicked = false;
    exportRoot["q4a" + i].removeEventListener("click", chooseAnsFn);
    exportRoot["q4a" + i].removeEventListener("mouseover", over2);
    exportRoot["q4a" + i].removeEventListener("mouseout", out);
  }
  exportRoot["confirmBtn"].alpha = 0;
  exportRoot["confirmBtn"].cursor = "auto";
  exportRoot["confirmBtn"].removeEventListener("click", confirmFN);
}

function chooseAnsFn(e3) {
  muteSound();
  dimSound();
  if (timerFrame < 60) {
    sounds.clickSd.play();

    activateClick();
    e3.currentTarget.gotoAndStop(3);
    e3.currentTarget.cursor = "auto";
    e3.currentTarget.clickAns = e3.currentTarget.name;
    e3.currentTarget.removeEventListener("click", chooseAnsFn);
    e3.currentTarget.removeEventListener("mouseover", over2);
    e3.currentTarget.removeEventListener("mouseout", out);
    answerName = e3.currentTarget.name;
    console.log("answerName " + answerName);
    exportRoot["confirmBtn"].alpha = 1;
  }
}

function moveFn(e) {
  bounds = exportRoot.getBounds();
  e.currentTarget.disX = stage.mouseX - e.currentTarget.x;
  e.currentTarget.disY = stage.mouseY - e.currentTarget.y;
  e.currentTarget.x = e.stageX / stage.scaleX;
  e.currentTarget.y = e.stageY / stage.scaleY;
  // e.currentTarget.x = Math.max(bounds.x+e.currentTarget.nominalBounds.width/2.1, Math.min(bounds.x+bounds.width-e.currentTarget.nominalBounds.width/1.65, e.stageX / (stage.scaleX)));
  // e.currentTarget.y = Math.max(bounds.y+e.currentTarget.nominalBounds.height/1.7, Math.min(bounds.y+bounds.height-e.currentTarget.nominalBounds.height/1.9, e.stageY / (stage.scaleY)));
  e.currentTarget.removeEventListener("mouseover", over2);
  e.currentTarget.removeEventListener("mouseout", out);
  exportRoot.addChild(e.currentTarget);
}


function pressupFn(e2) {
  muteSound();
  dimSound();
  found = false;
  if (timerFrame < 60) {
    for (var i = 1; i <= numOfPlaces; i++) {
      if (
        Math.abs(e2.currentTarget.x - exportRoot["q" + currentQ + "p" + i].x) <
        250 &&
        Math.abs(e2.currentTarget.y - exportRoot["q" + currentQ + "p" + i].y) <
        70
      ) {
        sounds.clickSd.play();
        found = true;
        if (
          exportRoot["q" + currentQ + "p" + i].ansNum == null &&
          e2.currentTarget.placeNum == null
        ) {
          counter++;
          l("if++ counter = " + counter);
          // stopAllSounds();
        }
        if (exportRoot["q" + currentQ + "p" + i].ansNum !== null) {
          var prevAnsNum = exportRoot["q" + currentQ + "p" + i].ansNum;
          if (e2.currentTarget.placeNum !== null) {
            var prevPlaceNum = e2.currentTarget.placeNum;
            createjs.Tween.get(exportRoot["q" + currentQ + "a" + prevAnsNum], {
              override: true,
            }).to(
              {
                x: exportRoot["q" + currentQ + "p" + prevPlaceNum].x,
                y: exportRoot["q" + currentQ + "p" + prevPlaceNum].y,
              },
              150,
              createjs.Ease.easeOut
            );
            exportRoot["q" + currentQ + "a" + prevAnsNum].placeNum =
              prevPlaceNum;
            exportRoot["q" + currentQ + "p" + prevPlaceNum].ansNum = prevAnsNum;
          } else {
            createjs.Tween.get(exportRoot["q" + currentQ + "a" + prevAnsNum], {
              override: true,
            }).to(
              {
                x: exportRoot["q" + currentQ + "a" + prevAnsNum].xPos,
                y: exportRoot["q" + currentQ + "a" + prevAnsNum].yPos,
              },
              200,
              createjs.Ease.easeOut
            );
            exportRoot["q" + currentQ + "a" + prevAnsNum].placeNum = null;
            exportRoot["q" + currentQ + "a" + prevAnsNum].addEventListener(
              "mouseover",
              over2
            );
            exportRoot["q" + currentQ + "a" + prevAnsNum].addEventListener(
              "mouseout",
              out
            );
            exportRoot["q" + currentQ + "a" + prevAnsNum].cursor = "pointer";
            exportRoot["q" + currentQ + "a" + prevAnsNum].gotoAndStop(0);
          }
        } else {
          if (e2.currentTarget.placeNum !== null) {
            var prevPlaceNum = e2.currentTarget.placeNum;
            exportRoot["q" + currentQ + "p" + prevPlaceNum].ansNum = null;
          }
        }
        e2.currentTarget.x = exportRoot["q" + currentQ + "p" + i].x;
        e2.currentTarget.y = exportRoot["q" + currentQ + "p" + i].y;
        e2.currentTarget.addEventListener("pressmove", moveFn);
        e2.currentTarget.addEventListener("pressup", pressupFn);
        e2.currentTarget.cursor = "auto";
        e2.currentTarget.gotoAndStop(3);
        e2.currentTarget.placeNum = i;

        exportRoot["q" + currentQ + "p" + i].ansNum = e2.currentTarget.id;

        if (counter == numOfPlaces) {
          exportRoot.confirmBtn.alpha = 1;
          confirmAction = true;
        } else {
          exportRoot.confirmBtn.alpha = 0;
        }
        break;
      }
    }
    if (found == false) {
      if (e2.currentTarget.placeNum != null) {
        var prevPlaceNum = e2.currentTarget.placeNum;

        e2.currentTarget.placeNum !== null ? counter-- : counter;

        exportRoot["q" + currentQ + "p" + prevPlaceNum].ansNum = null;
        e2.currentTarget.placeNum = null;

        l("if-- counter = " + counter);
        exportRoot.confirmBtn.alpha = 0;
        confirmAction = false;
      }
      e2.currentTarget.addEventListener("mouseover", over2);
      e2.currentTarget.addEventListener("mouseout", out);
      e2.currentTarget.cursor = "pointer";
      e2.currentTarget.gotoAndStop(0);

      createjs.Tween.get(e2.currentTarget, {
        override: true,
      }).to(
        {
          x: e2.currentTarget.xPos,
          y: e2.currentTarget.yPos,
        },
        50,
        createjs.Ease.easeOut
      );
    }
  } else {
    deactivateButtons();
  }
}

function confirmFN() {
  deActivPrvAndNext();
  hideFB();
  stopAllSounds();
  sounds.clickSd.play();
  clearInterval(timerInterval);
  if (currentQ <= 3) {
    for (var i = 1; i <= numOfDragAns; i++) {
      if (
        exportRoot["q" + currentQ + "a" + i].id ==
        exportRoot["q" + currentQ + "a" + i].placeNum
      ) {
        score++;
      }
    }
    console.log("currentQ " + currentQ);
    deactivateButtons();
  } else {
    deactivateClick();
    checkScore();
  }

  console.log(score + " Count Score");
  unDimSound();
  playSound();
  confirmFB();
}
function confirmFB() {
  confirmAction = false;

  if (score == numOfPlaces) {
    exportRoot["rightFB"].playV = true;
    exportRoot["rightFB"].alpha = 1;
    exportRoot["rightFB"].gotoAndPlay(2);
    for (var i = 1; i <= numOfAns; i++) {
      console.log(i);
      exportRoot["rightFB"]["quz" + i].alpha = 0;
    }
    exportRoot["rightFB"]["quz" + currentQ].alpha = 1;
    exportRoot["rightFB"]["quz" + currentQ].gotoAndPlay(2);
    exportRoot["confirmBtn"].alpha = 0;
  } else {
    attempts++;
    if (attempts == maxAttempts) {
      exportRoot["wrongFB"].playV = true;
      exportRoot["wrongFB"].alpha = 1;
      exportRoot["wrongFB"].gotoAndPlay(2);

      for (var i = 1; i <= numOfAns; i++) {
        exportRoot["wrongFB"]["quz" + i].alpha = 0;
      }
      exportRoot["wrongFB"]["quz" + currentQ].alpha = 1;
      exportRoot["wrongFB"]["quz" + currentQ].gotoAndPlay(2);
      exportRoot["confirmBtn"].alpha = 0;
    } else {
      exportRoot["tryFB"].playV = true;
      exportRoot["tryFB"].alpha = 1;
      exportRoot["tryFB"].gotoAndPlay(2);

      for (var i = 1; i <= numOfAns; i++) {
        exportRoot["tryFB"]["quz" + i].alpha = 0;
      }
      exportRoot["tryFB"]["quz" + currentQ].alpha = 1;
      exportRoot["tryFB"]["quz" + currentQ].gotoAndPlay(2);
      exportRoot["confirmBtn"].alpha = 0;
    }
  }
}
function checkScore() {
  if (exportRoot["q4a1"].clickAns !== null) {
    score = numOfPlaces;
    console.log(score + " Count Score in if");
  }
}

function nextQFn() {
  stopAllSounds();
  hideFB();
  exportRoot.addChild(exportRoot["hideSymb"]);
  currentQ++;
  timerFrame = 0;
  exportRoot["timerSymb"].gotoAndStop(timerFrame);
  QuzComplete = currentQ;
  score = 0;
  attempts = 0;
  counter = 0;
  createjs.Tween.get(exportRoot["hideSymb"], {
    override: true,
  })
    .to(
      {
        alpha: 1,
      },
      500,
      createjs.Ease.easeOut
    )
    .call(function () {
      exportRoot.gotoAndStop("q" + currentQ);
      createjs.Tween.get(exportRoot["hideSymb"], {
        override: true,
      }).to(
        {
          alpha: 0,
        },
        300,
        createjs.Ease.easeOut
      );
    });

  currentQ <= 3 ? activateButtons() : activateClick();
  Timer();

  sounds["quizSd" + currentQ].play();
  currentSound = sounds["quizSd" + currentQ];
  unDimSound();
  playSound();
  currentSound.on("end", () => {
    dimSound();
  });
  activPrvAndNext();
}

function activPrvAndNext() {
  exportRoot.prevQuzComplete.alpha = 1;

}

function deActivPrvAndNext() {
  exportRoot.nextQuzComplete.alpha = 0;
  exportRoot.prevQuzComplete.alpha = 0;
}

function retryFN() {
  clearInterval(timerInterval);
  counter = 0;
  score = 0;
  stopAllSounds();
  dimSound();
  muteSound();
  sounds.clickSd.play();
  exportRoot.gotoAndStop("q" + currentQ);
  if (currentQ <= 3) {
    retryV = true;
    activateButtons();
    retryV = false;
  } else {
    activateClick();
  }
  timerFrame = 0;
  exportRoot["timerSymb"].gotoAndStop(timerFrame);
  hideFB();
  Timer();
  if (currentQ > 1) {
    activPrvAndNext();
  }
}

function over(e) {
  e.currentTarget.gotoAndStop(1);
}
function over2(e) {
  e.currentTarget.gotoAndStop(2);
}

function out(e) {
  e.currentTarget.gotoAndStop(0);
}

function Timer() {
  timerInterval = setInterval(timerFn, 1000);
}

function timerFn() {
  timerFrame++;
  exportRoot["timerSymb"]["timerInSymb"].alpha = 0;
  exportRoot["timerSymb"].gotoAndStop(timerFrame);
  if (timerFrame == 60) {
    timeOut();
  }
}

function timeOut() {
  clearInterval(timerInterval);
  stopAllSounds();
  exportRoot.confirmBtn.alpha = 0;

  sounds.timeOutSd.play();
  attempts++;
  sounds.timeOutSd.on("end", () => {
    if (attempts == maxAttempts) {
      exportRoot["wrongFB"].playV = true;
      exportRoot["wrongFB"].alpha = 1;
      exportRoot["wrongFB"].gotoAndPlay(2);

      for (var i = 1; i <= numOfAns; i++) {
        exportRoot["wrongFB"]["quz" + i].alpha = 0;
      }
      exportRoot["wrongFB"]["quz" + currentQ].alpha = 1;
      exportRoot["wrongFB"]["quz" + currentQ].gotoAndPlay(2);
    } else {
      exportRoot["timeOutFB"].playV = true;
      exportRoot["timeOutFB"].alpha = 1;
      exportRoot["timeOutFB"].gotoAndPlay(0);
    }
    if (currentQ <= 3) {
      deactivateButtons();
    } else {
      deactivateClick();
    }
  });
  unDimSound();
  playSound();
  deActivPrvAndNext();

}

function showBtns() {
  if (currentQ <= 3) {
    if (score == numOfPlaces || attempts == maxAttempts) {
      console.log(attempts);
      exportRoot["nextBtnQuz"].alpha = 1;
    } else {
      console.log(attempts);
      exportRoot["retryBtn"].alpha = 1;
    }
  } else if (currentQ == 4 && attempts < maxAttempts && score !== numOfPlaces) {
    exportRoot["retryBtn"].alpha = 1;
  }
}
// sound Button
function playSound() {
  exportRoot["muteBtn"].alpha = 0;
  exportRoot["soundBtn"].alpha = 1;
  soundStatus = true;
  currentSound.volume(1.0);
}
function muteSound() {
  exportRoot["soundBtn"].alpha = 0;
  exportRoot["muteBtn"].alpha = 1;
  soundStatus = false;
  currentSound.volume(0.0);
}

function dimSound() {
  console.log("dim");
  exportRoot["soundBtn"].alpha = 0;
  exportRoot["muteBtn"].cursor = "auto";
  exportRoot["muteBtn"].alpha = 1;
  exportRoot["muteBtn"].gotoAndStop(4);
  exportRoot["muteBtn"].mouseEnabled = false;
}

function unDimSound() {
  exportRoot["soundBtn"].alpha = 1;
  exportRoot["muteBtn"].alpha = 0;
  exportRoot["muteBtn"].cursor = "pointer";
  exportRoot["muteBtn"].gotoAndStop(0);
  exportRoot["muteBtn"].mouseEnabled = true;
}

function nextQuzFn() {

  QuzComplete < currentQ ? QuzComplete++ : QuzComplete;

  exportRoot.gotoAndStop(`q${QuzComplete}`);

  for (var i = 1; i <= numOfAns; i++) {
    if (QuzComplete <= 2) {
      if (currentQ > 1) {
        exportRoot[`q${QuzComplete - 1}a${i}`].alpha = 0;
        if (i < 3) {
          exportRoot[`q${QuzComplete - 1}p${i}`].alpha = 0;
        }
      }
      exportRoot["q" + QuzComplete + "a" + i].alpha = 1;
      if (i < 3) {
        exportRoot["q" + QuzComplete + "p" + i].alpha = 1;
      }
      console.log("QuzComplete: " + QuzComplete);
    } else if (QuzComplete == 3) {
      exportRoot[`q${QuzComplete - 1}a${i}`].alpha = 0;
      if (i < 3) {
        exportRoot[`q${QuzComplete - 1}p${i}`].alpha = 0;
      }
      exportRoot["q" + QuzComplete + "a" + i].alpha = 1;
      if (i < 3) {
        exportRoot["q" + QuzComplete + "p" + i].alpha = 1;
      }
      console.log("QuzComplete: " + QuzComplete);
    }
    if (QuzComplete == numOfAns) {
      exportRoot["q4a" + i].alpha = 1;
      exportRoot[`q${QuzComplete - 1}a${i}`].alpha = 0;
      if (i < 3) {
        exportRoot[`q${QuzComplete - 1}p${i}`].alpha = 0;
      }
    }
  }

  if (QuzComplete == currentQ) {
    exportRoot["nextQuzComplete"].alpha = 0;

    if (confirmAction && currentQ <= 3) {
      exportRoot.confirmBtn.alpha = 1;
    } else if (answerName !== null) {
      exportRoot.confirmBtn.alpha = 1;
    }
    Timer();
  }
}

function prevQuzFn() {
  stopAllSounds();
  clearInterval(timerInterval);
  dimSound();
  muteSound();

  exportRoot.confirmBtn.alpha = 0;

  QuzComplete > 1 ? QuzComplete-- : QuzComplete;
  exportRoot.gotoAndStop(`q${QuzComplete}`);
  exportRoot["nextQuzComplete"].alpha = 1;

  for (let i = 1; i <= numOfAns; i++) {
    if (QuzComplete <= 2) {
      exportRoot[`q${QuzComplete + 1}a${i}`].alpha = 0;
      if (i < 3) {
        exportRoot[`q${QuzComplete + 1}p${i}`].alpha = 0;
      }
    }
    if (QuzComplete <= 3) {
      exportRoot["q" + QuzComplete + "a" + i].alpha = 1;
      exportRoot["q" + QuzComplete + "a" + i].gotoAndStop(4);
      exportRoot["q" + QuzComplete + "a" + i].x = exportRoot["q" + QuzComplete + "a" + i].xPos;
      exportRoot["q" + QuzComplete + "a" + i].y = exportRoot["q" + QuzComplete + "a" + i].yPos;
      if (i < 3) {
        exportRoot["q" + QuzComplete + "p" + i].alpha = 1;
        exportRoot["q" + QuzComplete + "a" + i].x = exportRoot["q" + QuzComplete + "p" + i].x;
        exportRoot["q" + QuzComplete + "a" + i].y = exportRoot["q" + QuzComplete + "p" + i].y;
      }
    }
    if (currentQ == numOfAns) {
      exportRoot["q4a" + i].alpha = 0;
    }
  }
}
