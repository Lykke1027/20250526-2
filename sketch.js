let video;
let faceMesh;
let predictions = [];
let mask1, mask2;
let currentMask;
let triangles;
let uvCoords;

function preload() {
  mask1 = loadImage('mask1.jpg');
  mask2 = loadImage('mask2.png');
  faceMesh = ml5.faceMesh({ maxFaces: 1 });  // 初始化 FaceMesh 模型
}

function setup() {
  createCanvas(640, 480, WEBGL);  // 使用 WEBGL 模式支援 texture mapping
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 啟動偵測
  faceMesh.detectStart(video, gotResults);

  // 載入內建的三角形與 UV 索引
  triangles = faceMesh.getTriangles();
  uvCoords = faceMesh.getUVCoords();

  currentMask = mask1;
}

function gotResults(results) {
  predictions = results;
}

function draw() {
  translate(-width / 2, -height / 2);
  background(0);
  image(video, 0, 0, width, height);

  if (predictions.length > 0 && triangles && uvCoords) {
    let face = predictions[0];

    texture(currentMask);
    textureMode(NORMAL);
    noStroke();
    beginShape(TRIANGLES);

    for (let i = 0; i < triangles.length; i++) {
      let [a, b, c] = triangles[i];

      let pa = face.keypoints[a];
      let pb = face.keypoints[b];
      let pc = face.keypoints[c];

      let uva = uvCoords[a];
      let uvb = uvCoords[b];
      let uvc = uvCoords[c];

      vertex(pa.x, pa.y, uva[0], uva[1]);
      vertex(pb.x, pb.y, uvb[0], uvb[1]);
      vertex(pc.x, pc.y, uvc[0], uvc[1]);
    }

    endShape();
  }
}

function mousePressed() {
  if (mouseButton === LEFT) {
    currentMask = (currentMask === mask1) ? mask2 : mask1;
  }
}
