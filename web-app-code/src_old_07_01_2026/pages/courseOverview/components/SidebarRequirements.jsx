// courseOverview/components/SidebarRequirements.jsx
import React from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';
import PropTypes from 'prop-types';

const { Text } = Typography;

const StyledSidebarCard = styled.div`
  padding: 0;
  margin-bottom: var(--gap-3xl);
  font-family: var(--font-family);
`;

const StyledRequirementsSection = styled.div`
  margin-bottom: var(--gap-3xl);
  padding-bottom: var(--gap-xl);
`;

const StyledRequirementsTitle = styled(Text)`
  &.ant-typography {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    color: var(--text-lighter);
    display: block;
    margin-bottom: var(--padding-md);
    letter-spacing: -0.2px;
  }
`;

const StyledRequirementList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StyledRequirement = styled.li`
  padding: var(--padding-xs) 0;
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  position: relative;
  padding-left: var(--gap-xl);
  font-weight: var(--font-weight-regular);

  &:before {
    content: "•";
    position: absolute;
    left: 0;
    top: 2px;
    color: var(--text-muted);
    font-size: var(--font-size-2xl);
  }
`;

const StyledLearningSection = styled.div`
  margin-bottom: var(--gap-3xl);
`;

const StyledLearningTitle = styled(Text)`
  &.ant-typography {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    color: var(--text-lighter);
    display: block;
    margin-bottom: var(--padding-md);
    letter-spacing: -0.2px;
  }
`;

const StyledLearningList = styled(StyledRequirementList)`
`;

const SidebarRequirements = ({ requirements, learnings }) => {
  return (
    <StyledSidebarCard>
      <StyledRequirementsSection>
        <StyledRequirementsTitle>ASSIGNMENTS</StyledRequirementsTitle>
        <StyledRequirementList>
          <StyledRequirement>
            Plan to dedicate a minimum of 1-2 hours a day to watch lectures videos, engage in Q&A sessions and complete assignments.
          </StyledRequirement>
        </StyledRequirementList>
      </StyledRequirementsSection>
      <StyledRequirementsSection>
        <StyledRequirementsTitle>REQUIREMENTS</StyledRequirementsTitle>
        <StyledRequirementList>
          {requirements.map((r, i) => (
            <StyledRequirement key={i}>{r}</StyledRequirement>
          ))}
        </StyledRequirementList>
      </StyledRequirementsSection>
      <StyledLearningSection>
        <StyledLearningTitle>WHAT YOU'LL LEARN</StyledLearningTitle>
        <StyledLearningList>
          {learnings.map((l, i) => (
            <StyledRequirement key={i}>{l}</StyledRequirement>
          ))}
        </StyledLearningList>
      </StyledLearningSection>
    </StyledSidebarCard>
  );
};

SidebarRequirements.propTypes = {
  requirements: PropTypes.array.isRequired,
  learnings: PropTypes.array.isRequired,
};

export default SidebarRequirements;