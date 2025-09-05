import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Heart, Users, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Grain & Grace
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Conectando pessoas e combatendo o desperdício alimentar através da tecnologia e solidariedade.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Link to="/pontos-coleta">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-background text-foreground hover:bg-background/90 shadow-glow w-full sm:w-auto"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Encontrar Pontos de Coleta
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto"
              >
                <Heart className="w-5 h-5 mr-2" />
                Como Ajudar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossa Missão
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transformamos o desperdício alimentar em oportunidades de solidariedade, criando uma rede eficiente de doação e distribuição.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-card hover:shadow-glow transition-all text-center">
            <CardHeader>
              <MapPin className="w-12 h-12 mx-auto text-primary mb-4" />
              <CardTitle>Pontos de Coleta</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Localize pontos de doação próximos e adicione novos locais à nossa rede colaborativa.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all text-center">
            <CardHeader>
              <Truck className="w-12 h-12 mx-auto text-accent mb-4" />
              <CardTitle>Rotas Inteligentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Otimize rotas de coleta para maximizar a eficiência e reduzir o desperdício alimentar.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-primary-light mb-4" />
              <CardTitle>Comunidade Unida</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Conecte estabelecimentos, voluntários e beneficiários em uma rede de solidariedade.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-warm py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Faça Parte da Mudança
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Cada alimento resgatado é uma vida transformada. Junte-se à nossa missão de combater a fome e o desperdício.
          </p>
          <Link to="/pontos-coleta">
            <Button size="lg" className="bg-gradient-primary shadow-glow">
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
