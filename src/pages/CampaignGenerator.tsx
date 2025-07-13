import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, TrendingUp, Sparkles, Calendar, Download, Edit } from "lucide-react";
import { Link } from "react-router-dom";

const CampaignGenerator = () => {
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
            <Link to="/trends" className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors">
              <TrendingUp size={20} />
              <span>Forecasts</span>
            </Link>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-pink-500 text-white">
              <Sparkles size={20} />
              <span>Campaign Generator</span>
              <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">BETA</span>
            </div>
            <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors">
              <Calendar size={20} />
              <span>Account</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Campaign Generator</h1>
          
          {/* Festival Selection */}
          <div className="flex gap-6 mb-12">
            <Select defaultValue="raksha-bandhan">
              <SelectTrigger className="w-64 bg-purple-100 border-purple-300">
                <SelectValue placeholder="Select Festival" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="raksha-bandhan">Raksha Bandhan</SelectItem>
                <SelectItem value="diwali">Diwali</SelectItem>
                <SelectItem value="eid">Eid</SelectItem>
                <SelectItem value="navratri">Navratri</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="onam">
              <SelectTrigger className="w-64 bg-purple-100 border-purple-300">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onam">Onam</SelectItem>
                <SelectItem value="durga-puja">Durga Puja</SelectItem>
                <SelectItem value="karwa-chauth">Karwa Chauth</SelectItem>
                <SelectItem value="ganesh-chaturthi">Ganesh Chaturthi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campaign Previews */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            {/* Instagram Reel Preview */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Instagram Reel Preview</h3>
              <Card className="p-4 bg-gradient-to-b from-pink-100 to-purple-100 border-purple-200">
                <div className="bg-white rounded-lg p-4 mb-4 aspect-[9/16] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">👗</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Fashion Preview</p>
                    <div className="flex justify-center gap-2 mt-3">
                      <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center">
                        <span className="text-xs">❤️</span>
                      </div>
                      <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center">
                        <span className="text-xs">❤️</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1">
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1">
                    <Download size={16} className="mr-1" />
                    Download
                  </Button>
                </div>
              </Card>
            </div>

            {/* WhatsApp Flyer */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">WhatsApp Flyer</h3>
              <Card className="p-4 bg-gradient-to-b from-purple-400 to-pink-500 text-white">
                <div className="text-center mb-4">
                  <h4 className="text-xl font-bold mb-2">SHARE LOVE</h4>
                  <div className="w-24 h-24 bg-white/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">👩</span>
                  </div>
                  <Button className="bg-white text-purple-600 hover:bg-white/90">
                    Shop Now
                  </Button>
                </div>
              </Card>
            </div>

            {/* Story Card Mockup */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Story Card Mockup</h3>
              <Card className="p-4 bg-gradient-to-b from-purple-600 to-blue-600 text-white">
                <div className="text-center mb-4">
                  <h4 className="text-xl font-bold mb-2">ONAM COLLECTION</h4>
                  <div className="w-24 h-24 bg-white/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">👩</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1">
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1">
                    <Download size={16} className="mr-1" />
                    Download
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full text-lg">
              Generate New
            </Button>
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Campaign Generated!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignGenerator;