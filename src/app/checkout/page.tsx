"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCartProducts } from "../hooks/use-cart-products";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NovaPoshtaSelect } from "./components/nova-poshta-select";
import { submitCheckout } from "@/lib/checkout";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "Введіть ім'я"),
  lastName: z.string().min(2, "Введіть прізвище"),
  middleName: z.string().min(2, "Введіть по-батькові"),
  email: z.string().email("Невалідна email адреса"),
  phone: z
    .string()
    .regex(/^\+380\d{9}$/, "Номер повинен бути у форматі +380XXXXXXXXX"),
  comment: z.string().optional(),
  city: z.object({
    label: z.string(),
    ref: z.string()
  }, "Оберіть місто"),

  warehouse: z.object({
    label: z.string(),
    ref: z.string()
  }, "Оберіть відділення"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems } = useCartStore();
  const { products } = useCartProducts();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (cartItems.length === 0) {
      router.replace("/cart");
    }
  }, [cartItems, hydrated, router]);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
    firstName: "",
    lastName: "",
    middleName: "",
      email: "",
      phone: "",
      comment: "",
    },
  });

  if (!hydrated) {
    return (
      <div className="p-6 text-center mt-20 text-gray-500">
        Завантаження...
      </div>
    );
  }

  const totalPrice = products.reduce((sum, product) => {
    const cartItem = cartItems.find((i) => i.id === product.id);
    const quantity = cartItem?.quantity || 0;
    return sum + (product.price ?? 0) * quantity;
  }, 0);

  const onSubmit = async (data: CheckoutFormValues) => {
    await submitCheckout(data, products, cartItems);
  };

  return (
    <section className="max-w-6xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6">Оформлення замовлення</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT SIDE — FORM */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Прізвище*</FormLabel>
                      <FormControl>
                      <Input placeholder="Прізвище" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Ім’я*</FormLabel>
                      <FormControl>
                      <Input placeholder="Ім’я" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>По-батькові*</FormLabel>
                      <FormControl>
                      <Input placeholder="По-батькові" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон*</FormLabel>
                    <FormControl>
                      <Input placeholder="+380XXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Коментар до замовлення</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Напишіть побажання або деталі доставки..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <NovaPoshtaSelect form={form} />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="px-5 py-5 cursor-pointer rounded-lg"
                  aria-label="Оформити замовлення через Mono"
                >
                  <img
                    src="/monocheckout_logo_white.svg"
                    alt="mono_logo"
                    aria-hidden="true"
                    className="w-60 h-9" 
                  />
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* RIGHT SIDE — ORDER SUMMARY */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 h-fit shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Ваше замовлення</h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {products.map((product) => {
                const cartItem = cartItems.find((i) => i.id === product.id);
                if (!cartItem) return null;
                return (
                  <div
                    key={product.id}
                    className="flex justify-between text-sm gap-3"
                  >

                    <span className="text-gray-700 flex-1 min-w-0 break-words line-clamp-2">
                      {product.name} × {cartItem.quantity}
                    </span>

                    {/* Ціна: не стискається */}
                    <span className="font-medium whitespace-nowrap">
                      {(product.price * cartItem.quantity).toLocaleString("uk-UA")} ₴
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between font-semibold text-lg">
                <span>Разом:</span>
                <span className="whitespace-nowrap">{totalPrice.toLocaleString("uk-UA")} ₴</span>
            </div>
        </div>


      </div>
    </section>
  );
}
