import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Order } from '@/types/admin';

interface AdminOrdersProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: string) => void;
}

export const AdminOrders = ({ orders, updateOrderStatus }: AdminOrdersProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          Manage and track customer orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No orders yet</p>
          ) : (
            orders.map((order) => (
              <div key={order.order_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{order.order_id}</p>
                      <p className="text-sm text-gray-600">
                        {order.customer_first_name} {order.customer_last_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">${(order.total || 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        {order.shipping_city}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    order.status === 'pending' ? 'destructive' :
                    order.status === 'confirmed' ? 'default' :
                    order.status === 'shipped' ? 'secondary' : 'default'
                  }>
                    {order.status}
                  </Badge>
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.order_id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                          Order ID: {selectedOrder?.order_id}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Customer Information</h4>
                            <p>{selectedOrder.customer_first_name} {selectedOrder.customer_last_name}</p>
                            <p>{selectedOrder.customer_email || 'No email'}</p>
                            <p>{selectedOrder.customer_phone}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Shipping Details</h4>
                            <p>City: {selectedOrder.shipping_city}</p>
                            <p>Total: ${selectedOrder.total}</p>
                            {selectedOrder.notes && <p>Notes: {selectedOrder.notes}</p>}
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-bold">
                              <span>Total:</span>
                              <span>${(selectedOrder.total || 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};