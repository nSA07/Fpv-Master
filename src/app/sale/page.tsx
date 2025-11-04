
import { getProducts } from '@/lib/directus'; 
import { ProductCard } from '@/components/product/product-card';

export default async function Page() {
    const discounted: Product[] = await getProducts(true);
    
    return (
        <div className="mt-2">
            {/* Заголовок */}
            <h1 className="text-3xl/tight font-extrabold mb-10 text-center tracking-tight">
                Акційні пропозиції
            </h1>

            {discounted && discounted.length > 0 ? (
                // --- АДАПТИВНА СІТКА З ПОКРАЩЕНИМИ ВІДСТУПАМИ ---
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {discounted.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                // ----------------------------------------------------
            ) : (
                // Заглушка, якщо товарів немає
                <div className="text-center p-12 bg-gray-100 rounded-xl text-gray-600 border border-gray-200">
                    <p className="text-xl font-semibold mb-2">Наразі акційних товарів немає.</p>
                    <p className="text-md">Слідкуйте за нашими оновленнями!</p>
                </div>
            )}
        </div>
    );
}