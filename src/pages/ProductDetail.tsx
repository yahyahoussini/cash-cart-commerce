import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Zap, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  description: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  specifications: { [key: string]: string };
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Mock product data - Replace with actual API call
        const mockProduct: Product = {
          id: id || '1',
          name: 'Premium Wireless Headphones',
          price: 299,
          originalPrice: 399,
          image: '/placeholder.svg',
          gallery: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
          description: 'Experience premium audio quality with these state-of-the-art wireless headphones. Featuring advanced noise cancellation technology, 30-hour battery life, and superior comfort for all-day wear.',
          category: 'Electronics',
          rating: 4.8,
          reviews: 1247,
          inStock: true,
          features: [
            'Active Noise Cancellation',
            '30-hour battery life',
            'Quick charge (3 hours in 15 minutes)',
            'Premium leather ear cushions',
            'Wireless and wired connectivity',
            'Built-in microphone',
            'Voice assistant compatible',
            'Foldable design'
          ],
          specifications: {
            'Driver Size': '40mm',
            'Frequency Response': '20Hz - 20kHz',
            'Impedance': '32 ohms',
            'Sensitivity': '100 dB',
            'Battery Life': '30 hours',
            'Charging Time': '2 hours',
            'Weight': '250g',
            'Connectivity': 'Bluetooth 5.0, 3.5mm jack',
            'Warranty': '2 years'
          }
        };
        
        setProduct(mockProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };

  const generateOrderId = () => {
    return 'ORDER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const generateTrackingCode = () => {
    return 'TRACK-' + Date.now().toString().slice(-6) + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const handleBuyNow = async (data: any) => {
    if (!product) return;

    try {
      const orderId = generateOrderId();
      const trackingCode = generateTrackingCode();
      
      // Split full name into first and last name
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Calculate totals
      const subtotal = product.price * quantity;
      const shipping = subtotal >= 50 ? 0 : 9.99;
      const total = subtotal + shipping;
      
      // Create order object with the correct structure expected by OrderConfirmation
      const orderData = {
        orderId,
        trackingCode,
        customer: {
          firstName,
          lastName,
          email: '', // Not collected in our simplified form
          phone: data.phone,
        },
        shippingAddress: {
          address: data.address,
          city: data.city,
          state: '', // Not collected in our simplified form
          zipCode: '', // Not collected in our simplified form
          country: '', // Not collected in our simplified form
        },
        items: [{
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image
        }],
        pricing: {
          subtotal,
          shipping,
          total
        },
        paymentMethod: 'Cash on Delivery',
        status: 'pending',
        createdAt: new Date().toISOString(),
        notes: ''
      };

      // Store order in localStorage (simulate database)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Navigate to confirmation page
      navigate(`/order-confirmation/${orderId}`, { 
        state: { orderData }
      });

      toast({
        title: 'Order Placed Successfully!',
        description: `Your order ${orderId} has been placed successfully.`,
      });

      form.reset();
      setShowBuyNowForm(false);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Failed',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Product link has been copied to clipboard.',
      });
    }
  };

  const handleWhatsApp = () => {
    if (!product) return;
    
    const message = `Hi! I'm interested in this product:
    
*${product.name}*
Price: $${product.price}
${product.originalPrice ? `Original Price: $${product.originalPrice}` : ''}

${product.description}

Please let me know about availability and delivery details.`;

    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const [showBuyNowForm, setShowBuyNowForm] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      city: '',
      quantity: 1
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">
              The product you're looking for could not be found.
            </p>
            <Link to="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-8">
          <Link to="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-lg p-4">
                <img
                  src={product.gallery[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg p-2 border-2 transition-colors ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-blue-600">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <Badge className="bg-red-500">
                  Save ${product.originalPrice - product.price}
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  size="lg"
                  className="flex-1"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                
                <Dialog open={showBuyNowForm} onOpenChange={setShowBuyNowForm}>
                  <DialogTrigger asChild>
                    <Button
                      disabled={!product.inStock}
                      size="lg"
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Buy Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Complete Your Order</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleBuyNow)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter your full name"
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  type="tel"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter your phone number"
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <textarea
                                  {...field}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter your complete address"
                                  rows={3}
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter your city"
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{product.name}</span>
                            <span>${product.price}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span>Quantity:</span>
                            <span>{quantity}</span>
                          </div>
                          <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>${(product.price * quantity).toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowBuyNowForm(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="flex-1">
                            Place Order
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={handleWhatsApp}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp
                </Button>
                
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-sm text-gray-600">On orders over $50</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-gray-600">Pay when you receive</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <RotateCcw className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">30 Day Returns</p>
                  <p className="text-sm text-gray-600">Easy returns policy</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">4.8 out of 5</span>
                      <span className="text-gray-600">({product.reviews} reviews)</span>
                    </div>
                    <p className="text-gray-600">
                      Reviews feature will be available soon. Our customers love this product!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
