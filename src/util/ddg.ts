import { search as ddg, SafeSearchType } from "duck-duck-scrape";
import {Result} from "typescript-result";

type Cache = Map<string, string>;
const caches: Map<string, Cache> = new Map();

const getOrDefault = <K, V, M extends Map<K, V>>(map: M, key: K, def: V): V => {
    return map.has(key) ? map.get(key)! : def;
}

export const search = async (site: string, query: string) => {
    const cache = getOrDefault(caches, site, new Map<string, string>());
    const { noResults, results, vqd } = await ddg(`site:${site} ${query}`, {
        safeSearch: SafeSearchType.STRICT,
        vqd: cache.get(query),
    });

    if (noResults || results.length <= 0) {
        return Result.error("No results found");
    }

    cache.set(query, vqd);

    const first = results[0];

    return Result.ok(first);
}
