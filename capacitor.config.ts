import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ARFA APP',
    server: {
      hostname: 'localhost',
    androidScheme: 'http' ,//,
    allowNavigation: [
      "10.0.2.2",
      "192.168.38.66"
    ],
  },
  webDir: 'www'
};

export default config;
