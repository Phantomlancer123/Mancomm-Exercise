const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const url = process.argv[2];

if (!url) {
  console.error('Please provide a URL as a command-line argument');
  process.exit(1);
}

(async () => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const json = parseHtmlToJson($);
    fs.writeFileSync('output.json', JSON.stringify(json, null, 2));
    console.log('JSON file created successfully.');
  } catch (error) {
    console.error('Error fetching or parsing the HTML:', error);
  }
})();

function parseHtmlToJson($) {
  const json = {
    title: $('div.title h1').text(),
    subtitles: $('div.subtitle').map((index, element) => {
      const $element = $(element);
      return {
        id: $element.attr('id'),
        title: $element.find('h2').text(),
        parts: $element.find('div.part').map((index, partElement) => {
          const $partElement = $(partElement);
          return {
            id: $partElement.attr('id'),
            title: $partElement.find('h1 a').text(),
            subparts: $partElement.find('div.subpart').map((index, subpartElement) => {
              const $subpartElement = $(subpartElement);
              return {
                id: $subpartElement.attr('id'),
                title: $subpartElement.find('h2 a').text(),
                sections: $subpartElement.find('div.section').map((index, sectionElement) => {
                  const $sectionElement = $(sectionElement);
                  return {
                    id: $sectionElement.attr('id'),
                    title: $sectionElement.find('h4 a').text(),
                    paragraphs: $sectionElement.find('p').map((index, paragraphElement) => {
                      const $paragraphElement = $(paragraphElement);
                      return {
                        text: $paragraphElement.text(),
                        indentLevel: ['indent-1', 'indent-2', 'indent-3', 'indent-4', 'indent-5', 'indent-6']
                          .findIndex(className => $paragraphElement.hasClass(className)) + 1
                      };
                    }).get()
                  };
                }).get()
              };
            }).get()
          };
        }).get()
      };
    }).get()
  };

  return json;
}