// eslint-disable-next-line no-undef
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['next/babel'],
  };
};
