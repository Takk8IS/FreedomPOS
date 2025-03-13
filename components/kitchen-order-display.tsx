"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ChevronUp,
  ChevronDown
} from "lucide-react";

interface KitchenOrderDisplayProps {
  order: {
    id: string;
    tableNumber: string;
    orderNumber: string;
    status: string;
    items: Array<{
      id: number;
      name: string;
      quantity: number;
      notes?: string;
      status: string;
    }>;
    orderTime: string;
    priority: string;
  };
}

export function KitchenOrderDisplay({ order }: KitchenOrderDisplayProps) {
  const [expanded, setExpanded] = useState(true);
  const orderRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => orderRef.current,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "normal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">
            Table {order.tableNumber}
          </CardTitle>
          <Badge variant="outline">{order.orderNumber}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date(order.orderTime).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(order.priority)}>
              {order.priority}
            </Badge>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>
        </div>

        {expanded && (
          <div ref={orderRef}>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Note: {item.notes}
                      </p>
                    )}
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="text-green-600">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Complete
              </Button>
              <Button variant="outline" size="sm" className="text-red-600">
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}