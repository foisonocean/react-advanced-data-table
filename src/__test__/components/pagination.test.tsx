import * as React from 'react';
import { shallow, render } from 'enzyme';
import { spy } from 'sinon';

import {
  Pagination,
  PaginationProps,
  defaultLocale,
  CLASSNAMES,
  DEFAULT_THRESHOLD,
} from 'components/pagination';

test('renders without crashing', () => {
  const baseProps = {
    totalPages: 20,
    currentPage: 1,
  };
  render(<Pagination {...baseProps} />);
});

describe('renders ellipsis correctly', () => {
  test('don\'t render ellipsis when total page is less than page threshold', () => {
    let wrapper;
    wrapper = shallow(
      <Pagination
        totalPages={6}
        currentPage={1}
      />
    );
    expect(wrapper.find(CLASSNAMES.ellipsis).length).toBe(0);
    wrapper = shallow(
      <Pagination
        totalPages={10}
        currentPage={9}
        pageThreshold={11}
      />
    );
    expect(wrapper.find(CLASSNAMES.ellipsis).length).toBe(0);
  });

  test(
    'only render one ellipsis (in the 2nd child) if \
    current page is in the first few pages',
    () => {
      let wrapper;

      wrapper = shallow(
        <Pagination
          totalPages={20}
          currentPage={1}
        />
      );
      expect(wrapper.childAt(1).text()).not.toBe('…');
      expect(wrapper.childAt(5).text()).toBe('…');

      wrapper = shallow(
        <Pagination
          totalPages={20}
          currentPage={8}
          pageThreshold={17}
        />
      );
      expect(wrapper.childAt(1).text()).not.toBe('…');
      expect(wrapper.childAt(15).text()).toBe('…');
    },
  );

  test(
    'only render one ellipsis (in the last 2nd child) if current page is in the last few pages',
    () => {
      let wrapper;

      wrapper = shallow(
        <Pagination
          totalPages={20}
          currentPage={20}
        />
      );
      expect(wrapper.childAt(1).text()).toBe('…');
      expect(wrapper.childAt(5).text()).not.toBe('…');

      wrapper = shallow(
        <Pagination
          totalPages={20}
          currentPage={18}
          pageThreshold={17}
        />
      );
      expect(wrapper.childAt(1).text()).toBe('…');
      expect(wrapper.childAt(15).text()).not.toBe('…');
    },
  );

  test(
    'should render two ellipsis (in the 2nd and last 2nd children) if current page is not in the first few pages or in the last few pages',
    () => {
      const wrapper = shallow(
        <Pagination
          totalPages={20}
          currentPage={10}
          pageThreshold={11}
        />
      );
      expect(wrapper.childAt(1).text()).toBe('…');
      expect(wrapper.childAt(9).text()).toBe('…');
    },
  );
});

describe('render page numbers correctly', () => {
  test('total page is less than page threshold', () => {
    const wrapper = shallow(
      <Pagination
        totalPages={8}
        currentPage={3}
        pageThreshold={11}
      />
    );
    expect(wrapper.childAt(0).text()).toBe('1');
    expect(wrapper.childAt(3).text()).toBe('4');
    expect(wrapper.childAt(7).text()).toBe('8');
  });

  test('normal rendering', () => {
    const wrapper = shallow(
      <Pagination
        totalPages={100}
        currentPage={27}
        pageThreshold={11}
      />
    );
    expect(wrapper.childAt(0).text()).toBe('1');
    expect(wrapper.childAt(2).text()).toBe('24');
    expect(wrapper.childAt(5).text()).toBe('27');
    expect(wrapper.childAt(8).text()).toBe('30');
    expect(wrapper.childAt(10).text()).toBe('100');
  });
});

describe('response click event correctly', () => {
  test('return page number when click a non-current page', () => {
    const callback= spy();
    const warpper = shallow(
      <Pagination
        totalPages={8}
        currentPage={3}
        pageThreshold={11}
        onPageClick={callback}
      />
    );
    warpper.childAt(0).simulate('click');
    warpper.childAt(4).simulate('click');
    expect(callback.firstCall.args[0]).toBe(1);
    expect(callback.secondCall.args[0]).toBe(5);
  });

  test('don\'t call when click current page', () => {
    const callback= spy();
    const warpper = shallow(
      <Pagination
        totalPages={8}
        currentPage={3}
        pageThreshold={11}
        onPageClick={callback}
      />
    );
    warpper.childAt(2).simulate('click');
    expect(callback.calledOnce).toBe(false);
  });

  test('don\'t call when click ellipsis', () => {
    const callback= spy();
    const warpper = shallow(
      <Pagination
        totalPages={15}
        currentPage={8}
        pageThreshold={7}
        onPageClick={callback}
      />
    );
    warpper.childAt(1).simulate('click');
    warpper.childAt(5).simulate('click');
    expect(callback.calledOnce).toBe(false);
  });
});

describe('behaviors when pass invalid pageThreshold prop', () => {
  test('warn when pass a number less than 7', () => {
    global.console.warn = jest.fn();
    shallow(<Pagination totalPages={20} currentPage={2} pageThreshold={4} />);
    expect((global.console.warn as any).mock.calls.length).toBe(1);
  });

  test('use a default value when pass a number less than 7', () => {
    global.console.warn = () => {};
    expect(
      shallow(<Pagination totalPages={20} currentPage={2} pageThreshold={3} />)
        .html(),
    ).toBe(
      shallow(<Pagination totalPages={20} currentPage={2} pageThreshold={DEFAULT_THRESHOLD} />)
        .html(),
    );
  });

  test('warn when pass a even', () => {
    global.console.warn = jest.fn();
    shallow(<Pagination totalPages={20} currentPage={2} pageThreshold={8} />);
    expect((global.console.warn as any).mock.calls.length).toBe(1);
  });

  test('use a default value when pass a even', () => {
    global.console.warn = () => {};
    expect(
      shallow(<Pagination totalPages={20} currentPage={2} pageThreshold={10} />)
        .html(),
    ).toBe(
      shallow(<Pagination totalPages={20} currentPage={2} pageThreshold={DEFAULT_THRESHOLD} />)
        .html(),
    );
  });
});

describe('flip buttons works correctly', () => {
  test(
    'don\'t render any flip buttons without \
    passing `showFlipButtons` prop',
    () => {
      const wrapper = shallow(
        <Pagination
          totalPages={100}
          currentPage={27}
        />,
      );
      expect(wrapper.find(`.${CLASSNAMES.flipButton}`).length).toBe(0);
    },
  );

  test(
    'don\'t render any flip buttons if the count of total page is 1 \
    even with the prop `showFlipButtons`',
    () => {
      const wrapper = shallow(
        <Pagination
          totalPages={1}
          currentPage={1}
          showFlipButtons
        />,
      );
      expect(wrapper.find(`.${CLASSNAMES.flipButton}`).length).toBe(0);
    },
  );

  test('only render next button when current page is first page', () => {
    const wrapper = shallow(
      <Pagination
        totalPages={100}
        currentPage={1}
        showFlipButtons
      />
    );
    const nextButtonWrapper = wrapper.find(`.${CLASSNAMES.flipButton}`);
    expect(nextButtonWrapper.length).toBe(1);
    expect(nextButtonWrapper.text()).toBe(defaultLocale.next);
  });

  test('locale text is correct when only render next button', () => {
    const wrapper = shallow(
      <Pagination
        totalPages={100}
        currentPage={1}
        locale={{
          prev: '上一页',
          next: '下一页',
        }}
        showFlipButtons
      />
    );
    const nextButtonWrapper = wrapper.find(`.${CLASSNAMES.flipButton}`);
    expect(nextButtonWrapper.length).toBe(1);
    expect(nextButtonWrapper.text()).toBe('下一页');
  });

  test(
    'triggers `onPageClick` callback correctly when only render next button',
    () => {
      const callback = jest.fn();
      const wrapper = shallow(
        <Pagination
          totalPages={100}
          currentPage={1}
          showFlipButtons
          onPageClick={callback}
        />
      );
      wrapper.find(`.${CLASSNAMES.flipButton}`).simulate('click');
      expect(callback.mock.calls[0][0]).toBe(2);
    },
  );

  test('only render previous button when current page is last page', () => {
    const wrapper = shallow(
      <Pagination
        totalPages={100}
        currentPage={100}
        showFlipButtons
      />
    );
    const nextButtonWrapper = wrapper.find(`.${CLASSNAMES.flipButton}`);
    expect(nextButtonWrapper.length).toBe(1);
    expect(nextButtonWrapper.text()).toBe(defaultLocale.prev);
  });

  test('locale text is correct when only render previous button', () => {
    const wrapper = shallow(
      <Pagination
        totalPages={100}
        currentPage={100}
        locale={{
          prev: '上一页',
          next: '下一页',
        }}
        showFlipButtons
      />
    );
    const nextButtonWrapper = wrapper.find(`.${CLASSNAMES.flipButton}`);
    expect(nextButtonWrapper.length).toBe(1);
    expect(nextButtonWrapper.text()).toBe('上一页');
  });

  test(
    'triggers `onPageClick` callback correctly when only render next button',
    () => {
      const callback = jest.fn();
      const wrapper = shallow(
        <Pagination
          totalPages={100}
          currentPage={100}
          showFlipButtons
          onPageClick={callback}
        />
      );
      wrapper.find(`.${CLASSNAMES.flipButton}`).simulate('click');
      expect(callback.mock.calls[0][0]).toBe(99);
    },
  );

  test(
    'render both previous button and next button when \
    current page is not first page nor last page',
    () => {
      const wrapper = shallow(
        <Pagination
          totalPages={100}
          currentPage={27}
          showFlipButtons
        />,
      );
      const buttonsWrapper = wrapper.find(`.${CLASSNAMES.flipButton}`);
      expect(buttonsWrapper.length).toBe(2);
      const prevButtonWrapper = buttonsWrapper.at(0);
      const nextButtonWrapper = buttonsWrapper.at(1);
      expect(prevButtonWrapper.text()).toBe(defaultLocale.prev);
      expect(nextButtonWrapper.text()).toBe(defaultLocale.next);
    },
  );

  test('locale texts are correct when render both flip buttons', () => {
    const wrapper = shallow(
      <Pagination
        totalPages={100}
        currentPage={27}
        locale={{
          prev: '上一页',
          next: '下一页',
        }}
        showFlipButtons
      />,
    );
    const buttonsWrapper = wrapper.find(`.${CLASSNAMES.flipButton}`);
    const prevButtonWrapper = buttonsWrapper.at(0);
    const nextButtonWrapper = buttonsWrapper.at(1);
    expect(prevButtonWrapper.text()).toBe('上一页');
    expect(nextButtonWrapper.text()).toBe('下一页');
  });

  test(
    'triggers `onPageClick` callback correctly when render both flip buttions',
    () => {
      const callback = jest.fn();
      const buttonsWrapper = shallow(
          <Pagination
            totalPages={100}
            currentPage={27}
            showFlipButtons
            onPageClick={callback}
          />,
        )
        .find(`.${CLASSNAMES.flipButton}`);
      const prevButtonWrapper = buttonsWrapper.at(0);
      const nextButtonWrapper = buttonsWrapper.at(1);

      prevButtonWrapper.simulate('click');
      expect(callback.mock.calls[0][0]).toBe(26);

      nextButtonWrapper.simulate('click');
      expect(callback.mock.calls[1][0]).toBe(28);
    },
  );
});
