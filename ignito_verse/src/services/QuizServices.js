/**
 * QUIZ SERVICES (StudentMicrocredentialQuiz API Services)
 * 
 * Provides clean, end-to-end API service methods and standardized DTO input/output handling
 * for the Student Microcredential Quiz flow without exposing proxy or encryption boilerplate.
 * 
 * APIs Covered:
 * 1.  Check Student Quiz Attempt Status (MicrocredentialQuizChekStudentMicrocredentialQuizAttempts)
 * 2.  Get Student Attempt List (GetMicrocredentialQuizStudentAttemptList)
 * 3.  Get Quiz Preview Data (GetStudentMicroQuizByMicrocredentialCourseId)
 * 4.  Get Existing Attempt by ID (MicrocredentialQuizAttemptGetById)
 * 5.  Auto-Save Timer Periodic (MicrocredentialQuizAttemptSave)
 * 6.  Save Single Question Answer / Attempt Answers (MicrocredentialQuizAttemptSave)
 * 7.  Auto-Submit Quiz on Timer Expiry (MicrocredentialQuizStudentFinalSubmit)
 * 8.  Manual Quiz Submission (MicrocredentialQuizStudentFinalSubmit)
 * 9.  Mark All Attempts as Done (MicrocredentialQuizUpdateAllAttemptDone)
 * 10. Get Quiz Result by Quiz ID (GetStudentMicrocredentialQuizResultGetByQuizId)
 * 11. Upload File / Audio / Video Attachment (CommonUploadFile)
 */

import { apiClient } from './apiClient';
import { getLoggedInStudentId } from './microcredentialService';

// Input DTO Builders
import { buildMicrocredentialQuizChekStudentMicrocredentialQuizAttemptsInput } from '../dto/input/microcredentialQuizChekStudentMicrocredentialQuizAttemptsInput';
import { buildGetMicrocredentialQuizStudentAttemptListInput } from '../dto/input/getMicrocredentialQuizStudentAttemptListInput';
import { buildGetStudentMicroQuizByMicrocredentialCourseIdInput } from '../dto/input/getStudentMicroQuizByMicrocredentialCourseIdInput';
import { buildMicrocredentialQuizAttemptGetByIdInput } from '../dto/input/microcredentialQuizAttemptGetByIdInput';
import { buildMicrocredentialQuizAttemptSaveInput } from '../dto/input/microcredentialQuizAttemptSaveInput';
import { buildMicrocredentialQuizStudentFinalSubmitInput } from '../dto/input/microcredentialQuizStudentFinalSubmitInput';
import { buildMicrocredentialQuizUpdateAllAttemptDoneInput } from '../dto/input/microcredentialQuizUpdateAllAttemptDoneInput';
import { buildGetStudentMicrocredentialQuizResultGetByQuizIdInput } from '../dto/input/getStudentMicrocredentialQuizResultGetByQuizIdInput';
import { buildCommonUploadFileInput } from '../dto/input/commonUploadFileInput';

// Output DTO Parsers
import { 
    parseMicrocredentialQuizChekStudentMicrocredentialQuizAttemptsOutput, 
    parseMicrocredentialQuizChekStudentMicrocredentialQuizAttemptsErrorOutput 
} from '../dto/output/microcredentialQuizChekStudentMicrocredentialQuizAttemptsOutput';
import { 
    parseGetMicrocredentialQuizStudentAttemptListOutput, 
    parseGetMicrocredentialQuizStudentAttemptListErrorOutput 
} from '../dto/output/getMicrocredentialQuizStudentAttemptListOutput';
import { 
    parseGetStudentMicroQuizByMicrocredentialCourseIdOutput, 
    parseGetStudentMicroQuizByMicrocredentialCourseIdErrorOutput 
} from '../dto/output/getStudentMicroQuizByMicrocredentialCourseIdOutput';
import { 
    parseMicrocredentialQuizAttemptGetByIdOutput, 
    parseMicrocredentialQuizAttemptGetByIdErrorOutput 
} from '../dto/output/microcredentialQuizAttemptGetByIdOutput';
import { 
    parseMicrocredentialQuizAttemptSaveOutput, 
    parseMicrocredentialQuizAttemptSaveErrorOutput 
} from '../dto/output/microcredentialQuizAttemptSaveOutput';
import { 
    parseMicrocredentialQuizStudentFinalSubmitOutput, 
    parseMicrocredentialQuizStudentFinalSubmitErrorOutput 
} from '../dto/output/microcredentialQuizStudentFinalSubmitOutput';
import { 
    parseMicrocredentialQuizUpdateAllAttemptDoneOutput, 
    parseMicrocredentialQuizUpdateAllAttemptDoneErrorOutput 
} from '../dto/output/microcredentialQuizUpdateAllAttemptDoneOutput';
import { 
    parseGetStudentMicrocredentialQuizResultGetByQuizIdOutput, 
    parseGetStudentMicrocredentialQuizResultGetByQuizIdErrorOutput 
} from '../dto/output/getStudentMicrocredentialQuizResultGetByQuizIdOutput';
import { 
    parseCommonUploadFileOutput, 
    parseCommonUploadFileErrorOutput 
} from '../dto/output/commonUploadFileOutput';

// ============================================================================
// QUESTION TYPE CONSTANTS
// ============================================================================
export const QUESTION_TYPES = {
    MULTIPLE_CHOICE: 1,
    TRUE_FALSE: 2,
    FILL_IN_THE_BLANKS: 3,
    MULTI_SELECT: 4,
    MATCHING: 5,
    ORDERING: 6,
    SHORT_ANSWER: 8,
    ARITHMETIC: 9,
    SIGNIFICANT_FIGURES: 10,
    MULTI_SHORT_ANSWER: 11,
    LIKERT_SCALE: 12,
    WRITTEN_RESPONSE: 13
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Resolves valid student ID from input, fallback to session/localStorage.
 * @param {number|string} [studentId=0]
 * @returns {number}
 */
export function resolveStudentId(studentId = 0) {
    const parsed = Number(studentId);
    if (!isNaN(parsed) && parsed > 0) {
        return parsed;
    }
    return getLoggedInStudentId() || 0;
}

// ============================================================================
// 1. CHECK STUDENT'S QUIZ ATTEMPT STATUS
// ============================================================================

/**
 * Checks if the student has already attempted the microcredential quiz.
 * Decides whether to show the attempt list or the quiz preview.
 * 
 * Endpoint: POST /api/StudentMicrocredentialQuizAPI/MicrocredentialQuizChekStudentMicrocredentialQuizAttempts
 * 
 * @param {number|string} microcredentialCourseId - Microcredential Course ID
 * @param {number} [studentId=0] - Student ID (defaults to active logged-in student)
 * @param {number} [educationTypeId=2] - Education Type ID (default 2)
 * @returns {Promise<object>} Parsed response containing `{ success, isSuccess, isAttemptedFlag, quizId, status, message, rawData }`
 */
export async function checkStudentQuizAttemptStatus(microcredentialCourseId, studentId = 0, educationTypeId = 2) {
    try {
        const finalStudentId = resolveStudentId(studentId);
        const finalCourseId = Number(microcredentialCourseId) || 0;

        const inputDto = buildMicrocredentialQuizChekStudentMicrocredentialQuizAttemptsInput(
            finalCourseId,
            finalStudentId,
            educationTypeId
        );

        const response = await apiClient('api/StudentMicrocredentialQuizAPI/MicrocredentialQuizChekStudentMicrocredentialQuizAttempts', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicrocredentialQuizChekStudentMicrocredentialQuizAttemptsErrorOutput(response.data, response.status);
        }

        return parseMicrocredentialQuizChekStudentMicrocredentialQuizAttemptsOutput(response.data, response.status);
    } catch (error) {
        console.error('Error in checkStudentQuizAttemptStatus:', error);
        return parseMicrocredentialQuizChekStudentMicrocredentialQuizAttemptsErrorOutput({ message: error.message }, 500);
    }
}

// Alias for direct backend method naming
export const microcredentialQuizChekStudentMicrocredentialQuizAttempts = checkStudentQuizAttemptStatus;

// ============================================================================
// 2. GET STUDENT'S ATTEMPT LIST
// ============================================================================

/**
 * Fetches the list of all past attempts for a quiz.
 * 
 * Endpoint: POST /api/StudentMicrocredentialQuizAPI/GetMicrocredentialQuizStudentAttemptList
 * 
 * @param {number} quizId - Quiz ID
 * @param {number} [studentId=0] - Student ID (defaults to active logged-in student)
 * @returns {Promise<object>} Parsed response containing `{ success, isSuccess, quizAttemptList, totalAttempts, status, message, rawData }`
 */
export async function getStudentAttemptList(quizId, studentId = 0) {
    try {
        const finalStudentId = resolveStudentId(studentId);
        const finalQuizId = Number(quizId) || 0;

        const inputDto = buildGetMicrocredentialQuizStudentAttemptListInput(finalQuizId, finalStudentId);

        const response = await apiClient('api/StudentMicrocredentialQuizAPI/GetMicrocredentialQuizStudentAttemptList', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetMicrocredentialQuizStudentAttemptListErrorOutput(response.data, response.status);
        }

        return parseGetMicrocredentialQuizStudentAttemptListOutput(response.data, response.status);
    } catch (error) {
        console.error('Error in getStudentAttemptList:', error);
        return parseGetMicrocredentialQuizStudentAttemptListErrorOutput({ message: error.message }, 500);
    }
}

// Alias for direct backend method naming
export const getMicrocredentialQuizStudentAttemptList = getStudentAttemptList;

// ============================================================================
// 3. GET QUIZ PREVIEW DATA (Questions, Options, and Config)
// ============================================================================

/**
 * Fetches complete quiz metadata, all question types, and configuration to render the quiz.
 * 
 * Endpoint: POST /api/StudentMicrocredentialQuizAPI/GetStudentMicroQuizByMicrocredentialCourseId
 * 
 * @param {number|string} microcredentialCourseId - Microcredential Course ID
 * @param {number} [studentId=0] - Student ID (defaults to active logged-in student)
 * @param {number} [educationTypeId=2] - Education Type ID (default 2)
 * @returns {Promise<object>} Parsed quiz structure with all question types and options
 */
export async function getQuizPreviewData(microcredentialCourseId, studentId = 0, educationTypeId = 2) {
    try {
        const finalStudentId = resolveStudentId(studentId);
        const finalCourseId = Number(microcredentialCourseId) || 0;

        const inputDto = buildGetStudentMicroQuizByMicrocredentialCourseIdInput(
            finalCourseId,
            finalStudentId,
            educationTypeId
        );

        const response = await apiClient('api/StudentMicrocredentialQuizAPI/GetStudentMicroQuizByMicrocredentialCourseId', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetStudentMicroQuizByMicrocredentialCourseIdErrorOutput(response.data, response.status);
        }

        return parseGetStudentMicroQuizByMicrocredentialCourseIdOutput(response.data, response.status);
    } catch (error) {
        console.error('Error in getQuizPreviewData:', error);
        return parseGetStudentMicroQuizByMicrocredentialCourseIdErrorOutput({ message: error.message }, 500);
    }
}

// Alias for direct backend method naming
export const getStudentMicroQuizByMicrocredentialCourseId = getQuizPreviewData;

// ============================================================================
// 4. GET EXISTING ATTEMPT BY ID (Resume In-Progress Quiz)
// ============================================================================

/**
 * Fetches a specific attempt's saved answers and timer to resume an in-progress quiz.
 * 
 * Endpoint: POST /api/StudentMicrocredentialQuizAPI/MicrocredentialQuizAttemptGetById
 * 
 * @param {number} attemptId - Attempt ID
 * @param {number} [studentId=0] - Student ID (defaults to active logged-in student)
 * @returns {Promise<object>} Saved attempt state, timer, and question answer arrays
 */
export async function getQuizAttemptById(attemptId, studentId = 0) {
    try {
        const finalStudentId = resolveStudentId(studentId);
        const finalAttemptId = Number(attemptId) || 0;

        const inputDto = buildMicrocredentialQuizAttemptGetByIdInput(finalAttemptId, finalStudentId);

        const response = await apiClient('api/StudentMicrocredentialQuizAPI/MicrocredentialQuizAttemptGetById', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicrocredentialQuizAttemptGetByIdErrorOutput(response.data, response.status);
        }

        return parseMicrocredentialQuizAttemptGetByIdOutput(response.data, response.status);
    } catch (error) {
        console.error('Error in getQuizAttemptById:', error);
        return parseMicrocredentialQuizAttemptGetByIdErrorOutput({ message: error.message }, 500);
    }
}

// Alias for direct backend method naming
export const microcredentialQuizAttemptGetById = getQuizAttemptById;

// ============================================================================
// 5 & 6. SAVE QUIZ ATTEMPT (Periodic Auto-Save Timer & Question Answer Save)
// ============================================================================

/**
 * Saves quiz attempt state, answers, or timer periodically.
 * 
 * Endpoint: POST /api/StudentMicrocredentialQuizAPI/MicrocredentialQuizAttemptSave
 * 
 * @param {object} attemptData - Full attempt payload object
 * @returns {Promise<object>} Parsed response containing `{ success, isSuccess, attemptId, status, message, rawData }`
 */
export async function saveQuizAttempt(attemptData = {}) {
    try {
        const studentId = resolveStudentId(attemptData.studentId || attemptData.StudentId);
        const normalizedData = {
            ...attemptData,
            StudentId: studentId,
            studentId
        };

        const inputDto = buildMicrocredentialQuizAttemptSaveInput(normalizedData);

        const response = await apiClient('api/StudentMicrocredentialQuizAPI/MicrocredentialQuizAttemptSave', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicrocredentialQuizAttemptSaveErrorOutput(response.data, response.status);
        }

        return parseMicrocredentialQuizAttemptSaveOutput(response.data, response.status);
    } catch (error) {
        console.error('Error in saveQuizAttempt:', error);
        return parseMicrocredentialQuizAttemptSaveErrorOutput({ message: error.message }, 500);
    }
}

// Alias for direct backend method naming
export const microcredentialQuizAttemptSave = saveQuizAttempt;

/**
 * Dedicated helper for Periodic Timer Auto-Save (Every 30s).
 * Sends only timer progress without updating question answers.
 * 
 * @param {number} quizId - Quiz ID
 * @param {number} lastActivityTime - Remaining or elapsed time
 * @param {number} [totalTimeAllowed=0] - Total time allowed
 * @param {number} [attemptNumber=0] - Attempt number
 * @param {number} [studentId=0] - Student ID
 * @returns {Promise<object>}
 */
export async function autoSaveQuizTimer(quizId, lastActivityTime, totalTimeAllowed = 0, attemptNumber = 0, studentId = 0) {
    return saveQuizAttempt({
        StudentId: resolveStudentId(studentId),
        QuizId: Number(quizId) || 0,
        TotalTimeAllowed: Number(totalTimeAllowed) || 0,
        LastActivityTime: Number(lastActivityTime) || 0,
        Answers: [],
        BlankAnswers: [],
        MatchingAnswers: [],
        OrderingAnswers: [],
        NumericAnswers: [],
        LikertAnswers: [],
        IsFinalSubmission: false,
        AttemptNumber: Number(attemptNumber) || 0
    });
}

/**
 * Dedicated helper to save an individual question's answer immediately on change.
 * Populates the correct backend array based on question type.
 * 
 * @param {object} params
 * @param {number} params.quizId - Quiz ID
 * @param {number} params.questionId - Question ID
 * @param {number} params.degreeQuestionType - Type constant (1-13)
 * @param {any} params.answerData - The answer payload (e.g. selected option ID, string text, array of blanks, etc.)
 * @param {number} [params.lastActivityTime=0] - Current timer value
 * @param {number} [params.totalTimeAllowed=0] - Total time allowed
 * @param {number} [params.attemptNumber=0] - Attempt number
 * @param {number} [params.studentId=0] - Student ID
 * @returns {Promise<object>}
 */
export async function saveQuestionAnswer({
    quizId,
    questionId,
    degreeQuestionType,
    answerData,
    lastActivityTime = 0,
    totalTimeAllowed = 0,
    attemptNumber = 0,
    studentId = 0
}) {
    const type = Number(degreeQuestionType);
    const qId = Number(questionId);

    const payload = {
        StudentId: resolveStudentId(studentId),
        QuizId: Number(quizId) || 0,
        TotalTimeAllowed: Number(totalTimeAllowed) || 0,
        LastActivityTime: Number(lastActivityTime) || 0,
        Answers: [],
        BlankAnswers: [],
        MatchingAnswers: [],
        OrderingAnswers: [],
        NumericAnswers: [],
        LikertAnswers: [],
        IsFinalSubmission: false,
        AttemptNumber: Number(attemptNumber) || 0
    };

    switch (type) {
        // MCQ / True-False
        case QUESTION_TYPES.MULTIPLE_CHOICE:
        case QUESTION_TYPES.TRUE_FALSE:
            payload.Answers.push({
                QuestionId: qId,
                DegreeQuestionType: type,
                AnswerText: '',
                SelectedOptionIds: String(answerData?.selectedOptionId || answerData || ''),
                TimeSpentInSeconds: Number(answerData?.timeSpentInSeconds || 0)
            });
            break;

        // Multi-Select
        case QUESTION_TYPES.MULTI_SELECT:
            payload.Answers.push({
                QuestionId: qId,
                DegreeQuestionType: type,
                AnswerText: '',
                SelectedOptionIds: Array.isArray(answerData) ? answerData.join(',') : String(answerData?.selectedOptionIds || answerData || ''),
                TimeSpentInSeconds: Number(answerData?.timeSpentInSeconds || 0)
            });
            break;

        // Fill in the Blanks / Short Answer / Multi-Short Answer
        case QUESTION_TYPES.FILL_IN_THE_BLANKS:
        case QUESTION_TYPES.SHORT_ANSWER:
        case QUESTION_TYPES.MULTI_SHORT_ANSWER:
            if (Array.isArray(answerData)) {
                payload.BlankAnswers = answerData.map((b, idx) => ({
                    TempAnswerKey: qId,
                    BlankIndex: b?.blankIndex ?? idx,
                    AnswerText: b?.answerText ?? b?.text ?? String(b || ''),
                    BlankNumber: b?.blankNumber ?? (idx + 1)
                }));
            } else if (typeof answerData === 'object' && answerData !== null) {
                payload.BlankAnswers = [{
                    TempAnswerKey: qId,
                    BlankIndex: answerData.blankIndex ?? 0,
                    AnswerText: answerData.answerText ?? answerData.text ?? '',
                    BlankNumber: answerData.blankNumber ?? 1
                }];
            } else {
                payload.BlankAnswers = [{
                    TempAnswerKey: qId,
                    BlankIndex: 0,
                    AnswerText: String(answerData || ''),
                    BlankNumber: 1
                }];
            }
            break;

        // Matching
        case QUESTION_TYPES.MATCHING:
            if (Array.isArray(answerData)) {
                payload.MatchingAnswers = answerData.map((m, idx) => ({
                    TempAnswerKey: qId,
                    PromptIndex: m?.promptIndex ?? idx,
                    SelectedChoiceId: Number(m?.selectedChoiceId || m?.choiceId || 0)
                }));
            } else {
                payload.MatchingAnswers = [{
                    TempAnswerKey: qId,
                    PromptIndex: answerData?.promptIndex ?? 0,
                    SelectedChoiceId: Number(answerData?.selectedChoiceId || 0)
                }];
            }
            break;

        // Ordering
        case QUESTION_TYPES.ORDERING:
            if (Array.isArray(answerData)) {
                payload.OrderingAnswers = answerData.map((o, idx) => ({
                    TempAnswerKey: qId,
                    ItemIndex: o?.itemIndex ?? idx,
                    ItemValue: o?.itemValue || o?.value || String(o || ''),
                    OriginalItemIndex: o?.originalItemIndex ?? idx
                }));
            }
            break;

        // Arithmetic & Significant Figures
        case QUESTION_TYPES.ARITHMETIC:
        case QUESTION_TYPES.SIGNIFICANT_FIGURES:
            payload.NumericAnswers = [{
                TempAnswerKey: qId,
                NumericValue: Number(answerData?.numericValue ?? answerData?.value ?? answerData ?? 0),
                UnitText: answerData?.unitText || answerData?.unit || '',
                ExponentValue: Number(answerData?.exponentValue ?? 0)
            }];
            break;

        // Likert Scale
        case QUESTION_TYPES.LIKERT_SCALE:
            if (Array.isArray(answerData)) {
                payload.LikertAnswers = answerData.map((l, idx) => ({
                    TempAnswerKey: qId,
                    StatementIndex: l?.statementIndex ?? idx,
                    SelectedScaleValue: Number(l?.selectedScaleValue || l?.value || 0)
                }));
            } else {
                payload.LikertAnswers = [{
                    TempAnswerKey: qId,
                    StatementIndex: answerData?.statementIndex ?? 0,
                    SelectedScaleValue: Number(answerData?.selectedScaleValue || 0)
                }];
            }
            break;

        // Written Response / Default Text Answer
        default:
            payload.Answers.push({
                QuestionId: qId,
                DegreeQuestionType: type,
                AnswerText: typeof answerData === 'string' ? answerData : JSON.stringify(answerData || ''),
                SelectedOptionIds: '',
                TimeSpentInSeconds: Number(answerData?.timeSpentInSeconds || 0)
            });
            break;
    }

    return saveQuizAttempt(payload);
}

// ============================================================================
// 7 & 8. FINAL QUIZ SUBMISSION (Auto Submit / Manual Submit)
// ============================================================================

/**
 * Submits the quiz attempt finally (used both for manual user submission and countdown timer expiry).
 * 
 * Endpoint: POST /api/StudentMicrocredentialQuizAPI/MicrocredentialQuizStudentFinalSubmit
 * 
 * @param {number} attemptId - Attempt ID to finalize
 * @param {number} [studentId=0] - Student ID (defaults to active logged-in student)
 * @returns {Promise<object>} Parsed response containing `{ success, isSuccess, scoreMessage, message, status, rawData }`
 */
export async function submitQuizFinal(attemptId, studentId = 0) {
    try {
        const finalStudentId = resolveStudentId(studentId);
        const finalAttemptId = Number(attemptId) || 0;

        const inputDto = buildMicrocredentialQuizStudentFinalSubmitInput(finalAttemptId, finalStudentId);

        const response = await apiClient('api/StudentMicrocredentialQuizAPI/MicrocredentialQuizStudentFinalSubmit', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicrocredentialQuizStudentFinalSubmitErrorOutput(response.data, response.status);
        }

        return parseMicrocredentialQuizStudentFinalSubmitOutput(response.data, response.status);
    } catch (error) {
        console.error('Error in submitQuizFinal:', error);
        return parseMicrocredentialQuizStudentFinalSubmitErrorOutput({ message: error.message }, 500);
    }
}

// Aliases for direct endpoint / specific flow naming
export const microcredentialQuizStudentFinalSubmit = submitQuizFinal;
export const autoSubmitQuizOnTimerExpiry = submitQuizFinal;
export const manualSubmitQuiz = submitQuizFinal;

// ============================================================================
// 9. MARK ALL ATTEMPTS AS DONE
// ============================================================================

/**
 * Marks all attempts for a given quiz as complete when student confirms this was their final attempt.
 * 
 * Endpoint: POST /api/StudentMicrocredentialQuizAPI/MicrocredentialQuizUpdateAllAttemptDone
 * 
 * @param {number} quizId - Quiz ID
 * @param {number} [studentId=0] - Student ID (defaults to active logged-in student)
 * @returns {Promise<object>} Parsed response confirming attempt status update
 */
export async function markAllAttemptsAsDone(quizId, studentId = 0) {
    try {
        const finalStudentId = resolveStudentId(studentId);
        const finalQuizId = Number(quizId) || 0;

        const inputDto = buildMicrocredentialQuizUpdateAllAttemptDoneInput(finalQuizId, finalStudentId);

        const response = await apiClient('api/StudentMicrocredentialQuizAPI/MicrocredentialQuizUpdateAllAttemptDone', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicrocredentialQuizUpdateAllAttemptDoneErrorOutput(response.data, response.status);
        }

        return parseMicrocredentialQuizUpdateAllAttemptDoneOutput(response.data, response.status);
    } catch (error) {
        console.error('Error in markAllAttemptsAsDone:', error);
        return parseMicrocredentialQuizUpdateAllAttemptDoneErrorOutput({ message: error.message }, 500);
    }
}

// Alias for direct backend method naming
export const microcredentialQuizUpdateAllAttemptDone = markAllAttemptsAsDone;

// ============================================================================
// 10. GET QUIZ RESULT BY QUIZ ID (Result Breakdown & Analysis)
// ============================================================================

/**
 * Fetches full result details (correct, wrong, skipped counts, points, grade, and per-question breakdown) for a specific attempt.
 * 
 * Endpoint: POST /api/StudentMicrocredentialQuizAPI/GetStudentMicrocredentialQuizResultGetByQuizId
 * (Fallback: /api/StudentMyProfileAPI/GetStudentMicrocredentialQuizResultGetByQuizId)
 * 
 * @param {number} quizId - Quiz ID
 * @param {number} [attemptId=0] - Attempt ID
 * @param {number} [studentId=0] - Student ID (defaults to active logged-in student)
 * @returns {Promise<object>} Complete quiz result data with detailed statistics
 */
export async function getQuizResultByQuizId(quizId, attemptId = 0, studentId = 0) {
    try {
        const finalStudentId = resolveStudentId(studentId);
        const finalQuizId = Number(quizId) || 0;
        const finalAttemptId = Number(attemptId) || 0;

        const inputDto = buildGetStudentMicrocredentialQuizResultGetByQuizIdInput(
            finalQuizId,
            finalStudentId,
            finalAttemptId
        );

        let response = await apiClient('api/StudentMicrocredentialQuizAPI/GetStudentMicrocredentialQuizResultGetByQuizId', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        // Fallback endpoint if primary path is 404
        if (response.status === 404) {
            response = await apiClient('api/StudentMyProfileAPI/GetStudentMicrocredentialQuizResultGetByQuizId', {
                method: 'POST',
                headers: inputDto.headers,
                body: inputDto.body
            });
        }

        if (!response.ok && response.status !== 200) {
            return parseGetStudentMicrocredentialQuizResultGetByQuizIdErrorOutput(response.data, response.status);
        }

        return parseGetStudentMicrocredentialQuizResultGetByQuizIdOutput(response.data, response.status);
    } catch (error) {
        console.error('Error in getQuizResultByQuizId:', error);
        return parseGetStudentMicrocredentialQuizResultGetByQuizIdErrorOutput({ message: error.message }, 500);
    }
}

// Alias for direct backend method naming
export const getStudentMicrocredentialQuizResultGetByQuizId = getQuizResultByQuizId;

// ============================================================================
// 11. UPLOAD FILE / AUDIO / VIDEO ATTACHMENT (Direct FormData Upload)
// ============================================================================

/**
 * Uploads a written response question attachment (file, audio, or video recording).
 * Sent via standard multipart/form-data POST.
 * 
 * Endpoint: POST /api/AdminCommonAPI/CommonUploadFile
 * 
 * @param {File|Blob} file - File or Blob object to upload
 * @param {string} [uploadSource='DegreeQuizWR'] - Upload source identifier (default: "DegreeQuizWR")
 * @returns {Promise<object>} Parsed response containing `{ success, status, filePath, documentList, rawData }`
 */
export async function uploadQuizAttachment(file, uploadSource = 'DegreeQuizWR') {
    try {
        if (!file) {
            return parseCommonUploadFileErrorOutput({ message: 'No file provided for upload' }, 400);
        }

        const inputDto = buildCommonUploadFileInput(file, 'UploadSource', uploadSource);

        const response = await apiClient('api/AdminCommonAPI/CommonUploadFile', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseCommonUploadFileErrorOutput(response.data, response.status);
        }

        const output = parseCommonUploadFileOutput(response.data, response.status);
        const filePath = output.documentList?.[0]?.filePath || '';

        return {
            ...output,
            filePath,
            isSuccess: output.success
        };
    } catch (error) {
        console.error('Error in uploadQuizAttachment:', error);
        return parseCommonUploadFileErrorOutput({ message: error.message }, 500);
    }
}

// Alias for direct backend method naming
export const commonUploadFile = uploadQuizAttachment;

// ============================================================================
// DEFAULT EXPORT
// ============================================================================
export default {
    QUESTION_TYPES,
    resolveStudentId,
    checkStudentQuizAttemptStatus,
    microcredentialQuizChekStudentMicrocredentialQuizAttempts,
    getStudentAttemptList,
    getMicrocredentialQuizStudentAttemptList,
    getQuizPreviewData,
    getStudentMicroQuizByMicrocredentialCourseId,
    getQuizAttemptById,
    microcredentialQuizAttemptGetById,
    saveQuizAttempt,
    microcredentialQuizAttemptSave,
    autoSaveQuizTimer,
    saveQuestionAnswer,
    submitQuizFinal,
    microcredentialQuizStudentFinalSubmit,
    autoSubmitQuizOnTimerExpiry,
    manualSubmitQuiz,
    markAllAttemptsAsDone,
    microcredentialQuizUpdateAllAttemptDone,
    getQuizResultByQuizId,
    getStudentMicrocredentialQuizResultGetByQuizId,
    uploadQuizAttachment,
    commonUploadFile
};
