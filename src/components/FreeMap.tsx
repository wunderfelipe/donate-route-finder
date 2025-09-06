import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Route, Car, Clock, Trash2, Navigation, Plus } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in a safer way
try {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
} catch (error) {
  console.warn('Leaflet icon setup error:', error);
}

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

interface RouteData {
  distance: number;
  duration: number;
  coordinates: [number, number][];
}

const FreeMap = () => {
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

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

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.log('Erro ao obter localização:', error)
      );
    }
  }, []);

  // Criar ícones customizados
  const createCustomIcon = (type: 'coleta' | 'distribuicao', isSelected: boolean) => {
    const color = type === 'coleta' ? '#10b981' : '#f59e0b';
    const size = isSelected ? 40 : 30;
    
    return L.divIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ${isSelected ? 'transform: scale(1.2); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3);' : ''}
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [size, size],
      iconAnchor: [size/2, size],
      popupAnchor: [0, -size]
    });
  };

  const togglePointSelection = (pointId: string) => {
    setSelectedPoints(prev => {
      return prev.includes(pointId) 
        ? prev.filter(id => id !== pointId)
        : [...prev, pointId];
    });
  };

  const calculateSimpleRoute = () => {
    if (selectedPoints.length < 2) return;

    const selectedPontos = pontos.filter(p => selectedPoints.includes(p.id));
    const coordinates: [number, number][] = selectedPontos.map(p => [p.lat, p.lng]);
    
    // Cálculo simples de distância e tempo
    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const dist = calculateDistance(coordinates[i], coordinates[i + 1]);
      totalDistance += dist;
    }

    const estimatedDuration = totalDistance * 60; // 1 minuto por km aproximadamente

    setCurrentRoute({
      distance: totalDistance * 1000, // converter para metros
      duration: estimatedDuration,
      coordinates
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

  // Componente para centralizar no mapa
  const MapController = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    
    useEffect(() => {
      map.setView(center, 15);
    }, [center, map]);

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden shadow-card">
            <div className="w-full h-[600px]">
              <MapContainer 
                center={[-23.5505, -46.6333]} 
                zoom={12} 
                className="h-full w-full"
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Marcador da localização do usuário */}
                {userLocation && (
                  <Marker 
                    position={userLocation}
                    icon={L.divIcon({
                      html: `
                        <div style="
                          width: 20px;
                          height: 20px;
                          background-color: #3b82f6;
                          border: 3px solid white;
                          border-radius: 50%;
                          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        "></div>
                      `,
                      className: 'user-location-icon',
                      iconSize: [20, 20],
                      iconAnchor: [10, 10]
                    })}
                  >
                    <Popup>Sua Localização</Popup>
                  </Marker>
                )}

                {/* Marcadores dos pontos */}
                {pontos.map((ponto) => (
                  <Marker
                    key={ponto.id}
                    position={[ponto.lat, ponto.lng]}
                    icon={createCustomIcon(ponto.type, selectedPoints.includes(ponto.id))}
                    eventHandlers={{
                      click: () => togglePointSelection(ponto.id)
                    }}
                  >
                    <Popup>
                      <div className="p-2 max-w-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-sm">{ponto.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            ponto.priority === 'alta' ? 'bg-red-100 text-red-800' :
                            ponto.priority === 'media' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ponto.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{ponto.address}</p>
                        <div className="space-y-1 text-xs">
                          <p>⏰ {ponto.horario}</p>
                          {ponto.telefone && <p>📞 {ponto.telefone}</p>}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            onClick={() => togglePointSelection(ponto.id)}
                            className={selectedPoints.includes(ponto.id) ? 'bg-red-500' : 'bg-primary'}
                          >
                            {selectedPoints.includes(ponto.id) ? 'Remover' : 'Adicionar'}
                          </Button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Linha da rota */}
                {currentRoute && (
                  <Polyline 
                    positions={currentRoute.coordinates}
                    color="#22c55e"
                    weight={5}
                    opacity={0.8}
                  />
                )}
              </MapContainer>
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
                onClick={calculateSimpleRoute}
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
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Sua Localização</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FreeMap;