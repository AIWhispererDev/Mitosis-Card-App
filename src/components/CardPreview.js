import React, { useState, useRef } from 'react';
import { toBlob } from 'html-to-image';
import { saveAs } from 'file-saver';
import './CardPreview.css';

// Import logo variants
import purpleLogo from '../assets/logos/mitosis_logo_symbol_purple.svg';
import mintLogo from '../assets/logos/mitosis_logo_symbol_mint.svg';
import whiteLogo from '../assets/logos/mitosis_logo_symbol_lightpurple.svg';
import blackLogo from '../assets/logos/mitosis_logo_symbol_black.svg';

const CardPreview = ({ cardData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef(null);

  // Choose logo based on selection
  const getLogoForCard = () => {
    switch (cardData.logo) {
      case 'mint':
        return mintLogo;
      case 'white':
        return whiteLogo;
      case 'black':
        return blackLogo;
      case 'purple':
      default:
        return purpleLogo;
    }
  };

  // Use custom color if set
  const getBackgroundColor = () => {
    if (cardData.cardColor && cardData.cardColor.startsWith('#')) {
      return cardData.cardColor;
    }
    if (cardData.cardColor === 'white') return '#FFFFFF';
    return '#6B5BFF';
  };

  // Calculate text color for custom backgrounds
  const getTextColor = () => {
    if (cardData.cardColor === '#FFFFFF' || cardData.cardColor === 'white') {
      return '#563AFE'; // deep purple for white card
    }
    return '#FFFFFF'; // white for all other backgrounds
  };

  // Create pastel colors that complement the main color
  const getPastelColor = (baseColor) => {
    if (baseColor === '#FFFFFF') return '#F4DFF8';
    if (baseColor === '#6B5BFF') return '#F4DFF8';
    if (baseColor.startsWith('#')) {
      const hex = baseColor.replace('#', '');
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      const pastelR = Math.min(255, r + 150);
      const pastelG = Math.min(255, g + 150);
      const pastelB = Math.min(255, b + 150);
      return `rgb(${pastelR}, ${pastelG}, ${pastelB})`;
    }
    return '#F4DFF8';
  };

  // Render template SVG inline with dynamic shape color
  const getTemplateSVG = () => {
    const waveColor = getPastelColor(cardData.cardColor);
    const isWhiteCard = cardData.cardColor === 'white' || cardData.cardColor === '#FFFFFF';
    const patternColor = isWhiteCard ? '#573BFF' : waveColor;
    switch (cardData.cardTemplate) {
      case 'clean-lines':
        return (
          <svg width="450" height="250" viewBox="0 0 450 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="450" height="250" fill="none" />
            <path d="M0 180 C90 140, 180 200, 270 160 S360 100, 450 140 L450 250 L0 250 Z" fill={waveColor} fillOpacity="0.6" />
            <path d="M0 200 C90 170, 180 220, 270 180 S360 130, 450 170 L450 250 L0 250 Z" fill={waveColor} fillOpacity="0.4" />
            <path d="M0 220 C90 200, 180 240, 270 210 S360 170, 450 200 L450 250 L0 250 Z" fill={waveColor} fillOpacity="0.2" />
          </svg>
        );
      case 'blue-waves':
        return (
          <svg width="450" height="250" viewBox="0 0 450 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="450" height="250" fill="none" />
            <path d="M0 200 Q120 150 240 220 T450 200 L450 250 L0 250 Z" fill={waveColor} fillOpacity="0.6" />
            <path d="M0 220 Q140 170 280 230 T450 220 L450 250 L0 250 Z" fill={waveColor} fillOpacity="0.4" />
          </svg>
        );
      case 'flowing-mesh':
        return (
          <svg width="450" height="250" viewBox="0 0 450 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={waveColor} stopOpacity="0.1" />
                <stop offset="50%" stopColor={waveColor} stopOpacity="0.2" />
                <stop offset="100%" stopColor={waveColor} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* Elegant flowing mesh pattern */}
            <path d="M0 250 C50 220 100 230 150 210 S200 180 250 190 S300 210 350 200 S400 180 450 190 L450 250 Z" fill="url(#meshGradient)" />
            <path d="M0 250 C60 230 120 240 180 220 S240 190 300 200 S360 220 450 200 L450 250 Z" fill={waveColor} fillOpacity="0.15" />
            <path d="M0 250 C70 240 140 250 210 230 S280 200 350 210 S420 230 450 210 L450 250 Z" fill={waveColor} fillOpacity="0.1" />
            
            {/* Delicate curved lines */}
            <path d="M-30 180 C40 150 110 170 180 150 S250 120 320 140 S390 170 480 140" stroke={waveColor} strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
            <path d="M-20 210 C50 180 120 200 190 180 S260 150 330 170 S400 200 490 170" stroke={waveColor} strokeWidth="1.5" strokeOpacity="0.15" fill="none" />
            <path d="M-10 240 C60 210 130 230 200 210 S270 180 340 200 S410 230 500 200" stroke={waveColor} strokeWidth="1.5" strokeOpacity="0.1" fill="none" />
          </svg>
        );
      case 'concentric-lines':
        return (
          <svg width="450" height="250" viewBox="0 0 450 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Concentric curved lines radiating from bottom left */}
            <g stroke={patternColor} strokeWidth="2" opacity="0.18">
              <path d="M0 250 Q 80 170 250 170 Q 420 170 450 30" />
              <path d="M0 250 Q 100 150 250 150 Q 400 150 450 60" />
              <path d="M0 250 Q 120 130 250 130 Q 380 130 450 90" />
              <path d="M0 250 Q 140 110 250 110 Q 360 110 450 120" />
              <path d="M0 250 Q 160 90 250 90 Q 340 90 450 150" />
              <path d="M0 250 Q 180 70 250 70 Q 320 70 450 180" />
            </g>
          </svg>
        );
      case 'radiate-top-left':
        return (
          <svg width="450" height="250" viewBox="0 0 450 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke={patternColor} strokeWidth="2" opacity="0.16">
              <path d="M0 0 Q 70 70 250 70 Q 430 70 450 200" />
              <path d="M0 0 Q 100 100 250 100 Q 400 100 450 230" />
              <path d="M0 0 Q 130 130 250 130 Q 370 130 450 250" />
              <path d="M0 0 Q 160 160 250 160 Q 340 160 450 270" />
            </g>
          </svg>
        );
      case 'diagonal-waves':
        return (
          <svg width="450" height="250" viewBox="0 0 450 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke={patternColor} strokeWidth="2" opacity="0.18">
              <path d="M-10 210 Q 60 170 120 200 T 250 170 T 400 210 T 470 160" />
              <path d="M-20 230 Q 40 190 110 220 T 230 180 T 350 230 T 480 200" />
              <path d="M-30 250 Q 30 210 90 240 T 210 210 T 320 250 T 490 240" />
              <path d="M0 180 Q 80 150 170 170 T 320 180 T 450 140" />
              <path d="M0 200 Q 100 180 200 190 T 350 200 T 450 180" />
            </g>
          </svg>
        );
      case 'circular-echoes':
        return (
          <svg width="450" height="250" viewBox="0 0 450 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke={patternColor} strokeWidth="2" opacity="0.16">
              <path d="M-40 250 Q 60 100 300 120 Q 520 140 520 250" />
              <path d="M-60 250 Q 80 120 320 150 Q 540 180 540 250" />
              <path d="M-80 250 Q 100 140 340 180 Q 560 220 560 250" />
              <path d="M-100 250 Q 120 160 360 210 Q 580 260 580 250" />
              <path d="M-120 250 Q 140 180 380 240 Q 600 300 600 250" />
            </g>
          </svg>
        );
      case 'glassmorphism-blobs': {
        // Use purple for all patterns on white cards
        let blob1 = patternColor;
        let blob2 = patternColor;
        let blob3 = patternColor;
        let meshStroke = patternColor;
        return (
          <svg width="450" height="250" viewBox="0 0 450 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="blob1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={blob1} stopOpacity="0.8" />
                <stop offset="100%" stopColor={blob1} stopOpacity="0.2" />
              </radialGradient>
              <radialGradient id="blob2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={blob2} stopOpacity="0.7" />
                <stop offset="100%" stopColor={blob2} stopOpacity="0.1" />
              </radialGradient>
              <radialGradient id="blob3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={blob3} stopOpacity="0.6" />
                <stop offset="100%" stopColor={blob3} stopOpacity="0.1" />
              </radialGradient>
            </defs>
            {/* Blurred glassy blobs */}
            <ellipse cx="120" cy="180" rx="80" ry="50" fill="url(#blob1)" filter="url(#blur1)" />
            <ellipse cx="340" cy="80" rx="60" ry="36" fill="url(#blob2)" filter="url(#blur2)" />
            <ellipse cx="260" cy="180" rx="40" ry="28" fill="url(#blob3)" filter="url(#blur3)" />
            {/* Subtle mesh lines for depth */}
            <path d="M40 200 Q 150 120 320 180 Q 410 210 430 120" stroke={meshStroke} strokeWidth="2" strokeOpacity="0.18" fill="none" />
            <path d="M80 230 Q 200 170 380 200 Q 430 210 440 180" stroke={meshStroke} strokeWidth="2" strokeOpacity="0.13" fill="none" />
            <filter id="blur1"><feGaussianBlur stdDeviation="18" /></filter>
            <filter id="blur2"><feGaussianBlur stdDeviation="12" /></filter>
            <filter id="blur3"><feGaussianBlur stdDeviation="8" /></filter>
          </svg>
        );
      }
      case 'overlapping-circles':
        return (
          <svg width="450" height="250" viewBox="0 0 450 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="450" height="250" fill="none" />
            {/* Abstract overlapping circles pattern */}
            <circle cx="100" cy="90" r="70" fill={waveColor} fillOpacity="0.23" />
            <circle cx="230" cy="120" r="90" fill={patternColor} fillOpacity="0.18" />
            <circle cx="340" cy="70" r="60" fill={waveColor} fillOpacity="0.15" />
            <circle cx="170" cy="180" r="60" fill={patternColor} fillOpacity="0.12" />
            <circle cx="320" cy="170" r="50" fill={waveColor} fillOpacity="0.10" />
          </svg>
        );
      default:
        return null;
    }
  };

  // PFP border color logic (fixed for white card)
  const getPfpBorderColor = () => {
    if (cardData.cardColor === '#FFFFFF' || cardData.cardColor === 'white') {
      return '#5A2DB3'; // purple border for white card
    }
    // If purple or custom color, use white border
    return '#FFFFFF';
  };

  // Download card as an image using html-to-image
  const downloadCard = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const blob = await toBlob(cardRef.current, { cacheBust: true });
      if (blob) saveAs(blob, 'mitosis-card.png');
    } catch (err) {
      console.error(err);
      alert('Failed to generate card image.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!cardData || !cardData.username) {
    return null;
  }

  return (
    <div className="card-preview-container">
      <h2>Your Mitosis Card</h2>
      <div
        ref={cardRef}
        className="mitosis-card"
        style={{ backgroundColor: getBackgroundColor() }}
      >
        <div className="template-layer">
          {getTemplateSVG()}
        </div>
        <div className="card-content" style={{ color: getTextColor() }}>
          <div
            className="profile-image-container"
            style={{ borderColor: getPfpBorderColor() }}
          >
            {cardData.profilePicture && (
              <img
                src={cardData.profilePicture}
                alt="Profile"
                className="profile-image"
                crossOrigin="anonymous"
              />
            )}
          </div>
          <div className="user-info" style={{ color: getTextColor() }}>
            <div className="username-role" style={{ color: getTextColor() }}>
              <span className="username">{cardData.name}</span><span className="separator"> | </span><span className="mitosis">Mitosis</span>
            </div>
            <div className="role">
              {Array.isArray(cardData.roles) && cardData.roles.length > 0
                ? cardData.roles.slice(0, 3).join(' • ')
                : cardData.role || ''}
            </div>
          </div>
          <div className="logo-container">
            <img src={getLogoForCard()} alt="Mitosis Logo" className="mitosis-logo" crossOrigin="anonymous" />
          </div>
          <div className="social-links" style={{ color: getTextColor() }}>
            {cardData.twitterHandle && (
              <span className="social-icon twitter" title="Twitter" style={{display: 'flex', alignItems: 'center', gap: 2}}>
                <svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 5.924c-.793.352-1.645.59-2.54.697a4.482 4.482 0 0 0 1.965-2.475 8.93 8.93 0 0 1-2.828 1.082A4.466 4.466 0 0 0 16.11 4c-2.466 0-4.466 2-4.466 4.466 0 .35.04.692.116 1.02C7.728 9.34 4.1 7.466 1.671 4.797c-.384.66-.604 1.427-.604 2.245 0 1.549.788 2.917 1.984 3.721a4.44 4.44 0 0 1-2.024-.56v.057c0 2.165 1.541 3.972 3.587 4.382-.375.102-.77.157-1.177.157-.288 0-.566-.028-.837-.08.567 1.77 2.211 3.06 4.162 3.094A8.95 8.95 0 0 1 0 19.54a12.64 12.64 0 0 0 6.84 2.006c8.208 0 12.704-6.8 12.704-12.704 0-.194-.004-.389-.013-.58A9.07 9.07 0 0 0 24 4.59a8.94 8.94 0 0 1-2.54.697z"/></svg>
                {cardData.twitterHandle}
              </span>
            )}
            {cardData.username && (
              <span className="social-icon discord" title="Discord" style={{display: 'flex', alignItems: 'center', gap: 2}}>
                <svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.369A19.791 19.791 0 0 0 16.885 3.2a.117.117 0 0 0-.124.06c-.531.96-1.124 2.21-1.541 3.195a17.963 17.963 0 0 0-5.06 0c-.417-.985-1.01-2.235-1.54-3.195a.117.117 0 0 0-.124-.06A19.736 19.736 0 0 0 3.684 4.369a.105.105 0 0 0-.049.043C.533 9.045-.319 13.58.099 18.057a.12.12 0 0 0 .045.082c2.022 1.482 3.983 2.382 5.915 2.986a.117.117 0 0 0 .127-.043c.456-.62.863-1.27 1.217-1.946a.112.112 0 0 0-.062-.157c-.652-.247-1.273-.548-1.872-.892a.117.117 0 0 1-.012-.195c.126-.094.252-.192.372-.291a.113.113 0 0 1 .114-.016c3.927 1.793 8.18 1.793 12.062 0a.112.112 0 0 1 .115.016c.12.099.246.197.372.291a.117.117 0 0 1-.011.195 12.298 12.298 0 0 1-1.873.892.112.112 0 0 0-.061.157c.36.676.767 1.326 1.217 1.946a.115.115 0 0 0 .127.043c1.932-.604 3.893-1.504 5.916-2.986a.12.12 0 0 0 .045-.082c.5-5.177-.838-9.673-3.633-13.645a.104.104 0 0 0-.048-.043zM8.02 15.331c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.174 1.095 2.156 2.418 0 1.334-.955 2.419-2.156 2.419zm7.974 0c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.174 1.095 2.156 2.418 0 1.334-.946 2.419-2.156 2.419z"/></svg>
                {cardData.username}
              </span>
            )}
            <span className="social-icon globe" title="Website" style={{display: 'flex', alignItems: 'center', gap: 2}}>
              <svg height="14" width="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              mitosis.org
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={downloadCard}
        className="download-button"
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Download Card'}
      </button>
    </div>
  );
};

export default CardPreview;
