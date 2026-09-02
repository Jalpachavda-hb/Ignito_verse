import { apiClient } from './apiClient';
import { buildMicrocredentialCourseBindDataListInput } from '../dto/input/microcredentialCourseBindDataListInput';
import { parseMicrocredentialCourseBindDataListOutput, parseMicrocredentialCourseBindDataListErrorOutput } from '../dto/output/microcredentialCourseBindDataListOutput';

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
