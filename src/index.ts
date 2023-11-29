const mainScore = document.getElementById('mainScore') as HTMLSpanElement;

  const container = document.querySelector('.wheel__container') as HTMLDivElement;
  const spinButton = document.getElementById('spin') as HTMLButtonElement;
  const resetButton = document.getElementById('reset') as HTMLButtonElement;
  const wheelPointer = document.querySelector('.wheel__pointer--score') as HTMLDivElement;
  let startScore: number = 0;
  
  let spin: number = Math.ceil(Math.random() * 1000);
  mainScore.innerText = 'score: ' + startScore;
  
  spinButton.onclick = function () {
    container.style.transform = 'rotate(' + spin + 'deg)';
    const timeout: number = spin;
    spin += Math.ceil(Math.random() * 1000);
    setTimeout(function () {
      const closestSection: HTMLDivElement | null = findClosestSection();
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
  
  function findClosestSection(): HTMLDivElement | null {
    const pointerCenter = getCenter(wheelPointer);
    let closestSection: HTMLDivElement | null = null;
    let closestDistance: number = Number.MAX_SAFE_INTEGER;
  
    const sections: NodeListOf<HTMLDivElement> = container.querySelectorAll('.wheel__section');
    
    sections.forEach((section: HTMLDivElement) => {
      const sectionCenter = getCenter(section);
      const distance = calculateDistance(pointerCenter, sectionCenter);
  
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    });
  
    return closestSection;
  }
  
  function getCenter(element: HTMLElement): { x: number; y: number } {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }
  
  function calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }

  function showPopup(message: string): void {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerText = message;
  
    document.body.appendChild(popup);
  
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 2000);
  }

  function winningScore(winningSection: HTMLDivElement): void {
    const value: string | null = winningSection.getAttribute('data-value');
    if (value) {
      startScore += parseInt(value);
      mainScore.innerText = 'score: ' + startScore;
      showPopup('You won ' + value);
    }
  }
  
  function startCoinAnimation(): void {
    const canvas: HTMLCanvasElement = document.getElementById('animation__coin') as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    let animationData: any;
    let animationTimeout: any;
  
    fetch('./coin-anim.json')
      .then((response) => response.json())
      .then((data) => {
        animationData = data;
        loadAndPlayAnimation();
      })
      .catch((error) => {
        console.error('Ошибка загрузки данных анимации:', error);
      });
  
    function loadAndPlayAnimation(): void {
      const atlasImage: HTMLImageElement = new Image();
      atlasImage.src = './images/coin-anim.png';
  
      atlasImage.onload = function () {
        playAnimation(animationData, atlasImage, canvas, ctx);
      };
    }
  
    function playAnimation(
      animationData: { animations: { 'coin-anim': string[] }; frames: { [key: string]: any } },
      atlasImage: HTMLImageElement,
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D | null
    ): void {
      let frameIndex: number = 0;
      const animationStartTime: number = performance.now();
  
      function animate(): void {
        const currentTime: number = performance.now();
        const elapsedTime: number = currentTime - animationStartTime;
  
        if (elapsedTime < 3000) {
          const currentFrameName: string = animationData.animations['coin-anim'][frameIndex];
          const currentFrameInfo: any = animationData.frames[currentFrameName];
  
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
  
            ctx.drawImage(
              atlasImage,
              currentFrameInfo.frame.x,
              currentFrameInfo.frame.y,
              currentFrameInfo.frame.w,
              currentFrameInfo.frame.h,
              0,
              0,
              currentFrameInfo.frame.w / 2,
              currentFrameInfo.frame.h / 2
            );
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
