
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  LogOut,
  BarChart3,
  TrendingUp,
  Calendar,
  Upload,
  FolderPlus,
  Tags,
  MapPin,
  Globe,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  in_stock: boolean;
  image: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CityAnalytics {
  city: string;
  country: string;
  visitors: number;
  orders: number;
  revenue: number;
  coordinates: [number, number];
}

interface ProductSales {
  productId: string;
  productName: string;
  category: string;
  totalSold: number;
  revenue: number;
  rank: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  icon: string;
  color: string;
}

interface Order {
  id: string;
  order_id: string;
  tracking_code: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_city: string;
  total: number;
  status: string;
  created_at: string;
  notes?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '/placeholder.svg'
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });
  const [editProductForm, setEditProductForm] = useState<Product | null>(null);

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      navigate('/admin/login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      // Load products from Supabase
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error loading products:', productsError);
      } else {
        setProducts(productsData || []);
      }

      // Load orders from Supabase
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error loading orders:', ordersError);
      } else {
        setOrders(ordersData || []);
      }

      // Load categories from localStorage (can be moved to Supabase later)
      const savedCategories = JSON.parse(localStorage.getItem('categories') || JSON.stringify([
        { id: '1', name: 'electronics', description: 'Electronic devices' },
        { id: '2', name: 'accessories', description: 'Tech accessories' },
        { id: '3', name: 'wearables', description: 'Smartwatches and fitness trackers' },
        { id: '4', name: 'home', description: 'Home and living items' }
      ]));

      setCategories(savedCategories);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/admin/login');
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('order_id', orderId);

      if (error) {
        throw error;
      }

      const updatedOrders = orders.map(order =>
        order.order_id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      
      toast({
        title: 'Status Updated',
        description: `Order ${orderId} status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status.',
        variant: 'destructive'
      });
    }
  };

  const addProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productForm.name,
          price: parseFloat(productForm.price),
          category: productForm.category,
          description: productForm.description,
          image: productForm.image,
          in_stock: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProducts([data, ...products]);
      setProductForm({
        name: '',
        price: '',
        category: '',
        description: '',
        image: '/placeholder.svg'
      });

      toast({
        title: 'Product Added',
        description: `${data.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product.',
        variant: 'destructive'
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        throw error;
      }

      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      
      toast({
        title: 'Product Deleted',
        description: 'Product has been removed successfully.',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product.',
        variant: 'destructive'
      });
    }
  };

  const addCategory = () => {
    if (!categoryForm.name) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a category name.',
        variant: 'destructive'
      });
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryForm.name,
      description: categoryForm.description
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    
    setCategoryForm({ name: '', description: '' });
    
    toast({
      title: 'Category Added',
      description: `${newCategory.name} category has been created.`,
    });
  };

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(c => c.id !== categoryId);
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    
    toast({
      title: 'Category Deleted',
      description: 'Category has been removed successfully.',
    });
  };

  const openEditProduct = (product: Product) => {
    setEditProductForm({ ...product });
  };

  const updateProduct = async () => {
    if (!editProductForm) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editProductForm.name,
          price: editProductForm.price,
          category: editProductForm.category,
          description: editProductForm.description,
          image: editProductForm.image,
          in_stock: editProductForm.in_stock
        })
        .eq('id', editProductForm.id);

      if (error) {
        throw error;
      }

      const updatedProducts = products.map(p => 
        p.id === editProductForm.id ? editProductForm : p
      );
      setProducts(updatedProducts);
      setEditProductForm(null);
      
      toast({
        title: 'Product Updated',
        description: 'Product has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product.',
        variant: 'destructive'
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (isEdit && editProductForm) {
          setEditProductForm({ ...editProductForm, image: imageUrl });
        } else {
          setProductForm(prev => ({ ...prev, image: imageUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
    { productId: '1', productName: 'Apple iPhone 15 Pro', category: 'Smartphones', totalSold: 145, revenue: 173855, rank: 1 },
    { productId: '3', productName: 'Sony WH-1000XM5 Headphones', category: 'Audio', totalSold: 98, revenue: 39102, rank: 2 },
    { productId: '4', productName: 'iPad Pro 12.9"', category: 'Tablets', totalSold: 76, revenue: 83524, rank: 3 },
    { productId: '2', productName: 'Samsung Galaxy Watch 6', category: 'Wearables', totalSold: 63, revenue: 20727, rank: 4 },
    { productId: '7', productName: 'Nintendo Switch OLED', category: 'Gaming', totalSold: 52, revenue: 18148, rank: 5 },
    { productId: '6', productName: 'AirPods Pro 2nd Gen', category: 'Audio', totalSold: 48, revenue: 11952, rank: 6 },
    { productId: '8', productName: 'Canon EOS R8 Camera', category: 'Cameras', totalSold: 28, revenue: 41972, rank: 7 },
    { productId: '5', productName: 'MacBook Air M2', category: 'Laptops', totalSold: 15, revenue: 17985, rank: 8 }
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

  // Calculate dashboard stats
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalProducts = products.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                From {totalOrders} orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {pendingOrders} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {products.filter(p => p.in_stock).length} in stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12.5%</div>
              <p className="text-xs text-muted-foreground">
                vs last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="seo">SEO Manager</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
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
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Add Product Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productPrice">Price</Label>
                    <Input
                      id="productPrice"
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productCategory">Category</Label>
                    <Select
                      value={productForm.category}
                      onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Product description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productImage">Product Image</Label>
                    <Input
                      id="productImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="cursor-pointer"
                    />
                    {productForm.image !== '/placeholder.svg' && (
                      <img 
                        src={productForm.image} 
                        alt="Preview" 
                        className="mt-2 w-20 h-20 object-cover rounded border"
                      />
                    )}
                  </div>
                  <Button onClick={addProduct} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </CardContent>
              </Card>

              {/* Products List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>
                      Manage your product inventory
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">${product.price}</p>
                              <Badge variant="outline">{product.category}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                             <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                               {product.in_stock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => openEditProduct(product)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Edit Product</DialogTitle>
                                  <DialogDescription>
                                    Update product information
                                  </DialogDescription>
                                </DialogHeader>
                                {editProductForm && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="editProductName">Product Name</Label>
                                      <Input
                                        id="editProductName"
                                        value={editProductForm.name}
                                        onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="editProductPrice">Price</Label>
                                      <Input
                                        id="editProductPrice"
                                        type="number"
                                        value={editProductForm.price}
                                        onChange={(e) => setEditProductForm({ ...editProductForm, price: parseFloat(e.target.value) })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="editProductCategory">Category</Label>
                                      <Select
                                        value={editProductForm.category}
                                        onValueChange={(value) => setEditProductForm({ ...editProductForm, category: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.name}>
                                              {category.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="editProductImage">Product Image</Label>
                                      <Input
                                        id="editProductImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, true)}
                                        className="cursor-pointer"
                                      />
                                      {editProductForm.image && (
                                        <img 
                                          src={editProductForm.image} 
                                          alt="Preview" 
                                          className="mt-2 w-20 h-20 object-cover rounded border"
                                        />
                                      )}
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button onClick={updateProduct} className="flex-1">
                                        Update Product
                                      </Button>
                                      <Button variant="outline" onClick={() => setEditProductForm(null)} className="flex-1">
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Add Category Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter category name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryDescription">Description</Label>
                    <Textarea
                      id="categoryDescription"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Category description"
                    />
                  </div>
                  <Button onClick={addCategory} className="w-full">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </CardContent>
              </Card>

              {/* Categories List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>
                      Manage your product categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Tags className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-sm text-gray-600">{category.description}</p>
                              <Badge variant="outline">
                                {products.filter(p => p.category === category.name).length} products
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>Gestionnaire SEO</CardTitle>
                <CardDescription>
                  Optimisez le référencement de vos produits pour améliorer leur visibilité sur les moteurs de recherche
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 space-y-4">
                  <div className="text-6xl">🔍</div>
                  <h3 className="text-xl font-semibold">Optimisation SEO Avancée</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Créez et gérez le contenu SEO optimisé pour chaque produit. 
                    Améliorez votre classement sur Google pour "cosmétiques bio Maroc".
                  </p>
                  <Button 
                    onClick={() => navigate('/admin/seo-manager')} 
                    size="lg"
                    className="mt-4"
                  >
                    Ouvrir le Gestionnaire SEO
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Top Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top City Revenue</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{cityAnalytics[0]?.city || 'Casablanca'}</div>
                    <p className="text-xs text-muted-foreground">
                      ${cityAnalytics[0]?.revenue.toLocaleString() || '12,450'} revenue
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Best Selling Product</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">{productSales[0]?.productName || 'iPhone 15 Pro'}</div>
                    <p className="text-xs text-muted-foreground">
                      {productSales[0]?.totalSold || 145} units sold
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {cityAnalytics.reduce((sum, city) => sum + city.visitors, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      From {cityAnalytics.length} cities
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* City Analytics and Product Rankings */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* City Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      City Performance Analytics
                    </CardTitle>
                    <CardDescription>
                      Revenue and visitor data by city
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cityAnalytics.map((city, index) => (
                        <div key={city.city} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{city.city}</p>
                                <p className="text-sm text-gray-500">{city.country}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex space-x-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Visitors</p>
                                  <p className="font-bold">{city.visitors.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Orders</p>
                                  <p className="font-bold">{city.orders}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Revenue</p>
                                  <p className="font-bold text-green-600">${city.revenue.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="mt-2">
                                <div className="w-24 h-2 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                                    style={{ width: `${(city.revenue / cityAnalytics[0].revenue) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Product Sales Ranking */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Product Sales Ranking
                    </CardTitle>
                    <CardDescription>
                      Most to least sold products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productSales.map((product, index) => (
                        <div key={product.productId} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                                index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                                index === 2 ? 'bg-gradient-to-br from-yellow-600 to-yellow-800' :
                                'bg-gradient-to-br from-blue-500 to-purple-600'
                              }`}>
                                {product.rank}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{product.productName}</p>
                                <Badge variant="outline" className="text-xs">{product.category}</Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex space-x-3 text-sm">
                                <div>
                                  <p className="text-gray-500">Sold</p>
                                  <p className="font-bold">{product.totalSold}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Revenue</p>
                                  <p className="font-bold text-green-600">${product.revenue.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="mt-2">
                                <div className="w-20 h-2 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                                    style={{ width: `${(product.totalSold / productSales[0].totalSold) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Traffic Sources Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Visitor Traffic Sources
                  </CardTitle>
                  <CardDescription>
                    Where your visitors are coming from
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficSources.map((source, index) => (
                      <div key={source.source} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${source.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                              {source.icon}
                            </div>
                            <div>
                              <p className="font-medium">{source.source}</p>
                              <p className="text-sm text-gray-500">{source.visitors.toLocaleString()} visitors</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {source.percentage}%
                            </div>
                            <div className="w-24 h-3 bg-gray-200 rounded-full mt-2">
                              <div 
                                className={`h-3 bg-gradient-to-r ${source.color} rounded-full transition-all duration-700`}
                                style={{ width: `${source.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Traffic Sources Summary */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3">Traffic Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Organic Search</p>
                        <p className="font-bold text-green-600">42.3%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Social Media</p>
                        <p className="font-bold text-blue-600">47.1%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Direct Traffic</p>
                        <p className="font-bold text-purple-600">6.2%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email & Other</p>
                        <p className="font-bold text-orange-600">4.4%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audience Insights */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Audience Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          Morocco
                        </span>
                        <span className="font-bold">78.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          France
                        </span>
                        <span className="font-bold">12.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                          Spain
                        </span>
                        <span className="font-bold">8.7%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Overall:</span>
                        <span className="font-bold text-green-600">6.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Morocco:</span>
                        <span className="font-bold text-green-600">7.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>International:</span>
                        <span className="font-bold">5.6%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Growth Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Revenue Growth:</span>
                        <span className="font-bold text-green-600">+24.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>New Customers:</span>
                        <span className="font-bold text-blue-600">+18.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg. Order Value:</span>
                        <span className="font-bold text-purple-600">+12.1%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
