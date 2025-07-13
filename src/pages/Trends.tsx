import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, MapPin, Calendar, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";

const center = { lat: 23.5937, lng: 80.9629 }; // Center of India

const cityCoords: Record<string, { lat: number; lng: number }> = {
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
};

const cityTrendMap: Record<string, { trend: string }> = {
  Lucknow: { trend: "Embroidered Dupattas" },
  Kolkata: { trend: "Cotton Sarees" },
  Jaipur: { trend: "Block Print Suits" },
};

const Trends = () => {
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const festivals = [
    {
      name: "Diwali",
      category: "Zari Sarees",
      color: "from-orange-500 to-red-500",
      icon: "🪔",
    },
    {
      name: "Eid",
      category: "White Kurtas",
      color: "from-teal-500 to-cyan-500",
      icon: "🌙",
    },
    {
      name: "Navratri",
      category: "Lehenga Choli",
      color: "from-orange-400 to-yellow-500",
      icon: "👗",
    },
    {
      name: "Basant",
      category: "Yellow Dupattas",
      color: "from-yellow-400 to-orange-400",
      icon: "🪁",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-primary to-secondary p-6 min-h-screen">
          <div className="text-white mb-8">
            <h2 className="text-xl font-bold">GullyKart</h2>
            <p className="text-sm opacity-90">Vision</p>
          </div>

          <nav className="space-y-2">
            <Link to="/" className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors">
              <MapPin size={20} />
              <span>Home</span>
            </Link>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-pink-500 text-white">
              <TrendingUp size={20} />
              <span>Forecasts</span>
            </div>
            <Link to="/campaigns" className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors">
              <Sparkles size={20} />
              <span>Campaign Generator</span>
            </Link>
            <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors">
              <Calendar size={20} />
              <span>Account</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Festival Forecast */}
          <div id="festival-forecast" className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-foreground">Festival Forecast</h1>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-muted rounded-full"></div>
                <div className="w-3 h-3 bg-muted rounded-full"></div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              {festivals.map((festival, index) => (
                <Card key={index} className={`p-6 bg-gradient-to-br ${festival.color} border-0 text-white`}>
                  <div className="text-3xl mb-4">{festival.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{festival.name}</h3>
                  <p className="text-white/90 mb-6">{festival.category}</p>
                  <Link to={`/insights/${festival.name.toLowerCase()}`}>
                    <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                      See Insights
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>

          {/* Regional Trend Heatmap with Google Maps */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Regional Trend Heatmap</h2>

            {isLoaded ? (
              <div className="w-full h-[500px] rounded-xl overflow-hidden">
                <GoogleMap
                  zoom={5}
                  center={center}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                >
                  {Object.entries(cityCoords).map(([city, coords]) => (
                    <Marker
                      key={city}
                      position={coords}
                      onClick={() => setActiveCity(city)}
                    />
                  ))}

                  {activeCity && (
                    <InfoWindow
                      position={cityCoords[activeCity]}
                      onCloseClick={() => setActiveCity(null)}
                    >
                      <div>
                        <h3 className="font-semibold">{activeCity}</h3>
                        <p>{cityTrendMap[activeCity].trend}</p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </div>
            ) : (
              <p>Loading map...</p>
            )}

            <div className="mt-6">
              <Button
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full"
                onClick={() => toast({ title: "Catalogue synced!", description: "Matching your products to trending styles..." })}
              >
                Sync Catalogue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
