import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useCartContext } from '../context/CartContext';
import CartSummary from '../components/cart/CartSummary';
import { formatCurrency } from '../utils/currency';
import { Plus } from 'lucide-react';
import { MapPin, ShoppingBag, Plus, X, Check, Navigation } from 'lucide-react';

// ─── Constante: reemplazá con tu API Key de Google Maps ───────────────────────
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// ──────────────────────────────────────────────────────────────────────────────

function MapModal({ onClose, onConfirm, initialDireccion }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [selectedAddress, setSelectedAddress] = useState(initialDireccion || '');
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carga el script de Google Maps si todavía no está cargado
  const loadGoogleMaps = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }
      if (document.getElementById('google-maps-script')) {
        // Ya existe el script, esperar a que cargue
        const interval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
        return;
      }
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }, []);

  // Convierte coordenadas en dirección legible (geocoding inverso)
  const reverseGeocode = useCallback((lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setSelectedAddress(results[0].formatted_address);
      }
    });
  }, []);

  // Mueve el marcador a las coordenadas indicadas
  const placeMarker = useCallback((lat, lng) => {
    if (!mapInstanceRef.current) return;
    const position = { lat, lng };
    if (markerRef.current) {
      markerRef.current.setPosition(position);
    } else {
      markerRef.current = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        title: 'Arrastrame para ajustar la ubicación',
      });
      markerRef.current.addListener('dragend', (e) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setSelectedCoords({ lat: newLat, lng: newLng });
        reverseGeocode(newLat, newLng);
      });
    }
    mapInstanceRef.current.panTo(position);
    setSelectedCoords({ lat, lng });
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  // Inicializa el mapa una vez cargado Google Maps
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    loadGoogleMaps()
      .then(() => {
        if (cancelled || !mapRef.current) return;

        const defaultCenter = { lat: -25.2867, lng: -57.647 }; // Asunción, Paraguay

        const map = new window.google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 14,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });

        mapInstanceRef.current = map;

        // Clic en el mapa para colocar el marcador
        map.addListener('click', (e) => {
          placeMarker(e.latLng.lat(), e.latLng.lng());
        });

        // Autocomplete en el campo de búsqueda
        if (searchInputRef.current) {
          const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
            fields: ['geometry', 'formatted_address'],
          });
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry?.location) return;
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            placeMarker(lat, lng);
            setSelectedAddress(place.formatted_address);
            map.setZoom(16);
          });
        }

        // Intentar geolocalización del usuario
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              if (cancelled) return;
              placeMarker(pos.coords.latitude, pos.coords.longitude);
              map.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            () => {
              // Si no hay permiso, usar el centro por defecto
              placeMarker(defaultCenter.lat, defaultCenter.lng);
            }
          );
        } else {
          placeMarker(defaultCenter.lat, defaultCenter.lng);
        }

        setMapReady(true);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [loadGoogleMaps, placeMarker]);

  const handleConfirm = () => {
    if (selectedAddress) {
      onConfirm(selectedAddress, selectedCoords);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
           style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="text-brand" size={20} />
            <h2 className="font-bold text-slate-900 text-lg">Seleccionar Ubicación</h2>
          </div>
          <button onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
            <X size={20} />
          </button>
        </div>

        {/* Buscador */}
        <div className="px-5 py-3 border-b border-slate-100">
          <div className="relative">
            <Navigation size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar dirección..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        {/* Mapa */}
        <div className="relative flex-1" style={{ minHeight: '360px' }}>
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
              <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-slate-500">Cargando mapa...</p>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" style={{ minHeight: '360px' }} />
          {mapReady && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-xs text-slate-500 px-3 py-1.5 rounded-full shadow border border-slate-200">
              Hacé clic en el mapa o arrastrá el marcador 📍
            </div>
          )}
        </div>

        {/* Dirección seleccionada + botones */}
        <div className="px-5 py-4 border-t border-slate-100 space-y-3">
          {selectedAddress && (
            <div className="flex items-start gap-2 bg-brand/5 border border-brand/20 rounded-xl p-3">
              <MapPin size={16} className="text-brand mt-0.5 shrink-0" />
              <p className="text-sm text-slate-700 font-medium leading-snug">{selectedAddress}</p>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Cancelar
            </button>
            <button onClick={handleConfirm}
                    disabled={!selectedAddress}
                    className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed">
              <Check size={16} /> Confirmar ubicación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClienteNuevoPedido() {
  const { productos, selectedRestaurante, createPedidoSimulado } = useContext(AppContext);
  const { cart, addToCart, clearCart } = useCartContext();

  const [direccion, setDireccion] = useState('Calle de la Victoria, 12, 28012 Madrid, España');
  const [notas, setNotas] = useState('');

  const restauranteProductos = productos.filter(p => p.restaurant_id === selectedRestaurante.id);

  const handleConfirm = () => {
    createPedidoSimulado(cart, direccion, notas);
    clearCart();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="text-center py-4">
        <h1 className="text-3xl font-extrabold text-slate-900">Nuevo Pedido</h1>
        <p className="text-slate-500 text-sm">
          Selecciona los productos de {selectedRestaurante.name} para comenzar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Catálogo de Productos */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Menú Disponible</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restauranteProductos.map(prod => (
              <div key={prod.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-3xl mb-2">{prod.image}</div>
                  <h3 className="font-bold text-slate-900">{prod.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{prod.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-brand">{formatCurrency(prod.price)}</span>
                  <button
                    onClick={() => addToCart(prod)}
                    className="bg-brand text-white p-2 rounded-lg hover:bg-brand-dark transition flex items-center gap-1 text-xs font-semibold"
                  >
                    <Plus size={16} /> Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel del Carrito */}
        <CartSummary
          direccion={direccion}
          setDireccion={setDireccion}
          notas={notas}
          setNotas={setNotas}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}
