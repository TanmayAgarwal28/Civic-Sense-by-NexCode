import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { fetchLocations } from '../api.js';
import { MapPin, Navigation, Sparkles, Building, Layers, Eye } from 'lucide-react';

export function CampusMap({ issues = [], onFilterByZone }) {
  const { lang, t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapZones, setMapZones] = useState([]);

  // Base coordinate mapping for standard campus zones (percentage coordinates: x, y from 0 to 100)
  const defaultCoords = {
    hostel_boys: { x: 18, y: 22, color: 'border-blue-400 bg-blue-900/40 text-blue-300' },
    hostel_girls: { x: 18, y: 72, color: 'border-pink-400 bg-pink-900/40 text-pink-300' },
    academic_block_a: { x: 50, y: 25, color: 'border-indigo-400 bg-indigo-900/40 text-indigo-300' },
    academic_block_b: { x: 50, y: 70, color: 'border-cyan-400 bg-cyan-900/40 text-cyan-300' },
    central_library: { x: 42, y: 48, color: 'border-emerald-400 bg-emerald-900/40 text-emerald-300' },
    admin_block: { x: 78, y: 48, color: 'border-amber-400 bg-amber-900/40 text-amber-300' },
    cafeteria_hub: { x: 65, y: 35, color: 'border-orange-400 bg-orange-900/40 text-orange-300' },
    sports_complex: { x: 78, y: 80, color: 'border-teal-400 bg-teal-900/40 text-teal-300' },
    campus_pathways: { x: 48, y: 90, color: 'border-slate-400 bg-slate-900/40 text-slate-300' }
  };

  useEffect(() => {
    const loadZones = async () => {
      try {
        const res = await fetchLocations();
        if (res.data && res.data.length > 0) {
          // Merge dynamic locations from backend with map coordinates
          const merged = res.data.map((item, index) => {
            const hasExplicitX = item.x !== undefined && item.x !== null && !isNaN(Number(item.x));
            const hasExplicitY = item.y !== undefined && item.y !== null && !isNaN(Number(item.y));
            const coord = defaultCoords[item.id] || {
              // Automatically space out new custom buildings added by Admin
              x: 20 + ((index * 16) % 65),
              y: 20 + ((index * 22) % 65),
              color: 'border-emerald-400 bg-emerald-900/40 text-emerald-300'
            };
            return {
              id: item.id,
              nameEn: item.en,
              nameAs: item.as,
              x: hasExplicitX ? Number(item.x) : coord.x,
              y: hasExplicitY ? Number(item.y) : coord.y,
              color: item.color || coord.color || 'border-emerald-400 bg-emerald-900/40 text-emerald-300',
              refDept: item.refDept,
              distanceMeters: item.distanceMeters,
              direction: item.direction
            };
          });
          setMapZones(merged);
        }
      } catch (e) {
        console.warn('Using default map zones:', e);
      }
    };
    loadZones();
  }, []);

  const getZoneStats = (zoneId) => {
    const zoneIssues = issues.filter(i => (i.zoneId || 'campus_pathways') === zoneId);
    const hasCritical = zoneIssues.some(i => i.priority === 'critical');
    const hasHigh = zoneIssues.some(i => i.priority === 'high');
    return {
      total: zoneIssues.length,
      hasCritical,
      hasHigh,
      issues: zoneIssues
    };
  };

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    if (onFilterByZone) {
      onFilterByZone(zone.id);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 shadow-xl mb-8 animate-fadeIn">
      
      {/* Header with customization hint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-6 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white">
                {lang === 'as' ? 'চৌহদৰ সক্ৰিয় ভৌগোলিক মানচিত্ৰ' : 'Interactive Campus Geo-Spatial Incident Map'}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Editable via Admin & Code
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any campus facility or corridor to inspect localized incidents and active dispatches.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" /> Critical Alert
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-1.5" /> High Urgency
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1.5" /> Normal / Clear
          </span>
        </div>
      </div>

      {/* Graphical Map Canvas with Mobile Responsive Scrolling */}
      <div className="block sm:hidden text-[11px] text-slate-400 mb-2 italic">
        <span>↔️ Swipe horizontally to inspect all campus facilities</span>
      </div>

      <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
        <div className="relative min-w-[620px] sm:min-w-0 w-full h-[450px] sm:h-[520px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center p-4">
        
        {/* Background Grid & Pathway Arteries (Customizable SVG) */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-800/80 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Main campus roads connecting zones */}
          <path d="M 180 120 L 420 240 L 780 240 M 180 360 L 420 240 M 500 120 L 500 360 M 650 180 L 780 400" fill="none" stroke="#334155" strokeWidth="6" strokeDasharray="6 4" />
        </svg>

        {/* Interactive Zone Pins / Hotspots */}
        {mapZones.map((z) => {
          const stats = getZoneStats(z.id);
          const isSelected = selectedZone?.id === z.id;

          return (
            <div
              key={z.id}
              onClick={() => handleZoneClick(z)}
              style={{ left: `${z.x}%`, top: `${z.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-105 z-20 ${
                isSelected ? 'scale-110 ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''
              }`}
            >
              <div className={`p-3 rounded-2xl border backdrop-blur-md shadow-lg flex flex-col items-center ${z.color} min-w-[130px] sm:min-w-[150px]`}>
                
                {/* Zone Icon & Issue Indicator Pill */}
                <div className="flex items-center justify-between w-full mb-1">
                  <MapPin className={`w-4 h-4 ${stats.hasCritical ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`} />
                  
                  {stats.total > 0 ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      stats.hasCritical
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                        : stats.hasHigh
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    }`}>
                      {stats.total} {stats.total === 1 ? 'Issue' : 'Issues'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Clear</span>
                  )}
                </div>

                {/* Building / Facility Name */}
                <span className="text-xs font-bold text-white text-center leading-tight">
                  {lang === 'as' ? z.nameAs : z.nameEn}
                </span>

                {/* Critical Hazard Alert Tag */}
                {stats.hasCritical && (
                  <span className="mt-1 text-[9px] font-bold text-rose-300 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800">
                    ⚡ Critical Triage
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Selected Zone Mini Details Panel */}
        {selectedZone && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-slate-900/95 border border-slate-700 p-4 rounded-2xl shadow-2xl max-w-sm z-30 backdrop-blur-md animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="font-bold text-sm text-emerald-400">
                {lang === 'as' ? selectedZone.nameAs : selectedZone.nameEn}
              </span>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            
            <div className="text-xs text-slate-300 mb-1">
              Active grievances in this sector: <strong>{getZoneStats(selectedZone.id).total}</strong>
            </div>

            {/* Geo-Spatial Coordinates & Placement Details */}
            <div className="text-[10px] text-slate-400 bg-slate-950/80 p-2 rounded-xl border border-slate-800 mb-2">
              <div className="flex items-center justify-between text-emerald-400 font-mono">
                <span>📍 Map Coordinates:</span>
                <span>X: {selectedZone.x}%, Y: {selectedZone.y}%</span>
              </div>
              {selectedZone.distanceMeters && selectedZone.direction && (
                <div className="text-slate-300 mt-1">
                  🧭 {selectedZone.distanceMeters}m {selectedZone.direction} of {selectedZone.refDept || 'Campus Core'}
                </div>
              )}
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {getZoneStats(selectedZone.id).issues.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic">No open grievances reported in this sector.</div>
              ) : (
                getZoneStats(selectedZone.id).issues.map(iss => (
                  <div key={iss.id} className="p-2 bg-slate-800 rounded-lg text-[11px] border border-slate-700">
                    <div className="font-bold text-white truncate font-assamese">{iss.title}</div>
                    <div className="text-slate-400 mt-0.5 flex justify-between">
                      <span>#{iss.ticketId}</span>
                      <span className="uppercase text-amber-400 font-semibold">{iss.priority}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
      </div>

      {/* Editing & Customization Instructions Note */}
      <div className="mt-4 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0" />
          <span><strong>How to Edit the Map:</strong> Add or delete campus zones in the Admin Dashboard, or edit coordinates <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">(x, y)</code> in <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">frontend/src/components/CampusMap.jsx</code>.</span>
        </span>
      </div>

    </div>
  );
}
