const sass = require('@stencil/sass');

exports.config = {
  namespace: 'st-datepicker',
  generateDistribution: true,
  serviceWorker: false,
  generateWWW: true,
  plugins: [sass()],
  bundles: [
    {
      components: [
        'st-datepicker',
      ]
    }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
