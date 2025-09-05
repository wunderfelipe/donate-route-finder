import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Search, 
  Filter, 
  Plus,
  Route,
  Clock,
  Phone,
  Navigation2
} from 'lucide-react';
import BasicMap from '@/components/BasicMap';
import RouteOptimizer from '@/components/RouteOptimizer';

const DonationPoints = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Localize Pontos de Coleta
            </h1>
            <p className="text-lg md:text-xl opacity-90 leading-relaxed">
              Encontre pontos de doação próximos ou indique novos locais. 
              Planeje rotas para recolher alimentos de forma eficiente, 
              garantindo que produtos que seriam descartados cheguem a pessoas em situação de vulnerabilidade.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90 shadow-glow"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Encontrar Pontos Próximos
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar Novo Ponto
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <Card className="shadow-card bg-card/95 backdrop-blur-sm">
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
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
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
            <BasicMap />
          </TabsContent>

          <TabsContent value="rotas" className="space-y-6">
            <RouteOptimizer />
          </TabsContent>
        </Tabs>
      </section>

      {/* Information Cards */}
      <section className="container mx-auto px-4 pb-16">
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
      </section>
    </div>
  );
};

export default DonationPoints;