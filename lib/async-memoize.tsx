/**
 * Add memoization for the function to replace the deprecated "use cache" NextJS directive.
 * @param {async Function} handler;
 * @param {Object} [options] - The memoization options.
 * @param {Number} [options.lifetime] - The memoization lifetime in ms. Default value 15 mins (15 * 60 * 1000).
 * @param {Number} [options.getKey<String>] - The memoization key. Default value "cached" - for a zero arg function. Should return a string.
 *
 * @returns {Function} - The memoized `handler` wrapper with ._cache method, where _cache is WeekMap with possible cache.
 */
export default function asyncMemoize(handler, options) {
  options = options || {};
  options.lifetime = options.lifetime || 15 * 60 * 1000; // 15 mins
  options.getKey = function() { return "cached"; };

  let cache = {};

  let cachedHandler = async function() {
    let key = options.getKey.apply(null, arguments);
    let cached = cache[key];

    if (cached && cached.expireIn >= Date.now())
      return cached.value;

    const result = await handler.apply(this, arguments);
    const clearTimer = setTimeout(() => {
      delete cache[key];
    }, options.lifetime);

    cache[key] = {
      value: result,
      expireIn: Date.now() + options.lifetime,
      timer: clearTimer
    };

    return result;
  };

  cachedHandler._cache = cache;

  return cachedHandler;
}
