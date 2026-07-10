import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Route, Navigation, Settings, HelpCircle, RefreshCw } from 'lucide-react'
import mapboxgl from 'mapbox-gl'

// Default coordinates for key hubs in Volta Region and surroundings
export const VOLTA_COORDINATES = {
  volta: [0.7000, 6.2000],
  ho: [0.4713, 6.6008],
  keta: [0.9856, 5.9221],
  anloga: [0.8974, 5.7947],
  accra: [-0.1870, 5.6037],
  sogakope: [0.5961, 5.9984]
}

const DEFAULT_TOKEN = 'pk.eyJ1IjoiZmxhc2gwMDAiLCJhIjoiY21yYmpqNWFnMmRsazJ6cXJiYjltOTV5eSJ9.n6MF1k_RScGprpVTlUIMgQ'

export default function MapboxView({
  startLocation = '', // Key or [lng, lat]
  endLocation = '', // Key or [lng, lat]
  onRouteCalculated = null, // Callback with { distance, duration, steps }
  markers = [], // Array of { id, position: [lng, lat], label, type }
  showActiveRoutes = false, // If true, draws connection lines on home supply map
  style = 'mapbox://styles/mapbox/streets-v12',
  className = 'h-full w-full min-h-[300px] rounded-2xl overflow-hidden shadow-inner'
}) {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  const markerList = useRef([])
  const [token, setToken] = useState(() => {
    return localStorage.getItem('mapbox_access_token') || DEFAULT_TOKEN
  })
  const [isTokenValid, setIsTokenValid] = useState(true)
  const [routeInfo, setRouteInfo] = useState(null)
  const [mapStyle, setMapStyle] = useState(style)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [userGeoloc, setUserGeoloc] = useState(null)
  const [locationDenied, setLocationDenied] = useState(false)
  const [inputToken, setInputToken] = useState('')

  const handleSaveToken = () => {
    const trimmed = inputToken.trim()
    if (trimmed) {
      localStorage.setItem('mapbox_access_token', trimmed)
      setToken(trimmed)
      setIsTokenValid(true)
      setErrorMessage('')
    }
  }

  // Request Geolocation access strictly before loading map
  const requestLocationAccess = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation not supported by browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserGeoloc([pos.coords.longitude, pos.coords.latitude])
        setLocationDenied(false)
      },
      (err) => {
        setLocationDenied(true)
        setErrorMessage('Location access is strictly required to view/calculate map routes.')
      },
      { enableHighAccuracy: true }
    )
  }

  useEffect(() => {
    requestLocationAccess()
  }, [])

  // Parse location prop to [lng, lat]
  const parseLocation = (loc) => {
    if (!loc) return null
    if (Array.isArray(loc) && loc.length === 2) return loc
    if (typeof loc === 'string') {
      const key = loc.toLowerCase().trim()
      if (VOLTA_COORDINATES[key]) return VOLTA_COORDINATES[key]
    }
    return null
  }

  // Load Mapbox CSS dynamically if not already loaded
  useEffect(() => {
    const CSS_ID = 'mapbox-gl-css'
    if (!document.getElementById(CSS_ID)) {
      const link = document.createElement('link')
      link.id = CSS_ID
      link.rel = 'stylesheet'
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.css'
      document.head.appendChild(link)
    }
  }, [])

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || !token || locationDenied) return

    mapboxgl.accessToken = token

    try {
      // Prioritize user actual geolocation for map center/view if available
      const center = userGeoloc || parseLocation(startLocation) || VOLTA_COORDINATES.volta
      
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: center,
        zoom: center === userGeoloc ? 11 : 9,
        attributionControl: false
      })

      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.addControl(new mapboxgl.ScaleControl(), 'bottom-right')

      mapInstance.current = map

      map.on('error', (e) => {
        console.error('Mapbox error:', e)
        if (e.error && (e.error.status === 401 || e.error.message?.includes('Unauthorized'))) {
          setIsTokenValid(false)
        }
      })

      map.on('load', () => {
        setIsTokenValid(true)
        setErrorMessage('')
      })

      return () => {
        if (mapInstance.current) {
          mapInstance.current.remove()
          mapInstance.current = null
        }
      }
    } catch (err) {
      console.error('Failed to initialize Mapbox GL:', err)
      setIsTokenValid(false)
    }
  }, [token, mapStyle])

  // Fly to user geolocation when it resolves
  useEffect(() => {
    const map = mapInstance.current
    if (!map || !userGeoloc) return

    // Fly to user's actual location
    map.flyTo({ center: userGeoloc, zoom: 11, duration: 1200 })

    // Add a pulsing blue dot for "My Location"
    const myLocEl = document.createElement('div')
    myLocEl.className = 'w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg'
    myLocEl.style.cssText = 'animation: pulse 2s infinite; box-shadow: 0 0 0 rgba(59,130,246,0.5);'
    const myLocMarker = new mapboxgl.Marker({ element: myLocEl })
      .setLngLat(userGeoloc)
      .setPopup(new mapboxgl.Popup({ offset: 15 }).setHTML('<div class="p-2 font-sans font-semibold text-sm">📍 Your Location</div>'))
      .addTo(map)

    return () => myLocMarker.remove()
  }, [userGeoloc])

  // Draw Markers & Update Zoom
  useEffect(() => {
    const map = mapInstance.current
    if (!map) return

    // Clean up existing markers
    markerList.current.forEach(m => m.remove())
    markerList.current = []

    const startCoords = userGeoloc || parseLocation(startLocation)
    const endCoords = parseLocation(endLocation)

    // Add Start Marker
    if (startCoords) {
      const el = document.createElement('div')
      el.className = 'w-10 h-10 flex items-center justify-center rounded-full bg-forest-600 border-2 border-white text-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform'
      el.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      `
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<div class="p-2 font-sans font-semibold text-earth-900">Start: ${typeof startLocation === 'string' ? startLocation.toUpperCase() : 'Custom Coordinates'}</div>`)

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(startCoords)
        .setPopup(popup)
        .addTo(map)

      markerList.current.push(marker)
    }

    // Add End Marker
    if (endCoords) {
      const el = document.createElement('div')
      el.className = 'w-10 h-10 flex items-center justify-center rounded-full bg-terracotta-600 border-2 border-white text-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform'
      el.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      `
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<div class="p-2 font-sans font-semibold text-earth-900">Destination: ${typeof endLocation === 'string' ? endLocation.toUpperCase() : 'Custom Coordinates'}</div>`)

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(endCoords)
        .setPopup(popup)
        .addTo(map)

      markerList.current.push(marker)
    }

    // Add other custom markers if any
    markers.forEach(m => {
      const mCoords = parseLocation(m.position)
      if (!mCoords) return

      const el = document.createElement('div')
      const colorClass = m.type === 'supply' ? 'bg-gold-500' : 'bg-terracotta-500'
      el.className = `px-3 py-1 flex items-center gap-1.5 rounded-full ${colorClass} border border-white text-white font-bold text-xs shadow-md cursor-pointer transform hover:scale-105 transition-transform`
      el.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        <span>${m.label || 'Hub'}</span>
      `

      const popup = new mapboxgl.Popup({ offset: 15 })
        .setHTML(`<div class="p-2 font-sans text-xs text-earth-900"><strong>${m.label}</strong><br/>Active Produce: ${m.produce || 0}kg<br/>Active Demand: ${m.demand || 0}kg</div>`)

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(mCoords)
        .setPopup(popup)
        .addTo(map)

      markerList.current.push(marker)
    })

    // Adjust map viewport to show both markers
    if (startCoords && endCoords) {
      const bounds = new mapboxgl.LngLatBounds()
        .extend(startCoords)
        .extend(endCoords)

      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12,
        duration: 1000
      })
    } else if (startCoords) {
      map.easeTo({ center: startCoords, zoom: 10, duration: 800 })
    }
  }, [startLocation, endLocation, markers, isTokenValid, userGeoloc])

  // Call Directions API and Draw Route Layer
  useEffect(() => {
    const map = mapInstance.current
    if (!map || !isTokenValid) return

    const startCoords = userGeoloc || parseLocation(startLocation)
    const endCoords = parseLocation(endLocation)

    // Remove existing route layers
    const removeRouteLayer = () => {
      if (map.getLayer('route')) map.removeLayer('route')
      if (map.getSource('route')) map.removeSource('route')
    }

    if (!startCoords || !endCoords) {
      removeRouteLayer()
      setRouteInfo(null)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&steps=true&access_token=${token}`

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch route. Please verify token settings.')
        return res.json()
      })
      .then(data => {
        setIsLoading(false)
        if (!data.routes || data.routes.length === 0) {
          throw new Error('No driving route found between these locations.')
        }

        const route = data.routes[0]
        const geometry = route.geometry
        const distanceKm = (route.distance / 1000).toFixed(1)
        const durationMin = Math.round(route.duration / 60)
        
        let durationStr = `${durationMin} mins`
        if (durationMin >= 60) {
          const hrs = Math.floor(durationMin / 60)
          const mins = durationMin % 60
          durationStr = `${hrs}h ${mins}m`
        }

        const steps = route.legs[0].steps.map(step => ({
          instruction: step.maneuver.instruction,
          distance: (step.distance / 1000).toFixed(2) + ' km',
          duration: Math.round(step.duration / 60) + 'm'
        }))

        const rInfo = {
          distance: `${distanceKm} km`,
          distanceValue: parseFloat(distanceKm),
          duration: durationStr,
          durationValue: durationMin,
          steps: steps,
          geometry: geometry
        }

        setRouteInfo(rInfo)
        if (onRouteCalculated) {
          onRouteCalculated(rInfo)
        }

        // Draw Route Line
        removeRouteLayer()
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: geometry
          }
        })

        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#C05621', // terracotta-500
            'line-width': 5,
            'line-opacity': 0.85
          }
        })
      })
      .catch(err => {
        setIsLoading(false)
        setErrorMessage(err.message)
        console.error(err)
      })
  }, [startLocation, endLocation, token, isTokenValid, userGeoloc])

  // Draw home active connections
  useEffect(() => {
    const map = mapInstance.current
    if (!map || !showActiveRoutes || startLocation || endLocation) return

    map.on('style.load', () => {
      drawHubConnections()
    })

    if (map.isStyleLoaded()) {
      drawHubConnections()
    }

    function drawHubConnections() {
      if (map.getLayer('hub-connections')) map.removeLayer('hub-connections')
      if (map.getSource('hub-connections')) map.removeSource('hub-connections')

      const features = []
      const hubs = Object.keys(VOLTA_COORDINATES).filter(k => k !== 'volta')
      
      // Connect Ho to other hubs for demonstration
      const hoCoords = VOLTA_COORDINATES.ho
      hubs.forEach(h => {
        if (h === 'ho') return
        features.push({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [hoCoords, VOLTA_COORDINATES[h]]
          }
        })
      })

      map.addSource('hub-connections', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features
        }
      })

      map.addLayer({
        id: 'hub-connections',
        type: 'line',
        source: 'hub-connections',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#2D8B5C', // forest-500
          'line-width': 2.5,
          'line-dasharray': [3, 2],
          'line-opacity': 0.6
        }
      })
    }
  }, [showActiveRoutes, startLocation, endLocation, mapStyle])

  return (
    <div className="relative h-full w-full rounded-3xl overflow-hidden group border border-earth-200 bg-earth-50">
      {/* Map Element */}
      <div ref={mapContainer} className={className} />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-20">
          <div className="bg-white/90 shadow-glass rounded-2xl px-6 py-4 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-terracotta-600 animate-spin" />
            <span className="font-semibold text-earth-800">Calculating route...</span>
          </div>
        </div>
      )}

      {/* Invalid Token Notification Banner */}
      {!isTokenValid && (
        <div className="absolute inset-0 bg-earth-900/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-fade-in">
          <div className="glass-lg max-w-md p-6 rounded-3xl text-white space-y-4">
            <Settings className="w-12 h-12 text-terracotta-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-earth-100">Mapbox Token Required</h3>
            <p className="text-sm text-earth-200">
              The default Mapbox access token seems invalid or missing. Please configure a valid Mapbox Public Access Token below.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="Paste Mapbox Access Token"
                className="w-full px-4 py-2 bg-earth-800 rounded-xl border border-earth-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-white text-xs"
              />
              <button
                onClick={handleSaveToken}
                className="w-full px-4 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl font-bold text-sm transition-all"
              >
                Apply Custom Token
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message Tooltip */}
      {errorMessage && (
        <div className="absolute top-4 left-4 right-4 bg-sunset-500/90 backdrop-blur text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 z-20 animate-slide-up">
          <HelpCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Style Toggle Floating controls — Settings button REMOVED */}
      {isTokenValid && !locationDenied && (
        <div className="absolute bottom-4 left-4 flex gap-2 z-10">
          <button
            onClick={() => setMapStyle(mapStyle.includes('streets') ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/streets-v12')}
            className="p-2.5 bg-white/90 hover:bg-white text-earth-800 rounded-xl font-bold text-xs shadow-glass border border-earth-200/50 transition-colors flex items-center gap-1.5"
          >
            <Navigation className="w-4 h-4 text-terracotta-600" />
            <span>{mapStyle.includes('streets') && !mapStyle.includes('satellite') ? 'Satellite' : 'Map'}</span>
          </button>
        </div>
      )}

      {/* Location Denied Lock View Screen */}
      {locationDenied && (
        <div className="absolute inset-0 bg-earth-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-fade-in">
          <div className="glass-lg max-w-md p-6 rounded-3xl text-white space-y-4">
            <MapPin className="w-12 h-12 text-terracotta-400 mx-auto animate-pulse" />
            <h3 className="text-xl font-bold text-earth-100">Location Access Required</h3>
            <p className="text-sm text-earth-200">
              This application requires location access to search routes, render maps, and show distances relative to your current location.
            </p>
            <button
              onClick={requestLocationAccess}
              className="w-full px-4 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl font-bold text-sm transition-all"
            >
              Grant Location Access
            </button>
          </div>
        </div>
      )}

      {/* Route Info Control Overlay */}
      {isTokenValid && routeInfo && (
        <div className="absolute top-4 right-4 w-72 max-h-[80%] overflow-y-auto glass p-4 rounded-2xl border border-white/40 shadow-glass-lg z-10 flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between pb-2 border-b border-earth-100">
            <div className="flex items-center gap-1.5 text-earth-900">
              <Route className="w-4 h-4 text-terracotta-600" />
              <span className="font-bold text-sm">Route Summary</span>
            </div>
            <span className="text-[10px] bg-forest-100 text-forest-700 font-semibold px-2 py-0.5 rounded-full uppercase">Optimal</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 bg-earth-50 rounded-xl border border-earth-100">
              <p className="text-[10px] text-earth-400 font-medium">Distance</p>
              <p className="font-bold text-earth-900 text-base">{routeInfo.distance}</p>
            </div>
            <div className="p-2 bg-earth-50 rounded-xl border border-earth-100">
              <p className="text-[10px] text-earth-400 font-medium">Duration</p>
              <p className="font-bold text-forest-600 text-base">{routeInfo.duration}</p>
            </div>
          </div>

          {/* Turn-by-Turn Steps Toggle */}
          <details className="group cursor-pointer">
            <summary className="list-none flex items-center justify-between py-1 text-xs font-semibold text-earth-700 hover:text-earth-900">
              <span>Turn-by-Turn Directions</span>
              <span className="text-earth-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1">
              {routeInfo.steps?.map((step, idx) => (
                <div key={idx} className="flex gap-2 text-[10px] leading-tight pb-1.5 border-b border-earth-100/50 last:border-0">
                  <div className="w-4 h-4 flex items-center justify-center rounded bg-earth-100 text-earth-600 font-semibold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-earth-800 font-medium">{step.instruction}</p>
                    <p className="text-earth-400">{step.distance} • {step.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
