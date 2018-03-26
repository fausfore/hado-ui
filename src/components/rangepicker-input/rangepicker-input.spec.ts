import { render } from '@stencil/core/testing';
import { RangepickerInput } from './rangepicker-input';

describe('RangepickerInput', () => {
  it('should build', () => {
    expect(new RangepickerInput()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [RangepickerInput],
        html: '<rangepicker-input></rangepicker-input>'
      });
    });
  });
});
