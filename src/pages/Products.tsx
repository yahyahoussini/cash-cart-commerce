import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Star, Filter, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  inStock: boolean;
  originalPrice?: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  const categories = ['all', 'Electronics', 'Wearables', 'Audio', 'Gaming', 'Home', 'Fashion'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Mock data - Replace with actual API call
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Premium Wireless Headphones',
            price: 299,
            originalPrice: 399,
            image: '/placeholder.svg',
            description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life',
            category: 'Electronics',
            rating: 4.8,
            inStock: true
          },
          {
            id: '2',
            name: 'Smart Fitness Watch',
            price: 199,
            originalPrice: 249,
            image: '/placeholder.svg',
            description: 'Track your fitness goals with GPS, heart rate monitor, and sleep tracking',
            category: 'Wearables',
            rating: 4.6,
            inStock: true
          },
          {
            id: '3',
            name: 'Bluetooth Speaker',
            price: 89,
            originalPrice: 129,
            image: '/placeholder.svg',
            description: 'Portable speaker with amazing sound quality and waterproof design',
            category: 'Audio',
            rating: 4.7,
            inStock: true
          },
          {
            id: '4',
            name: 'Gaming Keyboard',
            price: 159,
            image: '/placeholder.svg',
            description: 'Mechanical gaming keyboard with RGB lighting and programmable keys',
            category: 'Gaming',
            rating: 4.9,
            inStock: true
          },
          {
            id: '5',
            name: 'Smart Home Camera',
            price: 129,
            image: '/placeholder.svg',
            description: '1080p security camera with night vision and mobile app control',
            category: 'Home',
            rating: 4.5,
            inStock: true
          },
          {
            id: '6',
            name: 'Wireless Earbuds',
            price: 79,
            originalPrice: 99,
            image: '/placeholder.svg',
            description: 'True wireless earbuds with active noise cancellation',
            category: 'Audio',
            rating: 4.4,
            inStock: false
          }
        ];
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    const searchQuery = searchParams.get('search');

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, filterCategory, sortBy, priceRange, searchParams]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Our Products</h1>
          <p className="text-gray-600">Discover our amazing collection of products</p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Min Price</label>
              <Input
                type="number"
                placeholder="$0"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Price</label>
              <Input
                type="number"
                placeholder="$999"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium mb-2">View</label>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="block">
                <Card 
                  className={`hover:shadow-lg transition-shadow cursor-pointer ${
                    viewMode === 'list' ? 'flex' : ''
                  } ${!product.inStock ? 'opacity-75' : ''}`}
                >
                  <CardHeader className={`p-0 ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`object-cover ${
                          viewMode === 'list' 
                            ? 'w-full h-48 rounded-l-lg' 
                            : 'w-full h-48 rounded-t-lg'
                        }`}
                      />
                      {product.originalPrice && (
                        <Badge className="absolute top-2 left-2 bg-red-500">
                          Sale
                        </Badge>
                      )}
                      {!product.inStock && (
                        <Badge className="absolute top-2 right-2 bg-gray-500">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                    <div>
                      <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                      <CardDescription className="mb-3">
                        {product.description}
                      </CardDescription>
                      <div className="flex items-center mb-3">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm">{product.rating}</span>
                        <Badge variant="outline" className="ml-2">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-500 line-through ml-2">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-row' : 'flex-col sm:flex-row'}`} onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="flex-1"
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
