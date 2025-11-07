const theme = {
  token: {
    // Primary Colors
    colorPrimary: '#0F95DA',
    colorInfo: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    
    // Neutral Colors
    colorTextBase: '#374151',
    colorTextSecondary: '#6b7280',
    colorTextTertiary: '#9ca3af',
    colorTextQuaternary: '#d1d5db',
    
    // Background Colors
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#f8fafc',
    colorBgLayout: '#f8fafc',
    colorBgSpotlight: '#f1f5f9',
    
    // Border Colors
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    
    // Typography
    fontSize: 14,
    fontSizeHeading1: 28,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 18,
    fontSizeXXL: 20,
    
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeightStrong: 600,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
    
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,
    
    // Border Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,
    
    // Box Shadow
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    boxShadowTertiary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    
    // Animation
    motionDurationSlow: '0.3s',
    motionDurationMid: '0.2s',
    motionDurationFast: '0.1s',
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    motionEaseIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  },
  
  components: {
    Layout: {
      bodyBg: '#f8fafc',
      headerBg: '#ffffff',
      siderBg: '#ffffff',
    },
    
    Table: {
      headerBg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      headerColor: '#374151',
      headerSortActiveBg: '#f1f5f9',
      headerSortHoverBg: '#f8fafc',
      rowHoverBg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderColor: '#f1f5f9',
      headerBorderRadius: 0,
      cellPaddingBlock: 16,
      cellPaddingInline: 12,
    },
    
    Button: {
      borderRadius: 12,
      fontWeight: 600,
      paddingInline: 16,
      paddingBlock: 8,
      primaryShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      defaultShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      dangerShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    },
    
    Input: {
      borderRadius: 12,
      paddingInline: 12,
      paddingBlock: 8,
      borderColor: '#e2e8f0',
      hoverBorderColor: '#3b82f6',
      activeBorderColor: '#3b82f6',
      activeShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    
    Select: {
      borderRadius: 12,
      paddingInline: 12,
      paddingBlock: 8,
      borderColor: '#e2e8f0',
      hoverBorderColor: '#3b82f6',
      activeBorderColor: '#3b82f6',
      activeShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    
    Card: {
      borderRadius: 16,
      paddingLG: 24,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      headerBg: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    },
    
    Tag: {
      borderRadius: 8,
      paddingInline: 12,
      paddingBlock: 4,
      fontWeight: 500,
    },
    
    Pagination: {
      borderRadius: 8,
      itemActiveBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      itemActiveColorDisabled: '#ffffff',
      itemBg: '#ffffff',
      itemInputBg: '#ffffff',
      itemLinkBg: '#ffffff',
      itemSize: 32,
    },
    
    Checkbox: {
      borderRadius: 6,
      borderWidth: 2,
      size: 18,
    },
    
    Modal: {
      borderRadius: 16,
      paddingLG: 24,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    
    Drawer: {
      borderRadius: 16,
      paddingLG: 24,
    },
    
    Tooltip: {
      borderRadius: 8,
      paddingInline: 12,
      paddingBlock: 8,
    },
    
    Dropdown: {
      borderRadius: 12,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  },
};

export default theme;
