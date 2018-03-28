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
        'hado-datepicker',
        'hado-timepicker',
        'hado-input-form'
      ]
    }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
