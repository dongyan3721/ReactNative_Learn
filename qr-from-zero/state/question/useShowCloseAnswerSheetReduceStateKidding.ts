import {useReducer} from "react";

export const enum ANSWER_SHEET_ACTION {
    OPEN_ANSWER_SHEET,
    CLOSE_ANSWER_SHEET,
    ANSWER_SHEET_QUESTION_AVATAR_CLICKED
}

export interface AnswerSheetStatesParams {
    showAnswerSheet: boolean;
}

export const answerSheetInitialState: AnswerSheetStatesParams = {
    showAnswerSheet: false
}

export type ShowCloseAnswerSheetReduceStateKiddingAction = | {
    type: ANSWER_SHEET_ACTION.CLOSE_ANSWER_SHEET;
    payload: {showAnswerSheet: boolean};
} | {
    type: ANSWER_SHEET_ACTION.ANSWER_SHEET_QUESTION_AVATAR_CLICKED;
    payload: {showAnswerSheet: boolean};
} | {
    type: ANSWER_SHEET_ACTION.OPEN_ANSWER_SHEET;
}

export const answerSheetReducer = (state: AnswerSheetStatesParams, action: ShowCloseAnswerSheetReduceStateKiddingAction) =>{
    switch (action.type) {

        case ANSWER_SHEET_ACTION.CLOSE_ANSWER_SHEET:

            return {
                ...state,
                showAnswerSheet: action.payload.showAnswerSheet
            }

        case ANSWER_SHEET_ACTION.OPEN_ANSWER_SHEET:
            return {
                ...state,
                showAnswerSheet: true
            }
        case ANSWER_SHEET_ACTION.ANSWER_SHEET_QUESTION_AVATAR_CLICKED:
            return {
                ...state,
                showAnswerSheet: action.payload.showAnswerSheet
            }
        default:
            return state;
    }
}

// clwy的写法适合这个reducer有依赖一些东西的时候（下面函数的函数参数列表里面写着一些依赖）


