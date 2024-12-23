import Root from './Root';
import Trigger from './Trigger';
import Group from './Group';
import Item from './Item';
import { SelectContext } from '@/shared/model/useSelect';
import useToggle from '@/shared/model/useToggle';
import { Fragment, useState } from 'react';

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
  const [selectItems] = useState(items);

  return (
    <SelectContext.Provider value={toggleState}>
      <SelectComponent.Root>
        <p className="flex justify-between">{title}</p>
        <SelectComponent.Trigger>{title}</SelectComponent.Trigger>
        <SelectComponent.Group>
          {selectItems.map((item, index) => (
            <Fragment key={`item-${index}`}>
              <SelectComponent.Item>
                <p>{item}</p>
              </SelectComponent.Item>
              <hr />
            </Fragment>
          ))}
        </SelectComponent.Group>
      </SelectComponent.Root>
    </SelectContext.Provider>
  );
}
