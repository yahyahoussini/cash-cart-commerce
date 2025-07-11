import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Zap, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  thumbnail: string;
  rating: number;
  numReviews: number;
  discountPercentage: number;
  stock: number;
  brand: string;
  category: string;
  freeShipping: boolean;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Luxury Watch',
    description: 'A high-end watch with automatic movement and sapphire crystal.',
    price: 599.99,
    images: [
      '/images/watch1-1.jpg',
      '/images/watch1-2.jpg',
      '/images/watch1-3.jpg',
    ],
    thumbnail: '/images/watch1-1.jpg',
    rating: 4.8,
    numReviews: 120,
    discountPercentage: 5.0,
    stock: 50,
    brand: 'Rolex',
    category: 'Watches',
    freeShipping: true,
  },
  {
    id: '2',
    name: 'Elegant Handbag',
    description: 'A stylish leather handbag perfect for any occasion.',
    price: 249.50,
    images: [
      '/images/bag2-1.jpg',
      '/images/bag2-2.jpg',
      '/images/bag2-3.jpg',
    ],
    thumbnail: '/images/bag2-1.jpg',
    rating: 4.5,
    numReviews: 95,
    discountPercentage: 10.0,
    stock: 30,
    brand: 'Gucci',
    category: 'Handbags',
    freeShipping: false,
  },
  {
    id: '3',
    name: 'Classic Suit',
    description: 'A timeless suit made from premium wool.',
    price: 799.00,
    images: [
      '/images/suit3-1.jpg',
      '/images/suit3-2.jpg',
      '/images/suit3-3.jpg',
    ],
    thumbnail: '/images/suit3-1.jpg',
    rating: 4.7,
    numReviews: 110,
    discountPercentage: 7.5,
    stock: 40,
    brand: 'Armani',
    category: 'Suits',
    freeShipping: true,
  },
  {
    id: '4',
    name: 'Running Shoes',
    description: 'High-performance running shoes for athletes.',
    price: 129.99,
    images: [
      '/images/shoes4-1.jpg',
      '/images/shoes4-2.jpg',
      '/images/shoes4-3.jpg',
    ],
    thumbnail: '/images/shoes4-1.jpg',
    rating: 4.6,
    numReviews: 80,
    discountPercentage: 12.0,
    stock: 60,
    brand: 'Nike',
    category: 'Shoes',
    freeShipping: false,
  },
  {
    id: '5',
    name: 'Diamond Ring',
    description: 'A stunning diamond ring for special occasions.',
    price: 1999.00,
    images: [
      '/images/ring5-1.jpg',
      '/images/ring5-2.jpg',
      '/images/ring5-3.jpg',
    ],
    thumbnail: '/images/ring5-1.jpg',
    rating: 4.9,
    numReviews: 150,
    discountPercentage: 2.5,
    stock: 20,
    brand: 'Tiffany & Co.',
    category: 'Jewelry',
    freeShipping: true,
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showBuyNowForm, setShowBuyNowForm] = useState(false);
  const { addToCart } = useCart();
  
  const form = useForm({
    defaultValues: {
      name: '',
      phone: '',
      city: '',
      location: '',
    }
  });

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: 'Item added to cart',
        description: 'Check your cart to complete your order.',
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
          address: data.location, // Fix: use 'location' field from form
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

      console.log('Creating order from Buy Now:', orderData); // Debug log

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
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.error('Error sharing', error));
    } else {
      toast({
        title: 'Web Share API not supported',
        description: 'Please use another method to share this product.',
      });
    }
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const whatsappMessage = encodeURIComponent(
      `Check out this product: ${product.name} - ${product.description} at ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');
  };

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
              <Button>Return to Products</Button>
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
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        {/* Product Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg mb-4"
            />
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer ${
                    index === selectedImage ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < product.rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                {product.rating} ({product.numReviews} reviews)
              </span>
            </div>

            <div className="mb-4">
              {product.discountPercentage > 0 && (
                <Badge variant="destructive" className="mr-2">
                  {product.discountPercentage}% off
                </Badge>
              )}
              {product.freeShipping && (
                <Badge variant="secondary">Free Shipping</Badge>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-2xl font-semibold">${product.price}</span>
                {product.discountPercentage > 0 && (
                  <span className="text-gray-500 line-through ml-2">
                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                  </span>
                )}
              </div>
              <div>
                {product.stock > 0 ? (
                  <Badge variant="outline">In Stock ({product.stock} left)</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            <Separator className="mb-4" />

            {/* Quantity */}
            <div className="flex items-center space-x-4 mb-6">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity:
              </Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 text-center"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="secondary" onClick={() => setShowBuyNowForm(true)} disabled={product.stock === 0}>
                <Zap className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Product Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-green-500" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4 text-yellow-500" />
                <span>30-Day Returns</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Social Sharing */}
            <div className="flex justify-around">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm" onClick={handleWhatsApp}>
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>

        {/* Buy Now Form Modal */}
        {showBuyNowForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Complete Your Order</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBuyNowForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <form onSubmit={form.handleSubmit(handleBuyNow)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...form.register('name', { required: true })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...form.register('phone', { required: true })}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...form.register('city', { required: true })}
                      placeholder="Enter your city"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location/Address *</Label>
                    <Textarea
                      id="location"
                      {...form.register('location', { required: true })}
                      placeholder="Enter your detailed address"
                    />
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Product:</span>
                      <span>{product?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Quantity:</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Price:</span>
                      <span>${product?.price}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${product ? (product.price * quantity).toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Place Order (Cash on Delivery)
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
