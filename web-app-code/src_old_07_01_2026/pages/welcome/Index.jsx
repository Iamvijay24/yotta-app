// pages/home/Index.jsx
import React from 'react';
import { Button, Typography, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  RocketOutlined, 
  ThunderboltOutlined,
  BookOutlined, 
  TrophyOutlined,
  CheckCircleFilled
} from '@ant-design/icons';
import styled from 'styled-components';
import Logo from '../../assets/Logo_main.png';

const { Title, Paragraph } = Typography;

const HomeContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  overflow-x: hidden;
`;

const HeroSection = styled.div`
  min-height: auto;
  padding: 40px 20px 30px;
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const HeroContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  img {
    width: 500px;
    height: 150px;
    object-fit: contain;
    
    @media (max-width: 768px) {
      width: 350px;
      height: 50px;
    }
  }
`;

const HeroTitle = styled(Title)`
  color: #1e293b !important;
  font-weight: 800 !important;
  margin-bottom: 16px !important;
  font-size: 2.75rem !important;
  line-height: 1.2;
  text-align: center;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 2rem !important;
  }
`;

const HeroHighlight = styled.span`
  color: #2B7AFB;
`;

const HeroSubtitle = styled(Paragraph)`
  color: #64748b !important;
  font-size: 1.125rem !important;
  margin-bottom: 28px !important;
  line-height: 1.6;
  text-align: center;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroButton = styled(Button)`
  height: 54px;
  padding: 0 44px;
  background: #2B7AFB;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.0625rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 auto 36px;
  box-shadow: 0 4px 16px rgba(43, 122, 251, 0.25);
  transition: all 0.3s ease;

  &:hover {
    background: #1e5fd8 !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(43, 122, 251, 0.35) !important;
    color: white !important;
  }

  .anticon {
    font-size: 1.25rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 700px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const StatBox = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #2B7AFB;
  margin-bottom: 6px;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.9375rem;
  color: #64748b;
  font-weight: 500;
`;

const FeaturesSection = styled.div`
  padding: 60px 20px;
  background: #ffffff;
`;

const SectionTitle = styled(Title)`
  color: #1e293b !important;
  font-weight: 800 !important;
  text-align: center;
  margin-bottom: 12px !important;
  font-size: 2.25rem !important;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 1.875rem !important;
  }
`;

const SectionSubtitle = styled(Paragraph)`
  color: #64748b !important;
  font-size: 1.0625rem !important;
  text-align: center;
  margin-bottom: 40px !important;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeatureCard = styled(Card)`
  height: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    border-color: #2B7AFB;
    box-shadow: 0 12px 32px rgba(43, 122, 251, 0.15);
  }

  .ant-card-body {
    padding: 28px 24px;
  }
`;

const FeatureIconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border: 2px solid #e0efff;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  background: #f0f7ff;

  .anticon {
    font-size: 32px;
    color: #2B7AFB;
  }
`;

const FeatureTitle = styled(Title)`
  color: #1e293b !important;
  font-weight: 700 !important;
  margin-bottom: 10px !important;
  font-size: 1.125rem !important;
  text-align: center;
`;

const FeatureDescription = styled(Paragraph)`
  color: #64748b !important;
  margin-bottom: 0 !important;
  line-height: 1.6;
  font-size: 0.9375rem !important;
  text-align: center;
`;

const BenefitsSection = styled.div`
  padding: 60px 20px;
  background: #f8fafc;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  gap: 14px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #2B7AFB;
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(43, 122, 251, 0.1);
  }
`;

const BenefitIcon = styled.div`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  
  .anticon {
    font-size: 18px;
    color: #2B7AFB;
  }
`;

const BenefitText = styled.div`
  color: #475569;
  font-size: 0.9375rem;
  line-height: 1.6;
`;

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOutlined />,
      title: 'World-Class Curriculum',
      description: 'Master cutting-edge skills through meticulously designed courses created by industry leaders.'
    },
    {
      icon: <ThunderboltOutlined />,
      title: 'AI-Powered Learning',
      description: 'Experience personalized learning paths that adapt to your pace and style in real-time.'
    },
    {
      icon: <TrophyOutlined />,
      title: 'Industry Certificates',
      description: 'Earn prestigious certifications that showcase your expertise and open career doors.'
    },
    {
      icon: <RocketOutlined />,
      title: 'Unlimited Access',
      description: 'Learn anytime, anywhere with lifetime access to comprehensive course libraries.'
    }
  ];

  const benefits = [
    'Learn from 500+ expert-created courses',
    'Get 24/7 AI tutor support',
    'Join live interactive sessions',
    'Build real-world projects',
    'Connect with global community',
    'Track progress with analytics'
  ];

  const handleGetStarted = () => {
    navigate('/my-progress');
  };

  return (
    <HomeContainer>
      <HeroSection>
        <ContentWrapper>
          <HeroContent>
            <LogoWrapper>
              <img src={Logo} alt="Logo" />
            </LogoWrapper>
            
            <HeroTitle level={1}>
              Master Skills That <HeroHighlight>Define Tomorrow</HeroHighlight>
            </HeroTitle>
            
            <HeroSubtitle>
              Transform your potential into expertise with AI-powered learning and world-class instructors.
            </HeroSubtitle>
            
            <HeroButton 
              type="primary" 
              icon={<RocketOutlined />}
              onClick={handleGetStarted}
              size="large"
            >
              Begin Your Journey
            </HeroButton>

            <StatsGrid>
              <StatBox>
                <StatNumber>50K+</StatNumber>
                <StatLabel>Active Learners</StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber>500+</StatNumber>
                <StatLabel>Expert Courses</StatLabel>
              </StatBox>
              <StatBox>
                <StatNumber>95%</StatNumber>
                <StatLabel>Success Rate</StatLabel>
              </StatBox>
            </StatsGrid>
          </HeroContent>
        </ContentWrapper>
      </HeroSection>

      <FeaturesSection>
        <ContentWrapper>
          <SectionTitle level={2}>Why Choose Us</SectionTitle>
          <SectionSubtitle>
            Everything you need to accelerate your learning journey
          </SectionSubtitle>
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <FeatureCard>
                  <FeatureIconWrapper>
                    {feature.icon}
                  </FeatureIconWrapper>
                  <FeatureTitle level={4}>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureCard>
              </Col>
            ))}
          </Row>
        </ContentWrapper>
      </FeaturesSection>

      <BenefitsSection>
        <ContentWrapper>
          <SectionTitle level={2}>What You Get</SectionTitle>
          <SectionSubtitle>
            Comprehensive tools and resources at your fingertips
          </SectionSubtitle>
          <BenefitsGrid>
            {benefits.map((benefit, index) => (
              <BenefitItem key={index}>
                <BenefitIcon>
                  <CheckCircleFilled />
                </BenefitIcon>
                <BenefitText>{benefit}</BenefitText>
              </BenefitItem>
            ))}
          </BenefitsGrid>
        </ContentWrapper>
      </BenefitsSection>
    </HomeContainer>
  );
};

export default Index;