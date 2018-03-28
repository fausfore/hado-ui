const sass = require('@stencil/sass');

exports.config = {
  namespace: 'hado-ui',
  generateDistribution: true,
  serviceWorker: false,
  generateWWW: true,
  plugins: [sass()],
  bundles: [
    {
      components: [
        'st-datepicker',
        'st-timepicker',
      ]
    }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
