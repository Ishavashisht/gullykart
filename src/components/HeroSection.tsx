import { Button } from "@/components/ui/button";
import { TrendingUp, Zap, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";



const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary"
        style={{
          backgroundImage: "var(--gradient-hero)"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                AI-Powered Hyperlocal
                <br />
                <span className="text-accent">Trend Forecasting Tool</span>
                <br />
                for Fashion Sellers
              </h1>
              <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl">
                Discover what's trending in your region, get smart product recommendations, 
                and create engaging campaigns - all powered by AI.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
  onClick={() => navigate("/trends")}
  size="lg" 
  variant="secondary"
  className="text-lg px-8 py-6 font-semibold bg-secondary hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300"
>
  Start Forecasting Now
</Button>

            </div>
          </div>

          {/* Right Content - Illustration */}
         <div className="relative">
            <div className="bg-primary-glow/20 rounded-3xl p-8 backdrop-blur-sm border border-primary-foreground/10">
              <div className="aspect-square bg-gradient-to-br from-accent/30 to-secondary/30 rounded-2xl flex items-center justify-center">
                <div className="flex justify-center items-center">
                  <img 
  src="/right_corner_image.png" 
  alt="Fashion Seller Illustration"
  className="max-w-[300px] w-full h-auto rounded-xl shadow-lg"
/>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;


