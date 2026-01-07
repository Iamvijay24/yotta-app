// courseOverview/components/AuthorSection.jsx
import React from 'react';
import styled from 'styled-components';
import { Typography, Avatar } from 'antd';
import { UserOutlined, StarFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Text } = Typography;

const StyledAuthorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-md);
  margin-bottom: var(--gap-3xl);
  padding: var(--padding-lg);
  border-radius: var(--radius-md);
`;

const StyledAuthorInfo = styled.div`
  flex: 1;
`;

const StyledAuthorName = styled(Text)`
  &.ant-typography {
    display: block;
    font-family: var(--font-family);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-md);
    line-height: var(--line-height-relaxed);
    color: var(--text-muted);
  }
`;

const StyledAuthorRole = styled(Text)`
  &.ant-typography {
    display: block;
    font-family: var(--font-family);
    font-weight: var(--font-weight-semi-bold);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-relaxed);
    color: var(--text-light);
  }
`;

const StyledRatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-md);
`;

const StyledRatingStars = styled.div`
  display: flex;
  gap: var(--gap-xs);

  .anticon {
    color: var(--warning);
    font-size: var(--font-size-xl);
  }

  .star {
    &.filled {
      opacity: 1;
    }

    &.empty {
      opacity: 0.3;
    }
  }
`;

const StyledRatingText = styled(Text)`
  &.ant-typography {
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-lg);
    color: var(--text-rating);
  }
`;

const StyledAuthorAvatar = styled(Avatar)`
  &.ant-avatar {
    width: var(--avatar-sm);
    height: var(--avatar-sm);
    background: linear-gradient(135deg, #1c55ffff, #1d4ed8);
  }
`;

const AuthorSection = () => {
  return (
    <StyledAuthorContainer>
      <StyledAuthorAvatar icon={<UserOutlined />} />
      <StyledAuthorInfo>
        <StyledAuthorName>By Yotta Academy</StyledAuthorName>
      </StyledAuthorInfo>
      {/* <StyledRatingContainer>
        <StyledRatingStars>
          {[...Array(5)].map((_, i) => (
            <StarFilled
              key={i}
              className={`star ${i < Math.floor(rating || 0) ? 'filled' : 'empty'}`}
            />
          ))}
        </StyledRatingStars>
        <StyledRatingText>{rating || 'N/A'}/5</StyledRatingText>
      </StyledRatingContainer> */}
    </StyledAuthorContainer>
  );
};



export default AuthorSection;
