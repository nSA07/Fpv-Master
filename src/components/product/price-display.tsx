// src/components/PriceMiniDisplay.jsx (або вбудований блок)

export const PriceMiniDisplay = ({ price, price_old }: { price: number; price_old?: number | null }) => {
  // Використовуємо просту перевірку на існування price_old для відображення знижки
  const hasOldPriceDisplay = !!price_old; 

  return (
    <div className="flex items-end gap-2">
      
      {/* 1. Актуальна ціна */}
      <span className={`
          text-xl font-bold 
          ${hasOldPriceDisplay ? 'text-red-600' : 'text-gray-900'}
      `}>
          {price}₴
      </span>
      
      {/* 2. Стара ціна (перекреслена) */}
      {hasOldPriceDisplay && (
        <span className="text-sm text-gray-500 line-through font-medium">
          {price_old}₴
        </span>
      )}
      
    </div>
  );
}