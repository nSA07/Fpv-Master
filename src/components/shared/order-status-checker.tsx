// components/OrderStatusChecker.tsx (Остаточна версія)
'use client'; 

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export function OrderStatusChecker() {
    const orderId = useCartStore((state) => state.orderId);
    const resetCartState = useCartStore((state) => state.resetCartState);

    const checkPaymentStatus = async (currentOrderId: string) => {
        if (!currentOrderId) return;
        
        console.log(`Checking payment status for local_order_id: ${currentOrderId}`);
        
        try {
            const checkRes = await fetch(`/api/check-order?orderId=${currentOrderId}`);
            const checkData = await checkRes.json();
            
            if (checkData.exists && checkData.payment_status === "paid") {
                console.log("Order paid successfully. Clearing local state.");
                resetCartState();
            }
        } catch (error) {
            console.error("Failed to fetch payment status:", error);
        }
    };
    
    // Обробка першого завантаження сторінки
    useEffect(() => {
        checkPaymentStatus(orderId);
    }, [orderId, resetCartState]);

    // Обробка повернення через кеш браузера (bfcache)
    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                // Отримуємо поточний стан store безпосередньо, оскільки хук не спрацьовує
                const currentOrderId = useCartStore.getState().orderId;
                checkPaymentStatus(currentOrderId);
            }
        };

        window.addEventListener('pageshow', handlePageShow);

        return () => {
            window.removeEventListener('pageshow', handlePageShow);
        };
    }, []);

    return null; 
}