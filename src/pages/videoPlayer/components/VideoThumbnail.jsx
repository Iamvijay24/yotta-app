import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import styles from '../video_player.module.scss';

const FALLBACK_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIFRodW1ibmFpbDwvdGV4dD48L3N2Zz4=';

export const VideoThumbnail = ({ visible, thumbnailUrl, fallbackUrl, onPlay }) => {
  const [imageSrc, setImageSrc] = useState(thumbnailUrl);
  const [hasErrored, setHasErrored] = useState(false);

  useEffect(() => {
    setImageSrc(thumbnailUrl);
    setHasErrored(false);
  }, [thumbnailUrl]);

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

  return (
    <>
      <div className={styles.thumbnailPreview}>
        <img
          src={imageSrc}
          alt="Video thumbnail"
          onError={handleImageError}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className={styles.playOverlay} onClick={onPlay}>
        <button onClick={onPlay}>
          <Play size={32} color="#000" />
        </button>
      </div>
    </>
  );
};