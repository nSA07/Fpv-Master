"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CopyButton = ({ value }: { value: string | number }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(String(value));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    return (
        <Button
            variant="ghost"
            onClick={handleCopy}
            className="inline-flex items-center justify-center p-2 has-[>svg]:px-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Копіювати артикул"
        >
            {copied ? (
                <Check size={14} className="text-green-500" />
            ) : (
                <Copy size={14} />
            )}
        </Button>
    );
};