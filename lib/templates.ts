// Template definitions based on gallery examples
export interface PropertyTemplate {
  name: string;
  description: string;
  hasTimeData: boolean; // Whether this template is designed for time-series data
  config: Record<string, string>;
}

export const PROPERTY_TEMPLATES: PropertyTemplate[] = [
  {
    name: 'Default',
    description: 'Clean and simple - good starting point',
    hasTimeData: false,
    config: {
      'colors.scheme': 'Default',
      'colors.darkMode': 'no',
      'animate.flows': 'no',
      'clustering': 'yes',
      'fadeAmount': '45',
      'baseMapOpacity': '75',
    },
  },
  {
    name: 'Dark Teal',
    description: 'Dark basemap with teal color scheme',
    hasTimeData: false,
    config: {
      'colors.scheme': 'Teal',
      'colors.darkMode': 'yes',
      'animate.flows': 'no',
      'clustering': 'yes',
      'fadeAmount': '45',
      'baseMapOpacity': '75',
    },
  },
  {
    name: 'Animated Sunset',
    description: 'Vibrant sunset colors with flowing animation',
    hasTimeData: false,
    config: {
      'colors.scheme': 'Sunset',
      'colors.darkMode': 'yes',
      'animate.flows': 'yes',
      'clustering': 'no',
      'fadeAmount': '24',
      'baseMapOpacity': '75',
    },
  },
  {
    name: 'Scientific Viridis',
    description: 'Perceptually uniform color scheme for scientific data',
    hasTimeData: false,
    config: {
      'colors.scheme': 'Viridis',
      'colors.darkMode': 'yes',
      'animate.flows': 'no',
      'clustering': 'yes',
      'fadeAmount': '45',
      'baseMapOpacity': '75',
    },
  },
  {
    name: 'Warm Magma',
    description: 'Hot lava-like colors for high-intensity flows',
    hasTimeData: false,
    config: {
      'colors.scheme': 'Magma',
      'colors.darkMode': 'yes',
      'animate.flows': 'no',
      'clustering': 'yes',
      'fadeAmount': '45',
      'baseMapOpacity': '75',
    },
  },
  {
    name: 'Cool Blues',
    description: 'Calm blue palette on light background',
    hasTimeData: false,
    config: {
      'colors.scheme': 'Blues',
      'colors.darkMode': 'no',
      'animate.flows': 'no',
      'clustering': 'yes',
      'fadeAmount': '50',
      'baseMapOpacity': '75',
    },
  },
  // Time-series templates
  {
    name: 'Time-Series: Daily Flow',
    description: '⏱️ Daily time-series with timeline controls',
    hasTimeData: true,
    config: {
      'colors.scheme': 'Default',
      'colors.darkMode': 'yes',
      'animate.flows': 'yes',
      'clustering': 'yes',
      'fadeAmount': '50',
      'baseMapOpacity': '75',
    },
  },
  {
    name: 'Time-Series: Hourly Animation',
    description: '⏱️ Hourly data with auto-play animation',
    hasTimeData: true,
    config: {
      'colors.scheme': 'Sunset',
      'colors.darkMode': 'yes',
      'animate.flows': 'yes',
      'clustering': 'no',
      'fadeAmount': '35',
      'baseMapOpacity': '65',
    },
  },
];
