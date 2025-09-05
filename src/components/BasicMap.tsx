import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Route, Car, Clock, Trash2, Plus } from 'lucide-react';

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

const BasicMap = () => {
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [currentRoute, setCurrentRoute] = useState<any>(null);

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

  const calculateBasicRoute = () => {
    if (selectedPoints.length < 2) return;
    
    const selectedPontos = pontos.filter(p => selectedPoints.includes(p.id));
    
    // Cálculo básico de distância
    let totalDistance = 0;
    for (let i = 0; i < selectedPontos.length - 1; i++) {
      const p1 = selectedPontos[i];
      const p2 = selectedPontos[i + 1];
      const dist = calculateDistance([p1.lat, p1.lng], [p2.lat, p2.lng]);
      totalDistance += dist;
    }
    
    setCurrentRoute({
      distance: totalDistance * 1000, // metros
      duration: (totalDistance / 50) * 3600, // velocidade 50km/h
      points: selectedPontos.length
    });
  };

  const calculateDistance = (coord1: [number, number], coord2: [number, number]) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  };

  const clearRoute = () => {
    setCurrentRoute(null);
    setSelectedPoints([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden shadow-card">
            <div className="w-full h-[600px] bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 relative overflow-hidden">
              {/* Mapa Simulado */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 600 400">
                  {/* Linhas de grade */}
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Estradas simuladas */}
                  <path d="M0,200 Q150,100 300,200 T600,200" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3"/>
                  <path d="M300,0 L300,400" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2"/>
                  <path d="M0,300 Q200,250 400,300 L600,300" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2"/>
                </svg>
              </div>
              
              {/* Pontos no mapa */}
              <div className="absolute inset-0 p-8">
                {pontos.map((ponto, index) => {
                  const x = (index * 100) + 50 + (index % 2) * 100;
                  const y = 100 + (index * 80) + (index % 3) * 50;
                  const isSelected = selectedPoints.includes(ponto.id);
                  
                  return (
                    <div
                      key={ponto.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                        isSelected ? 'scale-125 z-10' : 'hover:scale-110'
                      }`}
                      style={{ left: `${x}px`, top: `${y}px` }}
                      onClick={() => togglePointSelection(ponto.id)}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                        ponto.type === 'coleta' ? 'bg-primary' : 'bg-accent'
                      } ${isSelected ? 'ring-4 ring-primary/30' : ''}`}>
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="bg-background border shadow-lg rounded-lg p-2 text-xs whitespace-nowrap">
                          <div className="font-semibold">{ponto.name}</div>
                          <div className="text-muted-foreground">{ponto.horario}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Linha de rota */}
                {selectedPoints.length > 1 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {selectedPoints.map((pointId, index) => {
                      if (index === selectedPoints.length - 1) return null;
                      
                      const currentIndex = pontos.findIndex(p => p.id === pointId);
                      const nextIndex = pontos.findIndex(p => p.id === selectedPoints[index + 1]);
                      
                      const x1 = (currentIndex * 100) + 50 + (currentIndex % 2) * 100;
                      const y1 = 100 + (currentIndex * 80) + (currentIndex % 3) * 50;
                      const x2 = (nextIndex * 100) + 50 + (nextIndex % 2) * 100;
                      const y2 = 100 + (nextIndex * 80) + (nextIndex % 3) * 50;
                      
                      return (
                        <line
                          key={`${pointId}-${index}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="rgb(34, 197, 94)"
                          strokeWidth="3"
                          strokeDasharray="5,5"
                          className="animate-pulse"
                        />
                      );
                    })}
                  </svg>
                )}
              </div>
              
              {/* Info do mapa */}
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur rounded-lg p-3">
                <h3 className="font-semibold text-sm mb-1">Mapa Interativo Básico</h3>
                <p className="text-xs text-muted-foreground">Clique nos pontos para selecionar</p>
              </div>
            </div>
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
                onClick={calculateBasicRoute}
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
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {pontos.map((ponto) => (
                <div 
                  key={ponto.id} 
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPoints.includes(ponto.id) 
                      ? 'bg-primary/10 border-primary shadow-soft' 
                      : 'bg-card hover:shadow-soft'
                  }`}
                  onClick={() => togglePointSelection(ponto.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      ponto.type === 'coleta' ? 'bg-primary' : 'bg-accent'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{ponto.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            ponto.priority === 'alta' ? 'border-red-300 text-red-700' :
                            ponto.priority === 'media' ? 'border-yellow-300 text-yellow-700' :
                            'border-gray-300 text-gray-700'
                          }`}
                        >
                          {ponto.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{ponto.address}</p>
                      <p className="text-xs text-muted-foreground">⏰ {ponto.horario}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Navigation className="w-4 h-4" />
                    </Button>
                  </div>
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

export default BasicMap;