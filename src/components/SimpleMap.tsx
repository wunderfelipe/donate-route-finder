import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Route, 
  Car, 
  Clock, 
  Trash2, 
  Navigation, 
  Plus,
  Phone
} from 'lucide-react';

interface DonationPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'coleta' | 'distribuicao';
  horario: string;
  telefone?: string;
  priority?: 'alta' | 'media' | 'baixa';
}

const SimpleMap = () => {
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [currentRoute, setCurrentRoute] = useState<{
    distance: number;
    duration: number;
    points: string[];
  } | null>(null);

  const pontos: DonationPoint[] = [
    {
      id: '1',
      name: 'Centro de Coleta Alimentar',
      address: 'Rua das Flores, 123 - Centro',
      lat: -23.5505,
      lng: -46.6333,
      type: 'coleta',
      horario: '08:00 - 18:00',
      telefone: '(11) 1234-5678',
      priority: 'alta'
    },
    {
      id: '2', 
      name: 'Banco de Alimentos São Paulo',
      address: 'Av. Paulista, 456 - Bela Vista',
      lat: -23.5615,
      lng: -46.6565,
      type: 'distribuicao',
      horario: '09:00 - 17:00',
      telefone: '(11) 9876-5432',
      priority: 'media'
    },
    {
      id: '3',
      name: 'ONG Alimenta Esperança',
      address: 'Rua da Solidariedade, 789 - Vila Madalena',
      lat: -23.5448,
      lng: -46.6886,
      type: 'coleta',
      horario: '24 horas',
      telefone: '(11) 5555-4444',
      priority: 'alta'
    },
    {
      id: '4',
      name: 'Mercado Solidário',
      address: 'Av. Ibirapuera, 321 - Moema',
      lat: -23.5732,
      lng: -46.6500,
      type: 'coleta',
      horario: '06:00 - 22:00',
      telefone: '(11) 7777-8888',
      priority: 'media'
    },
    {
      id: '5',
      name: 'Centro Comunitário Esperança',
      address: 'Rua das Acácias, 654 - Ipiranga',
      lat: -23.5863,
      lng: -46.6125,
      type: 'distribuicao',
      horario: '08:00 - 16:00',
      telefone: '(11) 3333-2222',
      priority: 'baixa'
    }
  ];

  const togglePointSelection = (pointId: string) => {
    setSelectedPoints(prev => {
      return prev.includes(pointId) 
        ? prev.filter(id => id !== pointId)
        : [...prev, pointId];
    });
  };

  const calculateRoute = () => {
    if (selectedPoints.length < 2) return;

    const selectedPontos = pontos.filter(p => selectedPoints.includes(p.id));
    
    // Cálculo simples de distância total
    let totalDistance = 0;
    for (let i = 0; i < selectedPontos.length - 1; i++) {
      const point1 = selectedPontos[i];
      const point2 = selectedPontos[i + 1];
      const distance = calculateDistance(
        [point1.lat, point1.lng], 
        [point2.lat, point2.lng]
      );
      totalDistance += distance;
    }

    const estimatedDuration = totalDistance * 60; // 1 minuto por km

    setCurrentRoute({
      distance: totalDistance * 1000, // em metros
      duration: estimatedDuration,
      points: selectedPoints
    });
  };

  const calculateDistance = (point1: [number, number], point2: [number, number]) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const clearRoute = () => {
    setCurrentRoute(null);
    setSelectedPoints([]);
  };

  const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  };

  const openInGoogleMaps = () => {
    if (selectedPoints.length === 0) return;
    
    const selectedPontos = pontos.filter(p => selectedPoints.includes(p.id));
    const waypoints = selectedPontos.map(p => `${p.lat},${p.lng}`).join('/');
    const url = `https://www.google.com/maps/dir/${waypoints}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Área do Mapa - Temporariamente substituída por lista visual */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Pontos de Coleta - São Paulo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-subtle rounded-lg p-6 min-h-[500px] relative overflow-hidden">
                {/* Simulação visual do mapa */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    <path 
                      d="M50,50 Q200,20 350,80 Q380,150 320,250 Q200,280 80,220 Q20,150 50,50" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    />
                    <circle cx="100" cy="100" r="30" fill="currentColor" opacity="0.1" />
                    <circle cx="300" cy="120" r="40" fill="currentColor" opacity="0.1" />
                    <circle cx="180" cy="200" r="35" fill="currentColor" opacity="0.1" />
                  </svg>
                </div>

                {/* Pontos no mapa visual */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  {pontos.map((ponto, index) => (
                    <div 
                      key={ponto.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPoints.includes(ponto.id)
                          ? 'border-primary bg-primary/10 shadow-glow'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                      onClick={() => togglePointSelection(ponto.id)}
                      style={{
                        transform: `translate(${index * 20}px, ${index * 30}px)`,
                        maxWidth: '280px'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                          ponto.type === 'coleta' ? 'bg-primary' : 'bg-accent'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{ponto.name}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs flex-shrink-0 ${
                                ponto.priority === 'alta' ? 'border-red-300 text-red-700' :
                                ponto.priority === 'media' ? 'border-yellow-300 text-yellow-700' :
                                'border-gray-300 text-gray-700'
                              }`}
                            >
                              {ponto.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{ponto.address}</p>
                          <div className="space-y-1 text-xs">
                            <p className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {ponto.horario}
                            </p>
                            {ponto.telefone && (
                              <p className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {ponto.telefone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Indicação de rota */}
                {currentRoute && selectedPoints.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4 bg-primary/90 text-primary-foreground p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Route className="w-4 h-4" />
                      <span>Rota conectando {selectedPoints.length} pontos</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Controles de Rota */}
          <Card className="p-4 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Planejador de Rota</h3>
              <Badge variant="outline" className="text-xs">
                {selectedPoints.length} selecionados
              </Badge>
            </div>
            
            <div className="flex gap-2 mb-4">
              <Button 
                onClick={calculateRoute}
                disabled={selectedPoints.length < 2}
                className="flex-1 bg-gradient-primary text-sm"
                size="sm"
              >
                <Route className="w-4 h-4 mr-1" />
                Calcular Rota
              </Button>
              <Button 
                onClick={clearRoute}
                variant="outline"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {currentRoute && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gradient-subtle border space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Car className="w-4 h-4 text-primary" />
                    Rota Calculada
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Distância:</span>
                      <div className="font-semibold">{formatDistance(currentRoute.distance)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tempo:</span>
                      <div className="font-semibold">{formatDuration(currentRoute.duration)}</div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={openInGoogleMaps}
                  className="w-full"
                  size="sm"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Abrir no Google Maps
                </Button>
              </div>
            )}
          </Card>

          {/* Lista de Pontos */}
          <Card className="p-4 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Pontos de Coleta</h3>
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {pontos.map((ponto) => (
                <div 
                  key={ponto.id} 
                  className={`p-2 rounded cursor-pointer transition-all text-sm ${
                    selectedPoints.includes(ponto.id) 
                      ? 'bg-primary/10 border border-primary' 
                      : 'bg-card hover:bg-accent/50'
                  }`}
                  onClick={() => togglePointSelection(ponto.id)}
                >
                  <div className="font-medium">{ponto.name}</div>
                  <div className="text-xs text-muted-foreground">{ponto.address}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-gradient-subtle shadow-soft">
            <h3 className="font-semibold mb-2">Legenda</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Pontos de Coleta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span>Pontos de Distribuição</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;