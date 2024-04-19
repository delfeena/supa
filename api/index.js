
const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const interceptedURLs = []; // Array to store intercepted URLs

  // Enable request interception
  await page.setRequestInterception(true);

  // Event listener to intercept requests
  page.on('request', interceptedRequest => {
    // Store the intercepted URL
    interceptedURLs.push(interceptedRequest.url());
    
    // Continue with the intercepted request
    interceptedRequest.continue();
  });

  try {
    // Navigate to the URL
    await page.goto('https://multiembed.mov/directstream.php?video_id=tt6791350');

    // Wait for some time to capture requests
    await page.waitForTimeout(5000);

    // Close the browser
    await browser.close();
    
    // Render intercepted URLs on the screen
    res.status(200).send(`
      <h1>Intercepted Requests</h1>
      <ul>
        ${interceptedURLs.map(url => `<li>${url}</li>`).join('')}
      </ul>
    `);
  } catch (error) {
    console.error('An error occurred:', error);
    await browser.close();
    res.status(500).send('An error occurred while executing the Puppeteer script');
  }
};
