import { getOrderByLocalId } from "@/lib/directus";
import { format } from "date-fns"; // Переконайтеся, що `date-fns` встановлено

// -------------------------------------------------------------------
// 1. ВИЗНАЧЕННЯ ТИПІВ (Залишаємо без змін)
// -------------------------------------------------------------------

interface DirectusProduct {
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

interface DirectusOrder {
    products: DirectusProduct[];
    id: string;
    local_order_id: string;
    customer_name: string;
    email: string;
    phone: string;
    payment_status: 'paid' | 'pending' | 'failed' | 'cash_on_delivery';
    shipping_status: 'not_shipped' | 'shipped' | 'delivered';
    amount: number;
    city: string;
    warehouse: string;
    date_created?: string;
    waybill_number?: string;
}

// -------------------------------------------------------------------
// 2. ДОПОМІЖНА ФУНКЦІЯ ДЛЯ ВІДОБРАЖЕННЯ СТАТУСУ (Tailwind Classes)
// -------------------------------------------------------------------

/**
 * Повертає об'єкт з текстом та Tailwind CSS класами для стилізації статусу.
 */
const getStatusStyles = (status: string) => {
    let text: string;
    let textClass: string;
    let borderClass: string; // Використовуємо border-l-4

    switch (status) {
        // УСПІХ - ЗЕЛЕНИЙ
        case 'paid':
        case 'delivered':
            text = status === 'paid' ? '✅ Оплачено' : '✅ Доставлено';
            textClass = 'text-green-800'; // Темно-зелений текст
            borderClass = 'border-green-500'; // Зелена ліва межа
            break;

        // ПОМИЛКА/ВІДМОВА - ЧЕРВОНИЙ
        case 'failed':
            text = '❌ Помилка/Відмова';
            textClass = 'text-red-800'; // Темно-червоний текст
            borderClass = 'border-red-500'; // Червона ліва межа
            break;

        // ОЧІКУВАННЯ - ЖОВТИЙ
        case 'pending':
            text = '⏳ Очікує оплати';
            textClass = 'text-yellow-800'; // Темно-жовтий текст
            borderClass = 'border-yellow-500'; // Жовта ліва межа
            break;

        // НАКЛАДЕНИЙ ПЛАТІЖ / ВІДПРАВЛЕНО - СИНІЙ
        case 'pay_on_delivery':
            text = '💵 Накладений платіж';
            textClass = 'text-blue-800'; // Темно-синій текст
            borderClass = 'border-blue-500'; // Синя ліва межа
            break;
            
        case 'shipped':
            text = '📦 Відправлено';
            textClass = 'text-indigo-800'; // Темно-фіолетовий (індиго)
            borderClass = 'border-indigo-500';
            break;

        // ГОТУЄТЬСЯ - СІРИЙ
        case 'not_shipped':
            text = '📝 Готується до відправки';
            textClass = 'text-gray-800';
            borderClass = 'border-gray-500';
            break;

        default:
            text = status;
            textClass = 'text-gray-700';
            borderClass = 'border-gray-400';
    }
    return { text, textClass, borderClass };
};

// -------------------------------------------------------------------
// 3. ОСНОВНИЙ КОМПОНЕНТ СТОРІНКИ (Tailwind)
// -------------------------------------------------------------------

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ order?: string }>
}) {
    // ⚠️ ЛОГІКА ОТРИМАННЯ ДАНИХ (НЕ ЧІПАЄМО)
    const resolved = await searchParams;
    const orderId = resolved.order?.trim();

    if (!orderId) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">ID замовлення відсутній</h1>
                    <p className="text-gray-600">Будь ласка, вкажіть параметр '?order=...' в URL.</p>
                </div>
            </main>
        );
    }

    const orderDetails = await getOrderByLocalId(orderId) as DirectusOrder | null;
    
    if (!orderDetails) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Замовлення не знайдено</h1>
                    <p className="text-gray-500">Не вдалося знайти замовлення з ID: <strong className="text-gray-700">{orderId}</strong></p>
                </div>
            </main>
        );
    }
    
    // --- ДЕТАЛІ ДЛЯ ВЕРСТКИ ---
    const paymentStatus = getStatusStyles(orderDetails.payment_status);
    const shippingStatus = getStatusStyles(orderDetails.shipping_status);
    const productsList: DirectusProduct[] = orderDetails.products || [];
    
    const amountDisplay = productsList.reduce((total, product) => {
        if (typeof product.subtotal === 'number') {
            return total + product.subtotal;
        }
        return total;
    }, 0);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(amount);
    };

    // 🌟 ОНОВЛЕНА СТРУКТУРА ВЕРСТКИ (Tailwind CSS "Чек-стайл")
    return (
        <main className="font-sans min-h-screen bg-gray-100">
            {/* Головний контейнер - імітація чека (max-w-md це 448px) */}
            <div className="max-w-md w-full mx-auto p-3 bg-white rounded-lg shadow-xl border-1 border-gray-300">
                
                {/* Заголовок */}
                <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-2 uppercase tracking-wide">
                    Ваше Замовлення
                </h1>
                <p className="text-sm text-gray-500 text-center mb-5 border-b pb-3 border-gray-200">
                    №{orderDetails.local_order_id} 
                    {orderDetails.date_created && ` | ${format(new Date(orderDetails.date_created), 'dd.MM.yyyy HH:mm')}`}
                </p>

                {/* --- СТАТУСИ --- */}
                <div className="mb-6 border-b border-dashed border-gray-300 pb-5">
                    
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Статуси
                    </h2>

                    {/* Контейнер статусів */}
                    <div className="flex flex-col gap-4">
                        
                        {/* Статус оплати */}
                        <div className={`p-4 bg-gray-50 rounded-lg border-l-4 ${paymentStatus.borderClass} shadow-sm`}>
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Статус оплати</h3>
                            <p className={`text-xl font-bold ${paymentStatus.textClass}`}>
                                {paymentStatus.text}
                            </p>
                        </div>

                        {/* Статус відправки */}
                        <div className={`p-4 bg-gray-50 rounded-lg border-l-4 ${shippingStatus.borderClass} shadow-sm`}>
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Статус відправлення</h3>
                            <p className={`text-xl font-bold ${shippingStatus.textClass}`}>
                                {shippingStatus.text}
                            </p>
                            {orderDetails.waybill_number && (
                                <p className="mt-2 text-sm text-gray-700">
                                    ТТН: <span className="font-mono">{orderDetails.waybill_number}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- ТОВАРИ --- */}
                {productsList.length > 0 && (
                    <div className="mb-6 border-b border-dashed border-gray-300 pb-5">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Перелік товарів
                        </h2>

                        {/* Таблиця товарів */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between font-bold text-gray-600 border-b pb-1">
                                <span className="w-1/2 text-left">Товар</span>
                                <span className="w-1/4 text-center">К-ть</span>
                                <span className="w-1/4 text-right">Сума</span>
                            </div>
                            
                            {productsList.map((product, index) => (
                                <div key={index} className="flex justify-between pt-1 border-b border-dotted border-gray-200 last:border-b-0">
                                    <span className="w-1/2 text-left text-gray-800">{product.name}</span>
                                    <span className="w-1/4 text-center text-gray-700">{product.quantity}</span>
                                    <span className="w-1/4 text-right font-medium text-gray-800">{formatCurrency(product.subtotal)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* --- ЗАГАЛЬНА СУМА --- */}
                <div className="mb-6 py-3 border-t-4 border-b-4 border-double border-gray-900 text-right">
                    <p className="text-2xl font-black text-gray-900">
                        ВСЬОГО: {formatCurrency(amountDisplay)}
                    </p>
                </div>


                {/* --- ДЕТАЛІ ОТРИМУВАЧА --- */}
                <div className="pt-5">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">
                        Деталі доставки
                    </h2>
                    
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="font-semibold text-gray-600 w-1/3">Отримувач:</dt>
                            <dd className="text-gray-800 w-2/3 text-right">{orderDetails.customer_name}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="font-semibold text-gray-600 w-1/3">Телефон:</dt>
                            <dd className="text-gray-800 w-2/3 text-right">{orderDetails.phone}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="font-semibold text-gray-600 w-1/3">Місто:</dt>
                            <dd className="text-gray-800 w-2/3 text-right">{orderDetails.city}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="font-semibold text-gray-600 w-1/3">Відділення:</dt>
                            <dd className="text-gray-800 w-2/3 text-right">{orderDetails.warehouse}</dd>
                        </div>
                    </dl>
                </div>

                <p className="text-xs text-gray-400 text-center mt-6 italic">
                    *** Дякуємо за Ваше замовлення! ***
                </p>

            </div>
        </main>
    );
}