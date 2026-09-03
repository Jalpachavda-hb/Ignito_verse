/**
 * INPUT PARAMETER FILE: Common Upload File Input DTO Builder
 * Builds FormData body for CommonUploadFile POST request.
 * 
 * @param {File|File[]|FileList} files - Single File, FileList, or array of Files to upload
 * @param {string} [uploadSourceKey='UploadSource'] - Form key for upload source
 * @param {string} [uploadSourceValue=''] - Form value for upload source (e.g. 'IntroImage', 'ProfessorImage')
 * @param {string} [oldPath=''] - Existing file path if replacing/updating
 * @returns {object} Request headers and FormData body
 */
export function buildCommonUploadFileInput(
    files,
    uploadSourceKey = 'UploadSource',
    uploadSourceValue = '',
    oldPath = ''
) {
    const formData = new FormData();

    if (files) {
        if (files instanceof FileList || Array.isArray(files)) {
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });
        } else if (files instanceof File) {
            formData.append('files', files);
        } else if (files instanceof FormData) {
            return {
                headers: {},
                body: files
            };
        }
    }

    if (oldPath) {
        formData.append('oldPath', oldPath);
    }

    if (uploadSourceKey && uploadSourceValue) {
        formData.append(uploadSourceKey, uploadSourceValue);
    }

    return {
        headers: {},
        body: formData
    };
}
