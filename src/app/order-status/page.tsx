import { getOrderByLocalId } from "@/lib/directus";

// Визначення типів (для коректного використання у верстці)
interface DirectusOrder {
    products: any[];
    id: string; // Directus ID
    local_order_id: string; // Локальний ID
    customer_name: string;
    email: string;
    phone: string;
    payment_status: 'paid' | 'pending' | 'failed';
    shipping_status: 'not_shipped' | 'shipped' | 'delivered';
    amount: number; // Сума в базових одиницях (наприклад, копійках)
    city: string;
    warehouse: string;
}

// --- Допоміжна функція для відображення статусу (Сірий тон) ---
const getStatusStyles = (status: string) => {
    // Всі статуси тепер використовують відтінки сірого, але з різною товщиною межі для розрізнення
    let baseStyle = { color: '#333333', border: '3px solid #AAAAAA' }; // Темно-сірий текст, світла межа

    switch (status) {
        case 'paid': 
        case 'delivered': 
            return { text: status === 'paid' ? 'Оплачено' : 'Доставлено', ...baseStyle, border: '3px solid #666666' }; // Темніша межа для успіху
        case 'pending': 
        case 'not_shipped': 
            return { text: status === 'pending' ? 'Очікує оплати' : 'Готується до відправки', ...baseStyle, border: '3px solid #BBBBBB' }; // Середня межа
        case 'failed': 
        case 'shipped': 
            return { text: status === 'failed' ? 'Помилка' : 'Відправлено', ...baseStyle, border: '3px solid #999999' }; // Середньо-темна межа
        default: 
            return { text: status, ...baseStyle, border: '3px solid #CCCCCC' };
    }
};
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
        <main style={{ padding: "20px", textAlign: "center", backgroundColor: '#ffffff' }}>
          <h1 style={{color: '#333333'}}>ID замовлення відсутній</h1>
          <p style={{color: '#666666'}}>Будь ласка, вкажіть параметр '?order=...' в URL.</p>
        </main>
      );
    }

    const orderDetails = await getOrderByLocalId(orderId) as DirectusOrder | null; 
    
    if (!orderDetails) {
      return (
        <main style={{ padding: "20px", textAlign: "center", backgroundColor: '#ffffff' }}>
          <h1 style={{color: '#333333'}}>Замовлення не знайдено</h1>
          <p style={{color: '#999999'}}>Не вдалося знайти замовлення з ID: <strong>{orderId}</strong></p>
        </main>
      );
    }
    
    // --- ДЕТАЛІ ДЛЯ ВЕРСТКИ ---
    const paymentStatus = getStatusStyles(orderDetails.payment_status);
    const shippingStatus = getStatusStyles(orderDetails.shipping_status);
    const amountDisplay = (orderDetails.products || []).reduce((total, product) => {
        // Забезпечуємо, що subtotal є числом перед додаванням
        if (typeof product.subtotal === 'number') {
            return total + product.subtotal;
        }
        return total;
    }, 0);

    // 🌟 ОНОВЛЕНА СТРУКТУРА ВЕРСТКИ (Чорний, сірий, білий)
    return (
        <main style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f5f5f5' }}>
            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                
                <h1 style={{ fontSize: '26px', fontWeight: 'bold', borderBottom: '1px solid #cccccc', paddingBottom: '15px', marginBottom: '20px', color: '#111111', textAlign: 'center' }}>
                    Статус Замовлення №{orderDetails.local_order_id}
                </h1>

                {/* Блоки статусів */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', marginBottom: '25px' }}>
                    
                    {/* Статус оплати */}
                    <div style={{ flex: 1, padding: '15px', backgroundColor: '#fafafa', borderRadius: '6px', borderLeft: paymentStatus.border }}>
                        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#444444', margin: '0 0 8px 0' }}>Статус оплати</h2>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: paymentStatus.color, margin: 0 }}>
                            {paymentStatus.text}
                        </p>
                    </div>

                    {/* Статус відправки */}
                    <div style={{ flex: 1, padding: '15px', backgroundColor: '#fafafa', borderRadius: '6px', borderLeft: shippingStatus.border }}>
                        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#444444', margin: '0 0 8px 0' }}>Статус відправлення</h2>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: shippingStatus.color, margin: 0 }}>
                            {shippingStatus.text}
                        </p>
                    </div>
                </div>

                {/* Деталі замовлення */}
                <div style={{ borderTop: '1px solid #cccccc', paddingTop: '20px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333333', marginBottom: '15px' }}>Деталі замовлення</h2>
                    
                    <div style={{ backgroundColor: '#eeeeee', padding: '15px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #cccccc' }}>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#333333', margin: 0 }}>
                            Загальна сума: {amountDisplay} UAH
                        </p>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '8px 0', fontWeight: '600', borderBottom: '1px solid #f0f0f0', color: '#444444' }}>Отримувач:</td>
                                <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', color: '#666666' }}>{orderDetails.customer_name}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 0', fontWeight: '600', borderBottom: '1px solid #f0f0f0', color: '#444444' }}>Телефон:</td>
                                <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', color: '#666666' }}>{orderDetails.phone}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 0', fontWeight: '600', borderBottom: '1px solid #f0f0f0', color: '#444444' }}>Email:</td>
                                <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', color: '#666666' }}>{orderDetails.email}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 0', fontWeight: '600', borderBottom: '1px solid #f0f0f0', color: '#444444' }}>Місто:</td>
                                <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', color: '#666666' }}>{orderDetails.city}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 0', fontWeight: '600', borderBottom: '1px solid #f0f0f0', color: '#444444' }}>Відділення:</td>
                                <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', color: '#666666' }}>{orderDetails.warehouse}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </main>
    );
}