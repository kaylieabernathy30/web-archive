# **App Name**: Web Archive

## Core Features:

- URL Input: Enter a URL to clone and save for offline viewing.
- BFS Crawl and Save: Crawl the website using BFS to identify and save all linked pages, assets (images, media, stylesheets, scripts), checking for embedded links to those resources and assets. Stop when all links have been visited.
- Crawling Progress: Display a progress bar indicating the crawling and saving process.
- Error Report: Indicate any broken links found during the crawling process, for later debugging.
- Completeness Check: Use generative AI to assess the overall completeness of the saved website. The tool checks for missing resources, layout discrepancies, or functional errors. After performing its analysis the tool returns an alert/report.

## Style Guidelines:

- Primary color: Soft blue (#74A4BC), evoking trust and stability for a reliable archiving experience.
- Background color: Light gray (#F0F4F7), providing a clean and neutral backdrop.
- Accent color: Muted green (#90BE6D), indicating successful saves and completed processes.
- Font pairing: 'Inter' for headlines and body text; sans-serif.
- Use simple, line-based icons for clear representation of actions like saving, loading, and checking.
- Organize the app into clear sections: URL input, progress display, and completion report.
- Use a smooth, continuous animation for the progress bar during crawling to indicate activity.