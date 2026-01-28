// @ts-ignore
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import {useAuth} from "@/contexts/AuthContext";

export default function ProfileScreen() {
    const {logout, user} = useAuth();

    const handleLogout = () => {
        Alert.alert('退出登录', '确定要退出吗？', [
            {text: '取消', style: 'cancel'},
            {
                text: '确定',
                style: 'destructive',
                onPress: () => logout(),
            },
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            {/* 用户信息卡片 */}
            <View style={styles.userCard}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.email?.charAt(0).toUpperCase() || '?'}
                    </Text>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>
                        {user?.username || '未设置昵称'}
                    </Text>
                    <Text style={styles.email}>{user?.email}</Text>
                    {user?.isPremium && (
                        <View style={styles.premiumBadge}>
                            <Text style={styles.premiumText}>高级会员</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* 功能列表 */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>学习</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuIcon}>📊</Text>
                    <Text style={styles.menuText}>学习统计</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuIcon}>📝</Text>
                    <Text style={styles.menuText}>学习记录</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuIcon}>🏆</Text>
                    <Text style={styles.menuText}>成就徽章</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>设置</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuIcon}>🎯</Text>
                    <Text style={styles.menuText}>切换工作大类</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuIcon}>👤</Text>
                    <Text style={styles.menuText}>编辑资料</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuIcon}>⚙️</Text>
                    <Text style={styles.menuText}>通用设置</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>其他</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuIcon}>❓</Text>
                    <Text style={styles.menuText}>帮助与反馈</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuIcon}>ℹ️</Text>
                    <Text style={styles.menuText}>关于我们</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
            </View>

            {/* 退出登录按钮 */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>退出登录</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Version 1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    userCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    premiumBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    premiumText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    section: {
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F8F9FA',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    menuIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#1a1a1a',
    },
    menuArrow: {
        fontSize: 24,
        color: '#ccc',
        fontWeight: '300',
    },
    logoutButton: {
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#999',
    },
});