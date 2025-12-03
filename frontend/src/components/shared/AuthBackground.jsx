import React from 'react'
 
export default function AuthBackground({ bg = '/img/ODF.6Z3cKDNpVY3uE0GoJu0Cng', posterTop = '/img/poster4.png', posterBottom = '/img/poster3.png' }){
  return (
    <div className="auth-bg fixed inset-0 -z-20 overflow-hidden">
      <div className="auth-bg-image absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${bg})` }} />

      {/* Top-left Poster card */}
      {/* <div className="auth-poster auth-poster-top absolute left-12 top-20 w-64 max-w-xs h-96 bg-cover bg-center rounded-2xl shadow-2xl" style={{ backgroundImage: `url(${posterTop})` }} /> */}

      {/* Bottom-right Poster card */}
      {/* <div className="auth-poster auth-poster-bottom absolute right-12 bottom-12 w-56 max-w-xs h-80 bg-cover bg-center rounded-2xl shadow-2xl" style={{ backgroundImage: `url(${posterBottom})` }} /> */}

      {/* Floating ball */}
  <div className="auth-ball absolute right-20 top-16 w-24 h-24 rounded-full bg-gradient-to-br from-white/60 to-white/20 shadow-lg z-10" />

  <div className="auth-ball absolute left-20 bottom-16 w-24 h-24 rounded-full bg-gradient-to-br from-white/60 to-white/20 shadow-lg z-10" />

      {/* Diya (small glowing element) */}
  <div className="auth-diya absolute left-6 bottom-16 w-16 h-10 rounded-t-full bg-yellow-400/90 shadow-sm z-10" />

      {/* Flower (decorative) */}
  <div className="auth-flower absolute right-8 bottom-36 w-20 h-20 rounded-full bg-pink-300/80 shadow-inner z-10" />
    </div>
  )
}
