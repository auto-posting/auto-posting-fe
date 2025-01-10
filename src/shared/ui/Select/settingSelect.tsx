import Root from './Root';
import Trigger from './Trigger';
import Group from './Group';
import Item from './Item';
import useToggle from '@/shared/model/useToggle';
import { Fragment, useEffect, useState } from 'react';
import { SelectContext } from '@/shared/model/selectContext';

const SelectComponent = Object.assign({
  Root: Root,
  Group: Group,
  Item: Item,
  Trigger: Trigger,
});

interface Select {
  title: string;
  label?: string;
  items: string[];
  onChange?: (value: string) => void;
}

export default function Select({ title, label, items, onChange }: Select) {
  const toggleState = useToggle();
  const [selectItems, setSelectItems] = useState(items);
  const [selectedValue, setSelectedValue] = useState<string>(title);

  useEffect(() => {
    setSelectItems(items);
  }, [items]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
    toggleState.toggle();
  };

  return (
    <SelectContext.Provider value={toggleState}>
      <SelectComponent.Root>
        <p className="flex justify-between">{label}</p>
        <SelectComponent.Trigger>{selectedValue}</SelectComponent.Trigger>
        <SelectComponent.Group>
          {selectItems.map((item, index) => (
            <Fragment key={`item-${index}`}>
              <SelectComponent.Item onClick={() => handleSelect(item)}>
                <div className={`flex items-center justify-between`}>
                  <p>{item}</p>
                </div>
              </SelectComponent.Item>
              <hr />
            </Fragment>
          ))}
        </SelectComponent.Group>
      </SelectComponent.Root>
    </SelectContext.Provider>
  );
}
