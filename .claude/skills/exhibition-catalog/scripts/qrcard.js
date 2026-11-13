// 전시장용 A5 QR 안내 카드 (PDF + PNG + QR 단독 PNG)
// 사용: node qrcard.js <출력폴더> <URL> <작가명> <전시명(가·운·데·점)> <주색 #hex> <강조색 #hex>
// 필요: npm i qrcode (아무 빈 폴더에서), Playwright(환경에 기본 설치)
const path = require('path'), fs = require('fs');
const [out, url, artist, title, c1, c2] = process.argv.slice(2);
const QR = require(require.resolve('qrcode', { paths: [process.cwd(), __dirname] }));
const { chromium } = require('playwright');
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const qrPng = path.join(out, 'qr.png');
  await QR.toFile(qrPng, url, { errorCorrectionLevel: 'H', width: 2000, margin: 4, color: { dark: '#1F1D1B', light: '#FFFFFF' } });
  const b64 = fs.readFileSync(qrPng).toString('base64');
  const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500;700;900&display=swap" rel="stylesheet">
<style>body{margin:0}.c{width:148mm;height:210mm;box-sizing:border-box;padding:16mm 14mm;background:#FBFAF7;font-family:'Noto Sans KR';color:#1F1D1B;display:flex;flex-direction:column;align-items:center;text-align:center}
.n{color:${c1};font-weight:900;font-size:34pt;letter-spacing:.06em}.n small{font-size:20pt;font-weight:700;margin-left:6px;letter-spacing:0}
.t{color:${c2};font-weight:900;font-size:22pt;letter-spacing:.08em;margin-top:2mm}
img{width:92mm;height:92mm;margin-top:10mm}.m{margin-top:8mm;font-size:17pt;font-weight:700;line-height:1.5;word-break:keep-all}
.u{margin-top:5mm;font-size:12pt;font-weight:500;color:#4A4540}</style></head>
<body><div class="c"><div class="n">${artist}<small>개인전</small></div><div class="t">${title}</div>
<img src="data:image/png;base64,${b64}"><div class="m">작품을 폰으로 보고,<br>축하 한마디를 남겨 주세요</div>
<div class="u">휴대폰 카메라를 QR에 비춰 주세요 · ${host}</div></div></body></html>`;
  const tmp = path.join(out, 'card.html'); fs.writeFileSync(tmp, html);
  const b = await chromium.launch(); const p = await b.newPage({ deviceScaleFactor: 3 });
  await p.goto('file://' + tmp, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  await p.locator('.c').screenshot({ path: path.join(out, 'qr-card-A5.png') });
  await p.pdf({ path: path.join(out, 'qr-card-A5.pdf'), width: '148mm', height: '210mm', printBackground: true, pageRanges: '1' });
  await b.close(); fs.unlinkSync(tmp); console.log('ok');
})();
