const axios = require('axios');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const productListUrl = 'https://www.firsttactical.com/collections/pants-men'; // URL of the page with multiple product listings

async function fetchProductPage(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        return html;
    } catch (error) {
        console.error(`Error fetching the page ${url}:`, error);
    }
}

async function extractProductLinks(html) {
    const $ = cheerio.load(html);
    const productLinks = [];

    // Modify this selector to match the links to individual product pages
    $('.grid-product__content a').each((index, element) => {
        const productUrl = $(element).attr('href');
        const fullProductUrl = `https://www.firsttactical.com${productUrl}`;
        console.log(fullProductUrl);
        if (fullProductUrl) {
            productLinks.push(fullProductUrl);
        }
    });

    return productLinks;
}

async function extractProductInfo(html) {
    const $ = cheerio.load(html);
    const title = $('.product-single__title').text();
    const price = $('.product__price').text();
    let feature_image = $('.photoswipe__image').attr('data-photoswipe-src');
    if (feature_image) {
        // Remove the starting "//" from the feature image URL
        feature_image = feature_image.replace(/^\/\//, '');
    }
    const image_urls = [];

    $('.product__thumbs--scroller .product__thumb-item .image-wrap a').each((index, element) => {
        const alt_image = $(element).attr('href');
        if (alt_image) {
            // Remove the starting "//" from the image URL
            const cleanedImageUrl = alt_image.replace(/^\/\//, '');
            image_urls.push(cleanedImageUrl);
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
    // Dynamically create headers for image URLs based on the maximum number of images
    let maxImageCount = 0;
    for (const productInfo of productInfoArray) {
        if (productInfo.image_urls.length > maxImageCount) {
            maxImageCount = productInfo.image_urls.length;
        }
    }

    const csvHeaders = [
        { id: 'title', title: 'Title' },
        { id: 'price', title: 'Price' },
        { id: 'feature_image', title: 'Feature Image' },
    ];

    for (let i = 1; i <= maxImageCount; i++) {
        csvHeaders.push({ id: `image_url_${i}`, title: `Image URL ${i}` });
    }

    const csvWriter = createCsvWriter({
        path: 'product_info.csv',
        header: csvHeaders,
    });

    // Flatten the product data into a single array with sequential image URLs
    const flattenedData = [];

    for (const productInfo of productInfoArray) {
        const productData = {
            title: productInfo.title,
            price: productInfo.price,
            feature_image: productInfo.feature_image,
        };

        for (let i = 0; i < productInfo.image_urls.length; i++) {
            productData[`image_url_${i + 1}`] = productInfo.image_urls[i];
        }

        flattenedData.push(productData);
    }

    await csvWriter.writeRecords(flattenedData);
    console.log('Data has been written to product_info.csv');
}

// Iterate through the product URLs, scrape data, and save all products
async function scrapeAndSave() {
    const productInfoArray = [];

    const productListHtml = await fetchProductPage(productListUrl);
    const productLinks = await extractProductLinks(productListHtml);

    for (const productLink of productLinks) {
        const productHtml = await fetchProductPage(productLink);
        const productInfo = await extractProductInfo(productHtml);
        productInfoArray.push(productInfo);
    }

    await saveToCsv(productInfoArray);
}

scrapeAndSave();
