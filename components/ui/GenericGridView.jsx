'use client';

import Masonry from 'react-masonry-css';
import { Card } from 'flowbite-react';

const breakpointColumnsObj = {
  default: 4,
  1536: 4,
  1280: 3,
  1024: 2,
  768: 1,
};

export default function GenericMasonryView({
  data,
  renderItem,
  modals = null,
}) {
  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-6"
        columnClassName="masonry-column"
      >
        {data.map((item) => (
          <div key={item.id} className="mb-6 break-inside-avoid">
            <Card
              className="h-full flex flex-col justify-between p-5 border-gray-200 dark:border-gray-700 rounded-xl
              bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900
              transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              {renderItem(item)}
            </Card>
          </div>
        ))}
      </Masonry>
      {modals}
    </>
  );
}
