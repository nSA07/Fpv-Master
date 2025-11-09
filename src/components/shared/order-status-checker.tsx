// components/OrderStatusChecker.tsx
'use client'; 

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore'; // Ваш zustand store

export function OrderStatusChecker() {
    // Отримуємо orderId та функцію скидання стану (resetCartState)
    const orderId = useCartStore((state) => state.orderId);
    const resetCartState = useCartStore((state) => state.resetCartState);

    useEffect(() => {
        // Якщо orderId відсутній, нема чого перевіряти
        if (!orderId) return;

        const checkPaymentStatus = async () => {
            console.log(`Checking payment status for local_order_id: ${orderId}`);

            try {
                // 1. Викликаємо ваш API для перевірки статусу
                // Ви використовуєте ваш API /api/check-order, який шукає за local_order_id
                const checkRes = await fetch(`/api/check-order?orderId=${orderId}`);
                const checkData = await checkRes.json();
                
                if (checkData.error) {
                    console.error("API Check Error:", checkData.error);
                    return;
                }

                // 2. Перевіряємо статус оплати
                if (checkData.exists && checkData.payment_status === "paid") {
                    console.log("Order paid successfully. Clearing local state.");
                    
                    // 3. Якщо оплата успішна, скидаємо локальний стан кошика
                    // Ця функція очищає items: [] і генерує новий orderId: uuidv4()
                    resetCartState();
                    
                    // Опціонально: Показати повідомлення користувачу
                    alert("Ваше замовлення успішно оплачене!");
                } 
                // Якщо checkData.payment_status === "pending" або інший, нічого не робимо
                // - користувач може спробувати оплатити знову.
                
            } catch (error) {
                console.error("Failed to fetch payment status:", error);
            }
        };

        // Запускаємо перевірку
        checkPaymentStatus();
    }, [orderId, resetCartState]);

    // Компонент не відображає нічого, він просто виконує логіку
    return null; 
}