
import React from 'react';
import type { PriceTagData } from '../types';
import PriceTag from './PriceTag';

interface PrintPreviewProps {
  tags: PriceTagData[];
  priceColor: string;
  isPromotion: boolean;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ tags, priceColor, isPromotion }) => {
  const tagsPerPage = 20;
  const pages: PriceTagData[][] = [];

  for (let i = 0; i < tags.length; i += tagsPerPage) {
    pages.push(tags.slice(i, i + tagsPerPage));
  }

  return (
    <div className="flex flex-col items-center space-y-8 bg-gray-200 dark:bg-gray-700 p-4 sm:p-8 rounded-lg">
      {pages.map((pageTags, pageIndex) => (
        <div
          key={pageIndex}
          className="a4-page bg-white dark:bg-gray-900 shadow-lg w-[210mm] min-h-[297mm] p-[10mm] box-border"
        >
          <div className="grid grid-cols-2 grid-rows-10 gap-2 h-full w-full">
            {pageTags.map((tag) => (
              <PriceTag key={tag.id} data={tag} priceColor={priceColor} isPromotion={isPromotion} />
            ))}
            {Array.from({ length: tagsPerPage - pageTags.length }).map((_, i) => (
                <div key={`placeholder-${i}`} className="bg-transparent border border-dashed border-gray-300 dark:border-gray-600 rounded-lg"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrintPreview;
