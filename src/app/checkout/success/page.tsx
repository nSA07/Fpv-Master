// app/success/page.tsx
'use client';

import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';


export default function SuccessPage() {
  // 1. Отримуємо функцію clearCart зі стору
  const clearCart = useCartStore((state) => state.clearCart);

  // 2. Викликаємо clearCart лише один раз після рендерингу
  useEffect(() => {
    // ⚠️ Важливо: Очищаємо кошик, як тільки сторінка успіху завантажилася.
    clearCart();
    
    // Можна додати консольний лог для перевірки
    console.log("Кошик успішно очищено після оплати.");
    
  }, [clearCart]); // Залежність clearCart гарантує, що useEffect викликається коректно

  // ----------------------------------------------------
  // Візуальне представлення сторінки (як у попередньому прикладі)
  // ----------------------------------------------------
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-sm shadow-xl border-t-4 border-black rounded-lg">
        <CardContent className="space-y-6 p-8 flex flex-col items-center">
          
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-12 w-12 text-black" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold text-black text-center tracking-tight">
            Оплата Успішна
          </h1>

          <p className="text-center text-base text-neutral-600 mb-4">
            Дякуємо за ваше замовлення!
            Ми успішно отримали ваш платіж.
            Ваш **кошик було автоматично очищено**.
          </p>

          <div className="w-full space-y-3 pt-2">
            <Button 
              size="lg" 
              className="w-full bg-black hover:bg-neutral-800 text-white"
              asChild
            >
              <Link href="/">Повернутись на Головну</Link>
            </Button>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}