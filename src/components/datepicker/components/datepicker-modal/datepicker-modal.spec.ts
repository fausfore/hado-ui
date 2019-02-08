import { render } from '@stencil/core/testing';
import { DatepickerModal } from './datepicker-modal';

describe('DatepickerModal', () => {
  it('should build', () => {
    expect(new DatepickerModal()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [DatepickerModal],
        html: '<datepicker-modal></datepicker-modal>'
      });
    });
  });
});
