// utils/fetchMediumArticle.ts
import axios from 'axios';
import { JSDOM } from 'jsdom';

export const fetchMediumArticle = async (url: string) => {
  try {
    const { data } = await axios.get(url);
    const dom = new JSDOM(data);
    const document = dom.window.document;

    const title = document.querySelector('h1')?.textContent || 'No title found';
    const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.textContent || '');

    return { title, paragraphs };
  } catch (error) {
    console.error('Error fetching Medium article:', error);
    return null;
  }
};
