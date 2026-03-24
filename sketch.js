let weeds = [];
let bubbles = [];
const colors = ['#9b5de5', '#f15bb5', '#fee440', '#00bbf9', '#00f5d4'];

function setup() {
  // 建立全螢幕畫布，並將畫布存入變數
  let canvas = createCanvas(windowWidth, windowHeight);
  
  // 【關鍵設定 1】：讓畫布可以被「滑鼠穿透」，這樣才能點擊到後面的網頁
  canvas.style('pointer-events', 'none');
  // 將畫布固定在最上層
  canvas.position(0, 0);
  canvas.style('z-index', '10');

  // 【關鍵設定 2】：建立 iframe 並載入指定網址
  let myIframe = createElement('iframe');
  myIframe.attribute('src', 'https://www.et.tku.edu.tw');
  // 設定 iframe 樣式，使其填滿畫面並置於畫布後方
  myIframe.position(0, 0);
  myIframe.style('width', '100vw');
  myIframe.style('height', '100vh');
  myIframe.style('border', 'none');
  myIframe.style('z-index', '1'); // 確保在畫布底下

  generateWeeds();
}

function generateWeeds() {
  weeds = [];
  for (let i = 0; i < 70; i++) {
    let c = color(random(colors));
    c.setAlpha(180); // 加入一點點透明 (0-255)
    weeds.push({
      x: random(width),
      color: c,
      strokeW: random(20, 35),
      hRatio: random(0.2, 0.45),
      speed: random(0.005, 0.02),
      noiseOffset: random(1000)
    });
  }
}

// 確保視窗調整大小時，畫布跟著調整
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateWeeds();
}

function draw() {
  // 【關鍵設定 3】：每次繪製前先清除畫布，避免半透明背景不斷疊加變成不透明！
  clear(); 
  
  // 設定背景顏色 (透明度 0.3)
  background(144, 224, 239, 255 * 0.3);

  noFill();            // 不填滿形狀，只畫線條
  strokeCap(ROUND);    // 讓線條端點圓潤

  for (let w of weeds) {
    stroke(w.color);
    strokeWeight(w.strokeW);

    let startX = w.x;
    let weedHeight = height * w.hRatio;
    let segmentSize = 10;

    beginShape();
    
    // 迴圈從 0 (根部) 跑到 weedHeight (頂端)
    for (let i = 0; i <= weedHeight; i += segmentSize) {
      let y = height - i;
      let nVal = noise(i * 0.01 + w.noiseOffset, frameCount * w.speed);
      let sway = map(nVal, 0, 1, -30, 30);
      let strength = i / weedHeight; 
      let x = startX + (sway * strength * 2);

      curveVertex(x, y);

      if (i === 0) {
        curveVertex(x, y);
      }
      if (i + segmentSize > weedHeight) {
        curveVertex(x, y);
      }
    }
    endShape();
  }

  // 產生並繪製水泡
  if (random(1) < 0.03) {
    bubbles.push(new Bubble());
  }

  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].display();
    if (bubbles[i].isFinished()) {
      bubbles.splice(i, 1);
    }
  }
}

class Bubble {
  constructor() {
    this.x = random(width);
    this.y = height + 10;
    this.r = random(5, 15);
    this.speed = random(1, 3);
    this.popY = random(height * 0.2, height * 0.8);
    this.popped = false;
    this.popTimer = 15;
  }

  update() {
    if (!this.popped) {
      this.y -= this.speed;
      this.x += random(-0.5, 0.5);
      
      if (this.y < this.popY) {
        this.popped = true;
      }
    } else {
      this.popTimer--;
      this.r += 0.5;
    }
  }

  display() {
    if (this.popped) {
      noFill();
      stroke(255, map(this.popTimer, 15, 0, 255, 0));
      strokeWeight(1);
      ellipse(this.x, this.y, this.r * 2);
    } else {
      noStroke();
      fill(255, 127);
      ellipse(this.x, this.y, this.r * 2);
      fill(255, 204);
      ellipse(this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.4);
    }
  }

  isFinished() {
    return this.popped && this.popTimer <= 0;
  }
}