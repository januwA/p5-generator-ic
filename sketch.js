let canvas;

// 1
let basicImg;
let basicBox;
let fileInputEle;

// 2
let textareaEle;
let sizes = [];
let textareaInitValue = `
48x48
72x72
96x96
144x144
192x192
`;

// 3
let showBtn;
let showBox;
let imgs = [];

// 4
let downloadBtn;

function setup() {
  canvas = createCanvas(200, 200);
  background(0);
  canvas.hide();

  createElement("h2", "1. 上传图片");
  fileInputEle = createFileInput(gotFile);
  basicBox = createDiv("");

  createElement("h2", "2. 设置尺寸");
  textareaEle = createElement("textarea", textareaInitValue);
  textareaEle.attribute("rows", "10");
  textareaEle.attribute("cols", "20");

  createElement("h2", "3. 预览");
  showBtn = createButton("Show");
  showBox = createElement("ol");
  showBtn.mouseClicked(showClicked);

  createElement("h2", "4. 下载");
  downloadBtn = createButton("Downlaod");
  downloadBtn.mouseClicked(startDownload);
}

/**
 * 点击下载事件
 */
function startDownload() {
  if (!imgs.length) {
    return alert("先预览!!");
  }
  drawDown(imgs);
}

/**
 * 下载处理
 * @param {*} images
 */
function drawDown(images) {
  if (images.length === 0) return false;
  let { data, w, h } = images[0];
  let img = createImg(data, () => {
    resizeCanvas(w, h);
    image(img, 0, 0, w, h);
    const name = `${w}x${h}_${basicImg.name}`;
    let dbtn = createA("javascript: (void 0)", name);
    dbtn.mouseClicked(e => {
      if (!img) return null;
      const dataURL = canvas.canvas.toDataURL(basicImg.file.type);
      dbtn.attribute("download", name);
      dbtn.attribute("href", dataURL);
    });
    dbtn.elt.click();
    dbtn.hide();
    drawDown(images.slice(1));
  });
  img.hide();
}

/**
 * 展示所有尺寸的图片
 */
function showClicked() {
  if (!basicImg) {
    return alert("先上传图片");
  }
  sizes = gotSizes();
  console.log(sizes);

  if (!sizes.length) {
    return alert("请正确填写尺寸");
  }
  imgs = [];
  showBox.html("");
  for (const s of sizes) {
    const [_, w, h] = /(^\d+)\D+(\d+$)/.exec(s);
    let li = createElement("li", "").parent(showBox);
    createP(s).parent(li);
    imgs.push({ data: basicImg.data, w, h });
    let img = createImg(basicImg.data, () => {
      img.parent(li);
      img.attribute("width", w);
      img.attribute("height", h);
      image(img);
    });
  }
}

/**
 * 获取填写的尺寸
 */
function gotSizes() {
  return textareaEle
    .value()
    .trim()
    .split(/[\r\n]/);
}

/**
 * 获取input上传的图片
 * @param {*} file
 */
function gotFile(file) {
  basicImg = file;
  basicBox.html("");
  imgs = [];
  showBox.html("");
  let img = createImg(file.data, () => {
    img.parent(basicBox);
    // image(img, 0, 0, 200, 200);
  });
  img.size(400, 400);
}
