/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Settings2, Calendar } from 'lucide-react';

export default function App() {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    let ampm = '';

    if (!is24Hour) {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
    }

    const hoursStr = hours.toString().padStart(2, '0');

    return { hours: hoursStr, minutes, seconds, ampm };
  };

  const { hours, minutes, seconds, ampm } = formatTime(time);

  // Calculate a color based on the time (HSL)
  // Hue: 0-360 based on seconds/minutes/hours
  const getDynamicColor = () => {
    const h = (time.getHours() * 15 + time.getMinutes() * 0.25 + time.getSeconds() * 0.004) % 360;
    return `hsl(${h}, 70%, 60%)`;
  };

  const dynamicColor = getDynamicColor();

  const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center transition-colors duration-1000 overflow-hidden"
      style={{ backgroundColor: `${dynamicColor}15` }} // Very light version of the dynamic color for background
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-8 md:p-16 rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-8 text-slate-500 font-medium tracking-wide uppercase text-xs">
          <Clock size={16} style={{ color: dynamicColor }} />
          <span>Temps Réel</span>
        </div>

        {/* Clock Display */}
        <div className="flex items-baseline gap-2 md:gap-4 font-mono font-bold text-6xl md:text-9xl tracking-tighter">
          <TimeUnit value={hours} color={dynamicColor} />
          <motion.span 
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-slate-300"
          >
            :
          </motion.span>
          <TimeUnit value={minutes} color={dynamicColor} />
          <motion.span 
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-slate-300"
          >
            :
          </motion.span>
          <TimeUnit value={seconds} color={dynamicColor} />
          
          {!is24Hour && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl md:text-4xl font-sans font-semibold text-slate-400 ml-2"
            >
              {ampm}
            </motion.span>
          )}
        </div>

        {/* Date Display */}
        <motion.div 
          className="mt-8 flex items-center gap-2 text-slate-500 font-medium"
          layout
        >
          <Calendar size={18} className="text-slate-400" />
          <span>{dayNames[time.getDay()]}, {time.getDate()} {monthNames[time.getMonth()]} {time.getFullYear()}</span>
        </motion.div>

        {/* Controls */}
        <div className="mt-12 flex gap-4">
          <button 
            onClick={() => setIs24Hour(!is24Hour)}
            className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Settings2 size={16} />
            {is24Hour ? "Mode 12h" : "Mode 24h"}
          </button>
        </div>
      </motion.div>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: dynamicColor }}
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: dynamicColor }}
        />
      </div>
    </div>
  );
}

function TimeUnit({ value, color }: { value: string, color: string }) {
  return (
    <div className="relative overflow-hidden h-[1.1em] flex items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ color }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
