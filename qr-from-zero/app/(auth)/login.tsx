import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import {useAuth} from "@/contexts/AuthContext";


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {isLoading, login} = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('错误', '请输入邮箱和密码');
      return;
    }

    try {
      // 登录成功后，_layout.tsx会自动跳转
      await login({ email, password });
    } catch (err: any) {
      Alert.alert('登录失败', err);
    }
  };

  return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>欢迎回来</Text>
          <Text style={styles.subtitle}>登录开始刷题之旅</Text>

          <TextInput
              style={styles.input}
              placeholder="邮箱地址"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
          />

          <TextInput
              style={styles.input}
              placeholder="密码"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
          />

          <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? '登录中...' : '登录'}
            </Text>
          </TouchableOpacity>

          <Link href="/(auth)/register" asChild>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>还没有账号？立即注册</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 15,
  },
});