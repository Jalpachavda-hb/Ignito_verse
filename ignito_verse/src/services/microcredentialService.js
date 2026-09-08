import { apiClient } from './apiClient';
import { buildMicrocredentialCourseBindDataListInput } from '../dto/input/microcredentialCourseBindDataListInput';
import { parseMicrocredentialCourseBindDataListOutput, parseMicrocredentialCourseBindDataListErrorOutput } from '../dto/output/microcredentialCourseBindDataListOutput';
import { buildGetMicroCourseTopicDetailInput } from '../dto/input/getMicroCourseTopicDetailInput';
import { parseGetMicroCourseTopicDetailOutput, parseGetMicroCourseTopicDetailErrorOutput } from '../dto/output/getMicroCourseTopicDetailOutput';
import { buildMicroCredencialWatchvideoAddUpdateInput } from '../dto/input/microCredencialWatchvideoAddUpdateInput';
import { parseMicroCredencialWatchvideoAddUpdateOutput, parseMicroCredencialWatchvideoAddUpdateErrorOutput } from '../dto/output/microCredencialWatchvideoAddUpdateOutput';
import { buildGetMicrocredentialCourseDetailInput } from '../dto/input/getMicrocredentialCourseDetailInput';
import { parseGetMicrocredentialCourseDetailOutput, parseGetMicrocredentialCourseDetailErrorOutput } from '../dto/output/getMicrocredentialCourseDetailOutput';
import { buildGetStudentReviewByMicroCorseIdInput } from '../dto/input/getStudentReviewByMicroCorseIdInput';
import { parseGetStudentReviewByMicroCorseIdOutput, parseGetStudentReviewByMicroCorseIdErrorOutput } from '../dto/output/getStudentReviewByMicroCorseIdOutput';
import { buildGetReviewByMicroCourseIdInput } from '../dto/input/getReviewByMicroCourseIdInput';
import { parseGetReviewByMicroCourseIdOutput, parseGetReviewByMicroCourseIdErrorOutput } from '../dto/output/getReviewByMicroCourseIdOutput';
import { buildIgnitoMicroStudentReviewInsertInput } from '../dto/input/ignitoMicroStudentReviewInsertInput';
import { parseIgnitoMicroStudentReviewInsertOutput, parseIgnitoMicroStudentReviewInsertErrorOutput } from '../dto/output/ignitoMicroStudentReviewInsertOutput';
import { buildMicrocredentialStudentReviewLikeInsertInput } from '../dto/input/microcredentialStudentReviewLikeInsertInput';
import { parseMicrocredentialStudentReviewLikeInsertOutput, parseMicrocredentialStudentReviewLikeInsertErrorOutput } from '../dto/output/microcredentialStudentReviewLikeInsertOutput';
import { buildGetMicrocredentialStudentWatchVideoDataInput } from '../dto/input/getMicrocredentialStudentWatchVideoDataInput';
import { parseGetMicrocredentialStudentWatchVideoDataOutput, parseGetMicrocredentialStudentWatchVideoDataErrorOutput } from '../dto/output/getMicrocredentialStudentWatchVideoDataOutput';
import { buildMicrocredentialTranscriptByTimeInput } from '../dto/input/microcredentialTranscriptByTimeInput';
import { parseMicrocredentialTranscriptByTimeOutput, parseMicrocredentialTranscriptByTimeErrorOutput } from '../dto/output/microcredentialTranscriptByTimeOutput';
import { buildGetStudentMicrocredentialRaiseHandAnswerListInput } from '../dto/input/getStudentMicrocredentialRaiseHandAnswerListInput';
import { parseGetStudentMicrocredentialRaiseHandAnswerListOutput, parseGetStudentMicrocredentialRaiseHandAnswerListErrorOutput } from '../dto/output/getStudentMicrocredentialRaiseHandAnswerListOutput';
import { buildMicrocredentialQuizStudentAttemptDetailInput } from '../dto/input/microcredentialQuizStudentAttemptDetailInput';
import { parseMicrocredentialQuizStudentAttemptDetailOutput, parseMicrocredentialQuizStudentAttemptDetailErrorOutput } from '../dto/output/microcredentialQuizStudentAttemptDetailOutput';
import { buildGetMicroManyDiscussionQuestionInput } from '../dto/input/getMicroManyDiscussionQuestionInput';
import { parseGetMicroManyDiscussionQuestionOutput, parseGetMicroManyDiscussionQuestionErrorOutput } from '../dto/output/getMicroManyDiscussionQuestionOutput';
import { buildInsertMicroManyDiscussionQuestionInput } from '../dto/input/insertMicroManyDiscussionQuestionInput';
import { parseInsertMicroManyDiscussionQuestionOutput, parseInsertMicroManyDiscussionQuestionErrorOutput } from '../dto/output/insertMicroManyDiscussionQuestionOutput';
import { buildMicroCourseDiscussionQuestionLikeInput } from '../dto/input/microCourseDiscussionQuestionLikeInput';
import { parseMicroCourseDiscussionQuestionLikeOutput, parseMicroCourseDiscussionQuestionLikeErrorOutput } from '../dto/output/microCourseDiscussionQuestionLikeOutput';
import { buildInsertMicroManyDiscussionReplyInput } from '../dto/input/insertMicroManyDiscussionReplyInput';
import { parseInsertMicroManyDiscussionReplyOutput, parseInsertMicroManyDiscussionReplyErrorOutput } from '../dto/output/insertMicroManyDiscussionReplyOutput';









// To get list of Microcredential Courses
export async function getMicrocredentialCourseBindDataList(
    pageNo = 1,
    pageSize = 10,
    orderByColumn = 'UpdatedOn',
    orderByDirection = 'DESC',
    totalRecords = 0,
    searchInput = "",
    streamId = 0,
    isAllSelect = false,
    selectedLevelIds = '',
    microcredentialCourseId = 0 
) {
    debugger;
    try {
        const inputDto = buildMicrocredentialCourseBindDataListInput(
            pageNo,
            pageSize,
            orderByColumn,
            orderByDirection,
            totalRecords,
            searchInput,
            streamId,
            isAllSelect,
            selectedLevelIds,
            microcredentialCourseId 
        );
        const response = await apiClient('api/IgnitoMicroCredencialAPI/MicrocredentialCourseBindDataList', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });
        if (!response.ok && response.status !== 200) {
            return parseMicrocredentialCourseBindDataListErrorOutput(response.data, response.status);
        }
        const outputDto = parseMicrocredentialCourseBindDataListOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error fetching microcredential course list:', error);
        return parseMicrocredentialCourseBindDataListErrorOutput({ message: error.message }, 500);
    }
}

/*
 Fetches course video topics, video metadata/duration, topic PDFs, and 
 downloadable documents when the page loads.
*/

export async function getMicroCourseTopicDetail(
    microcredentialCourseId,
    studentId,
    encryptedMicrocredentialCourseId = ''
) {
    debugger;
    try {
        const inputDto = buildGetMicroCourseTopicDetailInput(
            microcredentialCourseId,
            studentId,
            encryptedMicrocredentialCourseId
        );
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetMicroCourseTopicDetail', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });
        if (!response.ok && response.status !== 200) {
            return parseGetMicroCourseTopicDetailErrorOutput(response.data, response.status);
        }
        const outputDto = parseGetMicroCourseTopicDetailOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error fetching microcredential course list:', error);
        return parseGetMicroCourseTopicDetailErrorOutput({ message: error.message }, 500);
    }
}

/*
 Periodically (every 2 minutes) or on page unload (beforeunload), updates 
  watched seconds and overall completion percentage.
 */

export async function microCredencialWatchvideoAddUpdate(
    studentId = 0,
    microcredentialCourseId = 0,
    overallPercentage = 0,
    studentwatchvideodetails = []
) {
    try {
        const inputDto = buildMicroCredencialWatchvideoAddUpdateInput(
            studentId,
            microcredentialCourseId,
            overallPercentage,
            studentwatchvideodetails
        );
        const response = await apiClient('api/MicroCredencialStudentWatchVideoAPI/MicroCredencialWatchvideoAddUpdate', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });
        if (!response.ok && response.status !== 200) {
            return parseMicroCredencialWatchvideoAddUpdateErrorOutput(response.data, response.status);
        }
        const outputDto = parseMicroCredencialWatchvideoAddUpdateOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error updating microcredential watch video:', error);
        return parseMicroCredencialWatchvideoAddUpdateErrorOutput({ message: error.message }, 500);
    }
}

/*
 Fetches microcredential course detail by course ID.
 API: POST /api/IgnitoMicroCredencialAPI/GetMicrocredentialCourseDetail
*/
export async function getMicrocredentialCourseDetail(microcredentialCourseId) {
    try {
        const inputDto = buildGetMicrocredentialCourseDetailInput(microcredentialCourseId);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetMicrocredentialCourseDetail', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });
        if (!response.ok && response.status !== 200) {
            return parseGetMicrocredentialCourseDetailErrorOutput(response.data, response.status);
        }
        const outputDto = parseGetMicrocredentialCourseDetailOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error fetching microcredential course detail:', error);
        return parseGetMicrocredentialCourseDetailErrorOutput({ message: error.message }, 500);
    }
}

/*
 Fetches student review details by student ID and microcredential course ID.
 API: POST /api/IgnitoMicroCredencialAPI/GetStudentReviewByMicroCorseId
*/
export async function getStudentReviewByMicroCorseId(studentId = 0, microcredentialCourseId = 0) {
    try {
        const inputDto = buildGetStudentReviewByMicroCorseIdInput(studentId, microcredentialCourseId);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetStudentReviewByMicroCorseId', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });
        if (!response.ok && response.status !== 200) {
            return parseGetStudentReviewByMicroCorseIdErrorOutput(response.data, response.status);
        }
        const outputDto = parseGetStudentReviewByMicroCorseIdOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error fetching student review by micro course id:', error);
        return parseGetStudentReviewByMicroCorseIdErrorOutput({ message: error.message }, 500);
    }
}

/*
 Fetches list of reviews for a microcredential course by course ID and student ID.
 API: POST /api/IgnitoMicroCredencialAPI/GetReviewByMicroCourseId
*/
export async function getReviewByMicroCourseId(microcredentialCourseId = 0, studentId = 0) {
    try {
        const inputDto = buildGetReviewByMicroCourseIdInput(microcredentialCourseId, studentId);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetReviewByMicroCourseId', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });
        if (!response.ok && response.status !== 200) {
            return parseGetReviewByMicroCourseIdErrorOutput(response.data, response.status);
        }
        const outputDto = parseGetReviewByMicroCourseIdOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error fetching review by micro course id:', error);
        return parseGetReviewByMicroCourseIdErrorOutput({ message: error.message }, 500);
    }
}

/*
 Inserts a student review for a microcredential course.
 API: POST /api/IgnitoMicroCredencialAPI/IgnitoMicroStudentReviewInsert
*/
export async function ignitoMicroStudentReviewInsert(
    studentId = 0,
    microcredentialCourseId = 0,
    reviewInStar = 0,
    reviewDescription = ''
) {
    try {
        const inputDto = buildIgnitoMicroStudentReviewInsertInput(
            studentId,
            microcredentialCourseId,
            reviewInStar,
            reviewDescription
        );
        const response = await apiClient('api/IgnitoMicroCredencialAPI/IgnitoMicroStudentReviewInsert', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });
        if (!response.ok && response.status !== 200) {
            return parseIgnitoMicroStudentReviewInsertErrorOutput(response.data, response.status);
        }
        const outputDto = parseIgnitoMicroStudentReviewInsertOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error inserting student review:', error);
        return parseIgnitoMicroStudentReviewInsertErrorOutput({ message: error.message }, 500);
    }
}

/*
 Likes or un-likes a student review for a microcredential course.
 API: POST /api/IgnitoMicroCredencialAPI/MicrocredentialStudentReviewLikeInsert
*/
export async function microcredentialStudentReviewLikeInsert(
    microcredentialReviewId = 0,
    studentId = 0,
    microcredentialCourseId = 0
) {
    try {
        const inputDto = buildMicrocredentialStudentReviewLikeInsertInput(
            microcredentialReviewId,
            studentId,
            microcredentialCourseId
        );
        const response = await apiClient('api/IgnitoMicroCredencialAPI/MicrocredentialStudentReviewLikeInsert', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });
        if (!response.ok && response.status !== 200) {
            return parseMicrocredentialStudentReviewLikeInsertErrorOutput(response.data, response.status);
        }
        const outputDto = parseMicrocredentialStudentReviewLikeInsertOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error liking student review:', error);
        return parseMicrocredentialStudentReviewLikeInsertErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches student watch video progress and quiz eligibility data for a course.
 * API: POST /api/IgnitoMicroCredencialAPI/GetMicrocredentialStudentWatchVideoData
 * 
 * @param {number} [studentId=0] - Student identifier (0 defaults to session StudentId on backend)
 * @param {number} [microcredentialCourseId=0] - Microcredential course identifier
 * @returns {Promise<object>} Parsed output containing overall percentage, student watch video details, and quiz metadata
 */
export async function getMicrocredentialStudentWatchVideoData(studentId = 0, microcredentialCourseId = 0) {
    try {
        const inputDto = buildGetMicrocredentialStudentWatchVideoDataInput(studentId, microcredentialCourseId);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetMicrocredentialStudentWatchVideoData', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetMicrocredentialStudentWatchVideoDataErrorOutput(response.data, response.status);
        }

        const outputDto = parseGetMicrocredentialStudentWatchVideoDataOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in getMicrocredentialStudentWatchVideoData:', error);
        return parseGetMicrocredentialStudentWatchVideoDataErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Submits raise-hand question and fetches AI/transcript answer.
 * API: POST /api/IgnitoMicroCredencialAPI/MicrocredentialTranscriptByTime
 * 
 * @param {number} [studentId=0] - Student identifier
 * @param {number} [studentDegreeAdmissionId=0] - Student degree admission identifier
 * @param {string} [videoId=''] - Video identifier
 * @param {string} [question=''] - Question text
 * @param {number} [microcredentialCourseId=0] - Microcredential course identifier
 * @param {number} [handRaiseTime=0] - Hand raise timestamp/seconds
 * @param {string} [econtent=''] - E-content text
 * @param {boolean} [isEcontent=false] - Flag indicating if content is E-content
 * @returns {Promise<object>} Parsed output containing raise hand answer DTO
 */
export async function microcredentialTranscriptByTime(
    studentId = 0,
    studentDegreeAdmissionId = 0,
    videoId = '',
    question = '',
    microcredentialCourseId = 0,
    handRaiseTime = 0,
    econtent = '',
    isEcontent = false
) {
    try {
        const inputDto = buildMicrocredentialTranscriptByTimeInput(
            studentId,
            studentDegreeAdmissionId,
            videoId,
            question,
            microcredentialCourseId,
            handRaiseTime,
            econtent,
            isEcontent
        );
        const response = await apiClient('api/IgnitoMicroCredencialAPI/MicrocredentialTranscriptByTime', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicrocredentialTranscriptByTimeErrorOutput(response.data, response.status);
        }

        const outputDto = parseMicrocredentialTranscriptByTimeOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in microcredentialTranscriptByTime:', error);
        return parseMicrocredentialTranscriptByTimeErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches list of student microcredential raise hand answers.
 * API: POST /api/IgnitoMicroCredencialAPI/GetStudentMicrocredentialRaiseHandAnswerList
 * 
 * @param {number} [studentId=0] - Student identifier
 * @param {number} [studentDegreeAdmissionId=0] - Student degree admission identifier
 * @param {number} [microcredentialCourseId=0] - Microcredential course identifier
 * @param {string} [videoId=''] - Video identifier
 * @param {number} [pageNumber=1] - Page number
 * @param {number} [pageSize=10] - Page size
 * @returns {Promise<object>} Parsed output containing getStudentMicrocredentialRaiseHandAnswer list
 */
export async function getStudentMicrocredentialRaiseHandAnswerList(
    studentId = 0,
    studentDegreeAdmissionId = 0,
    microcredentialCourseId = 0,
    videoId = '',
    pageNumber = 1,
    pageSize = 10
) {
    try {
        const inputDto = buildGetStudentMicrocredentialRaiseHandAnswerListInput(
            studentId,
            studentDegreeAdmissionId,
            microcredentialCourseId,
            videoId,
            pageNumber,
            pageSize
        );
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetStudentMicrocredentialRaiseHandAnswerList', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetStudentMicrocredentialRaiseHandAnswerListErrorOutput(response.data, response.status);
        }

        const outputDto = parseGetStudentMicrocredentialRaiseHandAnswerListOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in getStudentMicrocredentialRaiseHandAnswerList:', error);
        return parseGetStudentMicrocredentialRaiseHandAnswerListErrorOutput({ message: error.message }, 500);
    }
}


/**
 * Fetches student quiz attempt details and attempt history for a microcredential course.
 * API: POST /api/IgnitoMicroCredencialAPI/MicrocredentialQuizStudentAttemptDetail
 * 
 * @param {number} [microcredentialCourseId=0] - Microcredential course ID
 * @param {number} [studentId=0] - Student ID (0 uses session studentId on backend)
 * @returns {Promise<object>} Parsed output containing studentAttemptDetail and attempt history list
 */
export async function microcredentialQuizStudentAttemptDetail(
    microcredentialCourseId = 0,
    studentId = 0
) {
    try {
        const inputDto = buildMicrocredentialQuizStudentAttemptDetailInput(microcredentialCourseId, studentId);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/MicrocredentialQuizStudentAttemptDetail', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicrocredentialQuizStudentAttemptDetailErrorOutput(response.data, response.status);
        }

        const outputDto = parseMicrocredentialQuizStudentAttemptDetailOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in microcredentialQuizStudentAttemptDetail:', error);
        return parseMicrocredentialQuizStudentAttemptDetailErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches list of discussion questions for a microcredential course.
 * API: POST /api/IgnitoMicroCredencialAPI/GetMicroManyDiscussionQuestion
 * 
 * @param {number} [microCorseId=0] - Microcredential course ID
 * @param {number} [studentId=0] - Student ID (0 defaults to session StudentId on backend)
 * @returns {Promise<object>} Parsed output containing microDiscussionQuestions list
 */
export async function getMicroManyDiscussionQuestion(microCorseId = 0, studentId = 0) {
    try {
        const inputDto = buildGetMicroManyDiscussionQuestionInput(microCorseId, studentId);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetMicroManyDiscussionQuestion', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetMicroManyDiscussionQuestionErrorOutput(response.data, response.status);
        }

        const outputDto = parseGetMicroManyDiscussionQuestionOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in getMicroManyDiscussionQuestion:', error);
        return parseGetMicroManyDiscussionQuestionErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Inserts/submits a discussion question for a microcredential course.
 * API: POST /api/IgnitoMicroCredencialAPI/InsertMicroManyDiscussionQuestion
 * 
 * @param {number} [studentId=0] - Student ID (0 defaults to session StudentId on backend)
 * @param {number} [professorId=0] - Professor ID
 * @param {number} [microCorseId=0] - Microcredential course ID
 * @param {string} [question=''] - Discussion question text
 * @returns {Promise<object>} Parsed output containing `{ success, message, status, errorDescription, rawData }`
 */
export async function insertMicroManyDiscussionQuestion(
    studentId = 0,
    professorId = 0,
    microCorseId = 0,
    question = ''
) {
    try {
        const inputDto = buildInsertMicroManyDiscussionQuestionInput(
            studentId,
            professorId,
            microCorseId,
            question
        );
        const response = await apiClient('api/IgnitoMicroCredencialAPI/InsertMicroManyDiscussionQuestion', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseInsertMicroManyDiscussionQuestionErrorOutput(response.data, response.status);
        }

        const outputDto = parseInsertMicroManyDiscussionQuestionOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in insertMicroManyDiscussionQuestion:', error);
        return parseInsertMicroManyDiscussionQuestionErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Likes or un-likes a microcourse discussion question.
 * API: POST /api/IgnitoMicroCredencialAPI/MicroCourseDiscussionQuestionLike
 * 
 * @param {number} [microCourseDiscussionQuestionId=0] - Microcourse discussion question ID
 * @param {number} [studentId=0] - Student ID (0 defaults to session StudentId on backend)
 * @param {number} [microCourseId=0] - Microcredential course ID
 * @returns {Promise<object>} Parsed output containing `{ success, message, status, errorDescription, rawData }`
 */
export async function microCourseDiscussionQuestionLike(
    microCourseDiscussionQuestionId = 0,
    studentId = 0,
    microCourseId = 0
) {
    try {
        const inputDto = buildMicroCourseDiscussionQuestionLikeInput(
            microCourseDiscussionQuestionId,
            studentId,
            microCourseId
        );
        const response = await apiClient('api/IgnitoMicroCredencialAPI/MicroCourseDiscussionQuestionLike', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicroCourseDiscussionQuestionLikeErrorOutput(response.data, response.status);
        }

        const outputDto = parseMicroCourseDiscussionQuestionLikeOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in microCourseDiscussionQuestionLike:', error);
        return parseMicroCourseDiscussionQuestionLikeErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Inserts/submits a reply to a microcourse discussion question.
 * API: POST /api/IgnitoMicroCredencialAPI/InsertManyMicroCourseDiscussionReply
 * 
 * @param {number} [microCourseDiscussionQuestionId=0] - Microcourse discussion question ID
 * @param {number} [studentId=0] - Student ID (0 defaults to session StudentId on backend)
 * @param {number} [professorId=0] - Professor ID
 * @param {number} [microCorseId=0] - Microcredential course ID
 * @param {string} [reply=''] - Discussion reply text
 * @returns {Promise<object>} Parsed output containing `{ success, message, status, errorDescription, rawData }`
 */
export async function insertManyMicroCourseDiscussionReply(
    microCourseDiscussionQuestionId = 0,
    studentId = 0,
    professorId = 0,
    microCorseId = 0,
    reply = ''
) {
    try {
        const inputDto = buildInsertMicroManyDiscussionReplyInput(
            microCourseDiscussionQuestionId,
            studentId,
            professorId,
            microCorseId,
            reply
        );
        const response = await apiClient('api/IgnitoMicroCredencialAPI/InsertManyMicroCourseDiscussionReply', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseInsertMicroManyDiscussionReplyErrorOutput(response.data, response.status);
        }

        const outputDto = parseInsertMicroManyDiscussionReplyOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in insertManyMicroCourseDiscussionReply:', error);
        return parseInsertMicroManyDiscussionReplyErrorOutput({ message: error.message }, 500);
    }
}













