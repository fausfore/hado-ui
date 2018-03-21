const sass = require('@stencil/sass');

exports.config = {
  namespace: 'st-datepicker',
  generateDistribution: true,
  serviceWorker: false,
  generateWWW: true,
  globalScript: 'src/global/index.ts',
  plugins: [sass()]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
