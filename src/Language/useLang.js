import useLanguageStore from "./useLanguageStore";
import { render } from "mustache";
import { useMemo } from "react";

/**
 * Returns the language string for the given key. You can optionally pass
 * multiple keys, or a context object to interpolate data into a Mustache
 * template format.
 */
export default function useLang(keys, context) {
  const [language, dict] = useLanguageStore((state) => [
    state.language,
    state.dict,
  ]);

  return useMemo(() => {
    const mapKeys = typeof keys === "string" ? [keys] : keys;
    const lang = dict[language];
    const values = mapKeys.map((key) => {
      key = key.toUpperCase();
      if (!lang[key]) return key;
      if (!context) return lang[key];
      return render(lang[key], context);
    });
    return values.length === 1 ? values[0] : values;
  }, [keys, language, dict]);
}
