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
        'rangepicker-modal',
        'rangepicker-input',
        'datepicker-modal',
        'datepicker-input',
        'date-item-list',
      ]
    }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
