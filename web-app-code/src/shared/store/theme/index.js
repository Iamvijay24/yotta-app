// theme/index.js 
export const theme = {
  colors: {
    // Primary Colors
    primary: '#2388ff',
    primaryHover: '#1d6fd8',
    primaryLight: '#60a5fa',
    primaryDark: '#1c55ff',
   
    // Secondary Colors
    secondary: '#2b7af5',
    secondaryHover: '#2563eb',
   
    // Success/Enrolled States
    success: '#3fbeab',
    successHover: '#34c9a7',
    successLight: '#a8fdf0ff',
   
    // Status Colors
    warning: '#fbbf24',
    error: '#ef4444',
    info: '#3b82f6',
   
    // Background Colors
    background: '#FFFFFF',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f9fafb',
    backgroundMuted: '#F8F8F8',
   
    // Surface Colors
    surface: '#FFFFFF',
    surfaceHover: '#f8f9fa',
    surfaceGray: '#bac2caff',
   
    // Border Colors
    border: '#e5e7eb',
    borderLight: '#F0F2F5',
    borderDark: '#d1d5db',
    borderHover: '#e0e0e0',  
   
    // Text Colors
    textPrimary: '#19213D',  
    textSecondary: '#323A57',
    textTertiary: '#565C72',
    textMuted: '#6b7280',
    textLight: '#8A91A8',
    textLighter: '#93989A',
    textVeryLight: '#666f8d',
   
    // Stat Card Background Colors
    statBlue: '#a9c7f7ff',
    statPurple: '#cab5fbff',
    statYellow: '#fce0afff',
    statTeal: '#a8fdf0ff',
   
    // Rating/Star Color
    star: '#FFA500',
    starYellow: '#fbbf24',
   
    // Icon Colors
    iconPrimary: '#323A57',
    iconSecondary: '#565C72',
   
    // Gradient Colors
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      blue: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      indigo: 'linear-gradient(135deg, #1c55ff 0%, #1d4ed8 100%)',
      userAvatar: 'linear-gradient(135deg, #1c55ffff, #1d4ed8)',
      glass: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
    },
  },
  fonts: {
    // Single font family for entire application
    family: "'Inter', sans-serif",
   
    // Font weights used across the application
    weights: {
      extraLight: 200,
      light: 400,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
    },
   
    // Font sizes used in the application
    sizes: {
      // Tiny sizes
      xxs: '10px',      // CategoryBadge
      xs: '11px',       // ByText, Author, StatTitle, StatValue, RecommendedAuthor
      
      // Small sizes
      statLabel: '12.5px',  // StatLabel (added to match original)
      sm: '12px',       // StatLabel, Description, Rating, LessonDuration, LectureSection
      base: '13px',     // BrowseButton, LessonName, RecommendedDescription, EnrollButton
      
      // Medium sizes
      md: '14px',       // InfoItem labels, AuthorName, RequirementList
      lg: '15px',       // Title, RecommendedTitle, SectionTitle, RequirementsTitle
      
      // Large sizes
      xl: '16px',       // EnrollBtn
      '2xl': '18px',    // SectionTitle
      '3xl': '19px',    // StatValue
      '4xl': '20px',    // PriceCurrent, PriceOriginal
      '5xl': '22px',    // PageTitle
      
      // Heading sizes
      h1: '28px',       // CourseTitle
      h2: '24px',       // Mobile CourseTitle
    },
   
    // Line heights
    lineHeights: {
      tight: '130%',
      normal: '140%',
      relaxed: '150%',
    },

    
    letterSpacings: {
      small: '0.5px',   
    },
  },
  shadows: {
    // Card shadows
    cardBase: '0 4px 12px rgba(0, 0, 0, 0.08)',
    cardHover: '0 8px 20px rgba(0, 0, 0, 0.12)', 
    cardRecommended: '0 4px 16px rgba(0, 0, 0, 0.1)',
   
    // Button shadows
    buttonPrimary: '0 4px 6px rgba(59, 130, 246, 0.2)',
    buttonPrimaryHover: '0 6px 8px rgba(59, 130, 246, 0.3)',
    buttonEnroll: '0 4px 12px rgba(43, 122, 251, 0.4)',
    buttonSuccess: '0 4px 12px rgba(63, 190, 171, 0.4)',
   
    // General shadows
    sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
    md: '0 4px 16px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.12)',
    small: '0 1px 3px rgba(0, 0, 0, 0.05)',  
  },
  radii: {
    xs: '4px',        // CategoryBadge, RatingSection
    sm: '6px',        // EnrollButton, InfoItem
    md: '12px',       // VideoThumbnail, AuthorContainer, StyledCollapse items (updated to match original --radius-md)
    lg: '10px',       // CardContainer, FullCourseStats
    xl: '12px',       // RecommendedCard, TocSection
    full: '50%',      // IconWrapper, AuthorAvatar
  },
  spacing: {
    // Gaps
    gapXs: '2px',
    gapSm: '4px',
    gapMd: '8px',
    gapLg: '12px',
    gapXl: '16px',
    gap2xl: '20px',
    gap3xl: '24px',
    gap4xl: '32px',
    gap5xl: '40px',
    gap6xl: '60px',
   
    // Padding
    paddingXs: '3px',
    paddingSm: '8px',
    paddingMd: '16px',
    paddingLg: '20px',
    paddingXl: '24px',
    padding2xl: '32px',
   
    // Margins
    marginXs: '4px',
    marginSm: '8px',
    marginMd: '16px',
    marginLg: '24px',
    marginXl: '32px',
    margin2xl: '40px',
    margin5xl: '40px',  
  },
  transitions: {
    // Transition durations and easings
    fast: 'all 0.15s ease',
    base: 'all 0.3s ease',
    slow: 'all 0.4s ease',
    spring: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
    '2xl': '1400px',
    wide: '1536px',
  },
  components: {
    // Button specific styles
    button: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '42px',
      },
      padding: {
        sm: '3px 10px',
        md: '8px 16px',
        lg: '12px 24px',
      },
    },
   
    // Card specific styles
    card: {
      maxWidth: '350px',
      imageHeight: '162px',
      recommendedImageWidth: '190px',
      recommendedImageHeight: '147px',
    },
   
    // Stat card styles
    statCard: {
      iconSize: '32px',
      iconFontSize: '16px',
    },
   
    // Avatar styles
    avatar: {
      sm: '40px',
      md: '50px',
      lg: '60px',
    },
   
    // Course overview specific
    courseOverview: {
      thumbnailHeight: '361px',
      sidebarWidth: '340px',
      contentWidth: '693px',
      statsContainerWidth: '300px',
    },
  },
  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  // Opacity values
  opacity: {
    disabled: 0.3,
    hover: 0.8,
    active: 0.9,
    full: 1,
  },
};
// Helper function to access nested theme values
export const getThemeValue = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], theme);
};
// Export individual theme sections for easier imports
export const colors = theme.colors;
export const fonts = theme.fonts;
export const shadows = theme.shadows;
export const radii = theme.radii;
export const spacing = theme.spacing;
export const transitions = theme.transitions;
export const breakpoints = theme.breakpoints;
export const components = theme.components;
export default theme;