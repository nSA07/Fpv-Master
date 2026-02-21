interface OrderItem {
    image_id: any;
    quantity: number;
    name: string;
    price: number;
    sku: string;
}

interface EmailProps {
    localOrderId: string;
    amount: string;
    orderUrl: string;
}

export function generateAdminOrderEmail(order: any, items: OrderItem[], directusUrl: string) {
    
    const itemsHtml = items.map(item => {
        const imgUrl = `${directusUrl}/assets/${item.image_id[0].directus_files_id}?width=100&height=100&fit=cover`;
        const total = (item.quantity * item.price).toFixed(2);
        
        return `
            <div style="display: flex; border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                <img src="${imgUrl}" style="width: 80px; height: 80px; object-fit: cover; margin-right: 15px;">
                <div>
                    <h4 style="margin: 0;">${item.name}</h4>
                    <p style="margin: 5px 0; font-size: 14px; color: #666;">SKU: ${item.sku}</p>
                    <p style="margin: 0;"><b>${item.quantity} шт.</b> x ${item.price} UAH = <b>${total} UAH</b></p>
                </div>
            </div>
        `;
    }).join('');

    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2);

    const commentHtml = order.comment 
        ? `
            <div style="background-color: #fef9c3; border-left: 4px solid #eab308; padding: 15px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #854d0e;">📝 Коментар / Реквізити для рахунку:</h3>
                <p style="margin: 0; white-space: pre-wrap; font-size: 16px;">${order.comment}</p>
            </div>
          `
        : '';

    return `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
            <h1 style="color: #171717;">🔔 Нове замовлення №${order.local_order_id}</h1>
            
            <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
                <p style="margin: 5px 0;"><b>Клієнт:</b> ${order.customer_name}</p>
                <p style="margin: 5px 0;"><b>Телефон:</b> ${order.phone}</p>
                <p style="margin: 5px 0;"><b>Email:</b> ${order.email}</p>
                <p style="margin: 5px 0;"><b>Спосіб оплати:</b> ${order.payment_method_label || 'Не вказано'}</p>
                <p style="margin: 5px 0;"><b>Доставка:</b> ${order.city}, ${order.warehouse}</p>
            </div>

            ${commentHtml}

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <h3>Товари:</h3>
            ${itemsHtml}
            
            <div style="text-align: right; margin-top: 20px;">
                <p style="font-size: 20px; color: #171717;"><b>Разом до сплати: ${total} UAH</b></p>
            </div>
            
            <p style="font-size: 12px; color: #777; margin-top: 40px;">
                Замовлення створено в Directus. Ви можете переглянути його в панелі керування.
            </p>
        </div>
    `;
}

export function generateOrderConfirmationEmail({ localOrderId, amount, orderUrl }: EmailProps): string {
    return `
        <!DOCTYPE html>
        <html lang="uk">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Підтвердження оплати</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4;">
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                
                                <tr>
                                    <td align="center" style="background-color: #171717; padding: 20px; border-radius: 8px 8px 0 0;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Замовлення успішно оплачено!</h1>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td style="padding: 30px;">
                                        <p style="margin-top: 0; font-size: 16px;">Шановний клієнте,</p>
                                        <p style="font-size: 16px;">Дякуємо, що обрали нас! Ваш платіж за замовлення **№${localOrderId}** успішно надійшов.</p>

                                        <table width="100%" border="0" cellspacing="0" cellpadding="10" style="margin: 20px 0; border: 1px solid #eeeeee; border-radius: 6px; background-color: #f9f9f9;">
                                            <tr>
                                                <td style="font-size: 16px;"><strong>Номер замовлення:</strong></td>
                                                <td style="font-size: 16px; text-align: right;">${localOrderId}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 16px;"><strong>Статус оплати:</strong></td>
                                                <td style="font-size: 16px; text-align: right; color: #171717;">Успішно оплачено</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 16px; border-top: 1px solid #eeeeee;"><strong>Загальна сума:</strong></td>
                                                <td style="font-size: 18px; font-weight: bold; text-align: right; border-top: 1px solid #eeeeee;">${amount}</td>
                                            </tr>
                                        </table>
                                        
                                        <p style="font-size: 16px;">Ви можете відслідковувати статус Вашого замовлення (обробка, відправка тощо) за цим посиланням:</p>

                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="padding: 20px 0;">
                                                    <a href="${orderUrl}" target="_blank" style="display: inline-block; padding: 12px 25px; background-color: #171717; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                                        Переглянути замовлення
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center" style="padding: 20px 30px; border-top: 1px solid #dddddd;">
                                        <p style="margin: 0; font-size: 12px; color: #777777;">
                                            Це автоматичне повідомлення. Будь ласка, не відповідайте на нього.<br>
                                            &copy; ${new Date().getFullYear()} Fpv Master.
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;
}