import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, Order, Category } from '@/types/admin';
import { toast } from '@/hooks/use-toast';

export const useAdminData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        setLoading(false);
        return;
      }

      // Load products from Supabase
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error loading products:', productsError);
        toast({
          title: 'Error',
          description: 'Failed to load products. Please check your admin permissions.',
          variant: 'destructive'
        });
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
        toast({
          title: 'Error',
          description: 'Failed to load orders. Please check your admin permissions.',
          variant: 'destructive'
        });
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

  const addProduct = async (productForm: any) => {
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

  const updateProduct = async (editProductForm: Product) => {
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

  const addCategory = (categoryForm: any) => {
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

  useEffect(() => {
    loadData();
  }, []);

  return {
    products,
    orders,
    categories,
    loading,
    updateOrderStatus,
    addProduct,
    deleteProduct,
    updateProduct,
    addCategory,
    deleteCategory,
    loadData
  };
};