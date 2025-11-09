"use client";

import { useEffect, useState, useRef } from "react";
import { useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { fetchNpCities, fetchNpWarehouses } from "@/actions/novaPoshta";

type Props = { form: any };

// debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export function NovaPoshtaSelect({ form }: Props) {
  const [cities, setCities] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [cityQuery, setCityQuery] = useState("");
  const [warehouseQuery, setWarehouseQuery] = useState("");
  const [isCityPopoverOpen, setIsCityPopoverOpen] = useState(false);
  const [isWarehousePopoverOpen, setIsWarehousePopoverOpen] = useState(false);
  const [isCityLoading, setIsCityLoading] = useState(false);
  const [isWarehouseLoading, setIsWarehouseLoading] = useState(false);

  const debouncedCityQuery = useDebounce(cityQuery, 500);

  // reactive value from form
  const selectedCity = useWatch({ control: form.control, name: "city" });
  const selectedCityRef = selectedCity?.ref;

  // cache for warehouses
  const warehouseCache = useRef<Record<string, any[]>>({});

  // --- LOAD CITIES ---
  useEffect(() => {
    const loadCities = async () => {
      if (debouncedCityQuery.length < 2) {
        setCities([]);
        return;
      }

      setIsCityLoading(true);
      try {
        const result = await fetchNpCities(debouncedCityQuery);
        setCities(result);
      } catch (error) {
        console.error("Помилка пошуку міст:", error);
        setCities([]);
      } finally {
        setIsCityLoading(false);
      }
    };

    loadCities();
  }, [debouncedCityQuery]);

  // --- LOAD WAREHOUSES ---
  useEffect(() => {
    if (!selectedCityRef) {
      setWarehouses([]);
      return;
    }

    setWarehouseQuery("");

    if (warehouseCache.current[selectedCityRef]) {
      setWarehouses(warehouseCache.current[selectedCityRef]);
      return;
    }

    const loadWarehouses = async () => {
      setIsWarehouseLoading(true);
      try {
        const result = await fetchNpWarehouses(selectedCityRef);
        warehouseCache.current[selectedCityRef] = result;
        setWarehouses(result);
      } catch (error) {
        console.error("Помилка завантаження відділень:", error);
        setWarehouses([]);
      } finally {
        setIsWarehouseLoading(false);
      }
    };

    loadWarehouses();
  }, [selectedCityRef]);

  // --- RESET WAREHOUSE on CITY CHANGE ---
  useEffect(() => {
    const warehouse = form.getValues("warehouse");
    if (warehouse && warehouse.cityRef !== selectedCityRef) {
      form.setValue("warehouse", undefined);
    }
  }, [selectedCityRef]);

  return (
    <div className="space-y-5">

      {/* CITY FIELD */}
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Місто*</FormLabel>
            <Popover open={isCityPopoverOpen} onOpenChange={setIsCityPopoverOpen} >
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                  >
                    {field.value?.label || "Оберіть місто"}
                    {isCityLoading && <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />}
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent className="p-0 max-h-72 overflow-y-auto" side="bottom" style={{ width: "var(--radix-popover-trigger-width)" }}>
                <Command>
                  <CommandInput placeholder="Пошук міста..." onValueChange={setCityQuery} />
                  <CommandEmpty>
                    {isCityLoading
                      ? "Завантаження..."
                      : debouncedCityQuery.length < 2
                      ? "Введіть мінімум 2 символи"
                      : "Місто не знайдено"}
                  </CommandEmpty>

                  {!isCityLoading && cities.length > 0 && (
                    <CommandGroup>
                      {cities.map((city) => (
                        <CommandItem
                          key={city.Ref}
                          value={city.Present}
                          onSelect={() => {
                            field.onChange({
                              label: city.Present,
                              ref: city.Ref,
                              area: city.SettlementTypeDescription,
                            });
                            setIsCityPopoverOpen(false);
                          }}
                        >
                          {city.Present}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* WAREHOUSE FIELD */}
      <FormField
        control={form.control}
        name="warehouse"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Відділення / Поштомат*</FormLabel>
            <Popover open={isWarehousePopoverOpen} onOpenChange={setIsWarehousePopoverOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={!selectedCityRef}
                    className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                  >
                    {field.value?.label || "Оберіть відділення"}
                    {isWarehouseLoading && <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />}
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent className="p-0 max-h-72 overflow-y-auto" side="bottom" style={{ width: "var(--radix-popover-trigger-width)" }}>
                <Command>
                  <CommandInput placeholder="Пошук відділення..." onValueChange={setWarehouseQuery} />
                  <CommandEmpty>
                    {isWarehouseLoading
                      ? "Завантаження..."
                      : !selectedCityRef
                      ? "Спочатку оберіть місто"
                      : "Відділення не знайдено"}
                  </CommandEmpty>

                  {!isWarehouseLoading && warehouses.length > 0 && (
                    <CommandGroup>
                      {warehouses
                        .filter((w) =>
                          w.Description.toLowerCase().includes(warehouseQuery.toLowerCase())
                        )
                        .map((w) => (
                          <CommandItem
                            key={w.Ref}
                            value={w.Description}
                            onSelect={() => {
                              field.onChange({
                                label: w.Description,
                                ref: w.Ref,
                                cityRef: selectedCityRef,
                              });
                              setWarehouseQuery("");
                              setIsWarehousePopoverOpen(false); // закриваємо після вибору
                            }}
                          >
                            {w.Description}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
