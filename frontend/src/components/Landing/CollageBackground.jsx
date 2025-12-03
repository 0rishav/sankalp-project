import React from 'react'

export default function CollageBackground({ images = [], overlayOpacity = 0.28, className = '' }) {
  // Fallback to some public images if none provided
  const fallback = [
    '/img/OIP.1oOiuO5Cae56hgSk2sM4oAAAAA',
    '/img/OIP.4xowSwdXkgq4LU8O0WsvDwAAAA',
    '/img/OIP.B2mWs5XcnjGdy75mrnULgAHaE7',
  ]
  const imgs = images.length ? images : fallback

  return (
    <div aria-hidden="true" className={`collage-bg fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <div className="collage-layer absolute inset-0 w-full h-full">
        {imgs.map((src, i) => (
          <div
            key={i}
            className={`card card-pos-${i} transform-gpu will-change-transform`}
            style={{
              backgroundImage: `url(${src})`
            }}
          />
        ))}
      </div>
      <div className="collage-overlay absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})`, backdropFilter: 'blur(6px)' }} />
    </div>
  )
}
