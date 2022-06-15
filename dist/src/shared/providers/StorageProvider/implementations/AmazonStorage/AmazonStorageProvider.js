"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonStorageProvider = void 0;
const AWS = __importStar(require("aws-sdk"));
const mime_1 = __importDefault(require("../../../../../shared/utils/mime"));
class AmazonStorageProvider {
    constructor() {
        this.s3 = new AWS.S3({ region: process.env.AWS_BUCKET_REGION });
        this.bucket = process.env.AWS_S3_BUCKET;
    }
    async upload({ file, fileName, isPublic, }) {
        const { Location: url } = await this.s3
            .upload({
            Bucket: this.bucket,
            Key: fileName,
            Body: file,
            ContentType: this.contentType(fileName),
            ACL: isPublic ? 'public-read' : undefined,
        })
            .promise();
        return { url };
    }
    download({ fileKey, }) {
        const fileStream = this.s3
            .getObject({
            Bucket: this.bucket,
            Key: fileKey,
        })
            .createReadStream();
        return { file: fileStream };
    }
    async delete({ fileName, }) {
        await this.s3
            .deleteObject({ Bucket: this.bucket, Key: fileName })
            .promise();
    }
    contentType(filename) {
        const extension = filename.split('.').pop();
        const mime = new mime_1.default();
        const contentType = mime.toContentType(extension);
        if (!contentType)
            throw new Error('Unsupported file type');
        return contentType;
    }
}
exports.AmazonStorageProvider = AmazonStorageProvider;
//# sourceMappingURL=AmazonStorageProvider.js.map