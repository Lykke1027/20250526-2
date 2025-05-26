let video;
let facemesh;
let predictions = [];
let mask1, mask2;
let currentMask;
let faceTriangles; // 用於存放三角形索引

function preload() {
  mask1 = loadImage('mask1.jpg');
  mask2 = loadImage('mask2.png');
  // 取得官方的468點三角形索引
  faceTriangles = loadJSON('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights/triangles.json');
}

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', results => {
    predictions = results;
  });

  currentMask = mask1;
}

function modelReady() {
  // 模型載入完成
}

function draw() {
  image(video, 0, 0, width, height);

  if (predictions.length > 0 && faceTriangles) {
    const keypoints = predictions[0].scaledMesh;

    // 將 mask 貼到臉上
    noStroke();
    texture(currentMask);
    for (let i = 0; i < faceTriangles.length; i += 3) {
      const a = faceTriangles[i];
      const b = faceTriangles[i + 1];
      const c = faceTriangles[i + 2];
      beginShape();
      // 臉部點
      vertex(keypoints[a][0], keypoints[a][1], a % currentMask.width, a % currentMask.height);
      vertex(keypoints[b][0], keypoints[b][1], b % currentMask.width, b % currentMask.height);
      vertex(keypoints[c][0], keypoints[c][1], c % currentMask.width, c % currentMask.height);
      endShape(CLOSE);
    }
  }
}

// 滑鼠左鍵切換 mask
function mousePressed() {
  if (mouseButton === LEFT) {
    currentMask = (currentMask === mask1) ? mask2 : mask1;
  }
}
