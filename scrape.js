// Node.js HackerNoon Scraper - Bypasses CORS completely
// Run with: node hackernoon-scraper.js

const https = require('https');
const http = require('http');
const { URL } = require('url');

class HackerNoonServerScraper {
    constructor(username = 'morpheuslord') {
        this.username = username;
        this.profileUrl = `https://hackernoon.com/u/${username}`;
        this.rssUrl = `https://hackernoon.com/u/${username}/rss`;
        this.articles = [];
    }

    // Make HTTP request with proper headers
    async makeRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const isHttps = urlObj.protocol === 'https:';
            const client = isHttps ? https : http;
            
            const requestOptions = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHttps ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: options.method || 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    ...options.headers
                }
            };

            const req = client.request(requestOptions, (res) => {
                let data = '';
                
                res.on('data', chunk => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve({
                            data: data,
                            statusCode: res.statusCode,
                            headers: res.headers
                        });
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                    }
                });
            });

            req.on('error', reject);
            req.setTimeout(15000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    // Scrape RSS feed
    async scrapeRSSFeed() {
        try {
            console.log('🔍 Scraping RSS feed...');
            const response = await this.makeRequest(this.rssUrl);
            const articles = this.parseRSSContent(response.data);
            
            if (articles.length > 0) {
                console.log(`✅ RSS: Found ${articles.length} articles`);
                return articles;
            }
            
            throw new Error('No articles found in RSS');
        } catch (error) {
            console.log(`❌ RSS scraping failed: ${error.message}`);
            return [];
        }
    }

    // Scrape HTML profile page
    async scrapeProfilePage() {
        try {
            console.log('🔍 Scraping profile page...');
            const response = await this.makeRequest(this.profileUrl);
            const articles = this.parseHTMLContent(response.data);
            
            if (articles.length > 0) {
                console.log(`✅ HTML: Found ${articles.length} articles`);
                return articles;
            }
            
            throw new Error('No articles found in HTML');
        } catch (error) {
            console.log(`❌ HTML scraping failed: ${error.message}`);
            return [];
        }
    }

    // Parse RSS XML content
    parseRSSContent(xmlContent) {
        const articles = [];
        
        try {
            // Simple XML parsing without external dependencies
            const itemMatches = xmlContent.match(/<item[^>]*>[\s\S]*?<\/item>/gi);
            
            if (itemMatches) {
                itemMatches.forEach(item => {
                    const title = this.extractXMLValue(item, 'title');
                    const link = this.extractXMLValue(item, 'link');
                    const description = this.extractXMLValue(item, 'description');
                    const pubDate = this.extractXMLValue(item, 'pubDate');
                    
                    if (title && link) {
                        articles.push({
                            title: this.cleanText(title),
                            url: link,
                            excerpt: description ? this.cleanText(description).substring(0, 200) + '...' : '',
                            date: pubDate ? new Date(pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                            readTime: this.estimateReadTime(description || title),
                            source: 'RSS'
                        });
                    }
                });
            }
        } catch (error) {
            console.log(`RSS parsing error: ${error.message}`);
        }
        
        return articles;
    }

    // Parse HTML content
    parseHTMLContent(htmlContent) {
        const articles = [];
        
        try {
            // Look for article patterns in HTML
            const patterns = [
                // Common article link patterns
                /<a[^>]+href=["']([^"']*hackernoon\.com[^"']*)["'][^>]*>([^<]+)</gi,
                // Title patterns
                /<h[1-6][^>]*>([^<]+)</gi,
                // Meta title patterns
                /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/gi,
                /<title[^>]*>([^<]+)</gi
            ];

            const foundTitles = new Set();
            const foundUrls = new Set();

            // Extract links first
            const linkPattern = /<a[^>]+href=["']([^"']*(?:hackernoon\.com)?[^"']*)["'][^>]*>([^<]+)/gi;
            let linkMatch;
            
            while ((linkMatch = linkPattern.exec(htmlContent)) !== null) {
                let url = linkMatch[1];
                const linkText = this.cleanText(linkMatch[2]);
                
                // Normalize URL
                if (url.startsWith('/')) {
                    url = 'https://hackernoon.com' + url;
                } else if (!url.startsWith('http')) {
                    continue;
                }
                
                if (linkText.length > 20 && linkText.length < 200 && 
                    !foundTitles.has(linkText) && !foundUrls.has(url)) {
                    
                    foundTitles.add(linkText);
                    foundUrls.add(url);
                    
                    articles.push({
                        title: linkText,
                        url: url,
                        excerpt: 'Extracted from profile page',
                        date: new Date().toISOString().split('T')[0],
                        readTime: this.estimateReadTime(linkText),
                        source: 'HTML'
                    });
                }
            }

            // If no links found, try extracting headings
            if (articles.length === 0) {
                const headingPattern = /<h[1-6][^>]*>([^<]+)</gi;
                let headingMatch;
                
                while ((headingMatch = headingPattern.exec(htmlContent)) !== null) {
                    const title = this.cleanText(headingMatch[1]);
                    
                    if (title.length > 20 && title.length < 200 && !foundTitles.has(title)) {
                        foundTitles.add(title);
                        
                        articles.push({
                            title: title,
                            url: this.generateUrlFromTitle(title),
                            excerpt: 'Extracted from page headings',
                            date: new Date().toISOString().split('T')[0],
                            readTime: this.estimateReadTime(title),
                            source: 'HTML-Headings'
                        });
                    }
                }
            }
            
        } catch (error) {
            console.log(`HTML parsing error: ${error.message}`);
        }
        
        return articles.slice(0, 15); // Limit results
    }

    // Extract value from XML tags
    extractXMLValue(xml, tagName) {
        const pattern = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
        const match = xml.match(pattern);
        return match ? match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '';
    }

    // Utility functions
    cleanText(text) {
        return text
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&[^;]+;/g, ' ') // Remove HTML entities
            .replace(/\s+/g, ' ')
            .trim();
    }

    estimateReadTime(text) {
        const words = text.split(' ').length;
        const minutes = Math.max(1, Math.ceil(words / 200)); // 200 words per minute
        return `${minutes} min read`;
    }

    generateUrlFromTitle(title) {
        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 60);
        return `https://hackernoon.com/${slug}`;
    }

    // Main scraping function
    async scrapeAll() {
        console.log(`🚀 Starting comprehensive scrape for: ${this.username}`);
        console.log(`Profile URL: ${this.profileUrl}`);
        console.log(`RSS URL: ${this.rssUrl}`);
        console.log('-'.repeat(50));

        let allArticles = [];

        // Try RSS first
        const rssArticles = await this.scrapeRSSFeed();
        allArticles = [...allArticles, ...rssArticles];

        // Then try HTML
        const htmlArticles = await this.scrapeProfilePage();
        allArticles = [...allArticles, ...htmlArticles];

        // Remove duplicates
        const uniqueArticles = allArticles.filter((article, index, self) =>
            index === self.findIndex(a => a.title === article.title)
        );

        this.articles = uniqueArticles;

        console.log('-'.repeat(50));
        console.log(`📊 Scraping Summary:`);
        console.log(`  RSS Articles: ${rssArticles.length}`);
        console.log(`  HTML Articles: ${htmlArticles.length}`);
        console.log(`  Total Unique: ${uniqueArticles.length}`);
        console.log('-'.repeat(50));

        return uniqueArticles;
    }

    // Export functions
    exportJSON() {
        return JSON.stringify(this.articles, null, 2);
    }

    exportCSV() {
        if (this.articles.length === 0) return '';
        
        const headers = ['Title', 'URL', 'Date', 'Read Time', 'Source', 'Excerpt'];
        const csvContent = [
            headers.join(','),
            ...this.articles.map(article => [
                `"${article.title.replace(/"/g, '""')}"`,
                `"${article.url}"`,
                `"${article.date}"`,
                `"${article.readTime}"`,
                `"${article.source}"`,
                `"${article.excerpt.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');
        
        return csvContent;
    }

    saveToFile(format = 'json') {
        const fs = require('fs');
        const filename = `hackernoon_${this.username}_${Date.now()}.${format}`;
        
        let content;
        if (format === 'json') {
            content = this.exportJSON();
        } else if (format === 'csv') {
            content = this.exportCSV();
        } else {
            throw new Error('Unsupported format. Use "json" or "csv".');
        }
        
        fs.writeFileSync(filename, content);
        console.log(`💾 Data saved to: ${filename}`);
        return filename;
    }
}

// Usage examples and CLI interface
async function main() {
    const scraper = new HackerNoonServerScraper('morpheuslord');
    
    try {
        const articles = await scraper.scrapeAll();
        
        if (articles.length > 0) {
            console.log('\n📰 Found Articles:');
            articles.forEach((article, index) => {
                console.log(`\n${index + 1}. ${article.title}`);
                console.log(`   URL: ${article.url}`);
                console.log(`   Date: ${article.date} | ${article.readTime} | Source: ${article.source}`);
                if (article.excerpt && article.excerpt !== 'Extracted from profile page') {
                    console.log(`   Excerpt: ${article.excerpt.substring(0, 100)}...`);
                }
            });
            
            // Save results
            scraper.saveToFile('json');
            scraper.saveToFile('csv');
            
        } else {
            console.log('❌ No articles found');
        }
        
    } catch (error) {
        console.error('❌ Scraping failed:', error.message);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = HackerNoonServerScraper;

/* 
USAGE INSTRUCTIONS:

1. Save this as 'hackernoon-scraper.js'
2. Run: node hackernoon-scraper.js
3. It will scrape and save results to JSON and CSV files

For custom usage:
const scraper = require('./hackernoon-scraper');
const scraperInstance = new scraper('your-username');
scraperInstance.scrapeAll().then(articles => console.log(articles));
*/