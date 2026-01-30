import React from "react";
import {Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader} from "@/components/ui/modal";
import {X} from "lucide-react-native";
import {Heading} from "@/components/ui/heading";
import {HStack} from "@/components/ui/hstack";
import {Pressable} from "@/components/ui/pressable";
import {Box} from "@/components/ui/box";
import {Text} from "@/components/ui/text";
import {Divider} from "@/components/ui/divider";
import {AnswerCardItem} from "@/types";

interface Props  {
    visible: boolean;
    answerCard: AnswerCardItem[];
    currentIndex: number;
    onCloseAnswerSheet: (visible: boolean) => void;
    onPressQuestionOrder: (currentIndex: number, visible: boolean) => void;
}


export const  AnswerSheet : React.FC<Props> = ({
    visible, answerCard, currentIndex, onCloseAnswerSheet, onPressQuestionOrder
                                                })=>{


    return (
        <Modal isOpen={visible} onClose={()=>{onCloseAnswerSheet(false)}}>
            <ModalBackdrop />
            <ModalContent className="max-h-full">
                <ModalHeader>
                    <Heading size="lg">答题卡</Heading>
                    <ModalCloseButton>
                        <X size={24} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <HStack className="flex-wrap gap-2 p-2">
                        {answerCard.map((item, idx) => (
                            <Pressable
                                key={item.questionId}
                                onPress={()=>{onPressQuestionOrder(idx, false)}}
                            >
                                <Box className="w-12 h-12 rounded justify-center items-center"
                                     style={{
                                         backgroundColor: idx === currentIndex ? '#1A56DB' : item.isViewed ? '#86EFAC' : '#9CA3AF'
                                     }}
                                >
                                    <Text className="font-bold"
                                          style={{
                                              backgroundColor: idx === currentIndex ? '#FFFFFF' : '#374151',
                                          }}
                                    >
                                        {idx + 1}
                                    </Text>
                                </Box>
                            </Pressable>
                        ))}
                    </HStack>

                    <Divider className="my-4" />

                    <HStack className="justify-center mb-4">
                        <HStack className="items-center" space="xs">
                            <Box className="w-4 h-4 rounded-s bg-green-300"/>
                            <Text size="sm">已浏览</Text>
                        </HStack>
                        <HStack space="xs" className="items-center">
                            <Box className="w-4 h-4 rounded-s bg-gray-700"/>
                            <Text size="sm">当前题</Text>
                        </HStack>
                        <HStack space="xs" className="items-center">
                            <Box className="w-4 h-4 rounded-s bg-orange-200"/>
                            <Text size="sm">未浏览</Text>
                        </HStack>
                    </HStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )

}