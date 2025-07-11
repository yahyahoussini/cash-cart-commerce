import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Truck, Shield, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    // Simulate API call - Replace with actual API call
    const fetchProducts = async () => {
      try {
        // Bio cosmetics product data optimized for Morocco SEO
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Sérum Vitamine C Bio - Anti-Âge',
            price: 2800,
            originalPrice: 3500,
            image: '/placeholder.svg',
            description: 'Sérum anti-âge bio à la vitamine C pure, certifié ECOCERT. Illumine et raffermit la peau naturellement.',
            category: 'Soins Visage',
            rating: 4.9,
            inStock: true
          },
          {
            id: '2',
            name: 'Crème Hydratante Argan Bio Maroc',
            price: 1800,
            originalPrice: 2200,
            image: '/placeholder.svg',
            description: 'Crème hydratante à l\'huile d\'argan bio du Maroc. Nourrissante et réparatrice pour tous types de peau.',
            category: 'Soins Corps',
            rating: 4.8,
            inStock: true
          },
          {
            id: '3',
            name: 'Masque Purifiant Ghassoul Maroc',
            price: 950,
            originalPrice: 1250,
            image: '/placeholder.svg',
            description: 'Masque visage au ghassoul authentique du Maroc. Purifie et détoxifie en profondeur.',
            category: 'Masques',
            rating: 4.7,
            inStock: true
          },
          {
            id: '4',
            name: 'Rouge à Lèvres Bio Naturel',
            price: 1200,
            image: '/placeholder.svg',
            description: 'Rouge à lèvres bio avec des pigments naturels. Longue tenue et hydratation optimale.',
            category: 'Maquillage',
            rating: 4.6,
            inStock: true
          }
        ];
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Bio Cosmétiques Maroc #1 - Clean Beauty Certifiée</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            ⭐ N°1 des cosmétiques bio au Maroc. Produits naturels certifiés ECOCERT avec livraison Cash on Delivery partout au royaume. Argan bio, ghassoul, eau de rose et plus encore.
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Découvrir nos Produits Bio
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Livraison Gratuite</h3>
              <p className="text-gray-600">Livraison gratuite partout au Maroc dès 500 DH</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cash on Delivery</h3>
              <p className="text-gray-600">Payez à la livraison en toute sécurité</p>
            </div>
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Support WhatsApp</h3>
              <p className="text-gray-600">Assistance instantanée via WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Produits Bio Certifiés ECOCERT</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={`${product.name} - Cosmétique bio Maroc`}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        Promo
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <CardDescription className="mb-3">
                    {product.description}
                  </CardDescription>
                  <div className="flex items-center mb-3">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        {product.price} DH
                      </span>
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through ml-2">
                          {product.originalPrice} DH
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/product/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Voir Détails
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Ajouter au Panier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg">Voir Tous les Produits Bio</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
