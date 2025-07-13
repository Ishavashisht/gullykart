import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, MapPin, Calendar, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Trends = () => {
  const festivals = [
    {
      name: "Diwali",
      category: "Zari Sarees",
      color: "from-orange-500 to-red-500",
      icon: "🪔"
    },
    {
      name: "Eid",
      category: "White Kurtas", 
      color: "from-teal-500 to-cyan-500",
      icon: "🌙"
    },
    {
      name: "Navratri",
      category: "Lehenga Choli",
      color: "from-orange-400 to-yellow-500",
      icon: "👗"
    },
    {
      name: "Basant",
      category: "Yellow Dupattas",
      color: "from-yellow-400 to-orange-400",
      icon: "🪁"
    }
  ];

  const regionalTrends = [
    { city: "Lucknow", trend: "Embroidered Dupattas", position: { top: "45%", left: "45%" } },
    { city: "Kolkata", trend: "Cotton Sarees", position: { top: "55%", left: "60%" } },
    { city: "Jaipur", trend: "Block Print Suits", position: { top: "50%", left: "35%" } }
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
          <div className="mb-12">
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
  <Button 
    variant="secondary" 
    className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
  >
    See Insights
  </Button>
</Link>

                </Card>
              ))}
            </div>
          </div>

          {/* Regional Trend Heatmap */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Regional Trend Heatmap</h2>
            
            <div className="flex gap-12 items-start">
              {/* Trend List */}
              <div className="space-y-4">
                {regionalTrends.map((trend, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <TrendingUp className="text-pink-500" size={20} />
                    <div>
                      <div className="font-semibold text-foreground">{trend.city}</div>
                      <div className="text-muted-foreground">{trend.trend}</div>
                    </div>
                  </div>
                ))}
                
                <Button className="mt-6 bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full">
                  Sync Catalogue
                </Button>
              </div>

              {/* India Map */}
              <div className="relative flex-1 max-w-md">
                <div className="relative w-full h-96 bg-gradient-to-br from-pink-400 to-orange-400 rounded-2xl overflow-hidden">
                  {/* Simplified India map silhouette */}
                  <svg viewBox="0 0 300 400" className="w-full h-full opacity-80">
                    <path 
                      d="M150 50 C200 60, 250 100, 240 200 C230 300, 180 350, 150 360 C120 350, 70 300, 60 200 C50 100, 100 60, 150 50 Z" 
                      fill="rgba(255,255,255,0.3)"
                    />
                  </svg>
                  
                  {/* Trend markers */}
                  {regionalTrends.map((trend, index) => (
                    <div 
                      key={index}
                      className="absolute w-4 h-4 bg-white rounded-full border-4 border-pink-300"
                      style={trend.position}
                    ></div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground">Auto-match your products with top trends.</p>
                </div>
              </div>

              {/* Right side trend info */}
              <div className="space-y-6">
                <div>
                  <div className="font-semibold text-foreground">Lucknow</div>
                  <div className="text-muted-foreground">Embroidered Dupattas</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Jaipur</div>
                  <div className="text-muted-foreground">Block Print Suits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;