# Single Page Scrape

This project demonstrates web scraping using Node.js to extract product information from a list of URLs and save it to a CSV file. It utilizes several packages to accomplish this task.

## Packages Used

### axios

- **What it is:** Axios is a popular HTTP client for Node.js. It is used to make HTTP requests to fetch web page content.

- **How it works in this project:** Axios is used in the `fetchProductPage` function to fetch the HTML content of product pages from the specified URLs.

### cheerio

- **What it is:** Cheerio is a fast, flexible, and lean implementation of jQuery for the server. It is used for parsing HTML and extracting data.

- **How it works in this project:** Cheerio is used in the `extractProductInfo` function to parse the HTML content and extract specific information like product title, price, feature image, and additional image URLs.

### csv-writer

- **What it is:** csv-writer is a package for writing data to CSV files in a structured manner.

- **How it works in this project:** The `saveToCsv` function utilizes csv-writer to create and write product information to a CSV file. It dynamically generates CSV headers based on the number of image URLs found in the product data.

## Project Workflow

1. The project starts by defining an array of product URLs to scrape.

2. The `fetchProductPage` function uses Axios to fetch the HTML content of each product page.

3. The `extractProductInfo` function uses Cheerio to parse the HTML and extract product information, including title, price, feature image, and additional image URLs.

4. The `saveToCsv` function uses csv-writer to create a CSV file and writes the extracted product data. It dynamically generates headers to accommodate multiple image URLs.

5. The `scrapeAndSave` function iterates through the list of product URLs, scrapes data for each product, and then saves all the products to a CSV file.

## Usage

To run this project and perform web scraping, follow these steps:

1. Install Node.js and npm if you haven't already.

2. Clone this repository to your local machine.

3. Navigate to the project directory and run `npm install` to install the required packages.

4. Add the product URLs you want to scrape to the `productUrls` array in the `index.js` file.

5. Run the project using `node index.js`.

6. The scraped product data will be saved to a CSV file named `product_info.csv` in the project directory.

## Note

Ensure that you have the necessary permissions to scrape data from websites, and use this code responsibly and in compliance with website terms of service.


