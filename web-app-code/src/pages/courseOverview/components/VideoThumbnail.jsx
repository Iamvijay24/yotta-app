// courseOverview/components/VideoThumbnail.jsx
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import styles from './../CourseOverview.module.scss'

const StyledVideoThumbnail = styled.div``;

const VideoThumbnail = ({ thumbnail, title, fallback }) => {
  return (
    <StyledVideoThumbnail className={styles.styledVideoThumbnail}>
      <img
        src={thumbnail}
        alt={title}
        onError={(e) => (e.target.src = fallback)}
      />
    </StyledVideoThumbnail>
  );
};

VideoThumbnail.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  fallback: PropTypes.string.isRequired,
};

export default VideoThumbnail;