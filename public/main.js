let video = document.getElementById('video');
let snap = document.getElementById('snap');
let results = document.getElementById('results');

const olog = console.log;
console.log = function(txt) {
  olog(txt)
  results.innerHTML += JSON.stringify(txt) + '<br>'
}

let width = 320; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream
let streaming = false;

video.addEventListener('canplay', function(ev) {
  if (!streaming) {
    height = video.videoHeight / (video.videoWidth / width);
    video.setAttribute('width', width);
    video.setAttribute('height', height);
    streaming = true;
  }
}, false);

navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: 'environment', // prioritize back camera
  },
  audio: false,
}).then(function(stream) {
  video.srcObject = stream;
  video.play();
}).catch(function(err) {
  console.log("An error occurred: " + err);
});

function take_snapshot() {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const base = canvas.toDataURL("image/jpeg", 1.0)
  snap.src = base;
  
  serverProcessImg(base);
  // localProcessImg(base)
}

function serverProcessImg(data) {
  results.innerHTML += 'please wait... <br>';
  $.ajax({
    type: 'POST',
    url: './ocr',
    data: {
      'data': data
    },
  }).done(function(data) {
    if (!data.length)
      data = 'nothing found';
    results.innerHTML += '----------------<br>';
    results.innerHTML += data + '<br>';
    results.innerHTML += '----------------<br>';
    window.scrollTo(0,document.body.scrollHeight);
  });
}

function localProcessImg(data) {
  Tesseract.recognize(
    base, 'eng', { logger: m => console.log(m) }
    )
  .then(({ data: { text } }) => {
    results.innerHTML += 'text: ' + text + '<br>';
  });
}