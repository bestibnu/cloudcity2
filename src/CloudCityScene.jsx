import { useRef, useEffect, useState } from "react";

function drawSky(canvas) {
  const ctx = canvas.getContext("2d"), w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  
  // Deep cobalt to pale blue gradient
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0.00, "#1e4e9e"); g.addColorStop(0.22, "#2e64b4");
  g.addColorStop(0.48, "#4a82cc"); g.addColorStop(0.72, "#7aaee0");
  g.addColorStop(0.88, "#aacce8"); g.addColorStop(1.00, "#c8e0f2");
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
  
  // Horizon haze
  const hz = ctx.createLinearGradient(0,h*0.65,0,h);
  hz.addColorStop(0,"rgba(192,224,244,0)"); hz.addColorStop(1,"rgba(220,238,252,0.5)");
  ctx.fillStyle = hz; ctx.fillRect(0,0,w,h);

  // Organic cloud wisps via fractal noise
  function hash(x,y){const n=Math.sin(x*127.1+y*311.7)*43758.5;return n-Math.floor(n);}
  function sn(x,y){
    const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
    const ux=fx*fx*(3-2*fx),uy=fy*fy*(3-2*fy);
    return hash(ix,iy)+(hash(ix+1,iy)-hash(ix,iy))*ux+(hash(ix,iy+1)-hash(ix,iy))*uy+(hash(ix,iy)+hash(ix+1,iy+1)-hash(ix+1,iy)-hash(ix,iy+1))*ux*uy;
  }
  function fbm(x,y){let v=0,a=0.5;for(let i=0;i<5;i++){v+=a*sn(x,y);x*=2.1;y*=2.1;a*=0.5;}return v;}
  
  const d=ctx.getImageData(0,0,w,h),p=d.data;
  for(let x=0;x<w;x+=2) for(let y=0;y<h*0.78;y+=2){
    const n=fbm(x/w*5.5,y/h*1.3),hf=Math.pow(1-y/(h*0.78),2),cl=Math.max(0,(n-0.52)*3.5)*hf;
    if(cl>0.01){
      const i=(y*w+x)*4;
      p[i]=Math.min(255,p[i]+cl*38);
      p[i+1]=Math.min(255,p[i+1]+cl*42);
      p[i+2]=Math.min(255,p[i+2]+cl*48);
    }
  }
  ctx.putImageData(d,0,0);
}

export default function CloudCityScene() {
  const skyRef = useRef(null);
  const blendRef = useRef(null);
  const [mode, setMode] = useState("ARCH");
  const MODES = ["ARCH","COST","FAULT","GROWTH","DENSITY"];

  useEffect(() => {
    function resize() {
      const sky = skyRef.current, blend = blendRef.current;
      if (!sky || !blend) return;
      
      // Sky canvas - top 50%
      sky.width = window.innerWidth;
      sky.height = Math.round(window.innerHeight * 0.50);
      drawSky(sky);
      
      // Horizon blend strip
      blend.width = window.innerWidth;
      blend.height = 80;
      const ctx = blend.getContext("2d");
      ctx.clearRect(0,0,blend.width,80);
      const g = ctx.createLinearGradient(0,0,0,80);
      g.addColorStop(0,"rgba(200,224,244,0)");
      g.addColorStop(0.30,"rgba(192,218,240,0.55)");
      g.addColorStop(0.48,"rgba(186,214,238,0.85)");
      g.addColorStop(0.62,"rgba(180,210,235,0.55)");
      g.addColorStop(1,"rgba(168,204,230,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,blend.width,80);
    }
    
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div style={{ 
      position:"relative", 
      width:"100%", 
      height:"100vh", 
      overflow:"hidden", 
      background:"#0d1e30", 
      fontFamily:"monospace" 
    }}>
      
      {/* Layer 1: REAL Ocean photo from public folder */}
      <div style={{
        position:"absolute",
        bottom:0,
        left:0,
        right:0,
        height:"52%",
        zIndex:1,
        backgroundImage: 'url("/ocean.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat"
      }}/>

      {/* Layer 2: Sky canvas with clouds */}
      <canvas ref={skyRef} style={{
        position:"absolute",
        top:0,
        left:0,
        width:"100%",
        height:"50%",
        zIndex:2
      }}/>

      {/* Layer 3: Horizon blend */}
      <canvas ref={blendRef} style={{
        position:"absolute",
        left:0,
        width:"100%",
        height:80,
        top:"calc(50% - 40px)",
        zIndex:3,
        pointerEvents:"none"
      }}/>

      {/* Water shadow beneath island - like reference image */}
      <div style={{
        position:"absolute",
        left:"50%",
        top:"52%",
        transform:"translateX(-50%)",
        width:"42%",
        height:"8%",
        background:"radial-gradient(ellipse at center, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.18) 50%, transparent 80%)",
        filter:"blur(25px)",
        zIndex:3,
        pointerEvents:"none"
      }}/>

      {/* Layer 4: Island - smaller for holistic view */}
      <img 
        src="/island.png" 
        alt="CloudCity Platform" 
        style={{
          position:"absolute",
          left:"50%",
          top:"58%",
          transform:"translateX(-50%)",
          width:"40%",
          height:"auto",
          zIndex:4,
          pointerEvents:"none",
          filter:"drop-shadow(0 18px 35px rgba(0,0,0,0.28))"
        }}
      />

      {/* UI - Brand */}
      <div style={{ position:"absolute", top:16, left:18, zIndex:10 }}>
        <div style={{ 
          color:"rgba(255,255,255,0.92)", 
          fontSize:13, 
          fontWeight:700, 
          letterSpacing:"0.18em" 
        }}>
          CLOUDCITY
        </div>
        <div style={{ 
          color:"rgba(255,255,255,0.28)", 
          fontSize:7, 
          letterSpacing:"0.25em", 
          marginTop:2 
        }}>
          1 REGION · AWS VISUALIZATION
        </div>
      </div>

      {/* UI - Mode switcher */}
      <div style={{
        position:"absolute",
        bottom:18,
        left:"50%",
        transform:"translateX(-50%)",
        zIndex:10,
        display:"flex",
        gap:3,
        background:"rgba(0,0,0,0.65)",
        border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:10,
        padding:"5px 8px"
      }}>
        {MODES.map(m => (
          <button 
            key={m} 
            onClick={()=>setMode(m)} 
            style={{
              padding:"5px 11px",
              borderRadius:6,
              border:"none",
              cursor:"pointer",
              background: mode===m ? "rgba(80,180,255,0.18)" : "transparent",
              color: mode===m ? "#70ccff" : "rgba(255,255,255,0.35)",
              fontSize:8,
              fontFamily:"monospace",
              letterSpacing:"0.10em",
              transition:"all 0.2s"
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* UI - Hint text */}
      <div style={{
        position:"absolute",
        bottom:55,
        left:"50%",
        transform:"translateX(-50%)",
        color:"rgba(255,255,255,0.15)",
        fontSize:7,
        letterSpacing:"0.30em",
        zIndex:10,
        whiteSpace:"nowrap"
      }}>
        CLICK THE ISLAND TO EXPLORE
      </div>
    </div>
  );
}
