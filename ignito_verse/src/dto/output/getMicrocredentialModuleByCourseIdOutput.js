export function parseGetMicrocredentialModuleByCourseIdOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? isHttpOk);

    const rawList = Array.isArray(rawJson?.microcredentialModuleList) 
        ? rawJson.microcredentialModuleList 
        : Array.isArray(rawJson?.data) 
            ? rawJson.data 
            : [];

    const moduleList = rawList.map(item => ({
        microcredentialModuleMasterId: item.microcredentialModuleMasterId || item.id || 0,
        microcredentialCourseId: item.microcredentialCourseId || 0,
        moduleName: item.moduleName || item.title || '',
        moduleDescription: item.moduleDescription || item.description || '',
        moduleBannerImage: item.moduleBannerImage || item.image || item.bannerImage || '',
        ...item
    }));

    return {
        success: isSuccess,
        isSuccess: isSuccess,
        status,
        message: rawJson?.message || '',
        errorDescription: rawJson?.errorDescription || '',
        errorNo: rawJson?.errorNo || 0,
        microcredentialModuleList: moduleList,
        data: moduleList,
        rawData: rawJson
    };
}

export function parseGetMicrocredentialModuleByCourseIdErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        isSuccess: false,
        status,
        message: rawJson?.message || 'Failed to fetch microcredential module list',
        errorDescription: rawJson?.errorDescription || rawJson?.error || 'Network/Server Error',
        errorNo: rawJson?.errorNo || status,
        microcredentialModuleList: [],
        data: [],
        rawData: rawJson
    };
}
