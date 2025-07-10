
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface OrderStatus {
  orderId: string;
  trackingCode: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  createdAt: string;
  estimatedDelivery?: string;
  trackingHistory: Array<{
    status: string;
    date: string;
    description: string;
  }>;
}

const TrackOrder = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [orderData, setOrderData] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleTrackOrder = () => {
    if (!trackingCode.trim()) {
      toast({
        title: 'Missing Tracking Code',
        description: 'Please enter your tracking code to search for your order.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setNotFound(false);

    // Simulate API call - In real app, this would be an API call
    setTimeout(() => {
      try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find((o: any) => o.trackingCode === trackingCode.toUpperCase());
        
        if (order) {
          // Generate tracking history based on status
          const trackingHistory = [
            {
              status: 'Order Placed',
              date: order.createdAt,
              description: 'Your order has been received and is being processed.'
            }
          ];

          if (['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)) {
            trackingHistory.push({
              status: 'Order Confirmed',
              date: new Date(new Date(order.createdAt).getTime() + 2 * 60 * 60 * 1000).toISOString(),
              description: 'Your order has been confirmed and is being prepared.'
            });
          }

          if (['processing', 'shipped', 'delivered'].includes(order.status)) {
            trackingHistory.push({
              status: 'Processing',
              date: new Date(new Date(order.createdAt).getTime() + 6 * 60 * 60 * 1000).toISOString(),
              description: 'Your items are being prepared for shipment.'
            });
          }

          if (['shipped', 'delivered'].includes(order.status)) {
            trackingHistory.push({
              status: 'Shipped',
              date: new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
              description: 'Your order is on its way to you.'
            });
          }

          if (order.status === 'delivered') {
            trackingHistory.push({
              status: 'Delivered',
              date: new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              description: 'Your order has been delivered successfully.'
            });
          }

          setOrderData({
            ...order,
            trackingHistory
          });
          setNotFound(false);
        } else {
          setOrderData(null);
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error tracking order:', error);
        toast({
          title: 'Error',
          description: 'There was an error tracking your order. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'confirmed':
      case 'processing':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-orange-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
          <p className="text-xl text-gray-600">
            Enter your tracking code to see the status of your order
          </p>
        </div>

        {/* Search Section */}
        <Card className="max-w-md mx-auto mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Order Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="trackingCode">Tracking Code</Label>
              <Input
                id="trackingCode"
                placeholder="Enter your tracking code (e.g., TRACK-123456)"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
              />
            </div>
            <Button 
              onClick={handleTrackOrder} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Track Order'}
            </Button>
          </CardContent>
        </Card>

        {/* Not Found */}
        {notFound && (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
              <p className="text-gray-600">
                We couldn't find an order with this tracking code. Please check your code and try again.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        {orderData && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Details</span>
                  <Badge className={getStatusColor(orderData.status)}>
                    {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">{orderData.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tracking Code</p>
                    <p className="font-semibold">{orderData.trackingCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-semibold">
                      {orderData.customer.firstName} {orderData.customer.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-semibold">${orderData.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tracking History */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.trackingHistory.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.status}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrder;
