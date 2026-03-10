export async function fetchHProfitStock() {
  const response = await fetch(`${process.env.HPROFIT_URL}/products?limit=500`, {
    headers: {
      "Authorization": `${process.env.HPROFIT_TOKEN}`,
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  
  return data?.data || [];
}

export async function syncToHugeProfit(orderData: any, isPaid: boolean, hpStatus: string = "processing") {
  
    const numericOrderId = typeof orderData.local_order_id === 'number' 
      ? orderData.local_order_id 
      : parseInt(orderData.local_order_id.toString().replace(/\D/g, '')) || Math.floor(Date.now() / 10000);

    const payload = {
      "data": {
        "order_id": numericOrderId,
        "price": orderData.products.reduce((total: number, p: any) => total + (p.subtotal || 0), 0),
        "currency": "UAH",
        "first_name": orderData.first_name || orderData.customer_name?.split(' ')[1] || "Клієнт",
        "last_name": orderData.last_name || orderData.customer_name?.split(' ')[0] || "",
        "phone": orderData.phone || "",
        "email": orderData.email || "",
        "status": hpStatus,
        "info": {
          "is_paid": isPaid,
          "payment_type": orderData.payment_method_label || "Без готівки",
          "comment": orderData.comment || "", 
        },
        "address_1": {
          "address_1": orderData.warehouse,
          "city": orderData.city,
          "delivery_cost": 0,
          "delivery_operator": "nova_poshta"
        },
        "order_data": orderData.products.map((p: any, index: number) => ({
          "id": index + 1, 
          "name": p.name,
          "sku": p.sku || "",
          "quantity": p.quantity,
          "price": p.price,
          "total": p.subtotal,
          "is_paid": isPaid,
          "payment_type": orderData.payment_method_label || "Без готівки",
          "product_id": null,
          "local_product_id": p.huge_profit_id ? Number(p.huge_profit_id) : null
        }))
      }
    };
    
    try {
      const response = await fetch('https://crm.h-profit.com/bapi/remote_orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HPROFIT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
        
      const resJson = await response.json();
    } catch (error) {
      console.error("HugeProfit Sync Error:", error);
    }
}