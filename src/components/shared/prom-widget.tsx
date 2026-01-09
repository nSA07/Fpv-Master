import React from 'react';

export const PromWidget: React.FC = () => {
  return (
    <div className="w-full flex justify-center overflow-hidden">
      <iframe
        src="https://prom.ua/renders/certification_widget/widget?widgetSize=600x160&companyDescription=FPVmaster%20—%20спеціалізований%20інтернет-магазин%20для%20FPV-пілотів.%20Інструменти%2C%20аксесуари%2C%20запчастини%20та%20комплектуючі%20для%20FPV-дронів.&companyId=4125434&widgetLanguage=uk"
        width="600"
        height="160"
        style={{ border: 0 }}
        title="Prom.ua Certification Widget"
        loading="lazy" // Оптимізація: завантажиться, коли користувач доскролить до футера
      />
    </div>
  );
};