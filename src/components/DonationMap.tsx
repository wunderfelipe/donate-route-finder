import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Plus } from 'lucide-react';

interface DonationPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'coleta' | 'distribuicao';
  horario: string;
  telefone?: string;
}

const DonationMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [pontos] = useState<DonationPoint[]>([
    {
      id: '1',
      name: 'Centro de Coleta Alimentar',
      address: 'Rua das Flores, 123 - Centro',
      lat: -23.5505,
      lng: -46.6333,
      type: 'coleta',
      horario: '08:00 - 18:00',
      telefone: '(11) 1234-5678'
    },
    {
      id: '2', 
      name: 'Banco de Alimentos São Paulo',
      address: 'Av. Paulista, 456 - Bela Vista',
      lat: -23.5615,
      lng: -46.6565,
      type: 'distribuicao',
      horario: '09:00 - 17:00',
      telefone: '(11) 9876-5432'
    },
    {
      id: '3',
      name: 'ONG Alimenta Esperança',
      address: 'Rua da Solidariedade, 789 - Vila Madalena',
      lat: -23.5448,
      lng: -46.6886,
      type: 'coleta',
      horario: '24 horas',
      telefone: '(11) 5555-4444'
    }
  ]);

  const initializeMap = async (token: string) => {
    if (!mapContainer.current) return;

    try {
      const mapboxgl = await import('mapbox-gl');
      await import('mapbox-gl/dist/mapbox-gl.css');
      
      mapboxgl.default.accessToken = token;
      
      const map = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-46.6333, -23.5505],
        zoom: 11,
        pitch: 0,
      });

      map.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

      // Adicionar marcadores para cada ponto
      pontos.forEach((ponto) => {
        const el = document.createElement('div');
        el.className = `w-8 h-8 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform transition-transform hover:scale-110 ${
          ponto.type === 'coleta' ? 'bg-primary' : 'bg-accent'
        }`;
        el.innerHTML = `<svg class="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

        const popup = new mapboxgl.default.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${ponto.name}</h3>
            <p class="text-xs text-gray-600 mt-1">${ponto.address}</p>
            <p class="text-xs text-gray-500 mt-1">Horário: ${ponto.horario}</p>
            ${ponto.telefone ? `<p class="text-xs text-gray-500">Tel: ${ponto.telefone}</p>` : ''}
          </div>
        `);

        new mapboxgl.default.Marker(el)
          .setLngLat([ponto.lng, ponto.lat])
          .setPopup(popup)
          .addTo(map);
      });

      setShowTokenInput(false);
    } catch (error) {
      console.error('Erro ao carregar o mapa:', error);
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      initializeMap(mapboxToken);
    }
  };

  return (
    <div className="space-y-6">
      {showTokenInput && (
        <Card className="p-6 bg-gradient-warm border-accent/20 shadow-soft">
          <h3 className="text-lg font-semibold mb-4">Configure o Mapa</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Para visualizar o mapa interativo, insira seu token público do Mapbox.
            Você pode obter um em{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
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
              Carregar Mapa
            </Button>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden shadow-card">
            <div 
              ref={mapContainer} 
              className="w-full h-[500px] bg-muted flex items-center justify-center"
            >
              {showTokenInput && (
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Configure o token do Mapbox para ver o mapa</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Pontos de Coleta</h3>
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
            
            <div className="space-y-3">
              {pontos.map((ponto) => (
                <div key={ponto.id} className="p-3 rounded-lg border bg-card hover:shadow-soft transition-all">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      ponto.type === 'coleta' ? 'bg-primary' : 'bg-accent'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm">{ponto.name}</h4>
                      <p className="text-xs text-muted-foreground">{ponto.address}</p>
                      <p className="text-xs text-muted-foreground">⏰ {ponto.horario}</p>
                      {ponto.telefone && (
                        <p className="text-xs text-muted-foreground">📞 {ponto.telefone}</p>
                      )}
                    </div>
                    <Button size="sm" variant="ghost">
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

export default DonationMap;