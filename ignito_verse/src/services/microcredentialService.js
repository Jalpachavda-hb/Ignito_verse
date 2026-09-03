import { apiClient } from './apiClient';
import { buildMicrocredentialCourseBindDataListInput } from '../dto/input/microcredentialCourseBindDataListInput';
import { parseMicrocredentialCourseBindDataListOutput, parseMicrocredentialCourseBindDataListErrorOutput } from '../dto/output/microcredentialCourseBindDataListOutput';
import { buildGetMicroCourseTopicDetailInput } from '../dto/input/getMicroCourseTopicDetailInput';
import { parseGetMicroCourseTopicDetailOutput, parseGetMicroCourseTopicDetailErrorOutput } from '../dto/output/getMicroCourseTopicDetailOutput';
import { buildMicroCredencialWatchvideoAddUpdateInput } from '../dto/input/microCredencialWatchvideoAddUpdateInput';
import { parseMicroCredencialWatchvideoAddUpdateOutput, parseMicroCredencialWatchvideoAddUpdateErrorOutput } from '../dto/output/microCredencialWatchvideoAddUpdateOutput';

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
    selectedLevelIds = ''
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
            selectedLevelIds
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
