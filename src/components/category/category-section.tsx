import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "../product/product-card";
import { ChevronRight } from "lucide-react";

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  products,
}) => {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-3xl font-bold text-gray-400 uppercase tracking-wide">
          COMING SOON
        </p>
      </div>
    );
  }
  
  return (
    <section className="mb-10">
      {categories.map((category) => {
        const catProducts = products.filter(
          (p) => category.children_subcategory
            .map((sub) => sub.id)
            .includes(p.subcategories.id)
        );
        
        if (catProducts.length === 0) return null;
        return (
          <div key={category.id} className="flex flex-col py-9 gap-2">
            <Carousel opts={{ align: "start" }}>
              <div className="flex justify-between items-center gap-2 sm:gap-0 pt-4 pb-4 sm:pb-8 relative">
                <h2 className="text-xl/tight md:text-2xl/tight font-bold uppercase">
                  {category.name}
                </h2>

                <div className="flex items-end xl:items-center gap-1 sm:gap-4 sm:ml-auto flex-col-reverse sm:flex-row">
                  <Link
                    href={`/${category.id}`}
                    className="text-sm/tight flex items-center font-semibold uppercase underline"
                  >
                    переглянути всі
                    <ChevronRight size={25} strokeWidth={2} />
                  </Link>
                  <div className="flex gap-1">
                    <CarouselPrevious className="static -translate-y-0 cursor-pointer" />
                    <CarouselNext className="static -translate-y-0 cursor-pointer" />
                  </div>
                </div>
              </div>

              <CarouselContent>
                {catProducts.map((p) => (
                  <CarouselItem
                    className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    key={p.id}
                  >
                    <ProductCard product={p} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        );
      })}
    </section>
  );
};