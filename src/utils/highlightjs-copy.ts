/* eslint-disable no-restricted-globals */
// @ts-nocheck
import { HighlightResult } from "highlight.js";
/**
 *  @file highlight-copy.js
 *  @author Arron Hunt <arronjhunt@gmail.com>
 *  @copyright Copyright 2021. All rights reserved.
 */

/**
 * Adds a copy button to highlightjs code blocks
 */
export default class CopyButtonPlugin {
  /**
   * Create a new CopyButtonPlugin class instance
   * @param {Object} [options] - Functions that will be called when a copy event fires
   * @param {CopyCallback} [options.callback]
   * @param {Hook} [options.hook]
   * @param {String} [options.lang] Defaults to the document body's lang attribute and falls back to "en"
   */
  constructor(options = {}) {
    self.hook = options.hook;
    self.callback = options.callback;
    self.lang = options.lang || document.documentElement.lang || "en";
    document.addEventListener("click", function (e) {
      if (!navigator.clipboard) return;
      if (e.target.classList.contains("hljs-copy-button")) {
        e.stopImmediatePropagation()
        const codeElement = e.target.parentElement
        let button = codeElement.removeChild(e.target);
        let newText = codeElement.innerText;
        codeElement.insertAdjacentElement("afterbegin", button);
        if (hook && typeof hook === "function") {
          newText = hook(text, el) || text;
        }
        navigator.clipboard
          .writeText(newText)
          .then(function () {
            button.innerHTML = locales[lang]?.[1] || "Copied!";
            button.dataset.copied = true;

            let alert = Object.assign(document.createElement("div"), {
              role: "status",
              className: "hljs-copy-alert",
              innerHTML: locales[lang]?.[2] || "Copied to clipboard",
            });
            codeElement.appendChild(alert);

            setTimeout(() => {
              button.innerHTML = locales[lang]?.[0] || "Copy";
              button.dataset.copied = false;
              codeElement.removeChild(alert);
              alert = null;
            }, 2000);
          })
          .then(function () {
            if (typeof callback === "function") return callback(newText, el);
          });
      }
    });
  }
  "after:highlight"(result: HighlightResult) {
    // Create the copy button and append it to the codeblock.
    let button = `<button class="hljs-copy-button" data-copied="false">${
      locales[lang]?.[0] || "Copy"
    }</button>`;
    result.value = button + result.value;
  }
}

/**
 * Basic support for localization. Please submit a PR
 * to help add more languages.
 * https://github.com/arronhunt/highlightjs-copy/pulls
 */
const locales = {
  en: ["Copy", "Copied!", "Copied to clipboard"],
  es: ["Copiar", "¡Copiado!", "Copiado al portapapeles"],
  fr: ["Copier", "Copié !", "Copié dans le presse-papier"],
  de: ["Kopieren", "Kopiert!", "In die Zwischenablage kopiert"],
  ja: ["コピー", "コピーしました！", "クリップボードにコピーしました"],
  ko: ["복사", "복사됨!", "클립보드에 복사됨"],
  ru: ["Копировать", "Скопировано!", "Скопировано в буфер обмена"],
  zh: ["复制", "已复制!", "已复制到剪贴板"],
  "zh-tw": ["複製", "已複製!", "已複製到剪貼簿"],
};

/**
 * @typedef {function} CopyCallback
 * @param {string} text - The raw text copied to the clipboard.
 * @param {HTMLElement} el - The code block element that was copied from.
 * @returns {undefined}
 */
/**
 * @typedef {function} Hook
 * @param {string} text - The raw text copied to the clipboard.
 * @param {HTMLElement} el - The code block element that was copied from.
 * @returns {string|undefined}
 */
