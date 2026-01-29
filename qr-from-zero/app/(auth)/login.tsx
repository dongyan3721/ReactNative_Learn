import React, {ReactNode, useState} from 'react';
import {
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import {useAuth} from "@/contexts/AuthContext";
import {Toast, ToastTitle, useToast} from "@/components/ui/toast";
import {Box} from "@/components/ui/box";
import {VStack} from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText
} from "@/components/ui/form-control";
import {Input, InputField} from "@/components/ui/input";
import {Button, ButtonText} from "@/components/ui/button";
import {Pressable} from "@/components/ui/pressable";
import {Heading} from "@/components/ui/heading";
import {HStack} from "@/components/ui/hstack";



export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {isLoading, login} = useAuth();

  const toast = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
            <Toast nativeID={id} action="error" variant="solid">
              <ToastTitle>请输入邮箱和密码</ToastTitle>
            </Toast>
        ),
      });
      return;
    }

    try {
      await login({ email, password });
    } catch (err: any) {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
            <Toast nativeID={id} action="error" variant="solid">
              <ToastTitle>{err}</ToastTitle>
            </Toast>
        ),
      });
    }
  };

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
      >
        <Box className="flex-1 bg-white dark:bg-gray-900 px-1.5">
          <Center className="flex-1">
            <VStack space="xl" className="w-full max-w-xl">
              <VStack space="xs">
                <Heading size="3xl" className="text-primary-900 dark:text-primary-100">
                  欢迎回来
                </Heading>
                <Text className="text-lg text-gray-600 dark:text-gray-400">
                  登录开始刷题之旅
                </Text>
              </VStack>

              <VStack space="md" className="w-full">
                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText className="text-gray-700 dark:text-gray-300">
                      邮箱地址
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input
                      variant="outline"
                      size="lg"
                      className="border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 bg-white dark:bg-gray-800"
                  >
                    <InputField
                        placeholder="请输入邮箱"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </Input>
                </FormControl>

                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText className="text-gray-700 dark:text-gray-300">
                      密码
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input
                      variant="outline"
                      size="lg"
                      className="border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 bg-white dark:bg-gray-800"
                  >
                    <InputField
                        placeholder="请输入密码"
                        value={password}
                        onChangeText={setPassword}
                        type="password"
                        autoCapitalize="none"
                        className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </Input>
                  <FormControlHelper className="mt-1">
                    <FormControlHelperText className="text-gray-500 dark:text-gray-400 text-xs">
                      密码长度至少8位
                    </FormControlHelperText>
                  </FormControlHelper>
                </FormControl>
              </VStack>

              <Button
                  size="lg"
                  onPress={handleLogin}
                  isDisabled={isLoading}
                  className="bg-primary-700 dark:bg-primary-600 active:bg-primary-600 dark:active:bg-primary-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 w-full"
              >
                <ButtonText className="text-white dark:text-gray-900 font-semibold">
                  {isLoading ? '登录中...' : '登录'}
                </ButtonText>
              </Button>

              {/*/!* 添加分隔线 *!/*/}
              <Box className="relative w-full flex items-center justify-center my-2">
                <Box className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <Text className="px-4 text-sm text-gray-500 dark:text-gray-400">或</Text>
                <Box className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </Box>

              {/*/!* 快速登录选项（可选） *!/*/}
              <HStack space="md" className="w-full justify-center">
                <Pressable className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-800">
                  <Text>G</Text>
                </Pressable>
                <Pressable className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-800">
                  <Text>微</Text>
                </Pressable>
              </HStack>

              <Link href="/(auth)/register" asChild>
                <Pressable className="mt-4">
                  <Text className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-center">
                    {/*这个地方用 transition-colors duration-200 这些动画样式会报错 不知道什么情况*/}
                    还没有账号？立即注册
                  </Text>
                </Pressable>
              </Link>

              {/*<Link href="/(auth)/register" asChild>*/}
              {/*  <Pressable className="mt-4">*/}
              {/*    <Text className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-center transition-colors">*/}
              {/*      还没有账号？立即注册*/}
              {/*    </Text>*/}
              {/*  </Pressable>*/}
              {/*</Link>*/}

              {/* 添加忘记密码链接 */}
              {/*<Link href="/(auth)/forgot-password" asChild>*/}
              {/*  <Pressable>*/}
              {/*    <Text className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-center transition-colors">*/}
              {/*      忘记密码？*/}
              {/*    </Text>*/}
              {/*  </Pressable>*/}
              {/*</Link>*/}
            </VStack>
          </Center>
        </Box>
      </KeyboardAvoidingView>
  );
}