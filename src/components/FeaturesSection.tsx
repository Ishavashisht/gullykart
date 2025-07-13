import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Zap, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturesSection = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Fashion Trends",
      description: "Stay ahead of the curve with local style insights",
      gradient: "from-purple-500 to-purple-600",
      route: "/trends#festival-forecast"
    },
    {
      icon: Zap,
      title: "AI-Powered Campaigns",
      description: "Generate engaging promotional content",
      gradient: "from-pink-500 to-pink-600",
      route: "/campaigns"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Flyers",
      description: "Deliver personalized product flyers to customers",
      gradient: "from-green-500 to-green-600",
      route: "/campaigns#whatsapp-flyers"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link to={feature.route} key={index}>
              <Card 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-card to-accent/5"
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
