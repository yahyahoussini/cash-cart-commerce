import { useState, useEffect } from 'react';
import { MapPin, Globe, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CityAnalytics, ProductSales, TrafficSource } from '@/types/admin';

export const AdminAnalytics = () => {
  const [realAnalytics, setRealAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    topProducts: [] as any[],
    avgOrderValue: 0
  });

  useEffect(() => {
    loadRealAnalytics();
  }, []);

  const loadRealAnalytics = async () => {
    try {
      // Get real orders data
      const { data: orders } = await supabase
        .from('orders')
        .select('total, created_at, shipping_city');
      
      // Get real products with order items
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_name, quantity, product_price');

      if (orders) {
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Group products by sales
        const productSales: { [key: string]: { quantity: number, revenue: number } } = {};
        orderItems?.forEach(item => {
          if (!productSales[item.product_name]) {
            productSales[item.product_name] = { quantity: 0, revenue: 0 };
          }
          productSales[item.product_name].quantity += item.quantity;
          productSales[item.product_name].revenue += item.quantity * item.product_price;
        });

        const topProducts = Object.entries(productSales)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 6);

        setRealAnalytics({
          totalRevenue,
          totalOrders,
          topProducts,
          avgOrderValue
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  // Use real data for some analytics, keep mock for demo purposes
  const cityAnalytics: CityAnalytics[] = [
    { city: 'Casablanca', country: 'Morocco', visitors: 1250, orders: 85, revenue: 12450, coordinates: [33.5731, -7.5898] },
    { city: 'Rabat', country: 'Morocco', visitors: 890, orders: 62, revenue: 8900, coordinates: [34.0209, -6.8416] },
    { city: 'Marrakech', country: 'Morocco', visitors: 750, orders: 48, revenue: 6780, coordinates: [31.6295, -7.9811] },
    { city: 'Fez', country: 'Morocco', visitors: 520, orders: 35, revenue: 4950, coordinates: [34.0181, -5.0078] },
    { city: 'Tangier', country: 'Morocco', visitors: 430, orders: 28, revenue: 3820, coordinates: [35.7595, -5.8340] },
    { city: 'Agadir', country: 'Morocco', visitors: 380, orders: 22, revenue: 3100, coordinates: [30.4278, -9.5981] },
    { city: 'Paris', country: 'France', visitors: 320, orders: 18, revenue: 2890, coordinates: [48.8566, 2.3522] },
    { city: 'Madrid', country: 'Spain', visitors: 280, orders: 15, revenue: 2340, coordinates: [40.4168, -3.7038] }
  ];

  const productSales: ProductSales[] = [
    { productId: '1', productName: 'Wireless Earbuds', category: 'electronics', totalSold: 145, revenue: 11595, rank: 1 },
    { productId: '2', productName: 'Smartphone Case', category: 'accessories', totalSold: 98, revenue: 2449, rank: 2 },
    { productId: '3', productName: 'Bluetooth Speaker', category: 'electronics', totalSold: 76, revenue: 11399, rank: 3 },
    { productId: '4', productName: 'Fitness Tracker', category: 'wearables', totalSold: 63, revenue: 12597, rank: 4 },
    { productId: '5', productName: 'Coffee Mug', category: 'home', totalSold: 52, revenue: 1040, rank: 5 },
    { productId: '6', productName: 'Laptop Stand', category: 'accessories', totalSold: 48, revenue: 4319, rank: 6 }
  ];

  const trafficSources: TrafficSource[] = [
    { source: 'Google Search', visitors: 2850, percentage: 42.3, icon: '🔍', color: 'from-green-500 to-green-600' },
    { source: 'Facebook', visitors: 1680, percentage: 24.9, icon: '📘', color: 'from-blue-500 to-blue-600' },
    { source: 'Instagram', visitors: 980, percentage: 14.5, icon: '📷', color: 'from-pink-500 to-purple-600' },
    { source: 'TikTok', visitors: 520, percentage: 7.7, icon: '🎵', color: 'from-black to-gray-600' },
    { source: 'Direct Link', visitors: 420, percentage: 6.2, icon: '🔗', color: 'from-gray-500 to-gray-600' },
    { source: 'YouTube', visitors: 180, percentage: 2.7, icon: '📺', color: 'from-red-500 to-red-600' },
    { source: 'Email Campaign', visitors: 95, percentage: 1.4, icon: '📧', color: 'from-indigo-500 to-indigo-600' },
    { source: 'Other', visitors: 25, percentage: 0.3, icon: '🌐', color: 'from-purple-500 to-purple-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Geographic Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Geographic Analytics
          </CardTitle>
          <CardDescription>
            Customer distribution by city and country
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cityAnalytics.map((city, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{city.city}, {city.country}</p>
                    <p className="text-sm text-gray-600">{city.visitors} visitors</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${city.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{city.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real Analytics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Real Analytics Summary
          </CardTitle>
          <CardDescription>
            Live data from your Supabase database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">${realAnalytics.totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{realAnalytics.totalOrders}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">${realAnalytics.avgOrderValue.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Avg Order Value</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{realAnalytics.topProducts.length}</div>
              <div className="text-sm text-gray-600">Product Types</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Top Selling Products</h4>
            {realAnalytics.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.quantity} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${product.revenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            ))}
            {realAnalytics.topProducts.length === 0 && (
              <p className="text-gray-500 text-center py-4">No sales data available yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Product Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Demo Product Performance
          </CardTitle>
          <CardDescription>
            Sample data for demonstration (not real data)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productSales.map((product) => (
              <div key={product.productId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{product.rank}</span>
                  </div>
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${product.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{product.totalSold} sold</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Traffic Sources
          </CardTitle>
          <CardDescription>
            Where your customers are coming from
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{source.icon}</span>
                  <div>
                    <p className="font-medium">{source.source}</p>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${source.color} h-2 rounded-full`}
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{source.visitors.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{source.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};