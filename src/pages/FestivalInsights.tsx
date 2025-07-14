import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, ShoppingCart, Star, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  occasion: string;
  seller_name: string;
}

const FestivalInsights = () => {
  const { festival } = useParams<{ festival: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const festivalInfo: Record<string, { title: string; emoji: string; description: string; color: string }> = {
    diwali: {
      title: 'Diwali Collection',
      emoji: '🪔',
      description: 'Illuminate your celebrations with our stunning Diwali collection',
      color: 'from-yellow-400 to-orange-500'
    },
    wedding: {
      title: 'Wedding Collection',
      emoji: '💒',
      description: 'Make your special day unforgettable with our bridal collection',
      color: 'from-pink-400 to-red-500'
    },
    eid: {
      title: 'Eid Collection',
      emoji: '🌙',
      description: 'Celebrate Eid in style with our festive collection',
      color: 'from-green-400 to-emerald-500'
    },
    navratri: {
      title: 'Navratri Collection',
      emoji: '🎭',
      description: 'Dance the night away in our vibrant Navratri outfits',
      color: 'from-purple-400 to-pink-500'
    },
    'karva-chauth': {
      title: 'Karva Chauth Collection',
      emoji: '🌕',
      description: 'Traditional elegance for your special occasion',
      color: 'from-red-400 to-pink-500'
    },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!festival) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:3001/api/products/occasion/${festival}`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
          if (data.products.length === 0) {
            setError(`No products found for ${festival}`);
          }
        } else {
          setError(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [festival]);

  const currentFestival = festival ? festivalInfo[festival] : null;

  if (!festival || !currentFestival) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Festival Not Found</h2>
            <p className="text-gray-600 mb-6">
              The festival you're looking for doesn't exist or isn't available yet.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className={`bg-gradient-to-r ${currentFestival.color} text-white py-16`}>
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <div className="text-6xl mb-4">{currentFestival.emoji}</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {currentFestival.title}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              {currentFestival.description}
            </p>
            <div className="flex items-center justify-center mt-6 gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-lg capitalize">{festival} Special</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="h-6 w-6 animate-spin" />
              <span className="text-lg">Loading {festival} products...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold mb-2">Oops!</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="text-center mb-12">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
              </Badge>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop`;
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className={`bg-gradient-to-r ${currentFestival.color} text-white`}>
                        {currentFestival.emoji} {festival}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{product.price.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm text-gray-600">4.5</span>
                      </div>
                    </div>
                    
                    {product.seller_name && (
                      <p className="text-sm text-gray-500 mb-3">
                        by {product.seller_name}
                      </p>
                    )}
                    
                    <Button 
                      className="w-full"
                      onClick={() => toast.success(`Added ${product.name} to cart!`)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{currentFestival.emoji}</div>
                  <h3 className="text-2xl font-bold mb-4">
                    Make Your {currentFestival.title.replace(' Collection', '')} Special!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Don't miss out on these exclusive {festival} deals. Shop now and celebrate in style!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button size="lg" className={`bg-gradient-to-r ${currentFestival.color}`}>
                      Shop More {festival} Collection
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate('/')}>
                      Explore All Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FestivalInsights;
