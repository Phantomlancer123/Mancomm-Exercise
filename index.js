const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const url = process.argv[2];

if (!url) {
  console.error('Please provide a URL as a command-line argument');
  process.exit(1);
}

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    console.log($);
    const json = parseHtmlToJson($);
    fs.writeFileSync('output.json', JSON.stringify(json, null, 2));
    console.log('JSON file created successfully.');
  })
  .catch(error => {
    console.error('Error fetching or parsing the HTML:', error);
  });

function parseHtmlToJson($) {
    return $;
}