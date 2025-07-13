
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, TrendingUp, Sparkles, Calendar, Download, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const CampaignGenerator = () => {
  const [form, setForm] = useState({
    product_image_url: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTAsDKKwiUTw_qkASFGUh3bR7WUHAfZ7ZBrKfPYYLfoV5n84-pRjf5BPGYhY1r4FDE1tdPvHWk23IpNkOdkF6EwFFkAg5iTxz9jfRMwIaKtPdx3M62elpLQ&usqp=CAc",
    product_name: "White Suit Set",
    event_name: "diwali",
    location: "Lucknow"
  });
  const [loading, setLoading] = useState(false);
  const [kit, setKit] = useState<{ generated_image_url: string; generated_ad_copy: string } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:8000/generate-kit", form);
      setKit(data);
      toast({ title: "Success", description: "Campaign generated" });
    } catch (e) {
      toast({ title: "Error", description: "Generation failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!kit?.generated_image_url) return;
    const a = document.createElement("a");
    a.href = kit.generated_image_url;
    a.download = "campaign-image.jpg";
    a.click();
  };

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
            <Link to="/" className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors"><MapPin size={20} /><span>Home</span></Link>
            <Link to="/trends" className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors"><TrendingUp size={20} /><span>Forecasts</span></Link>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-pink-500 text-white"><Sparkles size={20} /><span>Campaign Generator</span><span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">BETA</span></div>
            <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors"><Calendar size={20} /><span>Account</span></Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Campaign Generator</h1>

          {/* Festival & Region Input */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Input type="search" placeholder="Search Festival (e.g. Diwali)" value={form.event_name} onChange={(e) => setForm({ ...form, event_name: e.target.value })} className="bg-purple-100 border-purple-300" />
            <Input type="search" placeholder="Search Location (e.g. Jaipur)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="bg-purple-100 border-purple-300" />
          </div>

          {/* Generate Button */}
          <Button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full text-lg mb-6" onClick={handleGenerate} disabled={loading}>{loading ? "Generating…" : "Generate Campaign"}</Button>

          {kit && (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Instagram Reel Preview */}
              <Card className="p-4 bg-gradient-to-b from-pink-100 to-purple-100 border-purple-200">
                <h4 className="text-lg font-semibold text-center mb-2 text-foreground">Instagram Reel Preview</h4>
                <div className="bg-white rounded-lg p-4 mb-4 aspect-[9/16] flex items-center justify-center">
                  <img src={kit.generated_image_url} alt="Instagram Reel" className="rounded-md max-h-full object-cover" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1">
                    <Edit size={16} className="mr-1" />Edit
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1" onClick={handleDownload}>
                    <Download size={16} className="mr-1" />Download
                  </Button>
                </div>
              </Card>

              {/* WhatsApp Flyer */}
              <Card className="p-4 bg-gradient-to-b from-purple-400 to-pink-500 text-white">
                <div className="text-center mb-4">
                  <h4 className="text-xl font-bold mb-2">SHARE LOVE</h4>
                  <img src={kit.generated_image_url} alt="WhatsApp Flyer" className="w-24 h-24 rounded-lg mx-auto mb-3 object-cover" />
                  {kit.generated_ad_copy && <p className="text-sm italic mt-2">{kit.generated_ad_copy}</p>}
                  <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-white text-purple-600 hover:bg-white/90 mt-3">Shop Now</Button>
                  </a>
                </div>
              </Card>

              {/* Story Card */}
              <Card className="p-4 bg-gradient-to-b from-purple-600 to-blue-600 text-white">
                <div className="text-center mb-4">
                  <h4 className="text-xl font-bold mb-2">{form.event_name.toUpperCase()} COLLECTION</h4>
                  <img src={kit.generated_image_url} alt="Story Card" className="w-24 h-24 rounded-lg mx-auto mb-3 object-cover" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1">
                    <Edit size={16} className="mr-1" />Edit
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1" onClick={handleDownload}>
                    <Download size={16} className="mr-1" />Download
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignGenerator;
