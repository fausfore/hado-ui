import { render } from '@stencil/core/testing';
import { OuiDatepicker } from './oui-datepicker';

describe('OuiDatepicker', () => {
  it('should build', () => {
    expect(new OuiDatepicker()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [OuiDatepicker],
        html: '<oui-datepicker></oui-datepicker>'
      });
    });
  });
});
