declare class MimeClass {
    getExtension(contentType: string): string | false;
    toContentType(extension: string): string | false;
}
export default MimeClass;
