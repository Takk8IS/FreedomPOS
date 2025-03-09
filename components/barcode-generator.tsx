"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface BarcodeGeneratorProps {
    value: string;
    width?: number;
    height?: number;
    displayValue?: boolean;
    text?: string;
}

export function BarcodeGenerator({
    value,
    width = 2,
    height = 100,
    displayValue = true,
    text,
}: BarcodeGeneratorProps) {
    const barcodeRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, value, {
                width,
                height,
                displayValue,
                text: text || value,
                font: "Inter",
                fontSize: 16,
                textMargin: 8,
                margin: 10,
            });
        }
    }, [value, width, height, displayValue, text]);

    const printBarcode = () => {
        const printWindow = window.open("", "_blank");
        if (printWindow && barcodeRef.current) {
            const svg = barcodeRef.current.outerHTML;
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Barcode</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            ${svg}
            <script>
              window.onload = () => {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
            printWindow.document.close();
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <svg ref={barcodeRef} />
            <Button onClick={printBarcode} variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print Barcode
            </Button>
        </div>
    );
}
