"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function page() {
    const { items, removeItem, clearCart } = useCartStore();
    const router = useRouter();

    const totalPrice = items.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
    );

    const handleCheckout = () => {
        console.log(items);
        
    };

    if (items.length === 0) {
        return (
        <div className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Кошик порожній</h1>
            <Link href="/" className="text-blue-600 underline">
            Повернутись до каталогу
            </Link>
        </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Ваш кошик</h1>

            <div className="space-y-4">
                {items.map((item) => (
                <div
                    key={item.product.id}
                    className="flex items-center justify-between border-b pb-3"
                >
                    <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                        {item.quantity} × {item.product.price}₴
                    </p>
                    </div>
                    <div className="flex items-center gap-3">
                    <span className="font-bold">
                        {item.product.price * item.quantity}₴
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.product.id)}
                    >
                        Видалити
                    </Button>
                    </div>
                </div>
                ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
                <p className="text-xl font-bold">Разом: {totalPrice}₴</p>
                <div className="flex gap-3">
                <Button variant="outline" onClick={clearCart}>
                    Очистити
                </Button>
                <Button onClick={handleCheckout} className="bg-green-600 text-white">
                    Оплатити
                </Button>
                </div>
            </div>
        </div>
    );
}