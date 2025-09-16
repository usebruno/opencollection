import { useMemo } from 'react';
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';

export const useMarkdownRenderer = () => {
  const md = useMemo(() => {
    const markdownIt = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
      highlight: function (str, lang) {
        if (lang && Prism.languages[lang]) {
          try {
            return Prism.highlight(str, Prism.languages[lang], lang);
          } catch (__) { }
        }
        return '';
      },
    });

    const defaultRender =
      markdownIt.renderer.rules.heading_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    markdownIt.renderer.rules.heading_open = function (
      tokens,
      idx,
      options,
      env,
      self
    ) {
      const token = tokens[idx];
      const level = token.tag.substr(1);

      if (level === '1') {
        token.attrJoin('class', 'text-2xl font-bold mt-6 mb-3 heading-1');
      } else if (level === '2') {
        token.attrJoin('class', 'text-xl font-semibold mt-5 mb-2 heading-2');
      } else if (level === '3') {
        token.attrJoin('class', 'text-lg font-semibold mt-4 mb-2 heading-3');
      } else {
        token.attrJoin('class', 'font-semibold mt-3 mb-1 heading-4');
      }

      return defaultRender(tokens, idx, options, env, self);
    };

    return markdownIt;
  }, []);

  return md;
}; 