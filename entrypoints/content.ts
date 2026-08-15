export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    console.log('🚀 [Magic UI] Content script injected successfully!');

    // 1. Read basic document metadata
    const pageTitle = document.title;
    const url = window.location.href;

    // 2. Count and inspect main text elements
    const paragraphs = document.querySelectorAll('p');
    const headings = document.querySelectorAll('h1, h2, h3');
    const images = document.querySelectorAll('img');

    // 3. Test reading the main content wrapper
    const mainContainer =
      document.querySelector('article') ||
      document.querySelector('main') ||
      document.body;

    console.group('📄 [Magic UI] DOM Inspection Summary');
    console.log('Title:', pageTitle);
    console.log('URL:', url);
    console.log('Headings Count:', headings.length);
    console.log('Paragraphs Count:', paragraphs.length);
    console.log('Images Count:', images.length);
    console.log('Target Container Node:', mainContainer);
    console.groupEnd();
  },
});