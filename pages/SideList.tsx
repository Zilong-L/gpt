import React from 'react';
import { useRouter } from 'next/router';
type Item = {
  label: string;
  id: string;
};

type SideListProps = {
  items: Item[];
};

const SideList: React.FC<SideListProps> = ({ items }) => {
  const router = useRouter();
  if (!items) {
    return<></>
  }

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    router.push(`/label/${id}`);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-600">
      {items.map((item: Item, ) => (
        <a key={item.id} className="p-2 hover:cursor-pointer hover:bg-neutral-700 text-teal-200" onClick={(event) => handleClick(event, item.id)}>
          {item.label}
        </a>
      ))}
    </div>
  );
};

export default SideList;