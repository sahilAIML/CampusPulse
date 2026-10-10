const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const assetsDir = path.join(publicDir, 'assets');
const sourceVideo = path.join(publicDir, 'Bytexl.mp4');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const requiredVideos = [
  'intro.mp4',
  'outro.mp4',
  'landing.mp4',
  'faculty.mp4',
  'student.mp4',
  'admin.mp4',
  'mobile.mp4',
];

if (fs.existsSync(sourceVideo)) {
  for (const video of requiredVideos) {
    const dest = path.join(assetsDir, video);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(sourceVideo, dest);
      console.log(`Initialized placeholder ${video} from Bytexl.mp4`);
    } else {
      console.log(`${video} already exists, skipping.`);
    }
  }
} else {
  console.log('Source video not found, creating dummy placeholders');
  for (const video of requiredVideos) {
    const dest = path.join(assetsDir, video);
    if (!fs.existsSync(dest)) {
      fs.writeFileSync(dest, Buffer.alloc(1024));
    }
  }
}
