import { render } from '@stencil/core/testing';
import { RangepickerModal } from './rangepicker-modal';

describe('RangepickerModal', () => {
  it('should build', () => {
    expect(new RangepickerModal()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [RangepickerModal],
        html: '<rangepicker-modal></rangepicker-modal>'
      });
    });
  });
});
