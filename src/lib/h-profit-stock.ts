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