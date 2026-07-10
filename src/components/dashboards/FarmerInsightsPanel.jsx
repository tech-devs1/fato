/**
 * FarmerInsightsPanel
 * -------------------
 * Provides location-aware weather, planting calendar, harvest windows,
 * and agro-advisories for registered farmers.
 *
 * Weather data: Open-Meteo API (free, no key required)
 * Maps: Mapbox (token from localStorage / default)
 * Location: browser geolocation, falls back to profile community
 */
import React, { useState, useEffect, useCallback } from 'react'
import {
  Cloud, Sun, CloudRain, Wind, Droplets, Thermometer,
  Sprout, Scissors, AlertTriangle, CheckCircle, MapPin,
  RefreshCw, TrendingUp, Loader2, CloudLightning, Snowflake,
  Calendar, Info, ChevronDown, ChevronUp
} from 'lucide-react'
import MapboxView, { VOLTA_COORDINATES } from '../MapboxView'

// ── Open-Meteo WMO weather code → readable description + icon ──────────────────
function decodeWMO(code) {
  if (code === 0)              return { label: 'Clear Sky',        icon: Sun,             color: 'text-gold-500' }
  if (code <= 2)               return { label: 'Partly Cloudy',    icon: Cloud,           color: 'text-earth-400' }
  if (code <= 9)               return { label: 'Overcast',         icon: Cloud,           color: 'text-earth-500' }
  if (code <= 39)              return { label: 'Foggy',            icon: Cloud,           color: 'text-earth-400' }
  if (code <= 49)              return { label: 'Drizzle',          icon: CloudRain,       color: 'text-blue-400' }
  if (code <= 59)              return { label: 'Light Rain',       icon: CloudRain,       color: 'text-blue-500' }
  if (code <= 69)              return { label: 'Rain',             icon: CloudRain,       color: 'text-blue-600' }
  if (code <= 79)              return { label: 'Snow / Sleet',     icon: Snowflake,       color: 'text-blue-300' }
  if (code <= 84)              return { label: 'Rain Showers',     icon: CloudRain,       color: 'text-blue-500' }
  if (code <= 94)              return { label: 'Thunderstorm',     icon: CloudLightning,  color: 'text-purple-500' }
  return                              { label: 'Severe Storm',     icon: CloudLightning,  color: 'text-red-500' }
}

// ── Crop planting calendar for Ghana / Volta Region ───────────────────────────
const VOLTA_CROPS = [
  {
    name: 'Maize (Corn)',
    emoji: '🌽',
    plantMonths: [3, 4, 5, 8, 9],         // March-May (Major) + Aug-Sep (Minor)
    harvestMonths: [7, 8, 11, 12],
    minTempC: 18, maxTempC: 35,
    minRainMm: 400,
    tips: 'Prefers well-drained loamy soils. Plant 5cm deep, 75cm between rows.',
  },
  {
    name: 'Cassava',
    emoji: '🥔',
    plantMonths: [3, 4, 5, 6],
    harvestMonths: [9, 10, 11, 12, 1, 2],
    minTempC: 20, maxTempC: 38,
    minRainMm: 600,
    tips: 'Use healthy stem cuttings 25–30cm long. Harvest at 9–18 months.',
  },
  {
    name: 'Tomatoes',
    emoji: '🍅',
    plantMonths: [10, 11, 12, 1],
    harvestMonths: [1, 2, 3, 4],
    minTempC: 16, maxTempC: 32,
    minRainMm: 300,
    tips: 'Best in cool dry season. Stake plants when 30cm tall. Watch for leaf curl.',
  },
  {
    name: 'Yam',
    emoji: '🍠',
    plantMonths: [2, 3, 4],
    harvestMonths: [10, 11, 12],
    minTempC: 22, maxTempC: 35,
    minRainMm: 800,
    tips: 'Mound soil 30cm high. Use seed yam pieces with at least one bud.',
  },
  {
    name: 'Groundnuts',
    emoji: '🥜',
    plantMonths: [4, 5, 6, 8],
    harvestMonths: [8, 9, 10, 11],
    minTempC: 20, maxTempC: 34,
    minRainMm: 400,
    tips: 'Needs full sun. Avoid waterlogging. Best in sandy-loam soils.',
  },
  {
    name: 'Pepper',
    emoji: '🫑',
    plantMonths: [3, 4, 8, 9],
    harvestMonths: [6, 7, 11, 12],
    minTempC: 18, maxTempC: 32,
    minRainMm: 350,
    tips: 'Transplant seedlings at 6 weeks. Mulch around base to retain moisture.',
  },
]

// ── Location name resolver using Mapbox Geocoding API ──────────────────────────
async function reverseGeocode(lng, lat, token) {
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place,locality&access_token=${token}`
    )
    const data = await res.json()
    return data?.features?.[0]?.place_name?.split(',')[0] || 'Your Location'
  } catch {
    return 'Your Location'
  }
}

// ── Open-Meteo fetch ──────────────────────────────────────────────────────────
async function fetchWeather(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weathercode` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,sunrise,sunset` +
    `&timezone=Africa%2FAccra&forecast_days=7`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather fetch failed')
  return res.json()
}

// ── Planting advisories ───────────────────────────────────────────────────────
function getAdvisories(month, tempC, weeklyRainMm) {
  const recs = []
  const ready = []
  const harvest = []

  VOLTA_CROPS.forEach(crop => {
    const canPlant = crop.plantMonths.includes(month)
    const shouldHarvest = crop.harvestMonths.includes(month)
    const tempOk = tempC >= crop.minTempC && tempC <= crop.maxTempC
    const rainOk = weeklyRainMm * 4 >= crop.minRainMm / 3

    if (canPlant && tempOk && rainOk) ready.push(crop)
    else if (canPlant && (!tempOk || !rainOk)) {
      recs.push({ crop, reason: !tempOk ? 'Temperature out of range' : 'Insufficient rainfall forecast' })
    }
    if (shouldHarvest) harvest.push(crop)
  })

  return { ready, recs, harvest }
}

// ── Small weather stat card ───────────────────────────────────────────────────
function WeatherStat({ icon: Icon, label, value, color = 'text-earth-600' }) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-white/60 rounded-2xl">
      <Icon className={`w-5 h-5 ${color}`} />
      <p className="text-[10px] text-earth-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-earth-900">{value}</p>
    </div>
  )
}

// ── 7-day forecast strip ──────────────────────────────────────────────────────
function ForecastDay({ date, maxT, minT, rain, code }) {
  const { icon: Icon, color } = decodeWMO(code)
  const dayLabel = new Date(date).toLocaleDateString('en-GH', { weekday: 'short' })
  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-white/60 rounded-2xl min-w-[68px]">
      <p className="text-[10px] font-bold text-earth-500 uppercase">{dayLabel}</p>
      <Icon className={`w-5 h-5 ${color}`} />
      <p className="text-xs font-bold text-earth-900">{Math.round(maxT)}°</p>
      <p className="text-[10px] text-earth-400">{Math.round(minT)}°</p>
      {rain > 0 && (
        <p className="text-[10px] text-blue-500 font-semibold">{rain.toFixed(0)}mm</p>
      )}
    </div>
  )
}

// ── Crop planting card ────────────────────────────────────────────────────────
function CropCard({ crop, status }) {
  const [open, setOpen] = useState(false)
  const statusStyles = {
    ready:   { bg: 'bg-forest-50 border-forest-200',   badge: 'bg-forest-100 text-forest-700', dot: 'bg-forest-500' },
    harvest: { bg: 'bg-gold-50 border-gold-200',       badge: 'bg-gold-100 text-gold-700',     dot: 'bg-gold-500' },
    caution: { bg: 'bg-amber-50 border-amber-200',     badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500' },
  }
  const s = statusStyles[status] || statusStyles.caution
  const label = status === 'ready' ? 'Plant Now' : status === 'harvest' ? 'Harvest Time' : 'Conditions Poor'

  return (
    <div className={`rounded-2xl border p-4 ${s.bg}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{crop.emoji}</span>
          <div>
            <p className="font-bold text-earth-900 text-sm">{crop.name}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{label}</span>
          </div>
        </div>
        <button onClick={() => setOpen(o => !o)} className="text-earth-400 hover:text-earth-600 transition-colors">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-earth-100">
          <p className="text-xs text-earth-600 leading-relaxed">{crop.tips}</p>
          <div className="flex gap-3 mt-2 text-[10px] text-earth-500">
            <span>🌡 {crop.minTempC}–{crop.maxTempC}°C</span>
            <span>💧 {crop.minRainMm}mm/yr min</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FarmerInsightsPanel({ userProfile }) {
  const [coords, setCoords] = useState(null)      // [lng, lat]
  const [locationName, setLocationName] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [locationDenied, setLocationDenied] = useState(false)
  const [showMap, setShowMap] = useState(true)

  const mapboxToken = localStorage.getItem('mapbox_access_token') ||
    'pk.eyJ1IjoiZmxhc2gwMDAiLCJhIjoiY21yYmpqNWFnMmRsazJ6cXJiYjltOTV5eSJ9.n6MF1k_RScGprpVTlUIMgQ'

  // ── Resolve location: geolocation → Volta coords fallback ──────────────────
  const resolveLocation = useCallback(() => {
    setLoading(true)
    setError('')

    if (!navigator.geolocation) {
      useFallback()
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { longitude: lng, latitude: lat } = pos.coords
        setCoords([lng, lat])
        setLocationDenied(false)
        const name = await reverseGeocode(lng, lat, mapboxToken)
        setLocationName(name)
        try {
          const wx = await fetchWeather(lat, lng)
          setWeather(wx)
        } catch {
          setError('Could not load weather. Showing location only.')
        }
        setLoading(false)
      },
      () => {
        setLocationDenied(true)
        useFallback()
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }, [])

  function useFallback() {
    // Fall back to community from profile, or Ho (Volta capital)
    const community = userProfile?.community?.toLowerCase()?.trim()
    const voltaCoord = (community && VOLTA_COORDINATES[community])
      ? VOLTA_COORDINATES[community]
      : VOLTA_COORDINATES.ho

    setCoords(voltaCoord)
    const name = userProfile?.community || 'Ho, Volta Region'
    setLocationName(name)

    const [lng, lat] = voltaCoord
    fetchWeather(lat, lng)
      .then(wx => { setWeather(wx); setLoading(false) })
      .catch(() => { setError('Weather unavailable. Check your connection.'); setLoading(false) })
  }

  useEffect(() => { resolveLocation() }, [resolveLocation])

  // ── Derived data ──────────────────────────────────────────────────────────
  const current = weather?.current
  const daily   = weather?.daily
  const month   = new Date().getMonth() + 1 // 1-12

  const tempC       = current ? Math.round(current.temperature_2m) : null
  const humidity    = current ? Math.round(current.relative_humidity_2m) : null
  const windKph     = current ? Math.round(current.wind_speed_10m) : null
  const todayRainMm = current ? current.precipitation : null
  const weekRainMm  = daily   ? daily.precipitation_sum.slice(0, 7).reduce((a, b) => a + b, 0) : 0
  const wmoCode     = current ? current.weathercode : 0
  const { label: wxLabel, icon: WxIcon, color: wxColor } = decodeWMO(wmoCode)

  const { ready, recs, harvest } = tempC
    ? getAdvisories(month, tempC, weekRainMm / 7)
    : { ready: [], recs: [], harvest: [] }

  const sunrise = daily?.sunrise?.[0]?.split('T')[1]?.slice(0, 5)
  const sunset  = daily?.sunset?.[0]?.split('T')[1]?.slice(0, 5)

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-terracotta-500 animate-spin" />
        <p className="text-earth-500 text-sm font-medium">Loading insights for your location...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-4 animate-fade-in">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-earth-900">Farm Insights</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
            <p className="text-sm text-earth-500 font-medium">{locationName}</p>
            {locationDenied && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                Approx.
              </span>
            )}
          </div>
        </div>
        <button
          onClick={resolveLocation}
          className="p-2 rounded-xl bg-forest-50 text-forest-600 hover:bg-forest-100 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {locationDenied && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs">
          <div className="flex items-center gap-2 text-blue-700">
            <Info className="w-4 h-4 shrink-0" />
            <span>Enable location for precise insights</span>
          </div>
          <button
            onClick={resolveLocation}
            className="text-blue-600 font-bold underline ml-2"
          >
            Enable
          </button>
        </div>
      )}

      {/* ── Current Weather Card ─────────────────────────────────────────────── */}
      {current && (
        <div
          className="rounded-3xl p-6 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #2D8B5C 0%, #1a5c3f 60%, #C05621 150%)' }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ background: 'radial-gradient(circle at 80% 20%, white, transparent 60%)' }} />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-green-100 text-xs font-semibold uppercase tracking-widest mb-1">
                Current Weather
              </p>
              <p className="text-5xl font-black">{tempC}°C</p>
              <p className="text-green-100 text-sm mt-1 font-medium">{wxLabel}</p>
              {sunrise && (
                <p className="text-green-200 text-xs mt-1">🌅 {sunrise} &nbsp;🌇 {sunset}</p>
              )}
            </div>
            <WxIcon className={`w-16 h-16 text-white opacity-80`} />
          </div>

          <div className="relative grid grid-cols-4 gap-2 mt-5">
            <WeatherStat icon={Droplets}    label="Humidity"   value={`${humidity}%`}    color="text-blue-200" />
            <WeatherStat icon={Wind}        label="Wind"       value={`${windKph}km/h`}  color="text-green-200" />
            <WeatherStat icon={CloudRain}   label="Rain Today" value={`${todayRainMm}mm`} color="text-blue-200" />
            <WeatherStat icon={CloudRain}   label="Week Rain"  value={`${weekRainMm.toFixed(0)}mm`} color="text-blue-200" />
          </div>
        </div>
      )}
      {/* ── Farm Location Map ──────────────────────────────────────────────── */}
      {showMap && coords && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-earth-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terracotta-500" /> Interactive Farm Map & Insights
            </h3>
            <span className="text-[10px] bg-forest-100 text-forest-700 font-semibold px-2 py-0.5 rounded-full uppercase">
              Location Synced
            </span>
          </div>
          <div className="h-64 w-full rounded-xl overflow-hidden border border-earth-200 shadow-inner relative">
            <MapboxView
              startLocation={coords}
              markers={[
                {
                  id: 'farmer-farm-location',
                  position: coords,
                  label: 'My Farm',
                  type: 'supply',
                  popupHtml: `
                    <div class="p-3 font-sans max-w-[240px]">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-xl">🏡</span>
                        <strong class="text-earth-900 text-sm">My Farm Location</strong>
                      </div>
                      <div class="space-y-1 text-xs text-earth-700">
                        <p>📍 <span class="font-medium text-earth-800">${locationName}</span></p>
                        ${tempC ? `<p>🌡 <span class="font-semibold text-earth-900">${tempC}°C</span> (${wxLabel})</p>` : ''}
                        ${ready.length > 0 ? `<p>🌱 <span class="font-bold text-forest-700">Plant:</span> ${ready.map(c => c.emoji + ' ' + c.name).join(', ')}</p>` : '<p>🌱 No optimal planting conditions</p>'}
                        ${harvest.length > 0 ? `<p>🌾 <span class="font-bold text-gold-700">Harvest:</span> ${harvest.map(c => c.emoji + ' ' + c.name).join(', ')}</p>` : ''}
                      </div>
                    </div>
                  `
                }
              ]}
              className="h-full w-full rounded-xl overflow-hidden"
            />
          </div>
          <p className="text-[10px] text-earth-400">
            Click the marker on the map to see real-time planting recommendations & local weather insights for your coordinates.
          </p>
        </div>
      )}

      {/* ── 7-day Forecast ──────────────────────────────────────────────────── */}
      {daily && (
        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-bold text-earth-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-terracotta-500" /> 7-Day Forecast
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {daily.time.map((date, i) => (
              <ForecastDay
                key={date}
                date={date}
                maxT={daily.temperature_2m_max[i]}
                minT={daily.temperature_2m_min[i]}
                rain={daily.precipitation_sum[i]}
                code={daily.weathercode[i]}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Planting Recommendations ─────────────────────────────────────────── */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-earth-900 mb-1 flex items-center gap-2">
          <Sprout className="w-4 h-4 text-forest-600" /> Plant Now
        </h3>
        <p className="text-xs text-earth-400 mb-3">
          Crops suited for current conditions in {locationName}
        </p>
        {ready.length > 0 ? (
          <div className="space-y-3">
            {ready.map(crop => <CropCard key={crop.name} crop={crop} status="ready" />)}
          </div>
        ) : (
          <div className="text-center py-6 text-earth-400 text-sm">
            <Sprout className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No ideal planting conditions right now.</p>
            <p className="text-xs mt-1">Check again next month.</p>
          </div>
        )}
      </div>

      {/* ── Harvest Window ───────────────────────────────────────────────────── */}
      {harvest.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-earth-900 mb-1 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-gold-600" /> Ready to Harvest
          </h3>
          <p className="text-xs text-earth-400 mb-3">These crops are in their harvest window this month</p>
          <div className="space-y-3">
            {harvest.map(crop => <CropCard key={crop.name} crop={crop} status="harvest" />)}
          </div>
        </div>
      )}

      {/* ── Agro-Advisory ────────────────────────────────────────────────────── */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-earth-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" /> Agro-Advisory
        </h3>
        <div className="space-y-3">
          {/* Rain advisory */}
          {weekRainMm > 60 && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
              <CloudRain className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
              <div>
                <p className="font-bold">Heavy Rain This Week</p>
                <p className="text-blue-600 mt-0.5">
                  {weekRainMm.toFixed(0)}mm expected. Delay planting on slopes. Check drainage channels on your farm.
                </p>
              </div>
            </div>
          )}
          {weekRainMm < 5 && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <Sun className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
              <div>
                <p className="font-bold">Dry Spell Forecast</p>
                <p className="text-amber-600 mt-0.5">
                  Very little rain expected. Irrigate if possible. Mulch around crops to retain soil moisture.
                </p>
              </div>
            </div>
          )}
          {/* Temp advisory */}
          {tempC > 34 && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
              <Thermometer className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
              <div>
                <p className="font-bold">High Temperature Alert</p>
                <p className="text-red-600 mt-0.5">
                  {tempC}°C detected. Water crops early morning or evening. Avoid fertilising in heat.
                </p>
              </div>
            </div>
          )}
          {/* Wind advisory */}
          {windKph > 30 && (
            <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-800">
              <Wind className="w-4 h-4 mt-0.5 shrink-0 text-purple-500" />
              <div>
                <p className="font-bold">Strong Winds</p>
                <p className="text-purple-600 mt-0.5">
                  {windKph}km/h winds. Stake tall crops (tomatoes, maize). Secure shade nets and greenhouse covers.
                </p>
              </div>
            </div>
          )}
          {/* General good conditions */}
          {weekRainMm >= 5 && weekRainMm <= 60 && tempC >= 20 && tempC <= 33 && windKph <= 30 && (
            <div className="flex items-start gap-3 p-3 bg-forest-50 border border-forest-200 rounded-xl text-xs text-forest-800">
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-forest-500" />
              <div>
                <p className="font-bold">Good Growing Conditions</p>
                <p className="text-forest-600 mt-0.5">
                  Temperature and rainfall are ideal for most Volta Region crops. Great time to plant or tend your farm.
                </p>
              </div>
            </div>
          )}
          {/* Seasonal note */}
          <div className="flex items-start gap-3 p-3 bg-earth-50 border border-earth-200 rounded-xl text-xs text-earth-700">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-earth-400" />
            <p>
              Ghana's Volta Region has two rain seasons: <strong>March–July (Major)</strong> and <strong>September–November (Minor)</strong>.
              Plan your planting calendar accordingly for best yields.
            </p>
          </div>
        </div>
      </div>

      {/* ── Market Price Trends (moved from old insights) ─────────────────────── */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-earth-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-terracotta-500" /> Market Prices
        </h3>
        <div className="space-y-3">
          {[
            { crop: '🌽 Maize',      price: '₵3.10/kg', change: '-3%',  up: false },
            { crop: '🥔 Cassava',    price: '₵2.50/kg', change: '+12%', up: true  },
            { crop: '🍅 Tomatoes',   price: '₵4.20/kg', change: '+8%',  up: true  },
            { crop: '🍠 Yam',        price: '₵5.80/kg', change: '+5%',  up: true  },
            { crop: '🥜 Groundnuts', price: '₵7.00/kg', change: '-1%',  up: false },
          ].map(({ crop, price, change, up }) => (
            <div key={crop} className="flex items-center justify-between py-2 border-b border-earth-50 last:border-0">
              <span className="text-sm font-medium text-earth-800">{crop}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-earth-900">{price}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${up ? 'bg-forest-100 text-forest-700' : 'bg-red-100 text-red-600'}`}>
                  {change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
