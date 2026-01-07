import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import styles from '../video_player.module.scss';

const FALLBACK_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIFRodW1ibmFpbDwvdGV4dD48L3N2Zz4=';

const ThumbnailLoader = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'default',
        gap: '6px',
        fontSize: '14px',
        color: '#ffffff',
        fontWeight: 500,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              animation: 'bounce 1.4s ease-in-out infinite both',
              animationDelay: `${-0.32 + (i * 0.16)}s`,
            }}
          />
        ))}
      </div>
      <div>Loading...</div>
    </div>
  );
};

export const VideoThumbnail = ({ 
  visible, 
  thumbnailUrl, 
  fallbackUrl, 
  onPlay, 
  topicId, 
  loadedThumbnailRef 
}) => {
  const [imageSrc, setImageSrc] = useState(thumbnailUrl);
  const [hasErrored, setHasErrored] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    setImageSrc(thumbnailUrl);
    setHasErrored(false);
    const alreadyLoaded = loadedThumbnailRef?.current?.has(topicId) || false;
    setImageLoading(!alreadyLoaded);
  }, [thumbnailUrl, topicId, loadedThumbnailRef]);

  if (!visible) return null;

  const handleImageError = () => {
    if (!hasErrored) {
      setHasErrored(true);
      setImageSrc(fallbackUrl);
    } else {
      // If fallback also fails, use SVG placeholder
      setImageSrc(FALLBACK_SVG);
    }
  };

  const handleImageLoad = () => {
    if (loadedThumbnailRef?.current && topicId) {
      loadedThumbnailRef.current.add(topicId);
    }
    setImageLoading(false);
  };

  return (
    <>
      <div className={styles.thumbnailPreview}>
        <img
          src={imageSrc}
          alt="Video thumbnail"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className={styles.playOverlay} onClick={onPlay}>
        {imageLoading ? (
          <ThumbnailLoader />
        ) : (
          <button onClick={onPlay} style={{ cursor: 'pointer' }}>
            <Play size={32} color="#000" />
          </button>
        )}
      </div>
    </>
  );
};