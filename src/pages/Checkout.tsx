
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes: string;
  paymentMethod: string;
  agreeToTerms: boolean;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    notes: '',
    paymentMethod: 'cod',
    agreeToTerms: false
  });

  const shipping = state.total >= 50 ? 0 : 9.99;
  const subtotal = state.total;
  const total = subtotal + shipping;

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'address', 'city', 'state', 'zipCode', 'country'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        toast({
          title: 'Missing Information',
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          variant: 'destructive'
        });
        return false;
      }
    }

    if (!formData.agreeToTerms) {
      toast({
        title: 'Terms and Conditions',
        description: 'Please agree to the terms and conditions to continue.',
        variant: 'destructive'
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive'
      });
      return false;
    }

    // Phone validation
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number.',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const generateOrderId = () => {
    return 'ORDER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const orderId = generateOrderId();
      
      // Create order object
      const orderData = {
        orderId,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        items: state.items,
        pricing: {
          subtotal,
          shipping,
          total
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Simulate API call - Replace with actual API endpoint
      console.log('Creating order:', orderData);
      
      // Store order in localStorage (simulate database)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Clear cart
      clearCart();

      // Navigate to confirmation page
      navigate(`/order-confirmation/${orderId}`, { 
        state: { orderData }
      });

      toast({
        title: 'Order Placed Successfully!',
        description: `Your order ${orderId} has been placed successfully.`,
      });

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Failed',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Button onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
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
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/cart')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions for your order..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Cash on Delivery (COD)</p>
                            <p className="text-sm text-gray-600">
                              Pay when you receive your order
                            </p>
                          </div>
                          <Shield className="h-5 w-5 text-green-600" />
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        handleInputChange('agreeToTerms', checked as boolean)
                      }
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{' '}
                      <a href="/terms" className="text-blue-600 hover:underline">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>

                  <div className="text-center text-sm text-gray-600 space-y-2">
                    <p>✓ Secure order processing</p>
                    <p>✓ Cash on delivery payment</p>
                    <p>✓ Free returns within 30 days</p>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp Support */}
              <Card className="mt-6">
                <CardContent className="p-4">
                  <div className="text-center">
                    <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Contact us on WhatsApp for instant support
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const phone = '+1234567890'; // Replace with your WhatsApp number
                        const message = 'I need help with my checkout process.';
                        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat on WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
