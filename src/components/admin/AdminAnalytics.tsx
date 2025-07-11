import { MapPin, Globe, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CityAnalytics, ProductSales, TrafficSource } from '@/types/admin';

export const AdminAnalytics = () => {
  // Mock analytics data
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

      {/* Product Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Product Performance
          </CardTitle>
          <CardDescription>
            Best selling products and revenue analysis
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