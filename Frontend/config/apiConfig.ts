import { Platform } from 'react-native';

/**
 * API Configuration
 * 
 * IMPORTANT: For physical devices, you MUST set your computer's IP address below.
 * 
 * How to find your computer's IP address:
 * 
 * Windows:
 *   1. Open Command Prompt
 *   2. Run: ipconfig
 *   3. Look for "IPv4 Address" under your active network adapter
 *   4. Example: 192.168.1.100
 * 
 * macOS/Linux:
 *   1. Open Terminal
 *   2. Run: ifconfig (macOS/Linux) or ip addr (Linux)
 *   3. Look for "inet" or "inet addr" under your active network adapter
 *   4. Example: 192.168.1.100
 * 
 * Make sure your phone/tablet and computer are on the same WiFi network!
 */

// ============================================
// CONFIGURE YOUR IP ADDRESS HERE
// ============================================
// For physical device testing, replace this with your computer's IP address
// Example: '192.168.1.100' or '192.168.2.180'
// Leave empty ('') to use emulator/simulator defaults
// 
// Current IP detected: 192.168.2.180
// To change: Run 'ipconfig' (Windows) or 'ifconfig' (macOS/Linux) and update this value
const PHYSICAL_DEVICE_IP = '192.168.2.180';

// ============================================

/**
 * Get API Base URL based on platform and device type
 * 
 * Logic:
 * - If PHYSICAL_DEVICE_IP is set → Use it (for physical devices)
 * - If PHYSICAL_DEVICE_IP is empty → Use emulator/simulator defaults
 * 
 * To use emulator/simulator: Set PHYSICAL_DEVICE_IP = ''
 * To use physical device: Set PHYSICAL_DEVICE_IP = 'your-computer-ip'
 */
export function getApiBaseUrl(): string {
  if (!__DEV__) {
    // Production URL
    return 'http://your-api-url.com/api/v1';
  }

  // Development mode
  const hasPhysicalDeviceIP = PHYSICAL_DEVICE_IP && PHYSICAL_DEVICE_IP.trim() !== '';

  if (hasPhysicalDeviceIP) {
    // Physical device: use configured IP
    const ip = PHYSICAL_DEVICE_IP.trim();
    console.log('📱 Using physical device IP:', ip);
    return `http://${ip}:8080/api/v1`;
  }

  // Emulator/Simulator: use platform defaults
  const platform = Platform.OS;
  switch (platform) {
    case 'android':
      // Android emulator uses 10.0.2.2 to access host machine's localhost
      console.log('📱 Using Android emulator (10.0.2.2)');
      return 'http://10.0.2.2:8080/api/v1';
    case 'ios':
      // iOS simulator can use localhost directly
      console.log('📱 Using iOS simulator (localhost)');
      return 'http://localhost:8080/api/v1';
    default:
      console.log('📱 Using default (localhost)');
      return 'http://localhost:8080/api/v1';
  }
}

/**
 * Get the current API URL (for debugging)
 */
export function getCurrentApiUrl(): string {
  return getApiBaseUrl();
}

