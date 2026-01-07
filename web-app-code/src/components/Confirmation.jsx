import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { IoWarningOutline } from "react-icons/io5";

const { Text, Title } = Typography;

const Confirmation = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={440}
      closable={false}
      maskStyle={{ 
        backgroundColor: 'rgba(25, 33, 61, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
      bodyStyle={{ 
        backgroundColor: '#f8fafc',
        padding: '40px 32px',
        borderRadius: '22px'
      }}
      destroyOnClose
    >
      <div style={{ textAlign: 'center' }}>
        {/* Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 24px',
          backgroundColor: '#f8fafc',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #e5e7eb'
        }}>
            <IoWarningOutline 
              style={{
                fontSize: '35px',
              }}
            />
        </div>

        {/* Title */}
        <Title 
          level={4} 
          style={{ 
            fontSize: '30px',
            fontWeight: 600,
            color: '#19213D',
            marginBottom: '12px',
            lineHeight: '130%',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Confirm Logout
        </Title>

        {/* Description */}
        <Text style={{ 
          fontSize: '14px',
          color: '#565C72',
          display: 'block',
          marginBottom: '32px',
          lineHeight: '150%',
          fontFamily: "'Inter', sans-serif",
        }}>
          Are you sure you want to log out? You'll need to sign in again to access your account.
        </Text>

        {/* Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '12px' 
        }}>
          <Button 
            onClick={onCancel}
            style={{ 
              minWidth: '120px',
              height: '42px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '6px',
              border: '2px solid #e5e7eb',
              color: '#323A57',
              backgroundColor: '#FFFFFF',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.borderColor = '#b6b9bcff';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
          >
            Cancel
          </Button>
          <Button 
            type="primary"
            onClick={onConfirm}
            style={{ 
              minWidth: '120px',
              height: '42px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '6px',
              backgroundColor: '#2D5CA0',
              border: 'none',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(38, 46, 147, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2D5CA0';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(38, 46, 147, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2D5CA0';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(38, 46, 147, 0.4)';
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
          >
            Log Out
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Confirmation;