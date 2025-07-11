
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Shield, Clock, MessageCircle, Package, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About TechHub Store</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your premier destination for cutting-edge technology and electronics. 
            We specialize in authentic products from top brands with nationwide cash on delivery service.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Fast Delivery</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Quick and reliable delivery to your doorstep. Most orders delivered within 3-5 business days.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Cash on Delivery</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Pay only when you receive your order. No upfront payments, no hidden charges.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>WhatsApp Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Instant customer support through WhatsApp. Get help anytime, anywhere.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                TechHub Store was founded in 2020 by a team of technology enthusiasts who wanted to bring 
                the latest electronics and gadgets to customers nationwide with the convenience of cash on delivery.
              </p>
              <p>
                We partner directly with authorized distributors and manufacturers to ensure every product 
                is genuine and comes with full warranty. Our warehouse in the business district houses over 
                5,000 products ready for immediate shipping.
              </p>
              <p>
                Today, we serve over 50,000 satisfied customers across 150+ cities, maintaining a 98% 
                customer satisfaction rating and same-day dispatch for orders placed before 2 PM.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Package className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Quality Products</h3>
                  <p className="text-gray-600">Carefully curated selection of high-quality items.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Quick Processing</h3>
                  <p className="text-gray-600">Orders processed within 24 hours of confirmation.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Customer First</h3>
                  <p className="text-gray-600">Your satisfaction is our top priority.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-bold text-lg mb-2">Trust</h3>
                <p className="text-gray-600">
                  Building lasting relationships through transparency and reliability.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Convenience</h3>
                <p className="text-gray-600">
                  Making shopping as easy and hassle-free as possible.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Quality</h3>
                <p className="text-gray-600">
                  Delivering only the best products that meet our high standards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default About;
