import { cn } from "@/lib/utils";

interface WorldSceneProps {
  worldId: string;
  className?: string;
}

export function WorldScene({ worldId, className }: WorldSceneProps) {
  return (
    <svg
      viewBox="0 0 240 160"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      <Scene id={worldId} />
    </svg>
  );
}

function Scene({ id }: { id: string }) {
  const p = id;
  switch (id) {

    /* ── NATURE ─────────────────────────────────────── */

    case "forest": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b6e8cb"/><stop offset="100%" stopColor="#d9f5e8"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <path d="M0,118 Q55,96 120,112 Q185,128 240,108 L240,160 L0,160Z" fill="#3a7d5c"/>
      <path d="M0,134 Q70,118 150,130 Q200,136 240,124 L240,160 L0,160Z" fill="#1e5c3b"/>
      <polygon points="16,115 32,74 48,115" fill="#16422c"/>
      <polygon points="36,112 54,66 72,112" fill="#1e5c3b"/>
      <polygon points="100,108 118,60 136,108" fill="#16422c"/>
      <polygon points="172,110 188,64 204,110" fill="#1e5c3b"/>
      <polygon points="193,114 208,70 223,114" fill="#16422c"/>
      <line x1="118" y1="0" x2="72" y2="112" stroke="rgba(255,255,180,0.13)" strokeWidth="14"/>
      <line x1="148" y1="0" x2="148" y2="112" stroke="rgba(255,255,180,0.08)" strokeWidth="8"/>
      <circle cx="80" cy="88" r="2.5" fill="#ffe066" opacity="0.9"/>
      <circle cx="152" cy="80" r="2" fill="#ffe066" opacity="0.75"/>
      <circle cx="52" cy="96" r="1.5" fill="#fff9c4" opacity="0.7"/>
    </>;

    case "meadow": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff9c0"/><stop offset="60%" stopColor="#d4f7a4"/><stop offset="100%" stopColor="#a8e063"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <circle cx="198" cy="30" r="22" fill="#ffe066" opacity="0.9"/>
      <circle cx="198" cy="30" r="30" fill="#fff7a0" opacity="0.25"/>
      <path d="M-10,120 Q40,100 90,115 Q140,130 190,112 Q220,103 250,118 L250,160 L-10,160Z" fill="#6abf45"/>
      <path d="M-10,138 Q50,122 110,135 Q160,144 240,130 L240,160 L-10,160Z" fill="#4e9e30"/>
      {/* Flowers */}
      {[[30,118],[68,113],[108,120],[155,116],[200,122]].map(([x,y],i)=>(
        <g key={i}><line x1={x} y1={y} x2={x} y2={y+12} stroke="#4e9e30" strokeWidth="1.5"/>
        <circle cx={x} cy={y} r="4" fill={["#ff9ecd","#ffe066","#ff7eb3","#b5e8ff","#ffd6a5"][i]}/></g>
      ))}
      <path d="M15,40 Q20,30 30,38 Q22,28 30,20" stroke="rgba(255,255,255,0.5)" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M60,25 Q70,16 80,24 Q72,14 82,8" stroke="rgba(255,255,255,0.4)" strokeWidth="5" fill="none" strokeLinecap="round"/>
    </>;

    case "beach": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87ceeb"/><stop offset="55%" stopColor="#b8e8f8"/><stop offset="100%" stopColor="#e0f8ff"/>
        </linearGradient>
        <linearGradient id={`${p}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3ab0d8"/><stop offset="100%" stopColor="#8ed4f0"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <circle cx="188" cy="28" r="20" fill="#ffe066"/>
      <circle cx="188" cy="28" r="28" fill="#fff3a0" opacity="0.3"/>
      <path d="M0,95 Q60,82 120,92 Q180,102 240,88 L240,160 L0,160Z" fill={`url(#${p}-sea)`}/>
      <path d="M0,108 Q50,98 100,106 Q160,116 240,100 L240,160 L0,160Z" fill="#f5c97a"/>
      <path d="M0,122 Q60,112 130,120 Q190,126 240,114 L240,160 L0,160Z" fill="#e8b85c"/>
      {/* Waves */}
      <path d="M10,96 Q30,90 50,96 Q70,102 90,96" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none"/>
      <path d="M120,90 Q145,84 170,90 Q195,96 210,90" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
      {/* Seagulls */}
      <path d="M50,48 Q55,43 60,48" stroke="#888" strokeWidth="1.5" fill="none"/>
      <path d="M90,38 Q96,33 102,38" stroke="#888" strokeWidth="1.5" fill="none"/>
      <path d="M130,52 Q135,47 140,52" stroke="#aaa" strokeWidth="1.2" fill="none"/>
    </>;

    case "snowy-valley": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8e6ff"/><stop offset="100%" stopColor="#eaf5ff"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <path d="M0,110 Q50,88 110,105 Q170,122 240,100 L240,160 L0,160Z" fill="#d0e8f5"/>
      <path d="M0,128 Q60,112 130,125 Q185,134 240,118 L240,160 L0,160Z" fill="#e8f4ff"/>
      <path d="M0,140 Q70,128 140,138 Q200,144 240,134 L240,160 L0,160Z" fill="#f5faff"/>
      {/* Pine trees */}
      <polygon points="28,112 40,82 52,112" fill="#3a5f4a"/>
      <polygon points="22,112 40,86 58,112" fill="rgba(255,255,255,0.25)"/>
      <polygon points="185,108 196,78 207,108" fill="#3a5f4a"/>
      <polygon points="179,108 196,82 213,108" fill="rgba(255,255,255,0.25)"/>
      <polygon points="108,105 120,70 132,105" fill="#3a5f4a"/>
      <polygon points="102,105 120,74 138,105" fill="rgba(255,255,255,0.2)"/>
      {/* Snowflakes */}
      {[[60,38],[110,22],[160,45],[30,62],[200,30],[80,55],[148,60]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%2===0?2:1.5} fill="white" opacity="0.8"/>
      ))}
    </>;

    case "desert-oasis": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb347"/><stop offset="100%" stopColor="#ffe0a0"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <circle cx="185" cy="32" r="24" fill="#ff9500" opacity="0.9"/>
      <path d="M-10,115 Q50,95 110,112 Q160,128 250,108 L250,160 L-10,160Z" fill="#d4973a"/>
      <path d="M-10,130 Q60,118 130,128 Q185,136 250,122 L250,160 L-10,160Z" fill="#c48230"/>
      <path d="M-10,145 Q70,132 150,142 Q200,148 250,138 L250,160 L-10,160Z" fill="#b57228"/>
      {/* Oasis pond */}
      <ellipse cx="130" cy="128" rx="30" ry="12" fill="#5bc8f5" opacity="0.85"/>
      <ellipse cx="130" cy="128" rx="30" ry="12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      {/* Palm tree */}
      <line x1="128" y1="80" x2="132" y2="120" stroke="#6b4226" strokeWidth="4"/>
      <path d="M132,80 Q148,65 155,72 Q142,72 132,80" fill="#4a9e40"/>
      <path d="M132,80 Q116,65 108,72 Q122,72 132,80" fill="#3d8a35"/>
      <path d="M132,80 Q140,62 148,66 Q138,68 132,80" fill="#56b048"/>
      <path d="M132,80 Q124,62 116,66 Q126,68 132,80" fill="#4a9e40"/>
    </>;

    case "jungle-canopy": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a5240"/><stop offset="100%" stopColor="#2a7358"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Big leaves */}
      <ellipse cx="40" cy="50" rx="45" ry="28" fill="#256840" transform="rotate(-20,40,50)"/>
      <ellipse cx="200" cy="45" rx="40" ry="25" fill="#1d5e38" transform="rotate(15,200,45)"/>
      <ellipse cx="120" cy="30" rx="50" ry="22" fill="#2d7a50" transform="rotate(5,120,30)"/>
      <ellipse cx="10" cy="80" rx="35" ry="20" fill="#1d5e38" transform="rotate(-30,10,80)"/>
      <ellipse cx="230" cy="90" rx="35" ry="18" fill="#256840" transform="rotate(25,230,90)"/>
      {/* Ground */}
      <path d="M0,130 Q60,118 120,128 Q180,138 240,122 L240,160 L0,160Z" fill="#143a24"/>
      <path d="M0,145 Q70,132 150,142 Q200,148 240,136 L240,160 L0,160Z" fill="#0f2e1c"/>
      {/* Light patches */}
      <ellipse cx="120" cy="100" rx="28" ry="20" fill="rgba(255,255,150,0.12)"/>
      <ellipse cx="80" cy="115" rx="15" ry="10" fill="rgba(255,255,150,0.08)"/>
      {/* Vines */}
      <path d="M50,0 Q40,40 55,70 Q65,90 50,120" stroke="rgba(80,160,80,0.5)" strokeWidth="2" fill="none"/>
      <path d="M190,0 Q200,35 185,65 Q175,90 195,115" stroke="rgba(80,160,80,0.4)" strokeWidth="2" fill="none"/>
      {/* Parrot */}
      <circle cx="165" cy="75" r="6" fill="#ff6b35"/>
      <circle cx="168" cy="72" r="4" fill="#2196f3"/>
    </>;

    case "cherry-blossom": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8c8d8"/><stop offset="60%" stopColor="#e8b0cc"/><stop offset="100%" stopColor="#d4e8b8"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <path d="M0,128 Q60,116 130,125 Q185,132 240,120 L240,160 L0,160Z" fill="#8dc65e"/>
      <path d="M0,142 Q70,132 150,140 Q200,145 240,135 L240,160 L0,160Z" fill="#6aab3c"/>
      {/* Tree trunk + branches */}
      <path d="M80,160 Q82,130 80,110 Q78,90 60,65" stroke="#6b4226" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M80,110 Q100,95 115,70" stroke="#6b4226" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M80,120 Q60,105 45,80" stroke="#6b4226" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M80,130 Q100,118 118,105" stroke="#6b4226" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Blossoms */}
      {[[55,62],[65,50],[80,45],[95,55],[112,65],[50,75],[70,72],[95,68],[118,62],[45,58],
        [130,48],[148,55],[155,68],[170,62],[180,72]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={3+Math.sin(i)*1} fill={i%3===0?"#ffb8d0":i%3===1?"#ff8fb0":"#ffd0e0"} opacity="0.9"/>
      ))}
      {/* Falling petals */}
      {[[180,90],[200,70],[215,100],[170,115],[195,130]].map(([x,y],i)=>(
        <ellipse key={i} cx={x} cy={y} rx="3" ry="2" fill="#ffb8d0" opacity="0.6" transform={`rotate(${i*30},${x},${y})`}/>
      ))}
      {/* Stone path */}
      {[[20,145],[40,148],[60,145],[80,148],[100,145]].map(([x,y],i)=>(
        <ellipse key={i} cx={x} cy={y} rx="9" ry="5" fill="rgba(150,140,130,0.5)"/>
      ))}
    </>;

    case "waterfall-grotto": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d7a8c"/><stop offset="100%" stopColor="#1ab8cc"/>
        </linearGradient>
        <linearGradient id={`${p}-w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78d8f0" stopOpacity="0.9"/><stop offset="100%" stopColor="#a8eeff" stopOpacity="0.6"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Cave arch */}
      <path d="M0,160 L0,60 Q40,10 80,5 Q120,0 160,5 Q200,10 240,60 L240,160Z" fill="#0a5260"/>
      <path d="M20,160 L20,70 Q50,30 90,22 Q120,16 150,22 Q190,30 220,70 L220,160Z" fill="transparent"/>
      {/* Sky through arch */}
      <ellipse cx="120" cy="55" rx="85" ry="55" fill="#b8eeff" opacity="0.6"/>
      <ellipse cx="120" cy="55" rx="68" ry="44" fill="#d8f8ff" opacity="0.5"/>
      {/* Waterfall strands */}
      {[95,108,120,132,145].map((x,i)=>(
        <path key={i} d={`M${x},10 Q${x+3},40 ${x-2},70 Q${x+2},100 ${x},130`}
          stroke={`url(#${p}-w)`} strokeWidth={i===2?3:2} fill="none" strokeLinecap="round" opacity={0.7+i*0.05}/>
      ))}
      {/* Pool at base */}
      <ellipse cx="120" cy="148" rx="60" ry="14" fill="#5cc8e0" opacity="0.7"/>
      <ellipse cx="120" cy="148" rx="60" ry="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      {/* Mist */}
      <ellipse cx="120" cy="135" rx="55" ry="16" fill="rgba(255,255,255,0.15)"/>
      {/* Crystals */}
      {[[60,100],[175,95],[50,115],[185,112]].map(([x,y],i)=>(
        <polygon key={i} points={`${x},${y} ${x-4},${y+10} ${x+4},${y+10}`} fill={["#80e8f8","#a0f0ff","#60d8ee","#b0f4ff"][i]} opacity="0.8"/>
      ))}
    </>;


    /* ── COZY ───────────────────────────────────────── */

    case "cozy-room": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4956a"/><stop offset="100%" stopColor="#e8b882"/>
        </linearGradient>
        <radialGradient id={`${p}-g`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#ffe0a0" stopOpacity="0.8"/><stop offset="100%" stopColor="#ffe0a0" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Wall */}
      <rect width="240" height="160" fill="#7a4a2e" opacity="0.15"/>
      {/* Window */}
      <rect x="148" y="18" width="68" height="80" rx="4" fill="#ffecc0"/>
      <rect x="148" y="18" width="68" height="80" rx="4" fill={`url(#${p}-g)`}/>
      <line x1="182" y1="18" x2="182" y2="98" stroke="#a06030" strokeWidth="2"/>
      <line x1="148" y1="58" x2="216" y2="58" stroke="#a06030" strokeWidth="2"/>
      <rect x="145" y="15" width="74" height="86" rx="5" fill="none" stroke="#6b3c1e" strokeWidth="3"/>
      {/* Bookshelf */}
      <rect x="14" y="50" width="10" height="80" fill="#5c3418"/>
      <rect x="14" y="50" width="90" height="8" fill="#5c3418"/>
      <rect x="14" y="80" width="90" height="6" fill="#5c3418"/>
      <rect x="14" y="108" width="90" height="6" fill="#5c3418"/>
      <rect x="24" y="58" width="8" height="22" rx="2" fill="#c84040"/>
      <rect x="33" y="58" width="6" height="22" rx="2" fill="#4080c8"/>
      <rect x="40" y="58" width="9" height="22" rx="2" fill="#40a040"/>
      <rect x="50" y="58" width="7" height="22" rx="2" fill="#c880c8"/>
      <rect x="58" y="58" width="8" height="22" rx="2" fill="#e88030"/>
      <rect x="24" y="86" width="9" height="22" rx="2" fill="#6060c8"/>
      <rect x="34" y="86" width="6" height="22" rx="2" fill="#c84060"/>
      <rect x="41" y="86" width="8" height="22" rx="2" fill="#40b880"/>
      {/* Fireplace */}
      <rect x="100" y="118" width="50" height="40" rx="3" fill="#4a2510"/>
      <rect x="105" y="122" width="40" height="32" rx="2" fill="#1a0a04"/>
      {/* Flame */}
      <path d="M125,150 Q120,138 125,128 Q128,138 132,130 Q135,140 130,150Z" fill="#ff8c00"/>
      <path d="M125,150 Q122,142 126,134 Q129,142 125,150Z" fill="#ffd700"/>
      {/* Rug */}
      <ellipse cx="120" cy="155" rx="80" ry="10" fill="#c84040" opacity="0.5"/>
    </>;

    case "library": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d1b4e"/><stop offset="100%" stopColor="#4a2d7a"/>
        </linearGradient>
        <radialGradient id={`${p}-g`} cx="50%" cy="30%">
          <stop offset="0%" stopColor="#c8a0ff" stopOpacity="0.4"/><stop offset="100%" stopColor="#c8a0ff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <rect width="240" height="160" fill={`url(#${p}-g)`}/>
      {/* Shelves L */}
      {[20,48,76,104].map((y,i)=>(<g key={i}>
        <rect x="4" y={y} width="90" height="5" fill="#5a3a1a"/>
        {[10,20,28,36,44,52,58,66,72,80,88].slice(0,6+i).map((x,j)=>(
          <rect key={j} x={x+4} y={y-18} width={[7,5,8,6,9,5,7,6][j%8]} height="18" rx="1"
            fill={["#e05050","#5080e0","#50c060","#c060c0","#e09030","#4090c0","#d05070","#60b090"][j%8]}/>
        ))}
      </g>))}
      {/* Shelves R */}
      {[20,48,76,104].map((y,i)=>(<g key={i}>
        <rect x="146" y={y} width="90" height="5" fill="#5a3a1a"/>
        {[150,158,165,172,180,188,196,204,212,220].slice(0,5+i).map((x,j)=>(
          <rect key={j} x={x} y={y-18} width={[6,8,5,9,7,5,8,6][j%8]} height="18" rx="1"
            fill={["#e09030","#c060c0","#5080e0","#e05050","#4090c0","#50c060","#d05070","#60b090"][j%8]}/>
        ))}
      </g>))}
      {/* Floating orb */}
      <circle cx="120" cy="40" r="18" fill="rgba(200,160,255,0.2)"/>
      <circle cx="120" cy="40" r="12" fill="rgba(220,190,255,0.35)"/>
      <circle cx="120" cy="40" r="7" fill="rgba(240,220,255,0.6)"/>
      {/* Cat silhouette */}
      <ellipse cx="120" cy="142" rx="18" ry="10" fill="#1e1030"/>
      <circle cx="120" cy="132" r="8" fill="#1e1030"/>
      <polygon points="114,125 112,115 118,122" fill="#1e1030"/>
      <polygon points="126,125 128,115 122,122" fill="#1e1030"/>
      <path d="M128,142 Q145,138 148,145" stroke="#1e1030" strokeWidth="2" fill="none"/>
      {/* Floating books */}
      <rect x="85" y="80" width="22" height="14" rx="2" fill="#e05050" transform="rotate(-8,96,87)"/>
      <rect x="138" y="82" width="20" height="13" rx="2" fill="#5080e0" transform="rotate(6,148,88)"/>
    </>;

    case "treehouse": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8d8a0"/><stop offset="100%" stopColor="#c8ecc0"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <path d="M0,130 Q60,115 130,128 Q185,136 240,122 L240,160 L0,160Z" fill="#5a8c40"/>
      <path d="M0,145 Q70,135 150,143 Q200,148 240,138 L240,160 L0,160Z" fill="#427030"/>
      {/* Tree crown */}
      <ellipse cx="120" cy="55" rx="65" ry="50" fill="#3a7a2a"/>
      <ellipse cx="90" cy="68" rx="40" ry="36" fill="#4a9038"/>
      <ellipse cx="148" cy="62" rx="38" ry="34" fill="#3a7a2a"/>
      <ellipse cx="120" cy="45" rx="42" ry="32" fill="#58a840"/>
      {/* Trunk */}
      <rect x="108" y="100" width="24" height="62" rx="4" fill="#6b4226"/>
      <line x1="120" y1="105" x2="118" y2="140" stroke="#8b5a36" strokeWidth="2"/>
      {/* Platform */}
      <rect x="76" y="96" width="88" height="8" rx="2" fill="#8b5a36"/>
      <rect x="80" y="88" width="80" height="10" rx="3" fill="#a06840"/>
      {/* House */}
      <rect x="90" y="62" width="60" height="38" rx="3" fill="#c8a060"/>
      <polygon points="86,62 120,40 154,62" fill="#a06030"/>
      {/* Window */}
      <rect x="106" y="72" width="28" height="22" rx="2" fill="#b8e8ff"/>
      <line x1="120" y1="72" x2="120" y2="94" stroke="#a06030" strokeWidth="1.5"/>
      <line x1="106" y1="83" x2="134" y2="83" stroke="#a06030" strokeWidth="1.5"/>
      {/* Rope ladder */}
      <line x1="96" y1="104" x2="92" y2="145" stroke="#8b5a36" strokeWidth="2"/>
      <line x1="108" y1="104" x2="104" y2="145" stroke="#8b5a36" strokeWidth="2"/>
      {[110,118,126,134,142].map((y,i)=>(<line key={i} x1={96-i} y1={y} x2={108-i} y2={y} stroke="#8b5a36" strokeWidth="1.5"/>))}
    </>;

    case "bakery": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffeac0"/><stop offset="100%" stopColor="#ffd580"/>
        </linearGradient>
        <radialGradient id={`${p}-w`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fff8e0" stopOpacity="0.9"/><stop offset="100%" stopColor="#fff8e0" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Floor */}
      <rect x="0" y="130" width="240" height="30" fill="#c8903a"/>
      {/* Counter */}
      <rect x="0" y="115" width="240" height="20" fill="#a07030"/>
      {/* Window */}
      <rect x="30" y="20" width="180" height="100" rx="6" fill="#fff8e0"/>
      <rect x="30" y="20" width="180" height="100" rx="6" fill={`url(#${p}-w)`}/>
      <rect x="27" y="17" width="186" height="106" rx="8" fill="none" stroke="#8b5020" strokeWidth="4"/>
      <line x1="120" y1="17" x2="120" y2="123" stroke="#8b5020" strokeWidth="3"/>
      <line x1="27" y1="70" x2="213" y2="70" stroke="#8b5020" strokeWidth="3"/>
      {/* Bread loaves */}
      <ellipse cx="65" cy="108" rx="22" ry="12" fill="#c88030"/>
      <ellipse cx="65" cy="104" rx="20" ry="10" fill="#e09840"/>
      <path d="M48,104 Q65,96 82,104" stroke="#c07820" strokeWidth="1.5" fill="none"/>
      <ellipse cx="165" cy="108" rx="20" ry="11" fill="#c88030"/>
      <ellipse cx="165" cy="104" rx="18" ry="9" fill="#e09840"/>
      {/* Cakes in window */}
      <rect x="50" y="42" width="36" height="24" rx="3" fill="#f0a0b0"/>
      <ellipse cx="68" cy="42" rx="18" ry="6" fill="#f8c0cc"/>
      <rect x="140" y="40" width="32" height="26" rx="3" fill="#a0d0f0"/>
      <ellipse cx="156" cy="40" rx="16" ry="5" fill="#c0e0ff"/>
      {/* Steam */}
      <path d="M60,35 Q55,22 62,12" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M75,33 Q80,20 73,10" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M150,34 Q145,20 152,10" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Sign */}
      <rect x="85" y="0" width="70" height="22" rx="4" fill="#c86030"/>
      <text x="120" y="15" textAnchor="middle" fill="white" fontSize="10" fontFamily="serif">Bakery</text>
    </>;

    case "blanket-fort": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1040"/><stop offset="100%" stopColor="#3a2060"/>
        </linearGradient>
        <radialGradient id={`${p}-g`} cx="50%" cy="60%">
          <stop offset="0%" stopColor="#c8a0ff" stopOpacity="0.25"/><stop offset="100%" stopColor="#c8a0ff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <rect width="240" height="160" fill={`url(#${p}-g)`}/>
      {/* Blanket drapes */}
      <path d="M0,30 Q30,60 10,110 L0,160" fill="#6040a0" opacity="0.7"/>
      <path d="M240,30 Q210,65 230,110 L240,160" fill="#804080" opacity="0.7"/>
      <path d="M0,20 Q120,55 240,20 Q200,80 120,85 Q40,80 0,20Z" fill="#7050b0"/>
      <path d="M10,22 Q120,52 230,22 Q195,72 120,78 Q45,72 10,22Z" fill="#9070d0" opacity="0.6"/>
      {/* Blanket floor */}
      <path d="M0,155 Q60,140 120,150 Q180,158 240,145 L240,160 L0,160Z" fill="#5030a0" opacity="0.8"/>
      {/* Pillows */}
      <ellipse cx="60" cy="148" rx="28" ry="12" fill="#c080c0" opacity="0.85"/>
      <ellipse cx="180" cy="150" rx="25" ry="11" fill="#a0c0f0" opacity="0.85"/>
      <ellipse cx="120" cy="145" rx="22" ry="9" fill="#f0c080" opacity="0.8"/>
      {/* String lights */}
      <path d="M10,55 Q120,48 230,55" stroke="#444" strokeWidth="1" fill="none"/>
      {[20,42,64,86,108,130,152,174,196,218].map((x,i)=>(
        <g key={i}>
          <line x1={x} y1={52+Math.sin(i)*3} x2={x} y2={60+Math.sin(i)*3} stroke="#555" strokeWidth="1"/>
          <circle cx={x} cy={60+Math.sin(i)*3} r="3.5" fill={["#ff9900","#ff5580","#80ff80","#5588ff","#ff80ff"][i%5]} opacity="0.9"/>
        </g>
      ))}
      {/* Stars through gap */}
      {[[100,15],[120,8],[140,15],[160,10],[80,10]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity="0.7"/>
      ))}
    </>;

    case "cloud-bedroom": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7090e8"/><stop offset="100%" stopColor="#b0a8f8"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Stars */}
      {[[30,20],[60,10],[170,15],[200,25],[140,8],[90,28],[220,12]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity={0.5+i*0.05}/>
      ))}
      {/* Big clouds as floor */}
      <ellipse cx="40" cy="138" rx="55" ry="28" fill="white" opacity="0.85"/>
      <ellipse cx="120" cy="145" rx="70" ry="30" fill="white" opacity="0.9"/>
      <ellipse cx="200" cy="140" rx="52" ry="26" fill="white" opacity="0.85"/>
      <ellipse cx="80" cy="130" rx="45" ry="22" fill="white" opacity="0.8"/>
      <ellipse cx="170" cy="132" rx="48" ry="24" fill="white" opacity="0.8"/>
      {/* Bed on clouds */}
      <rect x="75" y="108" width="90" height="30" rx="4" fill="#f8e0d0"/>
      <rect x="72" y="106" width="96" height="18" rx="4" fill="white" opacity="0.9"/>
      <rect x="75" y="100" width="22" height="20" rx="3" fill="#e8c8b8"/>
      <rect x="143" y="100" width="22" height="20" rx="3" fill="#e8c8b8"/>
      {/* Blanket */}
      <rect x="78" y="116" width="84" height="22" rx="3" fill="#c0a0e8"/>
      {/* Window frame (looking at night sky) */}
      <rect x="155" y="45" width="62" height="52" rx="4" fill="#4060c8" opacity="0.6"/>
      <rect x="152" y="42" width="68" height="58" rx="5" fill="none" stroke="#8878e0" strokeWidth="3"/>
      <circle cx="186" cy="60" r="14" fill="#f0e060" opacity="0.8"/>
      {/* Moon */}
      <circle cx="192" cy="56" r="11" fill="#b8a8d8"/>
      {/* Floating clouds near bed */}
      <ellipse cx="50" cy="95" rx="30" ry="14" fill="white" opacity="0.7"/>
      <ellipse cx="190" cy="90" rx="28" ry="12" fill="white" opacity="0.65"/>
    </>;


    /* ── ADVENTURE ──────────────────────────────────── */

    case "underwater": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a4a80"/><stop offset="100%" stopColor="#1a7ab8"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Light rays from surface */}
      {[60,100,140,180].map((x,i)=>(
        <path key={i} d={`M${x},0 L${x+20},160`} stroke="rgba(100,200,255,0.08)" strokeWidth="12"/>
      ))}
      {/* Sandy floor */}
      <path d="M0,138 Q60,128 120,136 Q185,144 240,132 L240,160 L0,160Z" fill="#c8a060"/>
      <path d="M0,148 Q70,140 150,147 Q200,151 240,143 L240,160 L0,160Z" fill="#b89050"/>
      {/* Corals */}
      <path d="M25,138 Q22,120 18,112 Q28,118 30,108 Q35,118 38,112 Q40,120 37,128 Q33,134 25,138Z" fill="#ff7070"/>
      <path d="M48,138 Q45,122 42,118 Q50,124 48,116 Q52,124 56,118 Q54,126 48,138Z" fill="#ff9040"/>
      <path d="M190,135 Q188,115 184,110 Q194,118 196,108 Q200,118 204,110 Q202,118 196,128 Q192,133 190,135Z" fill="#ff7070"/>
      <path d="M210,138 Q215,118 212,112 Q218,120 222,110 Q224,120 220,130 Q216,136 210,138Z" fill="#ff9880"/>
      {/* Sea anemone */}
      <ellipse cx="110" cy="142" rx="10" ry="5" fill="#c840c0"/>
      {[102,106,110,114,118].map((x,i)=>(
        <path key={i} d={`M${x},140 Q${x+2},128 ${x},122`} stroke="#e060d8" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      ))}
      {/* Fish */}
      <ellipse cx="80" cy="80" rx="15" ry="8" fill="#ff9900"/>
      <polygon points="95,80 105,74 105,86" fill="#ff9900"/>
      <circle cx="75" cy="78" r="2" fill="white"/>
      <ellipse cx="160" cy="55" rx="11" ry="6" fill="#40c0c0"/>
      <polygon points="171,55 179,50 179,60" fill="#40c0c0"/>
      <circle cx="156" cy="53" r="1.5" fill="white"/>
      {/* Bubbles */}
      {[[90,40],[140,25],[55,60],[175,70],[115,45]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={2+i*0.5} fill="none" stroke="rgba(180,230,255,0.6)" strokeWidth="1.5"/>
      ))}
    </>;

    case "dinosaur-valley": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a9a60"/><stop offset="60%" stopColor="#8ab878"/><stop offset="100%" stopColor="#a8cc90"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Mist layers */}
      <ellipse cx="60" cy="80" rx="80" ry="35" fill="rgba(230,240,220,0.3)"/>
      <ellipse cx="180" cy="70" rx="75" ry="30" fill="rgba(230,240,220,0.25)"/>
      {/* Background hills */}
      <path d="M0,105 Q50,80 110,98 Q165,116 240,90 L240,160 L0,160Z" fill="#5a8848"/>
      <path d="M0,125 Q60,110 130,122 Q185,130 240,115 L240,160 L0,160Z" fill="#486838"/>
      <path d="M0,142 Q70,130 150,140 Q200,146 240,132 L240,160 L0,160Z" fill="#386028"/>
      {/* Fern leaves L */}
      <path d="M15,145 Q0,115 20,110 Q35,120 20,130 Q40,120 25,145" fill="#4a8838"/>
      <path d="M15,145 Q30,112 45,108 Q50,122 35,132 Q55,122 35,145" fill="#3a7828"/>
      {/* Fern leaves R */}
      <path d="M225,145 Q240,115 220,110 Q205,120 220,130 Q200,120 215,145" fill="#4a8838"/>
      {/* Dino silhouette (gentle brachiosaurus neck) */}
      <ellipse cx="145" cy="115" rx="28" ry="18" fill="#4a7040" opacity="0.85"/>
      <path d="M168,108 Q180,85 172,60 Q168,48 175,40" stroke="#4a7040" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <ellipse cx="178" cy="36" rx="10" ry="8" fill="#4a7040" opacity="0.85"/>
      {/* Eye */}
      <circle cx="181" cy="33" r="3" fill="white"/>
      <circle cx="182" cy="33" r="1.5" fill="#2a4820"/>
    </>;

    case "crystal-cave": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12083a"/><stop offset="100%" stopColor="#2a1060"/>
        </linearGradient>
        <radialGradient id={`${p}-g`} cx="50%" cy="55%">
          <stop offset="0%" stopColor="#9060ff" stopOpacity="0.3"/><stop offset="100%" stopColor="#9060ff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <rect width="240" height="160" fill={`url(#${p}-g)`}/>
      {/* Rock walls */}
      <path d="M0,50 Q15,40 25,55 Q35,45 45,60 Q55,48 65,58 Q50,70 30,65 Q15,70 0,60Z" fill="#1a0840"/>
      <path d="M175,48 Q190,38 205,52 Q215,42 228,55 Q235,45 240,50 L240,70 Q225,65 210,72 Q195,68 175,58Z" fill="#1a0840"/>
      {/* Floor crystals */}
      <polygon points="30,160 38,125 46,160" fill="#8040c0"/>
      <polygon points="42,160 52,118 62,160" fill="#a060e0"/>
      <polygon points="58,160 64,130 70,160" fill="#6030a0"/>
      <polygon points="75,160 83,112 91,160" fill="#c080ff"/>
      <polygon points="148,160 156,110 164,160" fill="#a060e0"/>
      <polygon points="166,160 174,118 182,160" fill="#8040c0"/>
      <polygon points="186,160 193,125 200,160" fill="#c080ff"/>
      <polygon points="202,160 210,130 218,160" fill="#6030a0"/>
      {/* Ceiling stalactites */}
      <polygon points="50,0 44,30 56,0" fill="#200850"/>
      <polygon points="80,0 74,38 86,0" fill="#1a0640"/>
      <polygon points="120,0 114,42 126,0" fill="#200850"/>
      <polygon points="160,0 154,35 166,0" fill="#1a0640"/>
      <polygon points="195,0 189,28 201,0" fill="#200850"/>
      {/* Crystal glows */}
      {[[85,138],[155,132],[35,142],[208,140],[120,125]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="5" fill={["#c080ff","#80c0ff","#ff80c0","#80ffdd","#ffe080"][i]} opacity="0.7"/>
      ))}
      {/* Sparkle particles */}
      {[[60,95],[100,78],[145,88],[178,95],[120,68],[40,110],[200,102]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity={0.4+i*0.06}/>
      ))}
    </>;

    case "volcano-island": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cc4400"/><stop offset="50%" stopColor="#ff8830"/><stop offset="100%" stopColor="#ffcc60"/>
        </linearGradient>
        <radialGradient id={`${p}-l`} cx="50%" cy="100%">
          <stop offset="0%" stopColor="#ff6600" stopOpacity="0.6"/><stop offset="100%" stopColor="#ff6600" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Ocean */}
      <path d="M0,130 Q60,120 120,128 Q185,136 240,124 L240,160 L0,160Z" fill="#2060b0"/>
      <path d="M0,144 Q70,136 150,143 Q200,147 240,138 L240,160 L0,160Z" fill="#1850a0"/>
      {/* Island base */}
      <path d="M60,132 Q90,118 120,122 Q155,118 180,132 Q165,140 120,144 Q75,140 60,132Z" fill="#4a6a30"/>
      {/* Volcano mountain */}
      <path d="M80,130 Q95,90 112,65 L120,48 L128,65 Q145,90 160,130Z" fill="#5a4030"/>
      <path d="M108,60 Q114,40 120,30 Q126,40 132,60Z" fill="#4a3028"/>
      {/* Lava glow at crater */}
      <ellipse cx="120" cy="30" rx="14" ry="6" fill={`url(#${p}-l)`}/>
      <ellipse cx="120" cy="30" rx="8" ry="4" fill="#ff6600" opacity="0.8"/>
      {/* Lava streams */}
      <path d="M116,30 Q112,50 108,75 Q105,90 108,105" stroke="#ff5500" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8"/>
      <path d="M124,32 Q128,55 130,80" stroke="#ff7700" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      {/* Smoke puffs */}
      <circle cx="112" cy="18" r="8" fill="rgba(80,60,50,0.5)"/>
      <circle cx="122" cy="10" r="10" fill="rgba(80,60,50,0.4)"/>
      <circle cx="132" cy="16" r="7" fill="rgba(80,60,50,0.45)"/>
      {/* Palm trees on island */}
      <line x1="75" y1="118" x2="78" y2="132" stroke="#5a3010" strokeWidth="3"/>
      <path d="M78,118 Q88,110 92,115 Q84,114 78,118" fill="#4a8030"/>
      <path d="M78,118 Q68,110 64,115 Q72,114 78,118" fill="#3a6a28"/>
    </>;

    case "pirate-ship": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5ab0e8"/><stop offset="100%" stopColor="#a8d8f8"/>
        </linearGradient>
        <linearGradient id={`${p}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1878c8"/><stop offset="100%" stopColor="#2898e0"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <circle cx="195" cy="28" r="18" fill="#ffe080"/>
      {/* Ocean */}
      <path d="M0,100 Q60,88 120,98 Q185,108 240,92 L240,160 L0,160Z" fill={`url(#${p}-sea)`}/>
      <path d="M0,88 Q40,82 80,88 Q110,94 140,86 Q175,80 240,88" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none"/>
      <path d="M10,100 Q50,94 90,100 Q120,106 160,98 Q200,92 230,100" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none"/>
      {/* Ship hull */}
      <path d="M55,100 Q50,115 58,128 Q80,138 120,140 Q160,138 182,128 Q190,115 185,100Z" fill="#5a3010"/>
      <path d="M58,100 L182,100 L178,115 Q160,125 120,127 Q80,125 62,115Z" fill="#7a4820"/>
      {/* Deck */}
      <rect x="65" y="95" width="110" height="8" rx="2" fill="#9a6030"/>
      {/* Mast */}
      <line x1="120" y1="40" x2="120" y2="98" stroke="#5a3010" strokeWidth="5"/>
      <line x1="80" y1="60" x2="160" y2="60" stroke="#5a3010" strokeWidth="3"/>
      {/* Main sail */}
      <path d="M120,42 Q150,60 160,62 Q148,85 120,96Z" fill="white" opacity="0.9"/>
      <path d="M120,42 Q90,60 80,62 Q92,85 120,96Z" fill="#f0e8d0" opacity="0.85"/>
      {/* Flag */}
      <line x1="120" y1="40" x2="120" y2="22" stroke="#5a3010" strokeWidth="2"/>
      <path d="M120,22 L140,28 L120,34Z" fill="#222"/>
      <circle cx="128" cy="28" r="3" fill="white"/>
      {/* Railing */}
      {[75,90,105,120,135,150,165].map((x,i)=>(<line key={i} x1={x} y1={87} x2={x} y2={97} stroke="#5a3010" strokeWidth="2"/>))}
    </>;

    case "submarine": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#041840"/><stop offset="100%" stopColor="#082850"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Deep light rays */}
      {[40,90,160,210].map((x,i)=>(
        <path key={i} d={`M${x},0 L${x+15},160`} stroke="rgba(40,100,200,0.06)" strokeWidth="20"/>
      ))}
      {/* Submarine body */}
      <ellipse cx="120" cy="90" rx="80" ry="30" fill="#d4b840"/>
      <ellipse cx="120" cy="90" rx="76" ry="26" fill="#e8cc50"/>
      {/* Conning tower */}
      <rect x="105" y="60" width="30" height="32" rx="4" fill="#c8a830"/>
      <rect x="108" y="55" width="24" height="10" rx="3" fill="#b09020"/>
      {/* Portholes */}
      {[72,100,140,168].map((x,i)=>(
        <g key={i}>
          <circle cx={x} cy="90" r="10" fill="#a09030"/>
          <circle cx={x} cy="90" r="7" fill="#80d8f8"/>
          <circle cx={x} cy="90" r="7" fill="rgba(160,220,255,0.4)"/>
          <circle cx={x-2} cy={90-2} r="2" fill="rgba(255,255,255,0.5)"/>
        </g>
      ))}
      {/* Propeller */}
      <circle cx="42" cy="90" r="8" fill="#b09020"/>
      <ellipse cx="42" cy="82" rx="3" ry="7" fill="#9a8018" transform="rotate(-15,42,90)"/>
      <ellipse cx="42" cy="98" rx="3" ry="7" fill="#9a8018" transform="rotate(15,42,90)"/>
      {/* Periscope */}
      <line x1="120" y1="55" x2="120" y2="42" stroke="#b09020" strokeWidth="4"/>
      <rect x="115" y="38" width="12" height="8" rx="2" fill="#b09020"/>
      {/* Bioluminescent fish */}
      <ellipse cx="190" cy="50" rx="12" ry="6" fill="#40d0d0" opacity="0.7"/>
      <polygon points="202,50 210,46 210,54" fill="#40d0d0" opacity="0.7"/>
      <circle cx="185" cy="48" r="3" fill="#80ffff" opacity="0.8"/>
      <ellipse cx="30" cy="130" rx="10" ry="5" fill="#d040a0" opacity="0.6"/>
      <circle cx="24" cy="128" r="2.5" fill="#ff80d0" opacity="0.7"/>
      {/* Bubbles */}
      {[[125,60],[130,48],[118,52],[122,40]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={2+i*0.5} fill="none" stroke="rgba(100,200,255,0.5)" strokeWidth="1.5"/>
      ))}
    </>;


    /* ── FANTASY ────────────────────────────────────── */

    case "castle": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0a8c8"/><stop offset="100%" stopColor="#f8d0e8"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Moat */}
      <ellipse cx="120" cy="152" rx="90" ry="16" fill="#78b8e8" opacity="0.7"/>
      {/* Ground */}
      <path d="M0,140 Q60,128 120,136 Q185,144 240,130 L240,160 L0,160Z" fill="#8cb870"/>
      {/* Main tower */}
      <rect x="95" y="55" width="50" height="90" fill="#d8a0c8"/>
      <rect x="95" y="50" width="50" height="10" fill="#c080b0"/>
      {[95,107,119,131,143].map((x,i)=>(<rect key={i} x={x} y={38} width="8" height="14" rx="1" fill="#c080b0"/>))}
      {/* Side towers */}
      <rect x="50" y="75" width="36" height="70" fill="#c898bc"/>
      <rect x="50" y="70" width="36" height="10" fill="#b880a8"/>
      {[50,62,74].map((x,i)=>(<rect key={i} x={x} y={58} width="8" height="14" rx="1" fill="#b880a8"/>))}
      <rect x="154" y="75" width="36" height="70" fill="#c898bc"/>
      <rect x="154" y="70" width="36" height="10" fill="#b880a8"/>
      {[154,166,178].map((x,i)=>(<rect key={i} x={x} y={58} width="8" height="14" rx="1" fill="#b880a8"/>))}
      {/* Gate */}
      <path d="M104,145 L104,115 Q120,105 136,115 L136,145Z" fill="#60304a"/>
      {/* Windows */}
      <circle cx="120" cy="80" r="8" fill="#a8d0f8"/>
      <circle cx="120" cy="80" r="8" fill="none" stroke="#a060b0" strokeWidth="2"/>
      <rect x="65" y="88" width="12" height="16" rx="6" fill="#a8d0f8"/>
      <rect x="163" y="88" width="12" height="16" rx="6" fill="#a8d0f8"/>
      {/* Flags */}
      <line x1="120" y1="38" x2="120" y2="22" stroke="#8a4880" strokeWidth="2"/>
      <polygon points="120,22 136,27 120,32" fill="#e060a0"/>
      <line x1="68" y1="58" x2="68" y2="44" stroke="#8a4880" strokeWidth="2"/>
      <polygon points="68,44 80,48 68,52" fill="#e060a0"/>
      <line x1="172" y1="58" x2="172" y2="44" stroke="#8a4880" strokeWidth="2"/>
      <polygon points="172,44 184,48 172,52" fill="#e060a0"/>
      {/* Sparkle stars */}
      {[[30,40],[58,22],[180,18],[212,38],[150,28],[92,15],[168,42]].map(([x,y],i)=>(
        <g key={i}><line x1={x-3} y1={y} x2={x+3} y2={y} stroke="#ffe080" strokeWidth="1.5"/>
        <line x1={x} y1={y-3} x2={x} y2={y+3} stroke="#ffe080" strokeWidth="1.5"/></g>
      ))}
    </>;

    case "fairy-garden": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8f5a0"/><stop offset="100%" stopColor="#e8ffcc"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <path d="M0,130 Q60,118 120,128 Q185,138 240,122 L240,160 L0,160Z" fill="#78c848"/>
      <path d="M0,145 Q70,136 150,143 Q200,148 240,138 L240,160 L0,160Z" fill="#58a832"/>
      {/* Giant flowers */}
      {[[35,100],[90,88],[148,95],[200,102]].map(([x,y],i)=>(
        <g key={i}>
          <line x1={x} y1={y} x2={x} y2={y+40} stroke="#4a9830" strokeWidth="3"/>
          {/* Petals */}
          {[0,60,120,180,240,300].map((angle,j)=>(
            <ellipse key={j} cx={x + Math.cos(angle*Math.PI/180)*14} cy={y + Math.sin(angle*Math.PI/180)*14}
              rx="8" ry="5" fill={["#ff9ecd","#ffe066","#ff7eb3","#80d0ff","#ff9ecd","#ffe066"][j]}
              transform={`rotate(${angle},${x + Math.cos(angle*Math.PI/180)*14},${y + Math.sin(angle*Math.PI/180)*14})`}
              opacity="0.9"/>
          ))}
          <circle cx={x} cy={y} r="8" fill={["#ffe066","#ff9ecd","#ffb040","#a0e060"][i]}/>
        </g>
      ))}
      {/* Butterfly */}
      <path d="M120,60 Q108,48 100,52 Q108,62 120,60Z" fill="#ff80c0" opacity="0.8"/>
      <path d="M120,60 Q132,48 140,52 Q132,62 120,60Z" fill="#ff80c0" opacity="0.8"/>
      <path d="M120,62 Q112,70 108,66 Q114,72 120,62Z" fill="#ff9fd0" opacity="0.7"/>
      <path d="M120,62 Q128,70 132,66 Q126,72 120,62Z" fill="#ff9fd0" opacity="0.7"/>
      <line x1="120" y1="58" x2="120" y2="66" stroke="#604080" strokeWidth="1.5"/>
      {/* Magic sparkles */}
      {[[55,55],[110,42],[170,50],[220,60],[30,72],[188,72]].map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="3" fill={["#ffe066","#ff9ecd","#80d0ff","#a0ff80","#ffb040","#d0a0ff"][i]} opacity="0.8"/>
          <line x1={x-5} y1={y} x2={x+5} y2={y} stroke={["#ffe066","#ff9ecd","#80d0ff","#a0ff80","#ffb040","#d0a0ff"][i]} strokeWidth="1" opacity="0.5"/>
          <line x1={x} y1={y-5} x2={x} y2={y+5} stroke={["#ffe066","#ff9ecd","#80d0ff","#a0ff80","#ffb040","#d0a0ff"][i]} strokeWidth="1" opacity="0.5"/>
        </g>
      ))}
    </>;

    case "rainbow-clouds": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5ab0e8"/><stop offset="100%" stopColor="#a8d8f8"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Rainbow */}
      {[
        ["#ff0000",95],["#ff7700",88],["#ffee00",81],["#00cc00",74],["#0088ff",67],["#8800ff",60]
      ].map(([color, r],i)=>(
        <path key={i} d={`M5,155 A${r},${r} 0 0,1 235,155`} fill="none" stroke={color as string} strokeWidth="4" opacity="0.7"/>
      ))}
      {/* Fluffy clouds */}
      {[[40,40],[120,25],[200,40],[75,75],[160,68],[20,95],[220,90]].map(([x,y],i)=>(
        <g key={i}>
          <ellipse cx={x} cy={y} rx={22+i%3*6} ry={13+i%2*4} fill="white" opacity={0.85+i*0.02}/>
          <ellipse cx={x-12} cy={y+2} rx={14+i%2*3} ry={10+i%3*2} fill="white" opacity={0.8}/>
          <ellipse cx={x+12} cy={y+2} rx={13+i%3*2} ry={9+i%2*3} fill="white" opacity={0.8}/>
        </g>
      ))}
      {/* Ground */}
      <path d="M0,138 Q60,125 120,135 Q185,145 240,128 L240,160 L0,160Z" fill="#7ad080"/>
      <path d="M0,150 Q70,140 150,148 Q200,153 240,142 L240,160 L0,160Z" fill="#5ab060"/>
    </>;

    case "mushroom-village": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0628"/><stop offset="100%" stopColor="#1e0c50"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Moon */}
      <circle cx="195" cy="30" r="22" fill="#f0e8b0"/>
      <circle cx="205" cy="25" r="15" fill="#e8d898"/>
      {/* Stars */}
      {[[20,18],[45,8],[80,20],[115,5],[150,18],[225,12],[35,45],[90,38],[170,35]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity={0.5+i*0.04}/>
      ))}
      {/* Ground */}
      <path d="M0,130 Q60,118 120,128 Q185,138 240,122 L240,160 L0,160Z" fill="#1a0840"/>
      <path d="M0,145 Q70,136 150,143 Q200,148 240,138 L240,160 L0,160Z" fill="#130630"/>
      {/* Mushrooms */}
      {[[30,128],[65,118],[110,124],[155,120],[190,128],[218,124]].map(([x,y],i)=>(
        <g key={i}>
          <rect x={x-6} y={y} width="12" height={20+i%2*5} rx="2" fill="#e8d0b0"/>
          {/* Cap */}
          <ellipse cx={x} cy={y} rx={20+i%3*5} ry={12+i%2*4} fill={["#e03030","#e05020","#c02888","#d03848","#e86030","#c83050"][i]}/>
          <ellipse cx={x} cy={y} rx={18+i%3*4} ry={10+i%2*3} fill={["#ff6060","#ff8040","#e050a0","#f05070","#ff9060","#f05068"][i]} opacity="0.5"/>
          {/* White spots */}
          {[[-6,2],[2,-3],[8,4]].map(([dx,dy],j)=>(
            <circle key={j} cx={x+dx} cy={y+dy} r="2.5" fill="white" opacity="0.8"/>
          ))}
          {/* Window glow */}
          <rect x={x-5} y={y+8} width="10" height="7" rx="2" fill="#ffe090" opacity="0.7"/>
        </g>
      ))}
      {/* Fireflies */}
      {[[85,90],[130,80],[175,88],[50,100],[210,95],[100,70],[160,65]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="2.5" fill={["#ffe066","#a0ff80","#80d0ff"][i%3]} opacity="0.85"/>
      ))}
    </>;

    case "dragon-mountain": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a2800"/><stop offset="50%" stopColor="#d85000"/><stop offset="100%" stopColor="#ff9040"/>
        </linearGradient>
        <radialGradient id={`${p}-g`} cx="50%" cy="100%">
          <stop offset="0%" stopColor="#ff6600" stopOpacity="0.4"/><stop offset="100%" stopColor="#ff6600" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <rect width="240" height="160" fill={`url(#${p}-g)`}/>
      {/* Mountains */}
      <path d="M0,145 Q30,100 70,80 Q100,62 130,48 Q160,62 190,80 Q220,100 240,130 L240,160 L0,160Z" fill="#3a2010"/>
      <path d="M0,160 Q20,140 60,118 Q90,100 120,85 Q150,100 180,118 Q210,136 240,155 L240,160 L0,160Z" fill="#4a2818"/>
      {/* Mountain peak */}
      <path d="M100,88 Q120,45 140,88Z" fill="#2a1808"/>
      {/* Dragon silhouette */}
      <path d="M145,68 Q165,55 178,60 Q170,50 180,42 Q172,48 168,42 Q175,52 162,58 Q155,48 148,52Z" fill="#1a0808" opacity="0.85"/>
      {/* Dragon body */}
      <ellipse cx="158" cy="68" rx="22" ry="12" fill="#1a0808" opacity="0.8"/>
      {/* Dragon tail */}
      <path d="M180,72 Q200,80 210,72 Q205,85 195,82 Q200,92 188,88" stroke="#1a0808" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8"/>
      {/* Dragon head */}
      <ellipse cx="138" cy="62" rx="12" ry="9" fill="#1a0808" opacity="0.8"/>
      {/* Eye */}
      <circle cx="134" cy="60" r="3" fill="#ff8800"/>
      <circle cx="134" cy="60" r="1.5" fill="#ffdd00"/>
      {/* Wings */}
      <path d="M158,58 Q140,38 125,42 Q138,52 148,62Z" fill="#220a08" opacity="0.8"/>
      <path d="M158,58 Q178,38 192,42 Q180,52 168,62Z" fill="#220a08" opacity="0.8"/>
      {/* Smoke puffs */}
      <circle cx="125" cy="50" r="7" fill="rgba(100,80,60,0.4)"/>
      <circle cx="115" cy="42" r="9" fill="rgba(100,80,60,0.35)"/>
      <circle cx="122" cy="33" r="6" fill="rgba(100,80,60,0.3)"/>
      {/* Glowing caves */}
      {[[30,148],[80,140],[175,142],[210,148]].map(([x,y],i)=>(
        <g key={i}><ellipse cx={x} cy={y} rx="12" ry="8" fill="rgba(255,100,0,0.4)"/>
        <ellipse cx={x} cy={y} rx="7" ry="5" fill="rgba(255,150,0,0.5)"/></g>
      ))}
    </>;

    case "mirror-lake": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ab8d8"/><stop offset="100%" stopColor="#b0d8f0"/>
        </linearGradient>
        <linearGradient id={`${p}-r`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8d0f0"/><stop offset="100%" stopColor="#c8e8ff"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Mirror lake */}
      <rect x="30" y="80" width="180" height="80" fill={`url(#${p}-r)`}/>
      <rect x="30" y="80" width="180" height="80" fill="rgba(200,230,255,0.4)"/>
      {/* Horizon line / reflection border */}
      <line x1="0" y1="80" x2="240" y2="80" stroke="rgba(150,200,240,0.6)" strokeWidth="1"/>
      {/* Sky scene */}
      <ellipse cx="50" cy="40" rx="35" ry="18" fill="white" opacity="0.7"/>
      <ellipse cx="180" cy="30" rx="30" ry="16" fill="white" opacity="0.7"/>
      <circle cx="195" cy="22" r="14" fill="#ffd080"/>
      {/* Willow trees */}
      <line x1="28" y1="0" x2="30" y2="82" stroke="#5a7a40" strokeWidth="5"/>
      <path d="M30,15 Q15,30 10,50 Q20,42 30,48 Q22,55 18,68 Q28,60 30,72" stroke="#4a9040" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M30,20 Q44,32 48,52 Q38,44 30,50 Q36,57 40,70 Q30,62 30,74" stroke="#5aaa50" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <line x1="212" y1="0" x2="210" y2="82" stroke="#5a7a40" strokeWidth="5"/>
      <path d="M210,15 Q195,30 192,50 Q202,42 210,48 Q202,55 198,68 Q208,60 210,72" stroke="#4a9040" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Reflection of trees */}
      <line x1="28" y1="82" x2="30" y2="155" stroke="#5a7a40" strokeWidth="4" opacity="0.4"/>
      <line x1="212" y1="82" x2="210" y2="155" stroke="#5a7a40" strokeWidth="4" opacity="0.4"/>
      {/* Lily pads */}
      {[[70,120],[100,110],[130,125],[160,115],[185,130]].map(([x,y],i)=>(
        <g key={i}><ellipse cx={x} cy={y} rx="10" ry="6" fill="#5aaa38" opacity="0.8"/>
        {i%2===0 && <circle cx={x-2} cy={y-1} r="3" fill="#ff80a0" opacity="0.7"/>}</g>
      ))}
      {/* Duck */}
      <ellipse cx="120" cy="100" rx="10" ry="6" fill="white"/>
      <circle cx="128" cy="97" r="5" fill="white"/>
      <ellipse cx="133" cy="97" rx="4" ry="2" fill="#ff9900"/>
    </>;


    /* ── SPACE ───────────────────────────────────────── */

    case "space": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#080828"/><stop offset="100%" stopColor="#1a0850"/>
        </linearGradient>
        <radialGradient id={`${p}-n1`} cx="35%" cy="40%">
          <stop offset="0%" stopColor="#8040d0" stopOpacity="0.35"/><stop offset="100%" stopColor="#8040d0" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`${p}-n2`} cx="70%" cy="60%">
          <stop offset="0%" stopColor="#2070d0" stopOpacity="0.3"/><stop offset="100%" stopColor="#2070d0" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <rect width="240" height="160" fill={`url(#${p}-n1)`}/>
      <rect width="240" height="160" fill={`url(#${p}-n2)`}/>
      {/* Stars */}
      {[[15,12],[35,28],[55,8],[80,20],[105,5],[130,15],[158,8],[182,22],[210,10],[230,28],
        [25,50],[60,42],[95,55],[128,40],[165,52],[200,45],[235,55],
        [10,80],[42,72],[78,88],[115,75],[150,82],[185,70],[225,85],
        [30,108],[68,118],[105,105],[142,115],[178,108],[215,120]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%4===0?2:i%3===0?1.5:1} fill="white" opacity={0.4+i%3*0.15}/>
      ))}
      {/* Shooting star */}
      <line x1="160" y1="35" x2="200" y2="48" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="160" cy="35" r="2" fill="white" opacity="0.9"/>
      {/* Nebula wisps */}
      <ellipse cx="90" cy="55" rx="55" ry="22" fill="rgba(160,80,220,0.12)"/>
      <ellipse cx="165" cy="70" rx="48" ry="18" fill="rgba(40,120,220,0.1)"/>
      {/* Distant galaxy */}
      <ellipse cx="180" cy="30" rx="20" ry="8" fill="rgba(200,160,255,0.2)" transform="rotate(-20,180,30)"/>
    </>;

    case "moon-base": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#080820"/><stop offset="100%" stopColor="#101838"/>
        </linearGradient>
        <linearGradient id={`${p}-m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8c0d8"/><stop offset="100%" stopColor="#8880a0"/>
        </linearGradient>
        <radialGradient id={`${p}-e`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#4080ff" stopOpacity="0.9"/><stop offset="30%" stopColor="#40c080" stopOpacity="0.5"/><stop offset="100%" stopColor="#4080ff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Stars */}
      {[[20,15],[50,8],[90,20],[130,5],[170,18],[210,8],[240,22],[35,40],[75,32],[145,38],[205,35]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity={0.4+i*0.04}/>
      ))}
      {/* Earth */}
      <circle cx="185" cy="32" r="28" fill={`url(#${p}-e)`}/>
      <circle cx="185" cy="32" r="28" fill="none" stroke="rgba(200,230,255,0.3)" strokeWidth="1"/>
      {/* Moon surface */}
      <path d="M0,108 Q50,95 100,105 Q160,118 240,100 L240,160 L0,160Z" fill={`url(#${p}-m)`}/>
      <path d="M0,125 Q60,115 130,122 Q185,128 240,118 L240,160 L0,160Z" fill="#8880a0"/>
      {/* Craters */}
      <ellipse cx="40" cy="130" rx="18" ry="10" fill="#706878" opacity="0.5"/>
      <ellipse cx="195" cy="140" rx="14" ry="7" fill="#706878" opacity="0.5"/>
      <ellipse cx="100" cy="150" rx="10" ry="5" fill="#706878" opacity="0.4"/>
      {/* Base dome */}
      <ellipse cx="120" cy="105" rx="42" ry="18" fill="#a0a0c0" opacity="0.3"/>
      <path d="M78,105 Q120,72 162,105Z" fill="#b0b0d0" opacity="0.5"/>
      <path d="M82,105 Q120,76 158,105Z" fill="#c8c8e8" opacity="0.6"/>
      {/* Base walls */}
      <rect x="85" y="100" width="70" height="12" rx="2" fill="#a0a0c0"/>
      {/* Windows */}
      {[[100,103],[120,103],[140,103]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="4" fill="#a0d8ff" opacity="0.8"/>
      ))}
      {/* Airlock tube */}
      <rect x="152" y="100" width="30" height="8" rx="3" fill="#909090"/>
      <rect x="178" y="96" width="14" height="16" rx="3" fill="#a0a0b8"/>
      {/* Antenna */}
      <line x1="120" y1="76" x2="120" y2="62" stroke="#c0c0d8" strokeWidth="2"/>
      <circle cx="120" cy="60" r="3" fill="#ff8040"/>
    </>;

    case "robot-workshop": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3040"/><stop offset="100%" stopColor="#284050"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Floor grid */}
      {[0,30,60,90,120,150,180,210].map((x,i)=>(
        <line key={i} x1={x} y1={0} x2={x} y2={160} stroke="rgba(100,200,255,0.06)" strokeWidth="1"/>
      ))}
      {[0,30,60,90,120,150].map((y,i)=>(
        <line key={i} x1={0} y1={y} x2={240} y2={y} stroke="rgba(100,200,255,0.06)" strokeWidth="1"/>
      ))}
      {/* Big gears */}
      {[[50,60,30],[150,80,38],[200,40,22],[30,120,20]].map(([cx,cy,r],i)=>(
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill="#2a5060" stroke="#40c0c0" strokeWidth="2"/>
          <circle cx={cx} cy={cy} r={r*0.55} fill="#1a3848" stroke="#40c0c0" strokeWidth="1.5"/>
          {[0,45,90,135,180,225,270,315].slice(0,6+i).map((angle,j)=>(
            <rect key={j} x={cx-3} y={cy-r-5} width="6" height="8" rx="1" fill="#40c0c0"
              transform={`rotate(${angle},${cx},${cy})`}/>
          ))}
        </g>
      ))}
      {/* Robot arm */}
      <line x1="240" y1="30" x2="190" y2="70" stroke="#608090" strokeWidth="8" strokeLinecap="round"/>
      <line x1="190" y1="70" x2="160" y2="100" stroke="#608090" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="190" cy="70" r="8" fill="#80a0b0"/>
      <circle cx="160" cy="100" r="6" fill="#80a0b0"/>
      {/* Control panel */}
      <rect x="10" y="90" width="55" height="40" rx="4" fill="#203040"/>
      <rect x="13" y="93" width="49" height="34" rx="3" fill="#1a2838"/>
      {[20,32,44].map((x,i)=>[x,97,x+10,107].map((y,j)=>(<circle key={j} cx={x+j%2*6} cy={97+Math.floor(j/2)*10} r="4" fill={["#ff4040","#40ff80","#4080ff"][i]} opacity="0.9"/>)))}
      {/* Floating robot */}
      <rect x="105" y="90" width="30" height="26" rx="4" fill="#5090a0"/>
      <rect x="110" y="82" width="20" height="14" rx="3" fill="#608090"/>
      <rect x="108" y="78" width="24" height="8" rx="2" fill="#506880"/>
      {[[112,88],[128,88]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="3" fill="#80f0ff" opacity="0.9"/>))}
      <line x1="105" y1="100" x2="95" y2="108" stroke="#5090a0" strokeWidth="3"/>
      <line x1="135" y1="100" x2="145" y2="108" stroke="#5090a0" strokeWidth="3"/>
      {/* Indicator lights */}
      {[[60,45],[70,130],[170,35],[225,100],[180,135]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="3.5" fill={["#ff4040","#40ff80","#4080ff","#ffcc00","#ff4040"][i]} opacity="0.9"/>
      ))}
    </>;

    case "telescope-tower": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#030818"/><stop offset="100%" stopColor="#0a1030"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Dense star field */}
      {[[12,10],[28,22],[48,5],[68,18],[88,8],[108,22],[128,6],[148,20],[168,8],[188,18],[208,5],[228,16],
        [18,38],[40,30],[65,45],[90,32],[118,42],[145,28],[172,40],[198,30],[222,45],
        [8,62],[35,55],[62,68],[92,55],[122,65],[152,52],[178,62],[205,55],[232,68],
        [20,88],[48,80],[78,92],[110,78],[140,88],[170,75],[200,88],[228,80]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%5===0?2:i%3===0?1.5:1} fill="white" opacity={0.3+i%4*0.12}/>
      ))}
      {/* Shooting star */}
      <line x1="30" y1="40" x2="70" y2="55" stroke="white" strokeWidth="1.5" opacity="0.6"/>
      <circle cx="30" cy="40" r="2" fill="white" opacity="0.8"/>
      {/* Tower */}
      <path d="M104,160 L106,80 L120,55 L134,80 L136,160Z" fill="#2a3040"/>
      <path d="M108,160 L110,82 L120,60 L130,82 L132,160Z" fill="#3a4060"/>
      {/* Tower windows */}
      {[100,115,130,145].map((y,i)=>(<rect key={i} x="113" y={y} width="14" height="10" rx="2" fill="#ffe080" opacity="0.7"/>))}
      {/* Observatory dome */}
      <ellipse cx="120" cy="56" rx="24" ry="14" fill="#3a4060"/>
      <path d="M96,56 Q120,38 144,56Z" fill="#4a5080"/>
      <ellipse cx="120" cy="56" rx="24" ry="5" fill="#303850"/>
      {/* Telescope */}
      <line x1="120" y1="45" x2="148" y2="28" stroke="#6070a0" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="148" cy="28" r="5" fill="#8090c0"/>
      {/* Star constellation lines */}
      <line x1="50" y1="25" x2="80" y2="18" stroke="rgba(150,180,255,0.3)" strokeWidth="1"/>
      <line x1="80" y1="18" x2="95" y2="32" stroke="rgba(150,180,255,0.3)" strokeWidth="1"/>
      <line x1="95" y1="32" x2="75" y2="40" stroke="rgba(150,180,255,0.3)" strokeWidth="1"/>
      <circle cx="50" cy="25" r="2.5" fill="#c0d0ff" opacity="0.8"/>
      <circle cx="80" cy="18" r="2.5" fill="#c0d0ff" opacity="0.8"/>
      <circle cx="95" cy="32" r="2.5" fill="#c0d0ff" opacity="0.8"/>
      <circle cx="75" cy="40" r="2.5" fill="#c0d0ff" opacity="0.8"/>
      {/* Ground */}
      <path d="M0,148 Q60,138 120,145 Q185,152 240,140 L240,160 L0,160Z" fill="#202838"/>
    </>;

    case "planet-garden": return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060520"/><stop offset="100%" stopColor="#100840"/>
        </linearGradient>
        <radialGradient id={`${p}-p1`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#60a8ff" stopOpacity="0.8"/><stop offset="100%" stopColor="#3060c0" stopOpacity="0.4"/>
        </radialGradient>
        <radialGradient id={`${p}-p2`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#ff9060" stopOpacity="0.8"/><stop offset="100%" stopColor="#c04820" stopOpacity="0.4"/>
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      {/* Stars */}
      {[[10,8],[30,18],[55,5],[80,22],[110,8],[140,18],[165,6],[190,20],[218,8],[238,18],
        [20,40],[50,32],[85,48],[120,35],[155,45],[190,35],[222,48]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%3===0?2:1.2} fill="white" opacity={0.3+i%4*0.1}/>
      ))}
      {/* Large planet with ring */}
      <circle cx="168" cy="55" r="40" fill={`url(#${p}-p1)`}/>
      <ellipse cx="168" cy="55" rx="58" ry="12" fill="rgba(150,190,255,0.15)" transform="rotate(-15,168,55)"/>
      <ellipse cx="168" cy="55" rx="58" ry="12" fill="none" stroke="rgba(180,210,255,0.35)" strokeWidth="2" transform="rotate(-15,168,55)"/>
      {/* Planet surface detail */}
      <ellipse cx="160" cy="48" rx="12" ry="8" fill="rgba(255,255,255,0.08)"/>
      <ellipse cx="175" cy="62" rx="8" ry="5" fill="rgba(255,255,255,0.06)"/>
      {/* Smaller planet */}
      <circle cx="45" cy="45" r="20" fill={`url(#${p}-p2)`}/>
      {/* Greenhouse/garden dome */}
      <path d="M60,145 Q60,112 120,108 Q180,112 180,145Z" fill="rgba(80,200,120,0.2)"/>
      <path d="M65,145 Q65,115 120,111 Q175,115 175,145Z" fill="rgba(100,220,140,0.15)"/>
      <rect x="60" y="140" width="120" height="8" rx="3" fill="rgba(100,200,140,0.4)"/>
      {/* Plants in dome */}
      {[[80,135],[100,128],[120,125],[140,128],[160,133]].map(([x,y],i)=>(
        <g key={i}>
          <line x1={x} y1={y} x2={x} y2={y+15} stroke="#40c060" strokeWidth="2"/>
          <ellipse cx={x} cy={y} rx={8+i%2*3} ry={5+i%3*2}
            fill={["#40e880","#80ff60","#a0ff80","#60e060","#80ffa0"][i]} opacity="0.8"/>
          {i%2===0 && <circle cx={x} cy={y-4} r="4" fill={["#ff80a0","#ffe060","#80c0ff"][i%3]} opacity="0.9"/>}
        </g>
      ))}
      {/* Floor */}
      <path d="M0,148 Q60,140 120,146 Q185,152 240,142 L240,160 L0,160Z" fill="#1a1035"/>
    </>;

    default: return <>
      <defs>
        <linearGradient id={`${p}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a0c8f0"/><stop offset="100%" stopColor="#d0e8ff"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${p}-s)`}/>
      <path d="M0,120 Q60,105 120,115 Q185,125 240,108 L240,160 L0,160Z" fill="#60a060"/>
      <circle cx="180" cy="30" r="20" fill="#ffe080"/>
    </>;
  }
}
