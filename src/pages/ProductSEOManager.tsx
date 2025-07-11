import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Save, Wand2, Copy, Check, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface ProductSEO {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  
  // SEO Fields
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  structuredData: any;
  
  // Additional SEO
  altText: string;
  focusKeyword: string;
  readabilityScore: number;
  seoScore: number;
}

const ProductSEOManager = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductSEO[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductSEO | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [keywordSuggestions] = useState([
    'cosmétiques bio maroc',
    'clean beauty maroc', 
    'produits naturels maroc',
    'soins visage bio',
    'argan bio maroc',
    'ghassoul maroc',
    'maquillage bio',
    'beauté naturelle'
  ]);

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      navigate('/admin/login');
      return;
    }

    loadProducts();
  }, [navigate]);

  const loadProducts = async () => {
    try {
      // Load existing products and add SEO fields
      const existingProducts = [
        {
          id: '1',
          name: 'Sérum Vitamine C Bio - Anti-Âge',
          price: 2800,
          category: 'Soins Visage',
          description: 'Sérum anti-âge bio à la vitamine C pure, certifié ECOCERT. Illumine et raffermit la peau naturellement.',
          image: '/placeholder.svg'
        },
        {
          id: '2', 
          name: 'Crème Hydratante Argan Bio Maroc',
          price: 1800,
          category: 'Soins Corps',
          description: 'Crème hydratante à l\'huile d\'argan bio du Maroc. Nourrissante et réparatrice pour tous types de peau.',
          image: '/placeholder.svg'
        }
      ];

      const seoProducts: ProductSEO[] = existingProducts.map(product => ({
        ...product,
        seoTitle: `${product.name} | Bio Cosmétiques Maroc #1`,
        metaDescription: `${product.description} ✅ Livraison Cash on Delivery partout au Maroc ⭐ N°1 des cosmétiques bio`,
        keywords: ['cosmétiques bio maroc', product.category.toLowerCase(), 'clean beauty'],
        slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        altText: `${product.name} - Cosmétique bio certifié ECOCERT Maroc`,
        focusKeyword: 'cosmétiques bio maroc',
        readabilityScore: 85,
        seoScore: 78,
        structuredData: generateStructuredData(product)
      }));

      setProducts(seoProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateStructuredData = (product: any) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": "Bio Beauty Maroc"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "MAD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Bio Beauty Maroc"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  });

  const generateSEOSuggestions = (product: ProductSEO) => {
    const suggestions = {
      title: `${product.name} | Bio Cosmétiques Maroc #1 - Livraison Cash`,
      description: `⭐ ${product.description} ✅ Certification ECOCERT ✅ Cash on Delivery partout au Maroc. Commandez maintenant!`,
      keywords: [
        `${product.name.toLowerCase()} bio`,
        `${product.category.toLowerCase()} maroc`,
        'cosmétiques bio maroc',
        'clean beauty maroc',
        'livraison cash on delivery'
      ]
    };
    return suggestions;
  };

  const applySEOSuggestions = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const suggestions = generateSEOSuggestions(product);
    
    const updatedProduct = {
      ...product,
      seoTitle: suggestions.title,
      metaDescription: suggestions.description,
      keywords: suggestions.keywords,
      seoScore: Math.min(product.seoScore + 15, 100)
    };

    setProducts(products.map(p => p.id === productId ? updatedProduct : p));
    setSelectedProduct(updatedProduct);

    toast({
      title: 'SEO Amélioré',
      description: 'Les suggestions SEO ont été appliquées avec succès!'
    });
  };

  const saveProduct = (product: ProductSEO) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
    toast({
      title: 'Produit Sauvegardé',
      description: 'Les informations SEO ont été mises à jour.'
    });
  };

  const copyStructuredData = (structuredData: any) => {
    navigator.clipboard.writeText(JSON.stringify(structuredData, null, 2));
    toast({
      title: 'Copié!',
      description: 'Le code de données structurées a été copié dans le presse-papiers.'
    });
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

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
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Gestionnaire SEO Produits</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={previewMode ? "default" : "outline"}
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Aperçu SEO
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Products List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Produits</CardTitle>
              <CardDescription>
                Sélectionnez un produit pour optimiser son SEO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedProduct?.id === product.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-semibold ${getSEOScoreColor(product.seoScore)}`}>
                          {product.seoScore}%
                        </div>
                        <div className="text-xs text-gray-500">SEO Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SEO Editor */}
          <div className="lg:col-span-2">
            {selectedProduct ? (
              <Tabs defaultValue="seo" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="seo">SEO Basique</TabsTrigger>
                  <TabsTrigger value="advanced">Avancé</TabsTrigger>
                  <TabsTrigger value="preview">Aperçu</TabsTrigger>
                </TabsList>

                <TabsContent value="seo">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{selectedProduct.name}</CardTitle>
                          <CardDescription>
                            Optimisation SEO pour les moteurs de recherche
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => applySEOSuggestions(selectedProduct.id)}
                          variant="outline"
                        >
                          <Wand2 className="h-4 w-4 mr-2" />
                          Auto-optimiser
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* SEO Score */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedProduct.seoScore}%
                          </div>
                          <div className="text-sm text-gray-600">Score SEO</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">
                            {selectedProduct.readabilityScore}%
                          </div>
                          <div className="text-sm text-gray-600">Lisibilité</div>
                        </div>
                      </div>

                      {/* SEO Title */}
                      <div>
                        <Label htmlFor="seoTitle">Titre SEO</Label>
                        <Input
                          id="seoTitle"
                          value={selectedProduct.seoTitle}
                          onChange={(e) => setSelectedProduct({
                            ...selectedProduct,
                            seoTitle: e.target.value
                          })}
                          placeholder="Titre optimisé pour les moteurs de recherche"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {selectedProduct.seoTitle.length}/60 caractères
                        </div>
                      </div>

                      {/* Meta Description */}
                      <div>
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <Textarea
                          id="metaDescription"
                          value={selectedProduct.metaDescription}
                          onChange={(e) => setSelectedProduct({
                            ...selectedProduct,
                            metaDescription: e.target.value
                          })}
                          placeholder="Description qui apparaîtra dans les résultats de recherche"
                          rows={3}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {selectedProduct.metaDescription.length}/160 caractères
                        </div>
                      </div>

                      {/* Focus Keyword */}
                      <div>
                        <Label htmlFor="focusKeyword">Mot-clé Principal</Label>
                        <Select
                          value={selectedProduct.focusKeyword}
                          onValueChange={(value) => setSelectedProduct({
                            ...selectedProduct,
                            focusKeyword: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir le mot-clé principal" />
                          </SelectTrigger>
                          <SelectContent>
                            {keywordSuggestions.map((keyword) => (
                              <SelectItem key={keyword} value={keyword}>
                                {keyword}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Keywords */}
                      <div>
                        <Label>Mots-clés</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedProduct.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary">
                              {keyword}
                              <button
                                onClick={() => {
                                  const newKeywords = selectedProduct.keywords.filter((_, i) => i !== index);
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    keywords: newKeywords
                                  });
                                }}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-sm text-gray-600">Suggestions:</span>
                          {keywordSuggestions
                            .filter(kw => !selectedProduct.keywords.includes(kw))
                            .slice(0, 3)
                            .map((keyword) => (
                            <Button
                              key={keyword}
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProduct({
                                ...selectedProduct,
                                keywords: [...selectedProduct.keywords, keyword]
                              })}
                            >
                              + {keyword}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Alt Text */}
                      <div>
                        <Label htmlFor="altText">Texte Alternatif Image</Label>
                        <Input
                          id="altText"
                          value={selectedProduct.altText}
                          onChange={(e) => setSelectedProduct({
                            ...selectedProduct,
                            altText: e.target.value
                          })}
                          placeholder="Description de l'image pour l'accessibilité"
                        />
                      </div>

                      <Button 
                        onClick={() => saveProduct(selectedProduct)}
                        className="w-full"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder les Modifications
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="advanced">
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres Avancés</CardTitle>
                      <CardDescription>
                        Configuration SEO avancée et données structurées
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* URL Slug */}
                      <div>
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input
                          id="slug"
                          value={selectedProduct.slug}
                          onChange={(e) => setSelectedProduct({
                            ...selectedProduct,
                            slug: e.target.value
                          })}
                          placeholder="url-produit-optimisee"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          URL finale: /product/{selectedProduct.slug}
                        </div>
                      </div>

                      {/* Structured Data */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Données Structurées (Schema.org)</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyStructuredData(selectedProduct.structuredData)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copier
                          </Button>
                        </div>
                        <Textarea
                          value={JSON.stringify(selectedProduct.structuredData, null, 2)}
                          readOnly
                          rows={12}
                          className="font-mono text-xs"
                        />
                      </div>

                      <Separator />

                      {/* SEO Checklist */}
                      <div>
                        <h4 className="font-medium mb-3">Checklist SEO</h4>
                        <div className="space-y-2">
                          {[
                            { label: 'Titre SEO optimisé', check: selectedProduct.seoTitle.length > 30 && selectedProduct.seoTitle.length < 60 },
                            { label: 'Meta description présente', check: selectedProduct.metaDescription.length > 120 },
                            { label: 'Mot-clé principal défini', check: selectedProduct.focusKeyword !== '' },
                            { label: 'Texte alternatif image', check: selectedProduct.altText !== '' },
                            { label: 'URL conviviale', check: selectedProduct.slug !== '' },
                            { label: 'Données structurées', check: true }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className={`w-4 h-4 rounded-full ${item.check ? 'bg-green-500' : 'bg-red-500'}`}>
                                {item.check && <Check className="w-3 h-3 text-white m-0.5" />}
                              </div>
                              <span className={item.check ? 'text-green-700' : 'text-red-700'}>
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview">
                  <Card>
                    <CardHeader>
                      <CardTitle>Aperçu des Résultats de Recherche</CardTitle>
                      <CardDescription>
                        Voici comment votre produit apparaîtra sur Google
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Google Search Preview */}
                      <div className="border rounded-lg p-4 bg-white">
                        <div className="text-sm text-gray-600 mb-1">
                          biobeautymaroc.com › product › {selectedProduct.slug}
                        </div>
                        <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer mb-1">
                          {selectedProduct.seoTitle}
                        </div>
                        <div className="text-gray-700 text-sm leading-relaxed">
                          {selectedProduct.metaDescription}
                        </div>
                        <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                          <span>⭐ 4.8 (127 avis)</span>
                          <span>En stock</span>
                          <span>{selectedProduct.price} DH</span>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      {/* Product Preview */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">Aperçu Produit</h4>
                        <div className="flex space-x-4">
                          <img
                            src={selectedProduct.image}
                            alt={selectedProduct.altText}
                            className="w-24 h-24 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{selectedProduct.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{selectedProduct.description}</p>
                            <div className="flex items-center mt-2 space-x-2">
                              {selectedProduct.keywords.slice(0, 3).map((keyword, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-lg font-bold text-blue-600 mt-2">
                              {selectedProduct.price} DH
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sélectionnez un produit
                  </h3>
                  <p className="text-gray-600">
                    Choisissez un produit dans la liste pour commencer l'optimisation SEO
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSEOManager;