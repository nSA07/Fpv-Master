const API_TOKEN = process.env.NOVA_POSHTA_API_KEY;

// --- Отримання міст (CityRef для getWarehouses) ---
export async function fetchNpCities(search: string) {
  if (!search || search.length < 2) return [];

  try {
    const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: API_TOKEN,
        modelName: "Address",
        calledMethod: "getCities",
        methodProperties: {
          FindByString: search,
          Limit: 20,
        },
      }),
    });

    const data = await res.json();

    if (!data.success) {
      console.error("❗️ NP Cities Error:", data.errors || data.warnings);
      return [];
    }

    // повертаємо тільки необхідні поля
    return data.data.map((city: any) => ({
      Ref: city.Ref, // CityRef для getWarehouses
      Present: city.Description,
      SettlementTypeDescription: city.SettlementTypeDescription,
    }));
  } catch (err) {
    console.error("🔥 fetchNpCities exception:", err);
    return [];
  }
}

// --- Отримання відділень по місту ---
export async function fetchNpWarehouses(cityRef: string) {
  if (!cityRef) return [];

  try {
    const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: API_TOKEN,
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: {
          CityRef: cityRef,
          Limit: 300,
        },
      }),
    });

    const data = await res.json();

    if (!data.success) {
      console.error("❗️ NP Warehouses Error:", data.errors || data.warnings);
      return [];
    }

    return data.data.map((w: any) => ({
      Ref: w.Ref,
      Description: w.Description,
      CityRef: w.CityRef,
      Number: w.Number,
      TypeOfWarehouse: w.TypeOfWarehouse,
      // додаткові поля за потреби
    }));
  } catch (err) {
    console.error("🔥 fetchNpWarehouses exception:", err);
    return [];
  }
}

// --- Опціонально: Пошук вулиць по місту ---
export async function fetchNpStreets(cityRef: string, search: string) {
  if (!cityRef || !search) return [];

  try {
    const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: API_TOKEN,
        modelName: "Address",
        calledMethod: "getStreet",
        methodProperties: {
          CityRef: cityRef,
          FindByString: search,
        },
      }),
    });

    const data = await res.json();

    if (!data.success) {
      console.error("❗️ NP Streets Error:", data.errors || data.warnings);
      return [];
    }

    return data.data.map((s: any) => ({
      Ref: s.Ref,
      Description: s.Description,
    }));
  } catch (err) {
    console.error("🔥 fetchNpStreets exception:", err);
    return [];
  }
}
