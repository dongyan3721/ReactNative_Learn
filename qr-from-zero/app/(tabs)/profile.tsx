import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';

const MenuItem = ({ icon, text, onPress }: { icon: string; text: string; onPress?: () => void }) => (
    <Pressable onPress={onPress} className="active:bg-gray-100 dark:active:bg-gray-800">
        <HStack space="md" className="items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-2xl">{icon}</Text>
            <Text className="flex-1 text-base text-gray-900 dark:text-gray-100">{text}</Text>
            <Text className="text-2xl text-gray-400 dark:text-gray-500 font-light">›</Text>
        </HStack>
    </Pressable>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <VStack className="mb-4">
        <Box className="px-4 py-3 bg-gray-50 dark:bg-gray-800">
            <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</Text>
        </Box>
        <Box className="bg-white dark:bg-gray-900">
            {children}
        </Box>
    </VStack>
);

export default function ProfileScreen() {
    const { logout, user } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        logout();
    };

    return (
        <>
            <ScrollView className="flex-1 bg-gray-100 dark:bg-black">
                {/* User Info Card */}
                <Box className="bg-white dark:bg-gray-900 p-5 mb-4">
                    <HStack space="md" className="items-center">
                        <Center className="w-16 h-16 rounded-full bg-primary-500">
                            <Heading size="2xl" className="text-white">
                                {user?.email?.charAt(0).toUpperCase() || '?'}
                            </Heading>
                        </Center>
                        <VStack>
                            <Heading size="lg" className="text-gray-900 dark:text-gray-100">
                                {user?.username || '未设置昵称'}
                            </Heading>
                            <Text className="text-gray-600 dark:text-gray-400">{user?.email}</Text>
                            {user?.isPremium && (
                                <Badge size="sm" action="warning" variant="solid" className="mt-2 self-start">
                                    <BadgeText>高级会员</BadgeText>
                                </Badge>
                            )}
                        </VStack>
                    </HStack>
                </Box>

                <Section title="学习">
                    <MenuItem icon="📊" text="学习统计" />
                    <MenuItem icon="📝" text="学习记录" />
                    <MenuItem icon="🏆" text="成就徽章" />
                </Section>

                <Section title="设置">
                    <MenuItem icon="🎯" text="切换工作大类" />
                    <MenuItem icon="👤" text="编辑资料" />
                    <MenuItem icon="⚙️" text="通用设置" />
                </Section>

                <Section title="其他">
                    <MenuItem icon="❓" text="帮助与反馈" />
                    <MenuItem icon="ℹ️" text="关于我们" />
                </Section>

                {/* Logout Button */}
                <Box className="px-4 py-4">
                     <Button
                        variant="solid"
                        action="negative"
                        onPress={handleLogout}
                        >
                        <ButtonText>退出登录</ButtonText>
                    </Button>
                </Box>


                {/* Footer */}
                <Center className="py-5">
                    <Text className="text-xs text-gray-400 dark:text-gray-600">Version 1.0.0</Text>
                </Center>
            </ScrollView>

            {/* Logout Confirmation Modal */}
            <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading>退出登录</Heading>
                        <ModalCloseButton>
                           <Text>X</Text>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Text>确定要退出吗？</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" size="sm" action="secondary" className="mr-3" onPress={() => setShowLogoutModal(false)}>
                            <ButtonText>取消</ButtonText>
                        </Button>
                        <Button size="sm" action="negative" onPress={confirmLogout}>
                            <ButtonText>确定</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}