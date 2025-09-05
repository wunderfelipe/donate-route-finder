import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Route, 
  Clock, 
  Truck, 
  MapPin, 
  Calendar,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';

interface RoutePoint {
  id: string;
  name: string;
  address: string;
  estimatedTime: string;
  priority: 'alta' | 'media' | 'baixa';
  status: 'pendente' | 'coletado' | 'em_andamento';
}

const RouteOptimizer = () => {
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [routes] = useState([
    {
      id: 'rota-1',
      name: 'Rota Centro - Manhã',
      distance: '15.2 km',
      estimatedTime: '2h 30min',
      points: 5,
      status: 'ativa' as const,
      points_detail: [
        {
          id: '1',
          name: 'Mercado Central',
          address: 'Rua do Comércio, 123',
          estimatedTime: '15min',
          priority: 'alta' as const,
          status: 'coletado' as const
        },
        {
          id: '2', 
          name: 'Padaria Dourada',
          address: 'Av. Principal, 456',
          estimatedTime: '10min',
          priority: 'media' as const,
          status: 'em_andamento' as const
        },
        {
          id: '3',
          name: 'Restaurante Bom Sabor',
          address: 'Rua da Alimentação, 789',
          estimatedTime: '20min',
          priority: 'alta' as const,
          status: 'pendente' as const
        }
      ]
    },
    {
      id: 'rota-2',
      name: 'Rota Zona Sul - Tarde',
      distance: '22.8 km',
      estimatedTime: '3h 15min',
      points: 7,
      status: 'planejada' as const,
      points_detail: [
        {
          id: '4',
          name: 'Supermercado Vila Nova',
          address: 'Rua das Palmeiras, 321',
          estimatedTime: '25min',
          priority: 'media' as const,
          status: 'pendente' as const
        },
        {
          id: '5',
          name: 'Café da Esquina',
          address: 'Av. dos Trabalhadores, 654',
          estimatedTime: '12min',
          priority: 'baixa' as const,
          status: 'pendente' as const
        }
      ]
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-destructive';
      case 'media': return 'bg-accent';
      case 'baixa': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'coletado': return 'bg-primary text-primary-foreground';
      case 'em_andamento': return 'bg-accent text-accent-foreground';
      case 'pendente': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRouteStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'text-primary';
      case 'planejada': return 'text-muted-foreground';
      case 'concluida': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {routes.map((route) => (
          <Card key={route.id} className="shadow-card hover:shadow-glow transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{route.name}</CardTitle>
                <Badge 
                  variant="outline" 
                  className={`${getRouteStatusColor(route.status)} border-current`}
                >
                  {route.status === 'ativa' && <Play className="w-3 h-3 mr-1" />}
                  {route.status === 'planejada' && <Pause className="w-3 h-3 mr-1" />}
                  {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Route className="w-4 h-4" />
                  {route.distance}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {route.estimatedTime}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {route.points} pontos
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveRoute(activeRoute === route.id ? null : route.id)}
                className="w-full justify-between"
              >
                {activeRoute === route.id ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  activeRoute === route.id ? 'rotate-90' : ''
                }`} />
              </Button>

              {activeRoute === route.id && (
                <div className="space-y-3 pt-2 border-t">
                  {route.points_detail.map((point, index) => (
                    <div key={point.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                          point.status === 'coletado' ? 'bg-primary text-primary-foreground' :
                          point.status === 'em_andamento' ? 'bg-accent text-accent-foreground' :
                          'bg-muted-foreground text-background'
                        }`}>
                          {index + 1}
                        </div>
                        {index < route.points_detail.length - 1 && (
                          <div className="w-px h-8 bg-border mt-2" />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{point.name}</h4>
                          <div className="flex gap-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(point.priority)} text-foreground border-transparent`}
                            >
                              {point.priority}
                            </Badge>
                            <Badge 
                              variant="outline"
                              className={`text-xs ${getStatusColor(point.status)}`}
                            >
                              {point.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{point.address}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Tempo estimado: {point.estimatedTime}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-gradient-primary" 
                  disabled={route.status !== 'planejada'}
                >
                  <Truck className="w-4 h-4 mr-2" />
                  {route.status === 'ativa' ? 'Em Andamento' : 'Iniciar Rota'}
                </Button>
                <Button variant="outline" size="icon">
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-subtle shadow-soft">
        <h3 className="text-lg font-semibold mb-4">Estatísticas de Hoje</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-card">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-sm text-muted-foreground">Pontos Coletados</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card">
            <div className="text-2xl font-bold text-accent">145kg</div>
            <div className="text-sm text-muted-foreground">Alimentos Resgatados</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card">
            <div className="text-2xl font-bold text-primary-light">8h 30m</div>
            <div className="text-sm text-muted-foreground">Tempo de Coleta</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card">
            <div className="text-2xl font-bold text-primary-dark">3</div>
            <div className="text-sm text-muted-foreground">Rotas Concluídas</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RouteOptimizer;