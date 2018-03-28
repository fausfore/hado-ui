import { render } from '@stencil/core/testing';
import { StDatepicker } from './st-datepicker';

describe('OuiDatepicker', () => {
  it('should build', () => {
    expect(new StDatepicker()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [StDatepicker],
        html: '<st-datepicker></st-datepicker>'
      });
    });
  });
});
