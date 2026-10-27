import React from 'react';
import './BackgroundElements.css';

/**
 * BackgroundElements renders ambient 3D glass orbs, an orbital flight ring,
 * low-opacity flight grid patterns, and royal blue ambient lighting.
 * Set with pointer-events: none and overflow: hidden to guarantee zero interaction interference.
 */
export const BackgroundElements = () => {
  return (
    <div className="bg-atmosphere-container" aria-hidden="true">
      {/* Flight routes grid overlay */}
      <div className="bg-flight-routes-pattern" />

      {/* Ambient Royal Blue Glow Cones */}
      <div className="bg-ambient-cone-1" />
      <div className="bg-ambient-cone-2" />

      {/* Floating 3D Orbital Ring */}
      <div className="bg-3d-orbital-ring" />
    </div>
  );
};

export default BackgroundElements;
