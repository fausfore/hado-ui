import { render } from '@stencil/core/testing';
import { DateItemList } from './calendar-date-item';

describe('DateItemList', () => {
  it('should build', () => {
    expect(new DateItemList()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [DateItemList],
        html: '<date-item-list></date-item-list>'
      });
    });
  });
});
