import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Truck, RefreshCw, CheckCircle, Banknote, CreditCard, ClipboardList } from 'lucide-react';

const placeholderData = {
  payment_cod_text: "Оплата при отриманні товару (накладений платіж)",
  payment_card_text: "Оплата карткою Visa/MasterCard (RozetkaPay)",
  payment_iban_number: "UA043220010000026001350095781",
  
  delivery_free_threshold: "1999 грн",
  delivery_methods_text: "Новою Поштою або іншим зручним перевізником",
  delivery_term_text: "1–3 робочі дні (залежно від регіону)",
  
  return_period: "14 днів з моменту отримання",
  return_conditions: [
    "товар не використовувався",
    "збережено товарний вигляд, пломби, ярлики",
    "є розрахунковий документ, виданий продавцем разом із товаром",
    "товар не входить до переліку тих, що не підлягають поверненню чи обміну"
  ],
  return_exception: "Перелік товарів належної якості, що не підлягають обміну або поверненню, визначено Постановою КМУ №172 від 19 березня 1994 року."
};


export default async function Page() {
    const data = placeholderData; 

    return (
        <div className="mt-2">
            {/* Головний заголовок: Чорний текст */}
            <h1 className="text-3xl/tight font-extrabold mb-10 text-center tracking-tight">
              Доставка та Оплата
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* --- Секція 1: Оплата ---------------------------------------------------- */}
                {/* Використовуємо класи Card за замовчуванням (білий фон, легка тінь) */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                            {/* Іконка тепер чорна/сіра */}
                            <DollarSign className="w-6 h-6 mr-3 text-gray-600" />
                            Способи Оплати
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        
                        {/* Оплата 1: Накладений платіж */}
                        <div className="flex items-start">
                            <Banknote className="w-6 h-6 mr-3 text-gray-600 mt-0.5 min-w-[24px]" />
                            <div>
                                <p className="font-semibold text-gray-800">Оплата при отриманні</p>
                                <p className="text-sm text-gray-600">{data.payment_cod_text}</p>
                            </div>
                        </div>

                        {/* Оплата 2: Картка */}
                        <div className="flex items-start">
                            <CreditCard className="w-6 h-6 mr-3 text-gray-600 mt-0.5 min-w-[24px]" />
                            <div>
                                <p className="font-semibold text-gray-800">Оплата карткою</p>
                                <p className="text-sm text-gray-600">{data.payment_card_text}</p>
                            </div>
                        </div>

                        {/* Оплата 3: IBAN */}
                        <div className="flex items-start">
                            <ClipboardList className="w-6 h-6 mr-3 text-gray-600 mt-0.5 min-w-[24px]" />
                            <div>
                                <p className="font-semibold text-gray-800">Оплата на рахунок IBAN:</p>
                                {/* Код IBAN - сірий фон для виділення */}
                                <code className="bg-gray-100 p-1 text-sm rounded text-gray-800">{data.payment_iban_number}</code>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* --- Секція 2: Доставка -------------------------------------------------- */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                            <Truck className="w-6 h-6 mr-3 text-gray-600" />
                            Доставка
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        
                        {/* Безкоштовна доставка: світло-сірий акцент */}
                        <div className="p-3 bg-gray-50 border-l-4 border-gray-300 rounded-md">
                            <p className="font-bold text-gray-800">
                                Безкоштовна доставка при замовленні від {data.delivery_free_threshold}
                            </p>
                        </div>
                        
                        {/* Перевізник */}
                        <div className="flex items-start">
                            <p className="font-semibold w-24 min-w-[96px] text-gray-500">Перевізник:</p>
                            <p className="text-gray-700">{data.delivery_methods_text}</p>
                        </div>

                        {/* Термін */}
                        <div className="flex items-start">
                            <p className="font-semibold w-24 min-w-[96px] text-gray-500">Термін:</p>
                            <p className="text-gray-700">{data.delivery_term_text}</p>
                        </div>

                    </CardContent>
                </Card>

                {/* --- Секція 3: Гарантія та Повернення ------------------------------------- */}
                <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                            <RefreshCw className="w-6 h-6 mr-3 text-gray-600" />
                            Гарантія та Повернення
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        
                        <p className="mb-3 text-sm text-gray-700">Обмін або повернення можливі протягом **{data.return_period}**.</p>
                        
                        <h3 className="text-lg font-bold border-b border-gray-200 pb-1 text-gray-800">Умови повернення</h3>
                        
                        <ul className="space-y-2">
                            {data.return_conditions.map((condition, index) => (
                                <li key={index} className="flex items-start text-sm text-gray-700">
                                    {/* Іконки умов: чорні/сірі */}
                                    <CheckCircle className="w-4 h-4 mr-2 text-gray-600 mt-1 min-w-[16px]" />
                                    {condition}
                                </li>
                            ))}
                        </ul>

                        {/* Виключення: сірий фон та тонка сіра лінія як акцент */}
                        <div className="mt-4 p-3 border-l-4 border-gray-300 bg-gray-50 text-xs italic text-gray-700">
                            **Виключення:** {data.return_exception}
                        </div>
                        
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}