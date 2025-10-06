const puppeteer = require('puppeteer');

function delay(time) {
   return new Promise(function(resolve) { 
       setTimeout(resolve, time)
   });
}

async function run() {
  const browser = await puppeteer.launch({ headless: false, waitUntil: 'load', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.setViewport({
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
  });

  await page.goto('https://pomoc.erecepcja.eu/panel_klienta.html');

  await delay(300);
  
  await page.type('input[name="login"]', '18320501576');
  await page.type('input[name="haslo"]', 'Nowehaslo1.');

  await delay(1000);

  await page.click('button[name="submitLogin"]');
  await page.waitForNavigation();

  console.log('New Page URL:', page.url());

  let dateAv;

  while (true) {
    await delay(2000);
    await page.click("::-p-xpath(//a[contains(., 'Łukasz Przysło')])");
    // await page.click("::-p-xpath(//a[contains(., 'Katarzyna Młudzik')])");

    await delay(300);

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    dateAv = await page.$('.datepicker-days td.active:not(.disabled)');

    if (dateAv) {
      console.log('HERE', dateAv);
      break;
    }

    console.log('available date', dateAv);

    await delay(2000);
    await page.reload();
  }

  await dateAv.click();

  await delay(1500);

  const firstDateAvList = await page.$$('.erecepcja-nav-pills li a');

  if (firstDateAvList.length) {
    console.log('first date available!', firstDateAvList);
    await firstDateAvList[0].click();
  }

  const confirmBtn = await page.waitForSelector('input[name=submitRezerwacjaZalogowanegoKlienta]');

  if (confirmBtn) {
    console.log('buttton found', confirmBtn);
    await confirmBtn.click();
  }

  await delay(5000);

  browser.close();
}

run();