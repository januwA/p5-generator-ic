let p5Canvas;

// 1
let basicImg; // 上传的原始图片
let basicBox;
let fileInputEle;

// 2
let textareaEle;
let sizes = [];
let textareaInitValue = `48x48
72x72
96x96
144x144
192x192`;

// 3
let showBtn;
let showBox;
let imgs = [];

// 4
let downloadBtn;
let downloadFlutterBtn;

function setup() {
  // 忽略用户计算机设置的系统屏幕显示比例
  pixelDensity(1);
  
  p5Canvas = createCanvas(200, 200);
  background(0);
  p5Canvas.hide();

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
  downloadBtn.mouseClicked(function () {
    if (!imgs.length) {
      return alert("先预览!!");
    }
    drawDown(imgs);
  });

  downloadFlutterBtn = createButton("Downlaod/Flutter");
  downloadFlutterBtn.mouseClicked(downloadFlutterLauncher);
}

async function toFlutterLauncherPng(hDir, index) {
  const hImageFile = await hDir.getFileHandle("ic_launcher.png", {
    create: true,
  });
  const { w, h } = imgs[index];
  const img = createImg(basicImg.data, async () => {
    resizeCanvas(w, h);
    image(img, 0, 0, w, h);
    p5Canvas.canvas.toBlob(async function (blob) {
      const w$ = await hImageFile.createWritable();
      await w$.write(blob);
      await w$.close();
    });
  });
  img.hide();
}

/**
 * 下载处理
 * @param {*} images
 */
function drawDown(images) {
  if (images.length === 0) return false;
  let { w, h } = images[0];
  let img = createImg(basicImg.data, () => {
    resizeCanvas(w, h);
    image(img, 0, 0, w, h);
    const name = `${w}x${h}_${basicImg.name}`;
    let dbtn = createA("javascript: (void 0)", name);
    dbtn.mouseClicked((e) => {
      if (!img) return null;
      const dataURL = p5Canvas.canvas.toDataURL(basicImg.file.type);
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
    imgs.push({ w, h });
    let img = createImg(basicImg.data, () => {
      img.parent(li);
      img.attribute("width", w);
      img.attribute("height", h);
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

async function downloadFlutterLauncher() {
  if (!imgs.length) {
    return alert("先预览!!");
  }

  if (!window.showDirectoryPicker) {
    return alert("not showDirectoryPicker API");
  }

  // 获取目录句柄
  const hSelectDir = await showDirectoryPicker();

  // 创建新目录，如果存在直接覆盖
  const hNewDir = await hSelectDir.getDirectoryHandle("launcher-res", {
    create: true,
  });

  let hDir = await hNewDir.getDirectoryHandle("mipmap-mdpi", {
    create: true,
  });
  await toFlutterLauncherPng(hDir, 0);

  hDir = await hNewDir.getDirectoryHandle("mipmap-hdpi", {
    create: true,
  });
  await toFlutterLauncherPng(hDir, 1);

  hDir = await hNewDir.getDirectoryHandle("mipmap-xhdpi", {
    create: true,
  });
  await toFlutterLauncherPng(hDir, 2);

  hDir = await hNewDir.getDirectoryHandle("mipmap-xxhdpi", {
    create: true,
  });
  await toFlutterLauncherPng(hDir, 3);

  hDir = await hNewDir.getDirectoryHandle("mipmap-xxxhdpi", {
    create: true,
  });
  await toFlutterLauncherPng(hDir, 4);
}
