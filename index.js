

const axios = require('axios');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Define an array of product URLs to scrape
const productUrls = [
    'https://www.firsttactical.com/collections/pants-men/products/mens-a2-pant',
    'https://www.firsttactical.com/collections/pants-men/products/mens-v2-tactical-pants',
    'https://www.firsttactical.com/collections/pants-men/products/mens-a2-short'
    // Add more product URLs as needed
];

async function fetchProductPage(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        return html;
    } catch (error) {
        console.error(`Error fetching the page ${url}:`, error);
    }
}

async function extractProductInfo(html) {
    const $ = cheerio.load(html);
    const title = $('.product-single__title').text();
    const price = $('.product__price').text();
    const feature_image = $('.photoswipe__image').attr('data-photoswipe-src');
    const image_urls = [];

    $('.product__thumbs--scroller .product__thumb-item .image-wrap a').each((index, element) => {
        const alt_image = $(element).attr('href');
        if (alt_image) {
            image_urls.push(alt_image);
        }
    });

    return {
        title,
        price,
        feature_image,
        image_urls,
    };
}

async function saveToCsv(productInfoArray) {
    const csvHeaders = [
        { id: 'title', title: 'Title' },
        { id: 'price', title: 'Price' },
        { id: 'feature_image', title: 'Feature Image' },
    ];

    // Dynamically create headers for image URLs
    for (let i = 0; i < productInfoArray.length; i++) {
        for (let j = 0; j < productInfoArray[i].image_urls.length; j++) {
            csvHeaders.push({ id: `image_url_${j + 1}`, title: `Image URL ${j + 1}` });
        }
    }

    const csvWriter = createCsvWriter({
        path: 'product_info.csv',
        header: csvHeaders,
    });

    // Flatten the product data into a single array
    const flattenedData = [];

    for (let i = 0; i < productInfoArray.length; i++) {
        const productInfo = productInfoArray[i];
        const productData = {
            title: productInfo.title,
            price: productInfo.price,
            feature_image: productInfo.feature_image,
        };

        for (let j = 0; j < productInfo.image_urls.length; j++) {
            productData[`image_url_${j + 1}`] = productInfo.image_urls[j];
        }

        flattenedData.push(productData);
    }

    await csvWriter.writeRecords(flattenedData);
    console.log('Data has been written to product_info.csv');
}

// Iterate through the product URLs, scrape data, and save all products
async function scrapeAndSave() {
    const productInfoArray = [];

    for (const url of productUrls) {
        const html = await fetchProductPage(url);
        const productInfo = await extractProductInfo(html);
        productInfoArray.push(productInfo);
    }

    await saveToCsv(productInfoArray);
}

scrapeAndSave();
