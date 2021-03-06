import 'jsdom-global/register';
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import sinon from 'sinon';

import { shallowWithContext } from '../test-helpers/new-context';
import SelectionCell from '../../src/row-selection/selection-cell';

describe('<SelectionCell />', () => {
  const mode = 'checkbox';
  const rowIndex = 1;

  let wrapper;

  describe('shouldComponentUpdate', () => {
    const selected = true;

    describe('when selected prop has not been changed', () => {
      it('should not update component', () => {
        const nextProps = { selected };

        wrapper = shallow(<SelectionCell rowKey={ 1 } mode={ mode } selected={ selected } />);

        expect(wrapper.instance().shouldComponentUpdate(nextProps)).toBe(false);
      });
    });

    describe('when selected prop has been changed', () => {
      it('should update component', () => {
        const nextProps = { selected: !selected };

        wrapper = shallow(<SelectionCell rowKey={ 1 } mode={ mode } selected={ selected } />);

        expect(wrapper.instance().shouldComponentUpdate(nextProps)).toBe(true);
      });
    });
  });

  describe('handleClick', () => {
    describe('when <input /> was been clicked', () => {
      const rowKey = 1;
      const selected = true;
      let mockOnRowSelect;
      const spy = sinon.spy(SelectionCell.prototype, 'handleClick');

      beforeEach(() => {
        mockOnRowSelect = sinon.stub();
      });

      afterEach(() => {
        spy.reset();
        mockOnRowSelect.reset();
      });

      describe('when disabled prop is false', () => {
        beforeEach(() => {
          wrapper = shallowWithContext(
            <SelectionCell
              selected
              rowKey={ rowKey }
              mode={ mode }
              rowIndex={ rowIndex }
              onRowSelect={ mockOnRowSelect }
            />,
            { bootstrap4: false }
          );
          wrapper.find('td').simulate('click');
        });

        it('should calling handleRowClicked', () => {
          expect(spy.calledOnce).toBe(true);
        });

        it('should calling onRowSelect callback correctly', () => {
          expect(mockOnRowSelect.calledOnce).toBe(true);
          expect(mockOnRowSelect.calledWith(rowKey, !selected, rowIndex)).toBe(true);
        });
      });

      describe('when disabled prop is true', () => {
        beforeEach(() => {
          wrapper = shallowWithContext(
            <SelectionCell
              selected
              rowKey={ rowKey }
              mode={ mode }
              rowIndex={ rowIndex }
              onRowSelect={ mockOnRowSelect }
              disabled
            />,
            { bootstrap4: false }
          );
          wrapper.find('td').simulate('click');
        });

        it('should calling handleRowClicked', () => {
          expect(spy.calledOnce).toBe(true);
        });

        it('should not calling onRowSelect callback', () => {
          expect(mockOnRowSelect.calledOnce).toBe(false);
        });
      });

      describe('if selectRow.mode is radio', () => {
        beforeEach(() => {
          wrapper = shallowWithContext(
            <SelectionCell
              selected
              rowKey={ rowKey }
              mode="radio"
              rowIndex={ rowIndex }
              onRowSelect={ mockOnRowSelect }
            />,
            { bootstrap4: false }
          );
        });

        it('should be called with correct paramters', () => {
          // first click
          wrapper.find('td').simulate('click');
          expect(mockOnRowSelect.callCount).toBe(1);
          expect(mockOnRowSelect.calledWith(rowKey, true, rowIndex)).toBe(true);
        });
      });

      describe('if selectRow.mode is checkbox', () => {
        beforeEach(() => {
          wrapper = shallowWithContext(
            <SelectionCell
              rowKey={ rowKey }
              mode="checkbox"
              rowIndex={ rowIndex }
              selected
              onRowSelect={ mockOnRowSelect }
            />,
            { bootstrap4: false }
          );
        });

        it('should be called with correct parameters', () => {
          // first click
          wrapper.find('td').simulate('click');
          expect(mockOnRowSelect.callCount).toBe(1);
          expect(mockOnRowSelect.calledWith(rowKey, false, rowIndex, undefined)).toBe(true);
        });
      });
    });
  });

  describe('render', () => {
    const selected = true;

    beforeEach(() => {
      wrapper = shallowWithContext(
        <SelectionCell rowKey={ 1 } mode={ mode } rowIndex={ rowIndex } selected={ selected } />,
        { bootstrap4: false }
      );
    });

    it('should render component correctly', () => {
      expect(wrapper.find('td').length).toBe(1);
      expect(wrapper.find('input')).toHaveLength(1);
      expect(wrapper.find('input').get(0).props.type).toBe(mode);
      expect(wrapper.find('input').get(0).props.checked).toBe(selected);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('when disabled prop give as true', () => {
      beforeEach(() => {
        wrapper = shallowWithContext(
          <SelectionCell
            rowKey={ 1 }
            mode={ mode }
            rowIndex={ rowIndex }
            selected={ selected }
            disabled
          />,
          { bootstrap4: false }
        );
      });

      it('should render component with disabled attribute', () => {
        expect(wrapper.find('input').get(0).props.disabled).toBeTruthy();
      });
    });

    describe('when selectionRenderer prop is defined', () => {
      const DummySelection = () => <div className="dummy" />;
      const selectionRenderer = jest.fn().mockReturnValue(<DummySelection />);

      beforeEach(() => {
        selectionRenderer.mockClear();
        wrapper = shallowWithContext(
          <SelectionCell
            rowKey={ 1 }
            mode={ mode }
            rowIndex={ rowIndex }
            selected={ selected }
            selectionRenderer={ selectionRenderer }
          />,
          { bootstrap4: false }
        );
      });

      it('should render component correctly', () => {
        expect(wrapper.find(DummySelection)).toHaveLength(1);
      });

      it('should call props.selectionRenderer correctly', () => {
        expect(selectionRenderer).toHaveBeenCalledTimes(1);
        expect(selectionRenderer).toHaveBeenCalledWith({
          mode,
          checked: selected,
          disabled: wrapper.prop('disabled')
        });
      });
    });

    describe('when bootstrap4 context is true', () => {
      beforeEach(() => {
        wrapper = shallowWithContext(
          <SelectionCell rowKey={ 1 } mode={ mode } rowIndex={ rowIndex } selected={ selected } />,
          { bootstrap4: true }
        );
      });

      it('should render component correctly', () => {
        expect(wrapper.find('td').length).toBe(1);
        expect(wrapper.find('.selection-input-4')).toHaveLength(1);
      });
    });
  });
});
