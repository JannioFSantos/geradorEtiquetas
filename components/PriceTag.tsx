
import React from 'react';
import type { PriceTagData } from '../types';

interface PriceTagProps {
  data: PriceTagData;
  priceColor: string;
  isPromotion: boolean;
}

const PriceTag: React.FC<PriceTagProps> = ({ data, priceColor, isPromotion }) => {
  const formatPrice = (price: number): [string, string] => {
    const validPrice = isNaN(price) ? 0 : price;
    const parts = validPrice.toFixed(2).split('.');
    return [parts[0], parts[1]];
  };

  const [integerPart, decimalPart] = formatPrice(data.preco);

  const colorClasses: { [key: string]: string } = {
      red: 'text-red-600 dark:text-red-500',
      blue: 'text-blue-600 dark:text-blue-500',
      black: 'text-gray-900 dark:text-gray-100',
  };

  const priceColorClass = colorClasses[priceColor] || colorClasses.red;

  return (
    <div className="relative bg-white dark:bg-gray-800 w-full h-full border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex flex-col justify-between p-4 text-center break-words overflow-hidden">
      {isPromotion && (
          <div 
              className="absolute left-0 top-0 h-full w-2.5 bg-yellow-400" 
              aria-hidden="true"
          />
      )}
      <div className="flex-grow flex items-center justify-center">
        <h3 className="text-2xl font-bold uppercase text-gray-800 dark:text-white leading-tight">
          {data.descricao}
        </h3>
      </div>
      <div className="mt-2">
        <div className={`flex items-end justify-center ${priceColorClass}`}>
          <span className="text-2xl font-semibold self-start mt-2 mr-1">R$</span>
          <span className="text-6xl font-extrabold leading-none tracking-tighter">
            {integerPart}
          </span>
          <div className="flex flex-col items-start ml-1">
            <span className="text-3xl font-bold leading-none">
              ,{decimalPart}
            </span>
            <span className="text-lg font-medium text-gray-500 dark:text-gray-400 lowercase -mt-1">
              /{data.unidadeMedida}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTag;
