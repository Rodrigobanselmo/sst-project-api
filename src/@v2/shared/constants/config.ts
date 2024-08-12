if (!process.env.NODE_ENV) throw new Error('NODE_ENV not defined');
if (!process.env.AWS_BUCKET_REGION) throw new Error('AWS_BUCKET_REGION not defined');
if (!process.env.AWS_S3_BUCKET) throw new Error('AWS_S3_BUCKET not defined');
if (!process.env.AWS_SQS_PGR_URL) throw new Error('AWS_SQS_PGR_URL not defined');

export const config = {
    SYSTEM: {
        NODE_ENV: process.env.NODE_ENV,
    },
    AWS: {
        S3_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
        S3_BUCKET: process.env.AWS_S3_BUCKET,
        SQS_PGR_URL: process.env.AWS_SQS_PGR_URL,
    },
}