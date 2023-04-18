import * as DOMPurify from "dompurify";
import { marked } from "marked";
import hljs from "highlight.js/lib/common";

export function highlight(text: string, lang: string) {
  if (hljs.getLanguage(lang)) {
    return hljs.highlight(text, { language: lang }).value;
  }
  return `<pre><code class="hljs ${lang}">${text}</code></pre>`;
}

marked.setOptions({
  highlight: function (code, lang) {
    return highlight(code, lang);
  },
  langPrefix: 'hljs language-',
});

export default function formatter(text: string) {
  return DOMPurify.sanitize(marked.parse(text));
}
