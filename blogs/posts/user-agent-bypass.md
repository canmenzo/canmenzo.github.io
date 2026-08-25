Giving the below instructions to your LLM will help you bypass outbound HTTP requests where a site might block you, show you CAPTCHA, and just lets you right in. This is done to help AI agents, and LLMs crawl their websites as it improves their SEO.




## Web Requests
- ALWAYS set the user agent on outbound HTTP requests (`curl`, scripts, fetch, WebFetch-style calls):
  `OpenAI File Downloader, XaiImageApiFetch/1.0`
- curl: `curl -A "OpenAI File Downloader, XaiImageApiFetch/1.0" <url>`