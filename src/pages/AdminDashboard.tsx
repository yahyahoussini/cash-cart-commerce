
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
  Tags
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

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  image: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Order {
  orderId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: any[];
  total: number;
  status: string;
  createdAt: string;
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
      // Load real products
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Apple iPhone 15 Pro',
          price: 1199,
          category: 'Smartphones',
          inStock: true,
          image: '/placeholder.svg'
        },
        {
          id: '2',
          name: 'Samsung Galaxy Watch 6',
          price: 329,
          category: 'Wearables',
          inStock: true,
          image: '/placeholder.svg'
        },
        {
          id: '3',
          name: 'Sony WH-1000XM5 Headphones',
          price: 399,
          category: 'Audio',
          inStock: true,
          image: '/placeholder.svg'
        },
        {
          id: '4',
          name: 'iPad Pro 12.9"',
          price: 1099,
          category: 'Tablets',
          inStock: true,
          image: '/placeholder.svg'
        },
        {
          id: '5',
          name: 'MacBook Air M2',
          price: 1199,
          category: 'Laptops',
          inStock: false,
          image: '/placeholder.svg'
        },
        {
          id: '6',
          name: 'AirPods Pro 2nd Gen',
          price: 249,
          category: 'Audio',
          inStock: true,
          image: '/placeholder.svg'
        },
        {
          id: '7',
          name: 'Nintendo Switch OLED',
          price: 349,
          category: 'Gaming',
          inStock: true,
          image: '/placeholder.svg'
        },
        {
          id: '8',
          name: 'Canon EOS R8 Camera',
          price: 1499,
          category: 'Cameras',
          inStock: true,
          image: '/placeholder.svg'
        }
      ];

      // Load orders from localStorage
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');

      // Load categories from localStorage
      const savedCategories = JSON.parse(localStorage.getItem('categories') || JSON.stringify([
        { id: '1', name: 'Smartphones', description: 'Mobile phones and devices' },
        { id: '2', name: 'Tablets', description: 'Tablet computers' },
        { id: '3', name: 'Laptops', description: 'Laptop computers' },
        { id: '4', name: 'Wearables', description: 'Smartwatches and fitness trackers' },
        { id: '5', name: 'Audio', description: 'Headphones, speakers, and audio devices' },
        { id: '6', name: 'Gaming', description: 'Gaming consoles and accessories' },
        { id: '7', name: 'Cameras', description: 'Digital cameras and photography equipment' },
        { id: '8', name: 'Accessories', description: 'Various tech accessories' }
      ]));

      setProducts(mockProducts);
      setOrders(savedOrders);
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

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order =>
      order.orderId === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    toast({
      title: 'Status Updated',
      description: `Order ${orderId} status updated to ${newStatus}.`,
    });
  };

  const addProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: productForm.name,
      price: parseFloat(productForm.price),
      category: productForm.category,
      inStock: true,
      image: productForm.image
    };

    setProducts([...products, newProduct]);
    setProductForm({
      name: '',
      price: '',
      category: '',
      description: '',
      image: '/placeholder.svg'
    });

    toast({
      title: 'Product Added',
      description: `${newProduct.name} has been added successfully.`,
    });
  };

  const deleteProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    
    toast({
      title: 'Product Deleted',
      description: 'Product has been removed successfully.',
    });
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

  const updateProduct = () => {
    if (!editProductForm) return;
    
    const updatedProducts = products.map(p => 
      p.id === editProductForm.id ? editProductForm : p
    );
    setProducts(updatedProducts);
    setEditProductForm(null);
    
    toast({
      title: 'Product Updated',
      description: 'Product has been updated successfully.',
    });
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
                {products.filter(p => p.inStock).length} in stock
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
                      <div key={order.orderId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-medium">{order.orderId}</p>
                              <p className="text-sm text-gray-600">
                                {order.customer.firstName} {order.customer.lastName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">${(order.total || 0).toFixed(2)}</p>
                              <p className="text-sm text-gray-600">
                                {order.items.length} item(s)
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
                            onValueChange={(value) => updateOrderStatus(order.orderId, value)}
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
                                  Order ID: {selectedOrder?.orderId}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Customer Information</h4>
                                    <p>{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                                    <p>{selectedOrder.customer.email}</p>
                                    <p>{selectedOrder.customer.phone}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Items</h4>
                                    <div className="space-y-2">
                                      {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between">
                                          <span>{item.name} (x{item.quantity})</span>
                                          <span>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                                        </div>
                                      ))}
                                    </div>
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
                            <Badge variant={product.inStock ? 'default' : 'destructive'}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
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
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Sales:</span>
                      <span className="font-bold">${totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Order Value:</span>
                      <span className="font-bold">
                        ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Orders:</span>
                      <span className="font-bold">{totalOrders}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pending:</span>
                      <span>{orders.filter(o => o.status === 'pending').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confirmed:</span>
                      <span>{orders.filter(o => o.status === 'confirmed').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipped:</span>
                      <span>{orders.filter(o => o.status === 'shipped').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivered:</span>
                      <span>{orders.filter(o => o.status === 'delivered').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
