import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Plus, Route, Car, Clock, Trash2, Zap } from 'lucide-react';

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
  geometry: number[][];
}

const DonationMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [useAdvancedMap, setUseAdvancedMap] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  
  const [pontos] = useState<DonationPoint[]>([
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
  ]);

  // Configurar ícones do Leaflet
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const savedToken = localStorage.getItem('mapboxToken');
    if (savedToken) {
      setMapboxToken(savedToken);
      setUseAdvancedMap(true);
    }
  }, []);

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => console.log('Erro ao obter localização:', error)
      );
    }
  }, []);

  const initializeMap = async (token: string) => {
    if (!mapContainer.current) return;

    try {
      const mapboxgl = await import('mapbox-gl');
      await import('mapbox-gl/dist/mapbox-gl.css');
      
      mapboxgl.default.accessToken = token;
      
      map.current = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-46.6333, -23.5505],
        zoom: 12,
        pitch: 45,
      });

      // Adicionar controles de navegação
      map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.default.FullscreenControl(), 'top-right');

      // Adicionar controle de geolocalização
      const geolocate = new mapboxgl.default.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });
      map.current.addControl(geolocate, 'top-right');

      // Adicionar marcador da localização do usuário
      if (userLocation) {
        const userMarker = document.createElement('div');
        userMarker.className = 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg';
        
        new mapboxgl.default.Marker(userMarker)
          .setLngLat(userLocation)
          .addTo(map.current);
      }

      // Adicionar marcadores para cada ponto
      pontos.forEach((ponto) => {
        const el = document.createElement('div');
        el.className = `w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform transition-all hover:scale-110 border-2 border-white ${
          ponto.type === 'coleta' ? 'bg-primary' : 'bg-accent'
        } ${selectedPoints.includes(ponto.id) ? 'ring-4 ring-primary-light scale-110' : ''}`;
        
        el.innerHTML = `<svg class="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

        // Popup com informações detalhadas
        const popup = new mapboxgl.default.Popup({ 
          offset: 25,
          closeButton: false,
          className: 'custom-popup'
        }).setHTML(`
          <div class="p-4 max-w-xs">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-semibold text-sm">${ponto.name}</h3>
              <span class="px-2 py-1 text-xs rounded-full ${
                ponto.priority === 'alta' ? 'bg-red-100 text-red-800' :
                ponto.priority === 'media' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }">${ponto.priority}</span>
            </div>
            <p class="text-xs text-gray-600 mb-2">${ponto.address}</p>
            <div class="space-y-1 text-xs">
              <p class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                ${ponto.horario}
              </p>
              ${ponto.telefone ? `
                <p class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  ${ponto.telefone}
                </p>
              ` : ''}
            </div>
            <div class="flex gap-2 mt-3">
              <button onclick="togglePointSelection('${ponto.id}')" class="flex-1 px-3 py-1 text-xs rounded ${
                selectedPoints.includes(ponto.id) ? 'bg-red-500 text-white' : 'bg-primary text-white'
              }">
                ${selectedPoints.includes(ponto.id) ? 'Remover' : 'Adicionar'}
              </button>
              <button onclick="navigateToPoint(${ponto.lng}, ${ponto.lat})" class="px-3 py-1 text-xs bg-accent text-white rounded">
                Ir até
              </button>
            </div>
          </div>
        `);

        // Click no marcador para selecionar ponto
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          togglePointSelection(ponto.id);
        });

        new mapboxgl.default.Marker(el)
          .setLngLat([ponto.lng, ponto.lat])
          .setPopup(popup)
          .addTo(map.current);
      });

      // Função global para seleção de pontos
      (window as any).togglePointSelection = togglePointSelection;
      (window as any).navigateToPoint = navigateToPoint;

      setShowTokenInput(false);
    } catch (error) {
      console.error('Erro ao carregar o mapa:', error);
    }
  };

  const togglePointSelection = (pointId: string) => {
    setSelectedPoints(prev => {
      const newSelection = prev.includes(pointId) 
        ? prev.filter(id => id !== pointId)
        : [...prev, pointId];
      
      // Atualizar visual dos marcadores
      if (map.current) {
        pontos.forEach(ponto => {
          const markers = document.querySelectorAll(`[data-point-id="${ponto.id}"]`);
          markers.forEach(marker => {
            if (newSelection.includes(ponto.id)) {
              marker.classList.add('ring-4', 'ring-primary-light', 'scale-110');
            } else {
              marker.classList.remove('ring-4', 'ring-primary-light', 'scale-110');
            }
          });
        });
      }
      
      return newSelection;
    });
  };

  const calculateRoute = async () => {
    if (selectedPoints.length < 2 || !map.current) return;

    const selectedPontos = pontos.filter(p => selectedPoints.includes(p.id));
    const coordinates = selectedPontos.map(p => [p.lng, p.lat]);
    
    try {
      const coordinatesString = coordinates.map(coord => coord.join(',')).join(';');
      const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?geometries=geojson&access_token=${mapboxToken}`);
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        setCurrentRoute({
          distance: route.distance,
          duration: route.duration,
          geometry: route.geometry.coordinates
        });

        // Adicionar rota ao mapa
        if (map.current.getSource('route')) {
          map.current.removeLayer('route');
          map.current.removeSource('route');
        }

        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          }
        });

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#22c55e',
            'line-width': 6,
            'line-opacity': 0.8
          }
        });

        // Ajustar visualização para mostrar toda a rota
        const bounds = new (await import('mapbox-gl')).default.LngLatBounds();
        coordinates.forEach(coord => bounds.extend(coord as [number, number]));
        map.current.fitBounds(bounds, { padding: 50 });
      }
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
    }
  };

  const navigateToPoint = (lng: number, lat: number) => {
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 16,
        pitch: 60,
        duration: 2000
      });
    }
  };

  const clearRoute = () => {
    if (map.current && map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }
    setCurrentRoute(null);
    setSelectedPoints([]);
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapboxToken', mapboxToken);
      initializeMap(mapboxToken);
    }
  };

  const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  };

  const calculateBasicRoute = () => {
    if (selectedPoints.length < 2) return;
    
    const selectedPontos = pontos.filter(p => selectedPoints.includes(p.id));
    const coords: [number, number][] = selectedPontos.map(p => [p.lat, p.lng]);
    setRouteCoords(coords);
    
    // Cálculo básico de distância (aproximado)
    let totalDistance = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const dist = calculateDistance(coords[i], coords[i + 1]);
      totalDistance += dist;
    }
    
    setCurrentRoute({
      distance: totalDistance * 1000, // converter para metros
      duration: (totalDistance / 50) * 3600, // velocidade média 50km/h
      geometry: coords.map(c => [c[1], c[0]]) // converter para lng,lat
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

  const createCustomIcon = (type: string, selected: boolean) => {
    const color = type === 'coleta' ? '#22c55e' : '#f59e0b';
    const size = selected ? 35 : 25;
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        ${selected ? 'transform: scale(1.2);' : ''}
      ">
        <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };

  return (
    <div className="space-y-6">
      {!useAdvancedMap && (
        <Card className="p-4 bg-gradient-warm border-accent/20 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Mapa Básico Ativo</h3>
              <p className="text-sm text-muted-foreground">
                Upgrade para mapa avançado com Mapbox para rotas otimizadas
              </p>
            </div>
            <Button 
              onClick={() => setShowTokenInput(true)} 
              className="bg-gradient-primary gap-2"
              size="sm"
            >
              <Zap className="w-4 h-4" />
              Upgrade
            </Button>
          </div>
        </Card>
      )}

      {showTokenInput && (
        <Card className="p-6 bg-gradient-warm border-accent/20 shadow-soft">
          <h3 className="text-lg font-semibold mb-4">Configure o Mapa Avançado</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Para usar rotas otimizadas e navegação avançada, insira seu token público do Mapbox.
            Você pode obter um gratuitamente em{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="pk.eyJ1IjoiLi4u"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTokenSubmit} className="bg-gradient-primary">
              Ativar Mapa Avançado
            </Button>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden shadow-card">
            {useAdvancedMap ? (
              <div 
                ref={mapContainer} 
                className="w-full h-[600px] bg-muted"
              />
            ) : (
              <MapContainer
                center={[-23.5505, -46.6333]}
                zoom={12}
                className="w-full h-[600px]"
                zoomControl={true}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
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
                        <p className="text-xs mb-2">⏰ {ponto.horario}</p>
                        {ponto.telefone && (
                          <p className="text-xs mb-2">📞 {ponto.telefone}</p>
                        )}
                        <Button 
                          size="sm" 
                          onClick={() => togglePointSelection(ponto.id)}
                          className={selectedPoints.includes(ponto.id) ? 'bg-red-500' : 'bg-primary'}
                        >
                          {selectedPoints.includes(ponto.id) ? 'Remover' : 'Adicionar'}
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {routeCoords.length > 1 && (
                  <Polyline
                    positions={routeCoords}
                    color="#22c55e"
                    weight={4}
                    opacity={0.8}
                  />
                )}
              </MapContainer>
            )}
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
                onClick={useAdvancedMap ? calculateRoute : calculateBasicRoute}
                disabled={selectedPoints.length < 2}
                className="flex-1 bg-gradient-primary text-sm"
                size="sm"
              >
                <Route className="w-4 h-4 mr-1" />
                {useAdvancedMap ? 'Rota Avançada' : 'Rota Básica'}
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
                        navigateToPoint(ponto.lng, ponto.lat);
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

export default DonationMap;