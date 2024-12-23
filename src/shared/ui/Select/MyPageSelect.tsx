import Root from './Root';
import Trigger from './Trigger';
import Group from './Group';
import Item from './Item';
import useToggle from '@/shared/model/useToggle';
import { Fragment, useState } from 'react';
import { SelectContext } from '@/shared/model/selectContext';

const SelectComponent = Object.assign({
  Root: Root,
  Group: Group,
  Item: Item,
  Trigger: Trigger,
});

interface Select {
  title: string;
  items: string[];
}

export default function Select({ title, items }: Select) {
  const toggleState = useToggle();
  const [selectItems, setSelectItems] = useState(items);

  function handleDeleteItem(index: number) {
    setSelectItems(prevItems => prevItems.filter((_, i) => i !== index));
  }

  return (
    <SelectContext.Provider value={toggleState}>
      <SelectComponent.Root>
        <div className="flex justify-between">
          {title}
          <button className="px-1 border bg-sub text-white font-bold rounded-lg">추가</button>
        </div>
        <SelectComponent.Trigger>{title}</SelectComponent.Trigger>
        <SelectComponent.Group>
          {selectItems.map((item, index) => (
            <Fragment key={`item-${index}`}>
              <SelectComponent.Item>
                <div className={`flex items-center justify-between`}>
                  <p>{item}</p>
                  <button role="delete" onClick={() => handleDeleteItem(index)}>
                    ✕
                  </button>
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
