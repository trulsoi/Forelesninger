const fs = require('fs');
const path = require('path');
const http = require('http');
const assert = require('assert');
const os = require('os');
const puppeteer = require(process.env.PUPPETEER_MODULE || 'puppeteer');
const artifacts = fs.mkdtempSync(path.join(os.tmpdir(), 'inga-browser-'));
console.log('Screenshots:', artifacts);
const root = path.resolve(process.env.WEB_ROOT || path.join(__dirname, '../publisering'));
const mime = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css',
              '.svg':'image/svg+xml', '.ipynb':'application/json'};
const server = http.createServer((req,res) => {
  let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (file.endsWith('/')) file += 'index.html';
  if (!file.startsWith(root + '/') || !fs.existsSync(file)) {res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  await new Promise(r => server.listen(0,'127.0.0.1',r));
  const base='http://127.0.0.1:'+server.address().port;
  const browser = await puppeteer.launch({executablePath:process.env.BROWSER_PATH || '/opt/brave.com/brave/brave',headless:true,
    args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],
    userDataDir:path.join(artifacts,'profile')});
  try {
    const page=await browser.newPage();
    await page.setViewport({width:1366,height:900});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const activity=base+'/INGA1002/aktiviteter/numerisk-derivasjon/';
    await page.goto(activity,{waitUntil:'networkidle0'});
    await page.waitForSelector('#position-board svg');
    const result=()=>page.$eval('#approx',e=>parseFloat(e.textContent.replace(',','.')));
    assert.equal(await result(),11);
    await page.click('[data-method="backward"]');assert.equal(await result(),9);
    await page.click('[data-method="central"]');assert.equal(await result(),10);
    await page.select('#model','cubic');assert.equal(await result(),3.04);
    let combinations=0;
    for (const model of ['quadratic','cubic']) {
      await page.select('#model',model);
      for (const method of ['forward','backward','central']) {
        await page.click('[data-method="'+method+'"]');
        for (const t of [0.5,1,2.5]) for (const h of [0.01,0.2,0.5]) {
          await page.evaluate((t,h)=>{
            document.querySelector('#time').value=t;
            document.querySelector('#step').value=h;
            document.querySelector('#step').dispatchEvent(new Event('input'));
          },t,h);
          const exact=model==='quadratic'?10*t:3*t*t;
          const expected=model==='quadratic'
            ?exact+({forward:5*h,backward:-5*h,central:0}[method])
            :exact+({forward:3*t*h+h*h,backward:-3*t*h+h*h,central:h*h}[method]);
          assert(Math.abs(await result()-expected)<0.0006,JSON.stringify({model,method,t,h}));
          combinations++;
        }
      }
    }
    await page.click('#reset');
    await page.click('#show-tangent');
    assert(await page.$eval('#exact-row',e=>e.hidden));
    await page.click('#reset');
    const before=await page.$eval('#time',e=>+e.value);
    await page.click('#play');await wait(650);await page.click('#play');
    assert((await page.$eval('#time',e=>+e.value))>before,'animation advances');
    await page.click('#reset');
    await page.screenshot({path:path.resolve(artifacts,'activity-desktop.png'),fullPage:true});
    await page.setViewport({width:390,height:844});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile horizontal overflow');
    await page.screenshot({path:path.resolve(artifacts,'activity-mobile.png'),fullPage:true});
    await page.setViewport({width:1366,height:900});
    await page.goto(base+'/INGA1002/forelesning/03-numerisk-derivasjon/',{waitUntil:'networkidle0'});
    await page.waitForFunction(()=>window.Reveal && Reveal.isReady());
    await page.waitForFunction(()=>document.querySelector('.katex'));
    await wait(1500);
    const slideCount=await page.evaluate(()=>Reveal.getTotalSlides());
    const issues=[];
    for(let i=0;i<slideCount;i++) {
      await page.evaluate(i=>Reveal.slide(i,0,999),i);
      await wait(300);
      const layout=await page.evaluate(()=>{
        const s=Reveal.getCurrentSlide();
        return {title:s.querySelector('h1,h2')?.textContent,height:s.scrollHeight,
          overflow:s.scrollHeight>720,mathErrors:s.querySelectorAll('.katex-error').length};
      });
      if(layout.overflow||layout.mathErrors)issues.push({slide:i,...layout});
      if([0,1,2,4,7,9,11,12,13].includes(i))await page.screenshot({path:path.resolve(artifacts,'slide-'+i+'.png')});
    }
    const frame=page.frames().find(f=>f.url().includes('?embed=1'));
    assert(frame,'Activity iframe is external HTML, not a broken data URL');
    const demoIndex=await page.evaluate(()=>{
      const slides=[...document.querySelectorAll('.reveal .slides > section')];
      return slides.findIndex(slide=>slide.querySelector('iframe.demo'));
    });
    assert(demoIndex>=0,'Activity slide exists');
    await page.evaluate(i=>Reveal.slide(i),demoIndex);
    await wait(300);
    assert(await frame.$('#position-board svg'),'iframe graph exists');
    await frame.click('#reset');
    assert.equal(await frame.$eval('#approx',e=>e.textContent),'11,000 m/s');
    const over=await frame.evaluate(()=>({height:document.documentElement.scrollHeight,viewport:innerHeight}));
    await page.screenshot({path:path.resolve(artifacts,'slide-demo.png')});
    console.log(JSON.stringify({combinations,slideCount,issues,iframe:over,browserErrors:errors},null,2));
    assert.equal(errors.length,0,'Browser errors');
    assert.equal(issues.length,0,'Slide layout or math errors');
    assert(over.height<=over.viewport,'Iframe content is taller than frame');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
