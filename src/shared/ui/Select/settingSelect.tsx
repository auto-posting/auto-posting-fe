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
  name: string;
  title: string;
  label?: string;
  items: (string | number)[];
  value?: string | number;
  onChange?: (e: { target: { name: string; value: string | number } }) => void;
}

export default function Select({ title, name, label, items = [], value, onChange }: Select) {
  const toggleState = useToggle();
  const [selectItems, setSelectItems] = useState(items);

  useEffect(() => {
    setSelectItems(items);
  }, [items]);

  const handleSelect = (item: string | number) => {
    if (onChange) {
      onChange({
        target: {
          name: name,
          value: item,
        },
      });
    }
    toggleState.toggle();
  };

  return (
    <SelectContext.Provider value={toggleState}>
      <SelectComponent.Root>
        <p className="flex justify-between">{label}</p>
        <SelectComponent.Trigger>{value !== 0 ? value?.toString() : title}</SelectComponent.Trigger>
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
