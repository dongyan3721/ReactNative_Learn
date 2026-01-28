export interface User {
    userId: number;
    email: string;
    username?: string;
    avatar?: string;
    createdAt: string;
    isActive: boolean;
    isPremium: boolean;
}

export interface JobCategory {
    categoryId: number;
    categoryName: string;
    categoryCode: string;
    description?: string;
    iconUrl?: string;
    sortOrder: number;
    isActive: boolean;
}

export interface Position {
    positionId: number;
    categoryId: number;
    positionName: string;
    positionCode: string;
    description?: string;
    sortOrder: number;
    isActive: boolean;
}

export interface ExamTopic {
    topicId: number;
    positionId: number;
    topicName: string;
    topicCode: string;
    description?: string;
    sortOrder: number;
    isActive: boolean;
    questionCount?: number;
}

export interface Tag {
    tagId: number;
    tagName: string;
    tagColor?: string;
}

export interface Question {
    questionId: number;
    topicId: number;
    title: string;
    contentMd: string;
    answerMd: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    isPremium: boolean;
    viewCount: number;
    tags?: Tag[];
    isFavorited?: boolean;
}

export interface QuestionListResponse {
    questions: Question[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface AnswerCardItem {
    questionId: number;
    title: string;
    difficulty: string;
    viewCount: number;
    lastViewedAt?: string;
    isViewed: boolean;
}