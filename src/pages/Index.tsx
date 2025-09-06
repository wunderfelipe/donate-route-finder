import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Heart, 
  Users, 
  Truck, 
  Search, 
  Filter, 
  Plus,
  Route,
  Clock,
  Phone,
  Navigation2,
  Car,
  Trash2,
  Navigation
} from 'lucide-react';
import SimpleMap from '@/components/SimpleMap';
import RouteOptimizer from '@/components/RouteOptimizer';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90 shadow-glow w-full sm:w-auto"
                onClick={() => document.getElementById('pontos-coleta')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Encontrar Pontos de Coleta
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto"
                onClick={() => document.getElementById('como-ajudar')?.scrollIntoView({ behavior: 'smooth' })}
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

      {/* Statistics Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Impacto em Números
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Juntos, estamos fazendo a diferença no combate ao desperdício alimentar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1,200+</div>
              <p className="text-muted-foreground">Refeições Resgatadas</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">85</div>
              <p className="text-muted-foreground">Pontos de Coleta</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-light mb-2">350+</div>
              <p className="text-muted-foreground">Voluntários Ativos</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">45</div>
              <p className="text-muted-foreground">Estabelecimentos Parceiros</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pontos de Coleta Section */}
      <section id="pontos-coleta" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Localize Pontos de Coleta
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre pontos de doação próximos ou indique novos locais. Planeje rotas para recolher alimentos de forma eficiente.
          </p>
        </div>

        {/* Search Section */}
        <Card className="shadow-card bg-card/95 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por endereço, bairro ou tipo de estabelecimento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button className="bg-gradient-primary">
                <Navigation2 className="w-4 h-4 mr-2" />
                Usar Localização
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="mapa" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-card shadow-soft">
              <TabsTrigger value="mapa" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Mapa de Pontos
              </TabsTrigger>
              <TabsTrigger value="rotas" className="flex items-center gap-2">
                <Route className="w-4 h-4" />
                Otimizar Rotas
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="mapa" className="space-y-6">
            <SimpleMap />
          </TabsContent>

          <TabsContent value="rotas" className="space-y-6">
            <RouteOptimizer />
          </TabsContent>
        </Tabs>
      </section>

      {/* Como Ajudar Section */}
      <section id="como-ajudar" className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como Ajudar
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Informações úteis para participar da nossa rede de solidariedade
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-soft hover:shadow-glow transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Clock className="w-5 h-5" />
                  Horários de Funcionamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Segunda a Sexta:</strong> 08:00 - 18:00</p>
                <p><strong>Sábados:</strong> 09:00 - 15:00</p>
                <p><strong>Emergências:</strong> 24h (pontos específicos)</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-glow transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Phone className="w-5 h-5" />
                  Central de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>WhatsApp:</strong> (11) 9999-8888</p>
                <p><strong>Telefone:</strong> (11) 3333-4444</p>
                <p><strong>Email:</strong> contato@grainegrace.org</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-glow transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <MapPin className="w-5 h-5" />
                  Como Participar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Cadastre seu estabelecimento</p>
                <p>• Indique novos pontos de coleta</p>
                <p>• Voluntarie-se para rotas</p>
              </CardContent>
            </Card>
          </div>
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
          <Button 
            size="lg" 
            className="bg-gradient-primary shadow-glow"
            onClick={() => document.getElementById('pontos-coleta')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Começar Agora
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
