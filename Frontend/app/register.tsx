import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiClient } from '../services/api';
import { Gender } from '@/types';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
  });
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<Gender | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate password according to backend requirements
    if (formData.password.length < 6 || formData.password.length > 20) {
      Alert.alert('Error', 'Password must be between 6 and 20 characters');
      return;
    }

    // Check password requirements: at least one uppercase, one lowercase, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(formData.password)) {
      Alert.alert(
        'Error',
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      );
      return;
    }

    // Validate name
    const trimmedName = formData.name.trim();
    if (trimmedName.length < 2) {
      Alert.alert('Error', 'Name must be at least 2 characters');
      return;
    }

    if (trimmedName.length > 100) {
      Alert.alert('Error', 'Name must not exceed 100 characters');
      return;
    }

    // Validate name pattern: only letters and spaces (Vietnamese characters allowed)
    const namePattern = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!namePattern.test(trimmedName)) {
      Alert.alert('Error', 'Name can only contain letters and spaces');
      return;
    }

    // Validate phone number if provided
    if (formData.mobileNumber && formData.mobileNumber.trim()) {
      const phonePattern = /^[0-9+\-\s()]*$/;
      if (!phonePattern.test(formData.mobileNumber.trim())) {
        Alert.alert('Error', 'Phone number contains invalid characters');
        return;
      }
      if (formData.mobileNumber.trim().length > 15) {
        Alert.alert('Error', 'Phone number must not exceed 15 characters');
        return;
      }
    }

    // Test connection first
    try {
      const healthCheck = await apiClient.testConnection();
      if (!healthCheck) {
        Alert.alert(
          'Lỗi kết nối',
          'Không thể kết nối đến backend server.\n\nVui lòng:\n1. Khởi động backend server\n2. Kiểm tra MySQL đang chạy\n3. Kiểm tra port 8080'
        );
        return;
      }
    } catch (error) {
      console.error('Health check failed:', error);
      // Continue anyway, backend might be starting
    }

    setIsLoading(true);
    try {
      // Prepare request data matching backend RegisterRequest exactly
      // Backend expects: name, email, password, phone (optional), dateOfBirth (optional), gender (optional)
      const registerData: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        dateOfBirth?: string;
        gender?: Gender;
      } = {
        name: trimmedName,
        email: formData.email.trim(),
        password: formData.password,
      };
      
      // Only add phone if it's provided and not empty
      if (formData.mobileNumber && formData.mobileNumber.trim()) {
        registerData.phone = formData.mobileNumber.trim();
      }
      
      // Add dateOfBirth if provided (format as ISO string YYYY-MM-DD)
      if (dateOfBirth) {
        const year = dateOfBirth.getFullYear();
        const month = String(dateOfBirth.getMonth() + 1).padStart(2, '0');
        const day = String(dateOfBirth.getDate()).padStart(2, '0');
        registerData.dateOfBirth = `${year}-${month}-${day}`;
      }
      
      // Add gender if provided
      if (gender) {
        registerData.gender = gender;
      }
      
      console.log('Sending register request:', { ...registerData, password: '***' });
      
      const response = await register(registerData);
      
      console.log('Registration successful:', response);
      
      // Redirect to verify email screen after successful registration
      router.push({
        pathname: '/verify-email',
        params: { email: formData.email.trim() },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = error.message || error.response?.data?.message || 'Registration failed';
      
      // Provide more helpful error messages for network issues
      if (error.message?.includes('Cannot connect to server') || error.code === 'ERR_NETWORK') {
        errorMessage = `Không thể kết nối đến backend server.\n\nVui lòng:\n1. Khởi động backend server:\n   cd Backend\n   gradlew.bat bootRun\n\n2. Kiểm tra MySQL đang chạy\n3. Nếu dùng thiết bị thật, cập nhật IP trong services/api.ts\n\nURL hiện tại: ${error.config?.baseURL || 'Unknown'}`;
      }
      
      Alert.alert('Đăng ký thất bại', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle} />
              <Text style={styles.logoText}>live Green</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Register Now!</Text>
            <Text style={styles.subtitle}>Enter your information below</Text>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                autoCapitalize="words"
                placeholderTextColor="#999"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999"
              />
            </View>

            {/* Mobile Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number"
                value={formData.mobileNumber}
                onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>

            {/* Date of Birth Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.dateInputContainer}>
                  <Text style={[styles.dateText, !dateOfBirth && styles.placeholderText]}>
                    {dateOfBirth ? formatDate(dateOfBirth) : 'Select date of birth'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#999" />
                </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    gender === Gender.MALE && styles.genderOptionSelected,
                  ]}
                  onPress={() => setGender(Gender.MALE)}
                >
                  <View style={[
                    styles.radioButton,
                    gender === Gender.MALE && styles.radioButtonSelected,
                  ]}>
                    {gender === Gender.MALE && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={[
                    styles.genderText,
                    gender === Gender.MALE && styles.genderTextSelected,
                  ]}>
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    gender === Gender.FEMALE && styles.genderOptionSelected,
                  ]}
                  onPress={() => setGender(Gender.FEMALE)}
                >
                  <View style={[
                    styles.radioButton,
                    gender === Gender.FEMALE && styles.radioButtonSelected,
                  ]}>
                    {gender === Gender.FEMALE && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={[
                    styles.genderText,
                    gender === Gender.FEMALE && styles.genderTextSelected,
                  ]}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Registering...' : 'Register'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Already a member? </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8B5CF6',
    borderRightWidth: 0,
    marginRight: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8B5CF6',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#999',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  genderOptionSelected: {
    borderColor: '#8B5CF6',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#8B5CF6',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B5CF6',
  },
  genderText: {
    fontSize: 16,
    color: '#000',
  },
  genderTextSelected: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#000',
  },
  loginLink: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
});
