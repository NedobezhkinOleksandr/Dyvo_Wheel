"use strict";

var mainScore = document.getElementById('mainScore');
var container = document.querySelector('.wheel__container');
var spinButton = document.getElementById('spin');
var resetButton = document.getElementById('reset');
var wheelPointer = document.querySelector('.wheel__pointer--score');
var startScore = 0;
var spin = Math.ceil(Math.random() * 1000);
mainScore.innerText = 'score: ' + startScore;
spinButton.onclick = function () {
  container.style.transform = 'rotate(' + spin + 'deg)';
  var timeout = spin;
  spin += Math.ceil(Math.random() * 1000);
  setTimeout(function () {
    var closestSection = findClosestSection();
    if (closestSection) {
      winningScore(closestSection);
      startCoinAnimation();
    }
  }, timeout + 3800);
};
function resetGame() {
  window.location.href = './index.html';
}
function startGame() {
  window.location.href = './game.html';
}
resetButton.onclick = function () {
  resetGame();
};
function findClosestSection() {
  var pointerCenter = getCenter(wheelPointer);
  var closestSection = null;
  var closestDistance = Number.MAX_SAFE_INTEGER;
  var sections = container.querySelectorAll('.wheel__section');
  sections.forEach(function (section) {
    var sectionCenter = getCenter(section);
    var distance = calculateDistance(pointerCenter, sectionCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestSection = section;
    }
  });
  return closestSection;
}
function getCenter(element) {
  var rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}
function calculateDistance(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
function showPopup(message) {
  var popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerText = message;
  document.body.appendChild(popup);
  setTimeout(function () {
    document.body.removeChild(popup);
  }, 2000);
}
function winningScore(winningSection) {
  var value = winningSection.getAttribute('data-value');
  if (value) {
    startScore += parseInt(value);
    mainScore.innerText = 'score: ' + startScore;
    showPopup('You won ' + value);
  }
}
function startCoinAnimation() {
  var canvas = document.getElementById('animation__coin');
  var ctx = canvas.getContext('2d');
  var animationData;
  var animationTimeout;
  fetch('./coin-anim.json').then(function (response) {
    return response.json();
  }).then(function (data) {
    animationData = data;
    loadAndPlayAnimation();
  })["catch"](function (error) {
    console.error('Ошибка загрузки данных анимации:', error);
  });
  function loadAndPlayAnimation() {
    var atlasImage = new Image();
    atlasImage.src = './images/coin-anim.png';
    atlasImage.onload = function () {
      playAnimation(animationData, atlasImage, canvas, ctx);
    };
  }
  function playAnimation(animationData, atlasImage, canvas, ctx) {
    var frameIndex = 0;
    var animationStartTime = performance.now();
    function animate() {
      var currentTime = performance.now();
      var elapsedTime = currentTime - animationStartTime;
      if (elapsedTime < 3000) {
        var currentFrameName = animationData.animations['coin-anim'][frameIndex];
        var currentFrameInfo = animationData.frames[currentFrameName];
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(atlasImage, currentFrameInfo.frame.x, currentFrameInfo.frame.y, currentFrameInfo.frame.w, currentFrameInfo.frame.h, 0, 0, currentFrameInfo.frame.w / 2, currentFrameInfo.frame.h / 2);
        }
        frameIndex = (frameIndex + 1) % animationData.animations['coin-anim'].length;
        animationTimeout = setTimeout(animate, 16); // 60 fps
      } else {
        if (animationTimeout) {
          clearTimeout(animationTimeout);
        }
      }
    }
    animationTimeout = setTimeout(animate, 0); // Start animation
  }
}