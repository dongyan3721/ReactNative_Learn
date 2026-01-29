import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    Dimensions,
} from 'react-native';
import { AnswerCardItem } from '@/types';

const { width, height } = Dimensions.get('window');

interface Props {
    visible: boolean;
    answerCard: AnswerCardItem[];
    currentIndex: number;
    onClose: () => void;
    onSelectQuestion: (index: number) => void;
}

export const AnswerSheet: React.FC<Props> = ({
                                                 visible,
                                                 answerCard,
                                                 currentIndex,
                                                 onClose,
                                                 onSelectQuestion,
                                             }) => {
    const renderItem = ({ item, index }: { item: AnswerCardItem; index: number }) => {
        const isActive = index === currentIndex;
        const isViewed = item.isViewed;

        return (
            <TouchableOpacity
                style={[
                    styles.answerItem,
                    isActive && styles.activeItem,
                    isViewed && styles.viewedItem,
                ]}
                onPress={() => {
                    onSelectQuestion(index);
                    onClose();
                }}
            >
                <Text style={[styles.answerNumber, isActive && styles.activeText]}>
                    {index + 1}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>答题卡</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>关闭</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, styles.viewedItem]} />
                            <Text style={styles.legendText}>已浏览</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, styles.activeItem]} />
                            <Text style={styles.legendText}>当前题</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={styles.legendDot} />
                            <Text style={styles.legendText}>未浏览</Text>
                        </View>
                    </View>

                    <FlatList
                        data={answerCard}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.questionId.toString()}
                        numColumns={5}
                        contentContainerStyle={styles.gridContainer}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: height * 0.7,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    closeButton: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: '#F8F8F8',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 20,
        height: 20,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginRight: 6,
    },
    legendText: {
        fontSize: 13,
        color: '#666',
    },
    gridContainer: {
        padding: 20,
    },
    answerItem: {
        width: (width - 80) / 5,
        height: 50,
        margin: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewedItem: {
        backgroundColor: '#C8E6C9',
    },
    activeItem: {
        backgroundColor: '#007AFF',
    },
    answerNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    activeText: {
        color: '#fff',
    },
});