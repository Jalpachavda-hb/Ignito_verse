/**
 * ADMIN MICROCREDENTIAL SERVICE
 * Service functions connecting Admin UI with backend .NET Web API endpoints.
 */

import { apiClient } from './apiClient';
import { buildCommonUploadFileInput } from '../dto/input/commonUploadFileInput';
import { parseCommonUploadFileOutput, parseCommonUploadFileErrorOutput } from '../dto/output/commonUploadFileOutput';
import { buildMicrocredentialCourseAddUpdateInput } from '../dto/input/microcredentialCourseAddUpdateInput';
import { parseMicrocredentialCourseAddUpdateOutput, parseMicrocredentialCourseAddUpdateErrorOutput } from '../dto/output/microcredentialCourseAddUpdateOutput';
import { buildGetStreamDataInput } from '../dto/input/getStreamDataInput';
import { parseGetStreamDataOutput, parseGetStreamDataErrorOutput } from '../dto/output/getStreamDataOutput';
import { buildGetMicroCredentialCourseLevelInput } from '../dto/input/getMicroCredentialCourseLevelInput';
import { parseGetMicroCredentialCourseLevelOutput, parseGetMicroCredentialCourseLevelErrorOutput } from '../dto/output/getMicroCredentialCourseLevelOutput';
import { buildGetProgrammeLanguageInput } from '../dto/input/getProgrammeLanguageInput';
import { parseGetProgrammeLanguageOutput, parseGetProgrammeLanguageErrorOutput } from '../dto/output/getProgrammeLanguageOutput';
import { buildAdminMicrocredentialCourseListInput } from '../dto/input/adminMicrocredentialCourseListInput';
import { parseAdminMicrocredentialCourseListOutput, parseAdminMicrocredentialCourseListErrorOutput } from '../dto/output/adminMicrocredentialCourseListOutput';
import { buildMicrocredentialCourseDeleteInput } from '../dto/input/microcredentialCourseDeleteInput';
import { parseMicrocredentialCourseDeleteOutput, parseMicrocredentialCourseDeleteErrorOutput } from '../dto/output/microcredentialCourseDeleteOutput';
import { buildGetMicroCourseMaterialIncludeDataInput } from '../dto/input/getMicroCourseMaterialIncludeDataInput';
import { parseGetMicroCourseMaterialIncludeDataOutput, parseGetMicroCourseMaterialIncludeDataErrorOutput } from '../dto/output/getMicroCourseMaterialIncludeDataOutput';
import { buildGetMicroCourseLearnDataInput } from '../dto/input/getMicroCourseLearnDataInput';
import { parseGetMicroCourseLearnDataOutput, parseGetMicroCourseLearnDataErrorOutput } from '../dto/output/getMicroCourseLearnDataOutput';
import { buildDownloadMicroTemplateInput } from '../dto/input/downloadMicroTemplateInput';
import { parseDownloadMicroTemplateOutput, parseDownloadMicroTemplateErrorOutput } from '../dto/output/downloadMicroTemplateOutput';
import { buildUploadMicroCourseExcelInput } from '../dto/input/uploadMicroCourseExcelInput';
import { parseUploadMicroCourseExcelOutput, parseUploadMicroCourseExcelErrorOutput } from '../dto/output/uploadMicroCourseExcelOutput';
import { buildMicrocredentialCourseExcelInsertInput } from '../dto/input/microcredentialCourseExcelInsertInput';
import { parseMicrocredentialCourseExcelInsertOutput, parseMicrocredentialCourseExcelInsertErrorOutput } from '../dto/output/microcredentialCourseExcelInsertOutput';
import { buildGetMicrocredentialCourseInput } from '../dto/input/getMicrocredentialCourseInput';
import { parseGetMicrocredentialCourseOutput, parseGetMicrocredentialCourseErrorOutput } from '../dto/output/getMicrocredentialCourseOutput';
import { buildMicroCourseTopicAddUpdateInput } from '../dto/input/microCourseTopicAddUpdateInput';
import { parseMicroCourseTopicAddUpdateOutput, parseMicroCourseTopicAddUpdateErrorOutput } from '../dto/output/microCourseTopicAddUpdateOutput';
import { buildMicroCourseTopicListInput } from '../dto/input/microCourseTopicListInput';
import { parseMicroCourseTopicListOutput, parseMicroCourseTopicListErrorOutput } from '../dto/output/microCourseTopicListOutput';
import { buildMicroCourseTopicDeleteInput } from '../dto/input/microCourseTopicDeleteInput';
import { parseMicroCourseTopicDeleteOutput, parseMicroCourseTopicDeleteErrorOutput } from '../dto/output/microCourseTopicDeleteOutput';
import { buildGetMicrocredentialStudentDownloadDocumentsInput } from '../dto/input/getMicrocredentialStudentDownloadDocumentsInput';
import { parseGetMicrocredentialStudentDownloadDocumentsOutput, parseGetMicrocredentialStudentDownloadDocumentsErrorOutput } from '../dto/output/getMicrocredentialStudentDownloadDocumentsOutput';
import { buildAdminGetMicroCourseManyDiscussionForumQuestionsListInput } from '../dto/input/adminGetMicroCourseManyDiscussionForumQuestionsListInput';
import { parseAdminGetMicroCourseManyDiscussionForumQuestionsListOutput, parseAdminGetMicroCourseManyDiscussionForumQuestionsListErrorOutput } from '../dto/output/adminGetMicroCourseManyDiscussionForumQuestionsListOutput';
import { buildAdminGetMicroCourseManyDiscussionQuestionReplyListInput } from '../dto/input/adminGetMicroCourseManyDiscussionQuestionReplyListInput';
import { parseAdminGetMicroCourseManyDiscussionQuestionReplyListOutput, parseAdminGetMicroCourseManyDiscussionQuestionReplyListErrorOutput } from '../dto/output/adminGetMicroCourseManyDiscussionQuestionReplyListOutput';
import { buildDeleteMicroManyDiscussionForumQuestionsInput } from '../dto/input/deleteMicroManyDiscussionForumQuestionsInput';
import { parseDeleteMicroManyDiscussionForumQuestionsOutput, parseDeleteMicroManyDiscussionForumQuestionsErrorOutput } from '../dto/output/deleteMicroManyDiscussionForumQuestionsOutput';
import { buildDeleteMicroManyDiscussionForumeReplyInput } from '../dto/input/deleteMicroManyDiscussionForumeReplyInput';
import { parseDeleteMicroManyDiscussionForumeReplyOutput, parseDeleteMicroManyDiscussionForumeReplyErrorOutput } from '../dto/output/deleteMicroManyDiscussionForumeReplyOutput';
import { buildGetMicrocredentialSingleDiscussionQuestionListInput } from '../dto/input/getMicrocredentialSingleDiscussionQuestionListInput';
import { parseGetMicrocredentialSingleDiscussionQuestionListOutput, parseGetMicrocredentialSingleDiscussionQuestionListErrorOutput } from '../dto/output/getMicrocredentialSingleDiscussionQuestionListOutput';
import { buildInsertMicroSingleDiscussionReplyInput } from '../dto/input/insertMicroSingleDiscussionReplyInput';
import { parseInsertMicroSingleDiscussionReplyOutput, parseInsertMicroSingleDiscussionReplyErrorOutput } from '../dto/output/insertMicroSingleDiscussionReplyOutput';
import { buildGetMicrocredentialSingleDiscussionStudentQuestionInput } from '../dto/input/getMicrocredentialSingleDiscussionStudentQuestionInput';
import { parseGetMicrocredentialSingleDiscussionStudentQuestionOutput, parseGetMicrocredentialSingleDiscussionStudentQuestionErrorOutput } from '../dto/output/getMicrocredentialSingleDiscussionStudentQuestionOutput';
import { buildGetMicrocredentialStudentReviewListInput } from '../dto/input/getMicrocredentialStudentReviewListInput';
import { parseGetMicrocredentialStudentReviewListOutput, parseGetMicrocredentialStudentReviewListErrorOutput } from '../dto/output/getMicrocredentialStudentReviewListOutput';
import { buildDeleteMicrocredentialStudentReviewInput } from '../dto/input/deleteMicrocredentialStudentReviewInput';
import { parseDeleteMicrocredentialStudentReviewOutput, parseDeleteMicrocredentialStudentReviewErrorOutput } from '../dto/output/deleteMicrocredentialStudentReviewOutput';

/**
 * Uploads one or more files using multipart/form-data.
 * API: POST /api/IgnitoMicroCredencialAPI/CommonUploadFile
 * 
 * @param {File|File[]|FileList|FormData} files - File, array of files, FileList, or pre-built FormData object
 * @param {string} [uploadSourceKey='UploadSource'] - Upload source field name
 * @param {string} [uploadSourceValue=''] - Upload source enum value (e.g. 'IntroImage', 'ProfessorImage')
 * @param {string} [oldPath=''] - Existing file path to replace
 * @returns {Promise<object>} Parsed output containing `{ success, documentList, status, rawData }`
 */
export async function commonUploadFile(
    files,
    uploadSourceKey = 'UploadSource',
    uploadSourceValue = '',
    oldPath = ''
) {
    try {
        const inputDto = buildCommonUploadFileInput(files, uploadSourceKey, uploadSourceValue, oldPath);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/CommonUploadFile', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseCommonUploadFileErrorOutput(response.data, response.status);
        }

        const outputDto = parseCommonUploadFileOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in commonUploadFile:', error);
        return parseCommonUploadFileErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Adds or updates a microcredential course.
 * API: POST /api/IgnitoMicroCredencialAPI/MicrocredentialCourseAddUpdate
 * 
 * @param {object} courseData - Course data payload
 * @returns {Promise<object>} Parsed output containing `{ success, message, status, errorDescription, rawData }`
 */
export async function microcredentialCourseAddUpdate(courseData = {}) {
    try {
        const inputDto = buildMicrocredentialCourseAddUpdateInput(courseData);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/MicrocredentialCourseAddUpdate', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicrocredentialCourseAddUpdateErrorOutput(response.data, response.status);
        }

        const outputDto = parseMicrocredentialCourseAddUpdateOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in microcredentialCourseAddUpdate:', error);
        return parseMicrocredentialCourseAddUpdateErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches stream data list for setup/dropdowns.
 * API: POST /api/AdminSetUpAPI/GetStreamData
 * 
 * @returns {Promise<object>} Parsed output containing `{ success, streamDataList, message, status, rawData }`
 */
export async function getStreamData() {
    try {
        const inputDto = buildGetStreamDataInput();
        const response = await apiClient('api/AdminSetUpAPI/GetStreamData', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetStreamDataErrorOutput(response.data, response.status);
        }

        const outputDto = parseGetStreamDataOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in getStreamData:', error);
        return parseGetStreamDataErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches course levels list.
 * API: POST /api/IgnitoMicroCredencialAPI/GetMicroCredentialCourseLevel
 * 
 * @returns {Promise<object>} Parsed output containing `{ success, microCredentialCourseLevelList, message, status, rawData }`
 */
export async function getMicroCredentialCourseLevel() {
    try {
        const inputDto = buildGetMicroCredentialCourseLevelInput();
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetMicroCredentialCourseLevel', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetMicroCredentialCourseLevelErrorOutput(response.data, response.status);
        }

        const outputDto = parseGetMicroCredentialCourseLevelOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in getMicroCredentialCourseLevel:', error);
        return parseGetMicroCredentialCourseLevelErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches programme language list.
 * API: POST /api/IgnitoMicroCredencialAPI/GetProgrammeLanguage
 * 
 * @returns {Promise<object>} Parsed output containing `{ success, getProgrammeLanguage, message, status, rawData }`
 */
export async function getProgrammeLanguage() {
    try {
        const inputDto = buildGetProgrammeLanguageInput();
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetProgrammeLanguage', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetProgrammeLanguageErrorOutput(response.data, response.status);
        }

        const outputDto = parseGetProgrammeLanguageOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in getProgrammeLanguage:', error);
        return parseGetProgrammeLanguageErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches admin microcredential course list with pagination and filters.
 * API: POST /api/IgnitoMicroCredencialAPI/MicrocredentialCourseList
 * 
 * @param {number} [pageNo=1] - Page number
 * @param {number} [pageSize=10] - Page size
 * @param {string} [orderByColumn='MicrocredentialCourseId'] - Column name to order by
 * @param {string} [orderByDirection='DESC'] - Sorting direction ('ASC'|'DESC')
 * @param {number} [totalRecords=0] - Total records count
 * @param {number} [adminId=0] - Admin identifier
 * @param {string} [searchInput=''] - Search filter text
 * @returns {Promise<object>} Parsed output containing `{ success, microcredentialCourseOutPutList, pageDetail, message, status, rawData }`
 */
export async function adminMicrocredentialCourseList(
    pageNo = 1,
    pageSize = 10,
    orderByColumn = 'MicrocredentialCourseId',
    orderByDirection = 'DESC',
    totalRecords = 0,
    adminId = 0,
    searchInput = ''
) {
    try {
        const inputDto = buildAdminMicrocredentialCourseListInput(
            pageNo,
            pageSize,
            orderByColumn,
            orderByDirection,
            totalRecords,
            adminId,
            searchInput
        );
        const response = await apiClient('api/IgnitoMicroCredencialAPI/MicrocredentialCourseList', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseAdminMicrocredentialCourseListErrorOutput(response.data, response.status);
        }

        const outputDto = parseAdminMicrocredentialCourseListOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in adminMicrocredentialCourseList:', error);
        return parseAdminMicrocredentialCourseListErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Deletes a microcredential course.
 * API: POST /api/IgnitoMicroCredencialAPI/MicrocredentialCourseDelete
 * 
 * @param {number} microcredentialCourseId - Microcredential course ID to delete
 * @param {number} [adminId=0] - Admin identifier
 * @returns {Promise<object>} Parsed output containing `{ success, message, status, errorDescription, rawData }`
 */
export async function microcredentialCourseDelete(microcredentialCourseId = 0, adminId = 0) {
    try {
        const inputDto = buildMicrocredentialCourseDeleteInput(microcredentialCourseId, adminId);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/MicrocredentialCourseDelete', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicrocredentialCourseDeleteErrorOutput(response.data, response.status);
        }

        const outputDto = parseMicrocredentialCourseDeleteOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in microcredentialCourseDelete:', error);
        return parseMicrocredentialCourseDeleteErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches micro course material include data list for a course.
 * API: POST /api/IgnitoMicroCredencialAPI/GetMicroCourseMaterialIncludeData
 * 
 * @param {number} [microcredentialCourseId=0] - Microcredential course ID
 * @returns {Promise<object>} Parsed output containing `{ success, microCourseMaterialIncludeDataList, message, status, rawData }`
 */
export async function getMicroCourseMaterialIncludeData(microcredentialCourseId = 0) {
    try {
        const inputDto = buildGetMicroCourseMaterialIncludeDataInput(microcredentialCourseId);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetMicroCourseMaterialIncludeData', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetMicroCourseMaterialIncludeDataErrorOutput(response.data, response.status);
        }

        const outputDto = parseGetMicroCourseMaterialIncludeDataOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in getMicroCourseMaterialIncludeData:', error);
        return parseGetMicroCourseMaterialIncludeDataErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches micro course learn data list for a course.
 * API: POST /api/IgnitoMicroCredencialAPI/GetMicroCourseLearnData
 * 
 * @param {number} [microcredentialCourseId=0] - Microcredential course ID
 * @returns {Promise<object>} Parsed output containing `{ success, microCourseLearnDataList, message, status, rawData }`
 */
export async function getMicroCourseLearnData(microcredentialCourseId = 0) {
    try {
        const inputDto = buildGetMicroCourseLearnDataInput(microcredentialCourseId);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetMicroCourseLearnData', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetMicroCourseLearnDataErrorOutput(response.data, response.status);
        }

        const outputDto = parseGetMicroCourseLearnDataOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in getMicroCourseLearnData:', error);
        return parseGetMicroCourseLearnDataErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Downloads the Excel template for Microcredential Courses.
 * API: GET /api/IgnitoMicroCredencialAPI/DownloadMicroTemplate
 * 
 * @param {boolean} [autoDownload=true] - Automatically triggers browser file download if true
 * @returns {Promise<object>} Parsed output containing `{ success, blob, fileName, status, rawData }`
 */
export async function downloadMicroTemplate(autoDownload = true) {
    try {
        const inputDto = buildDownloadMicroTemplateInput();
        const response = await apiClient('api/IgnitoMicroCredencialAPI/DownloadMicroTemplate', {
            method: 'GET',
            headers: inputDto.headers,
            responseType: inputDto.responseType
        });

        if (!response.ok && response.status !== 200) {
            return parseDownloadMicroTemplateErrorOutput(response.data, response.status);
        }

        const outputDto = parseDownloadMicroTemplateOutput(response.data, response.status, autoDownload);
        return outputDto;
    } catch (error) {
        console.error('Error in downloadMicroTemplate:', error);
        return parseDownloadMicroTemplateErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Uploads and processes a Micro Course Excel file.
 * API: POST /api/IgnitoMicroCredencialAPI/UploadMicroCourseExcel
 * 
 * @param {File} file - Excel file object
 * @returns {Promise<object>} Parsed output containing `{ success, microCourseExcelDataList, microCourseLearnList, materialIncludeList, message, status, rawData }`
 */
export async function uploadMicroCourseExcel(file) {
    try {
        const inputDto = buildUploadMicroCourseExcelInput(file);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/UploadMicroCourseExcel', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseUploadMicroCourseExcelErrorOutput(response.data, response.status);
        }

        const outputDto = parseUploadMicroCourseExcelOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in uploadMicroCourseExcel:', error);
        return parseUploadMicroCourseExcelErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Inserts Micro Courses batch data parsed from Excel.
 * API: POST /api/IgnitoMicroCredencialAPI/MicrocredentialCourseExcelInsert
 * 
 * @param {object} [data={}] - Object containing adminId, microCourseExcelDataList, microCourseLearnList, materialIncludeList
 * @returns {Promise<object>} Parsed output containing `{ success, message, status, errorDescription, rawData }`
 */
export async function microcredentialCourseExcelInsert(data = {}) {
    try {
        const inputDto = buildMicrocredentialCourseExcelInsertInput(data);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/MicrocredentialCourseExcelInsert', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicrocredentialCourseExcelInsertErrorOutput(response.data, response.status);
        }

        const outputDto = parseMicrocredentialCourseExcelInsertOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in microcredentialCourseExcelInsert:', error);
        return parseMicrocredentialCourseExcelInsertErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches list of microcredential courses by stream ID.
 * API: POST /api/IgnitoMicroCredencialAPI/GetMicrocredentialCourse
 * 
 * @param {string|number} [streamId=''] - Stream ID filter
 * @returns {Promise<object>} Parsed output containing `{ success, microcredentialCourseOutputList, message, status, rawData }`
 */
export async function getMicrocredentialCourse(streamId = '') {
    try {
        const inputDto = buildGetMicrocredentialCourseInput(streamId);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetMicrocredentialCourse', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetMicrocredentialCourseErrorOutput(response.data, response.status);
        }

        const outputDto = parseGetMicrocredentialCourseOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in getMicrocredentialCourse:', error);
        return parseGetMicrocredentialCourseErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Adds or updates topics for a microcredential course.
 * API: POST /api/IgnitoMicroCredencialAPI/MicroCourseTopicAddUpdate
 * 
 * @param {object} [topicData={}] - Object containing microcredentialCourseId, streamId, adminId, uploadMicroDocument, microcredentialCourseTopicList, microcredentialStudentDownloadDocumentList
 * @returns {Promise<object>} Parsed output containing `{ success, message, studentFcmToken, studentFcmTokens, notificationMessage, status, rawData }`
 */
export async function microCourseTopicAddUpdate(topicData = {}) {
    try {
        const inputDto = buildMicroCourseTopicAddUpdateInput(topicData);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/MicroCourseTopicAddUpdate', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicroCourseTopicAddUpdateErrorOutput(response.data, response.status);
        }

        const outputDto = parseMicroCourseTopicAddUpdateOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in microCourseTopicAddUpdate:', error);
        return parseMicroCourseTopicAddUpdateErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches admin micro course topic list with pagination and search.
 * API: POST /api/IgnitoMicroCredencialAPI/MicroCourseTopicList
 * 
 * @param {number} [pageNo=1] - Page number
 * @param {number} [pageSize=10] - Page size
 * @param {string} [orderByColumn='MicrocredentialCourseId'] - Column to order by
 * @param {string} [orderByDirection='DESC'] - Sort direction ('ASC'|'DESC')
 * @param {number} [totalRecords=0] - Total records count
 * @param {number} [adminId=0] - Admin identifier
 * @param {string} [searchInput=''] - Search term
 * @returns {Promise<object>} Parsed output containing `{ success, microCourseTopicList, pageDetail, message, status, rawData }`
 */
export async function microCourseTopicList(
    pageNo = 1,
    pageSize = 10,
    orderByColumn = 'MicrocredentialCourseId',
    orderByDirection = 'DESC',
    totalRecords = 0,
    adminId = 0,
    searchInput = ''
) {
    try {
        const inputDto = buildMicroCourseTopicListInput(
            pageNo,
            pageSize,
            orderByColumn,
            orderByDirection,
            totalRecords,
            adminId,
            searchInput
        );
        const response = await apiClient('api/IgnitoMicroCredencialAPI/MicroCourseTopicList', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicroCourseTopicListErrorOutput(response.data, response.status);
        }

        const outputDto = parseMicroCourseTopicListOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in microCourseTopicList:', error);
        return parseMicroCourseTopicListErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Deletes micro course topics for a course.
 * API: POST /api/IgnitoMicroCredencialAPI/MicroCourseTopicDelete
 * 
 * @param {number} microcredentialCourseId - Microcredential course ID
 * @param {number} [adminId=0] - Admin identifier
 * @returns {Promise<object>} Parsed output containing `{ success, message, status, errorDescription, rawData }`
 */
export async function microCourseTopicDelete(microcredentialCourseId = 0, adminId = 0) {
    try {
        const inputDto = buildMicroCourseTopicDeleteInput(microcredentialCourseId, adminId);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/MicroCourseTopicDelete', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseMicroCourseTopicDeleteErrorOutput(response.data, response.status);
        }

        const outputDto = parseMicroCourseTopicDeleteOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in microCourseTopicDelete:', error);
        return parseMicroCourseTopicDeleteErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches downloadable student documents for a microcredential course.
 * API: POST /api/IgnitoMicroCredencialAPI/GetMicrocredentialStudentDownloadDocuments
 * 
 * @param {number} [microcredentialCourseId=0] - Microcredential course ID
 * @returns {Promise<object>} Parsed output containing `{ success, adminGetMicrocredentialStudentDownloadDocumentsData, message, status, rawData }`
 */
export async function getMicrocredentialStudentDownloadDocuments(microcredentialCourseId = 0) {
    try {
        const inputDto = buildGetMicrocredentialStudentDownloadDocumentsInput(microcredentialCourseId);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetMicrocredentialStudentDownloadDocuments', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetMicrocredentialStudentDownloadDocumentsErrorOutput(response.data, response.status);
        }

        const outputDto = parseGetMicrocredentialStudentDownloadDocumentsOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in getMicrocredentialStudentDownloadDocuments:', error);
        return parseGetMicrocredentialStudentDownloadDocumentsErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches admin micro course discussion forum questions list.
 * API: POST /api/MicroDiscussionForumAPI/AdminGetMicroCourseManyDiscussionForumQuestionsList
 * 
 * @param {number} [pageNo=1] - Page number
 * @param {number} [pageSize=10] - Page size
 * @param {string} [orderByColumn='CreatedOn'] - Column to order by
 * @param {string} [orderByDirection='DESC'] - Sort direction ('ASC'|'DESC')
 * @param {number} [totalRecords=0] - Total records count
 * @param {number} [adminId=0] - Admin identifier
 * @param {string} [searchInput=''] - Search term
 * @returns {Promise<object>} Parsed output containing `{ success, discussionQuestionList, pageDetail, message, status, rawData }`
 */
export async function adminGetMicroCourseManyDiscussionForumQuestionsList(
    pageNo = 1,
    pageSize = 10,
    orderByColumn = 'CreatedOn',
    orderByDirection = 'DESC',
    totalRecords = 0,
    adminId = 0,
    searchInput = ''
) {
    try {
        const inputDto = buildAdminGetMicroCourseManyDiscussionForumQuestionsListInput(
            pageNo,
            pageSize,
            orderByColumn,
            orderByDirection,
            totalRecords,
            adminId,
            searchInput
        );
        const response = await apiClient('api/MicroDiscussionForumAPI/AdminGetMicroCourseManyDiscussionForumQuestionsList', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseAdminGetMicroCourseManyDiscussionForumQuestionsListErrorOutput(response.data, response.status);
        }

        const outputDto = parseAdminGetMicroCourseManyDiscussionForumQuestionsListOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in adminGetMicroCourseManyDiscussionForumQuestionsList:', error);
        return parseAdminGetMicroCourseManyDiscussionForumQuestionsListErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches replies for a specific discussion question in admin micro course.
 * API: POST /api/MicroDiscussionForumAPI/AdminGetMicroCourseManyDiscussionQuestionReplyList
 * 
 * @param {number} [discussionQuestionId=0] - Discussion question ID
 * @returns {Promise<object>} Parsed output containing `{ success, getMicroCourseManyDiscussionQuestionReply, message, status, rawData }`
 */
export async function adminGetMicroCourseManyDiscussionQuestionReplyList(discussionQuestionId = 0) {
    try {
        const inputDto = buildAdminGetMicroCourseManyDiscussionQuestionReplyListInput(discussionQuestionId);
        const response = await apiClient('api/MicroDiscussionForumAPI/AdminGetMicroCourseManyDiscussionQuestionReplyList', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseAdminGetMicroCourseManyDiscussionQuestionReplyListErrorOutput(response.data, response.status);
        }

        const outputDto = parseAdminGetMicroCourseManyDiscussionQuestionReplyListOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in adminGetMicroCourseManyDiscussionQuestionReplyList:', error);
        return parseAdminGetMicroCourseManyDiscussionQuestionReplyListErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Deletes a discussion forum question in admin micro course.
 * API: POST /api/MicroDiscussionForumAPI/DeleteMicroManyDiscussionForumQuestions
 * 
 * @param {number} [microCourseDiscussionQuestionId=0] - Micro course discussion question ID
 * @param {number} [adminId=0] - Admin identifier
 * @returns {Promise<object>} Parsed output containing `{ success, message, status, errorDescription, rawData }`
 */
export async function deleteMicroManyDiscussionForumQuestions(microCourseDiscussionQuestionId = 0, adminId = 0) {
    try {
        const inputDto = buildDeleteMicroManyDiscussionForumQuestionsInput(microCourseDiscussionQuestionId, adminId);
        const response = await apiClient('api/MicroDiscussionForumAPI/DeleteMicroManyDiscussionForumQuestions', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseDeleteMicroManyDiscussionForumQuestionsErrorOutput(response.data, response.status);
        }

        const outputDto = parseDeleteMicroManyDiscussionForumQuestionsOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in deleteMicroManyDiscussionForumQuestions:', error);
        return parseDeleteMicroManyDiscussionForumQuestionsErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Deletes a discussion forum reply in admin micro course.
 * API: POST /api/MicroDiscussionForumAPI/DeleteMicroManyDiscussionForumeReply
 * 
 * @param {number} [microCourseDiscussionReplyId=0] - Micro course discussion reply ID
 * @param {number} [adminId=0] - Admin identifier
 * @returns {Promise<object>} Parsed output containing `{ success, message, status, errorDescription, rawData }`
 */
export async function deleteMicroManyDiscussionForumeReply(microCourseDiscussionReplyId = 0, adminId = 0) {
    try {
        const inputDto = buildDeleteMicroManyDiscussionForumeReplyInput(microCourseDiscussionReplyId, adminId);
        const response = await apiClient('api/MicroDiscussionForumAPI/DeleteMicroManyDiscussionForumeReply', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseDeleteMicroManyDiscussionForumeReplyErrorOutput(response.data, response.status);
        }

        const outputDto = parseDeleteMicroManyDiscussionForumeReplyOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in deleteMicroManyDiscussionForumeReply:', error);
        return parseDeleteMicroManyDiscussionForumeReplyErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches single discussion question list for microcredential courses with pagination and search.
 * API: POST /api/MicroDiscussionForumAPI/GetMicrocredentialSingleDiscussionQuestionList
 * 
 * @param {number} [pageNo=1] - Page number
 * @param {number} [pageSize=10] - Page size
 * @param {string} [orderByColumn='MicroCourseId'] - Column to order by
 * @param {string} [orderByDirection='DESC'] - Sort direction ('ASC'|'DESC')
 * @param {number} [totalRecords=0] - Total records count
 * @param {number} [adminId=0] - Admin identifier
 * @param {string} [searchInput=''] - Search term
 * @returns {Promise<object>} Parsed output containing `{ success, getMicrocredentialSingleDiscussionQuestionList, pageDetail, message, status, rawData }`
 */
export async function getMicrocredentialSingleDiscussionQuestionList(
    pageNo = 1,
    pageSize = 10,
    orderByColumn = 'MicroCourseId',
    orderByDirection = 'DESC',
    totalRecords = 0,
    adminId = 0,
    searchInput = ''
) {
    try {
        const inputDto = buildGetMicrocredentialSingleDiscussionQuestionListInput(
            pageNo,
            pageSize,
            orderByColumn,
            orderByDirection,
            totalRecords,
            adminId,
            searchInput
        );
        const response = await apiClient('api/MicroDiscussionForumAPI/GetMicrocredentialSingleDiscussionQuestionList', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetMicrocredentialSingleDiscussionQuestionListErrorOutput(response.data, response.status);
        }

        const outputDto = parseGetMicrocredentialSingleDiscussionQuestionListOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in getMicrocredentialSingleDiscussionQuestionList:', error);
        return parseGetMicrocredentialSingleDiscussionQuestionListErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Inserts a single discussion reply for a student question.
 * API: POST /api/MicroDiscussionForumAPI/InsertMicroSingleDiscussionReply
 * 
 * @param {object} [replyData={}] - Object containing adminId, studentId, microSingleDiscussionQuestionId, reply, microCourseId
 * @returns {Promise<object>} Parsed output containing `{ success, message, status, errorDescription, rawData }`
 */
export async function insertMicroSingleDiscussionReply(replyData = {}) {
    try {
        const inputDto = buildInsertMicroSingleDiscussionReplyInput(replyData);
        const response = await apiClient('api/MicroDiscussionForumAPI/InsertMicroSingleDiscussionReply', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseInsertMicroSingleDiscussionReplyErrorOutput(response.data, response.status);
        }

        const outputDto = parseInsertMicroSingleDiscussionReplyOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in insertMicroSingleDiscussionReply:', error);
        return parseInsertMicroSingleDiscussionReplyErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches student discussion questions for single discussion in microcredentials.
 * API: POST /api/MicroDiscussionForumAPI/GetMicrocredentialSingleDiscussionStudentQuestion
 * 
 * @param {number} [studentId=0] - Student ID
 * @param {number} [microCourseId=0] - Micro Course ID
 * @returns {Promise<object>} Parsed output containing `{ success, getMicrocredentialSingleDiscussionStudentQuestionList, message, status, rawData }`
 */
export async function getMicrocredentialSingleDiscussionStudentQuestion(studentId = 0, microCourseId = 0) {
    try {
        const inputDto = buildGetMicrocredentialSingleDiscussionStudentQuestionInput(studentId, microCourseId);
        const response = await apiClient('api/MicroDiscussionForumAPI/GetMicrocredentialSingleDiscussionStudentQuestion', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetMicrocredentialSingleDiscussionStudentQuestionErrorOutput(response.data, response.status);
        }

        const outputDto = parseGetMicrocredentialSingleDiscussionStudentQuestionOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in getMicrocredentialSingleDiscussionStudentQuestion:', error);
        return parseGetMicrocredentialSingleDiscussionStudentQuestionErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Fetches admin student review list for microcredential courses with pagination and search.
 * API: POST /api/IgnitoMicroCredencialAPI/GetMicrocredentialStudentReviewList
 * 
 * @param {number} [pageNo=1] - Page number
 * @param {number} [pageSize=10] - Page size
 * @param {string} [orderByColumn='MicrocredentialCourseReviewId'] - Column to order by
 * @param {string} [orderByDirection='DESC'] - Sort direction ('ASC'|'DESC')
 * @param {number} [totalRecords=0] - Total records count
 * @param {number} [adminId=0] - Admin identifier
 * @param {string} [searchInput=''] - Search term
 * @returns {Promise<object>} Parsed output containing `{ success, getMicrocredentialStudentReviews, pageDetail, message, status, rawData }`
 */
export async function getMicrocredentialStudentReviewList(
    pageNo = 1,
    pageSize = 10,
    orderByColumn = 'MicrocredentialCourseReviewId',
    orderByDirection = 'DESC',
    totalRecords = 0,
    adminId = 0,
    searchInput = ''
) {
    try {
        const inputDto = buildGetMicrocredentialStudentReviewListInput(
            pageNo,
            pageSize,
            orderByColumn,
            orderByDirection,
            totalRecords,
            adminId,
            searchInput
        );
        const response = await apiClient('api/IgnitoMicroCredencialAPI/GetMicrocredentialStudentReviewList', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseGetMicrocredentialStudentReviewListErrorOutput(response.data, response.status);
        }

        const outputDto = parseGetMicrocredentialStudentReviewListOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in getMicrocredentialStudentReviewList:', error);
        return parseGetMicrocredentialStudentReviewListErrorOutput({ message: error.message }, 500);
    }
}

/**
 * Deletes a student review for a microcredential course.
 * API: POST /api/IgnitoMicroCredencialAPI/DeleteMicrocredentialStudentReview
 * 
 * @param {number} [microcredentialCourseReviewId=0] - Microcredential course review ID
 * @param {number} [adminId=0] - Admin identifier
 * @returns {Promise<object>} Parsed output containing `{ success, message, status, errorDescription, rawData }`
 */
export async function deleteMicrocredentialStudentReview(microcredentialCourseReviewId = 0, adminId = 0) {
    try {
        const inputDto = buildDeleteMicrocredentialStudentReviewInput(microcredentialCourseReviewId, adminId);
        const response = await apiClient('api/IgnitoMicroCredencialAPI/DeleteMicrocredentialStudentReview', {
            method: 'POST',
            headers: inputDto.headers,
            body: inputDto.body
        });

        if (!response.ok && response.status !== 200) {
            return parseDeleteMicrocredentialStudentReviewErrorOutput(response.data, response.status);
        }

        const outputDto = parseDeleteMicrocredentialStudentReviewOutput(response.data, response.status);
        return outputDto;
    } catch (error) {
        console.error('Error in deleteMicrocredentialStudentReview:', error);
        return parseDeleteMicrocredentialStudentReviewErrorOutput({ message: error.message }, 500);
    }
}

























