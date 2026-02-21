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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NovaPoshtaSelect } from "./components/nova-poshta-select";
import { submitCheckout } from "@/lib/checkout";
import { ArrowRight } from "lucide-react";

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
  paymentMethod: z.enum(["mono", "cod", "invoice"]),
}).refine(
    (data) => {
      if (data.paymentMethod === "invoice") {
        return data.comment && data.comment.trim().length >= 5;
      }
      return true;
    },
    {
      message: "Будь ласка, вкажіть реквізити (Назва компанії, ЄДРПОУ) для виставлення рахунку",
      path: ["comment"],
    }
  );

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems } = useCartStore();
  const { products } = useCartProducts();
  const [hydrated, setHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      phone: "",
      comment: "",
      paymentMethod: "mono",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  useEffect(() => {
    if (!hydrated) return;
    if (cartItems.length === 0) {
      router.replace("/cart");
    }
  }, [cartItems, hydrated, router]);

  if (!hydrated) return <div className="p-6 text-center mt-20">Завантаження...</div>;

  const totalPrice = products.reduce((sum, product) => {
    const cartItem = cartItems.find((i) => i.id === product.id);
    return sum + (product.price ?? 0) * (cartItem?.quantity || 0);
  }, 0);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setIsSubmitting(true);
      await submitCheckout(data, products, cartItems);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto w-full lg:p-4">
      <h2 className="text-2xl font-bold mb-6">Оформлення замовлення</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Контактні дані */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem><FormLabel>Прізвище*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem><FormLabel>Ім’я*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="middleName" render={({ field }) => (
                  <FormItem><FormLabel>По-батькові*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Телефон*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <NovaPoshtaSelect form={form} />

              <hr className="my-6" />

              {/* Вибір методу оплати */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Спосіб оплати*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Оберіть спосіб оплати" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mono">Оплата карткою (MonoPay)</SelectItem>
                        <SelectItem value="cod">Післяплата (накладений платіж)</SelectItem>
                        <SelectItem value="invoice">Оплата на розрахунковий рахунок</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Коментар або Реквізити */}
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {paymentMethod === "invoice" ? "Дані для рахунку*" : "Коментар до замовлення"}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          paymentMethod === "invoice"
                            ? "Вкажіть назву компанії/ФОП, ЄДРПОУ та email для отримання рахунку..."
                            : "Ваші побажання до замовлення..."
                        }
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    {paymentMethod === "invoice" && (
                      <p className="text-[13px] text-blue-600 font-medium bg-blue-50 p-2 rounded">
                        ℹ️ Рахунок буде надіслано вам після перевірки менеджером.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto min-w-[200px] px-8 py-5 text-base font-semibold bg-[#171717] hover:bg-[#262626] text-white rounded-lg cursor-pointer transition-all shadow-sm active:scale-[0.98]"
              >
                {isSubmitting ? "..." : (
                  <span className="flex items-center gap-2">
                    Оформити замовлення <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Підсумок замовлення */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 h-fit shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Ваше замовлення</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {products.map((product) => {
              const cartItem = cartItems.find((i) => i.id === product.id);
              if (!cartItem) return null;
              return (
                <div key={product.id} className="flex justify-between text-sm gap-3">
                  <span className="text-gray-700 flex-1">{product.name} × {cartItem.quantity}</span>
                  <span className="font-medium whitespace-nowrap">
                    {(product.price * cartItem.quantity).toLocaleString("uk-UA")} ₴
                  </span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between font-bold text-xl">
            <span>Разом:</span>
            <span>{totalPrice.toLocaleString("uk-UA")} ₴</span>
          </div>
        </div>
      </div>
    </section>
  );
}