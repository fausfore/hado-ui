import { DatepickerInput } from './datepicker-input';

describe('DatepickerInput', () => {
  it('should build', () => {
    expect(new DatepickerInput()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [DatepickerInput],
        html: '<datepicker-input></datepicker-input>'
      });
    });
  });
});
