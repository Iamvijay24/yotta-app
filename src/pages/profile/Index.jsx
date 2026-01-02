// pages/profile/Index.jsx (updated - use auth.user for name/email, localStorage for age/phone, update name in Cognito)
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, InputNumber, Card, Row, Col, Avatar, Divider, Space } from 'antd';
import { EditOutlined, SaveOutlined, UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import { useAuth } from '../../shared/api/AuthContext';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  min-height: 100vh;
 
 
 
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const ProfileHeaderCard = styled(Card)`
  margin-top: 24px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  .ant-card-body {
    padding: 0;
  }
`;

const ProfileBanner = styled.div`
  background: #fff;
  padding: 48px 32px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const ProfileAvatar = styled(Avatar)`
  background-color: #1890ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ProfileTitle = styled(Title)`
  margin-top: 16px !important;
  margin-bottom: 4px !important;
  color: #262626;
`;

const ProfileEmail = styled(Text)`
  color: #8c8c8c;
  font-size: 15px;
`;

const EditButton = styled(Button)`
  margin-top: 24px;
  height: 40px;
  padding: 0 32px;
  border-radius: 8px;
  font-weight: 500;
`;

const FormSection = styled.div`
  padding: 40px 32px;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const EditModeAlert = styled.div`
  background: #e6f7ff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 32px;
  border: 1px solid #91d5ff;
`;

const SectionTitle = styled(Title)`
  margin-bottom: 24px !important;
  color: #262626;
  font-size: 18px !important;
`;

const FormItem = styled(Form.Item)`
  .ant-form-item-label > label {
    font-size: 14px;
    font-weight: 500;
    color: #595959;
  }

  .ant-input,
  .ant-input-number {
    border-radius: 8px;
    font-size: 15px;

    &:hover {
      border-color: #40a9ff;
    }

    &:focus {
      border-color: #40a9ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }

  .ant-input-number {
    width: 100%;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 40px;
`;

const CancelButton = styled(Button)`
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
`;

const SaveButton = styled(Button)`
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
`;

const InfoCard = styled(Card)`
  margin-top: 24px;
  margin-bottom: 24px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .ant-card-body {
    padding: 24px;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 100px 20px;
  color: #595959;
  font-size: 16px;
`;

const Index = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user: authUser, updateAttributes, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchUserData = () => {
      try {
        if (authLoading || !authUser) {
          setLoading(true);
          return;
        }
        const storedExtra = localStorage.getItem('userExtra') ? JSON.parse(localStorage.getItem('userExtra')) : {};
        const fullData = {
          name: authUser.name || '',
          email: authUser.email || '',
          age: storedExtra.age || '',
          phone: storedExtra.phone || '',
        };
        setUserData(fullData);
        form.setFieldsValue(fullData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        message.error('Failed to load profile data.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser, authLoading, form, navigate]);

  const handleSave = async (values) => {
    try {
      const nameChanged = values.name !== userData.name;
      if (nameChanged) {
        const attributeList = [
          {
            Name: 'given_name',
            Value: values.name,
          },
        ];
        await updateAttributes(attributeList);
      }

      // Save extra fields to localStorage
      const extraData = {
        age: values.age || '',
        phone: values.phone || '',
      };
      localStorage.setItem('userExtra', JSON.stringify(extraData));

      setUserData(values);
      setIsEditing(false);
      message.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      message.error('Failed to update profile.');
    }
  };

  const breadcrumbItems = [
    { title: 'Profile' }
  ];

  if (loading || authLoading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <BreadcrumbComponent items={breadcrumbItems} />
          <LoadingContainer>Loading profile...</LoadingContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <BreadcrumbComponent items={breadcrumbItems} />
       
        <ProfileHeaderCard>
          <ProfileBanner>
            <ProfileAvatar size={100} icon={<UserOutlined />} />
            <ProfileTitle level={2}>
              {userData?.name || 'User Name'}
            </ProfileTitle>
           
           
            {!isEditing && (
              <EditButton
                type="primary"
                icon={<EditOutlined />}
                size="large"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </EditButton>
            )}
          </ProfileBanner>

          <FormSection>
            {isEditing && (
              <EditModeAlert>
                <Text style={{ color: '#1890ff', fontWeight: '500' }}>
                  <EditOutlined /> You are now in edit mode. Make your changes and click Save.
                </Text>
              </EditModeAlert>
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              disabled={!isEditing}
            >
              <SectionTitle level={4}>Personal Information</SectionTitle>
             
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={24} md={12}>
                  <FormItem
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please input your full name!' }]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Enter your full name"
                      size="large"
                    />
                  </FormItem>
                </Col>
               
                <Col xs={24} sm={24} md={12}>
                  <FormItem
                    name="age"
                    label="Age"
                    rules={[
                      { type: 'number', min: 13, max: 120, message: 'Age must be between 13 and 120' }
                    ]}
                  >
                    <InputNumber
                      min={13}
                      max={120}
                      prefix={<CalendarOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Enter your age"
                      size="large"
                    />
                  </FormItem>
                </Col>
              </Row>

              <Divider style={{ margin: '32px 0' }} />

              <SectionTitle level={4}>Contact Information</SectionTitle>

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={24} md={12}>
                  <FormItem
                    name="email"
                    label="Email Address"
                    rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
                  >
                    <Input
                      prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Enter your email"
                      size="large"
                    />
                  </FormItem>
                </Col>
               
                <Col xs={24} sm={24} md={12}>
                  <FormItem
                    name="phone"
                    label="Phone Number"
                    rules={[]}
                  >
                    <Input
                      prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Enter your phone number"
                      size="large"
                    />
                  </FormItem>
                </Col>
              </Row>

              {isEditing && (
                <ButtonGroup>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <CancelButton
                        size="large"
                        block
                        onClick={() => {
                          setIsEditing(false);
                          form.setFieldsValue(userData);
                        }}
                      >
                        Cancel
                      </CancelButton>
                    </Col>
                    <Col xs={24} sm={12}>
                      <SaveButton
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        size="large"
                        block
                      >
                        Save Changes
                      </SaveButton>
                    </Col>
                  </Row>
                </ButtonGroup>
              )}
            </Form>
          </FormSection>
        </ProfileHeaderCard>

        <InfoCard>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
              Last updated: {new Date().toLocaleDateString()}
            </Text>
            <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
              Your profile information is stored securely and can be updated anytime.
            </Text>
          </Space>
        </InfoCard>
      </ContentWrapper>
    </PageContainer>
  );
};

export default Index;