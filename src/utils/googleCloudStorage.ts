import { Storage } from '@google-cloud/storage';

export const uploadFile = async (filePath: string, filename: string, mimetype?: string) => {
    const clientEmail = process.env.GOOGLE_CLOUD_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY;
    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET!;

    if (!clientEmail || !privateKey) {
        throw new Error(`The CLIENT_EMAIL and PRIVATE_KEY environment variables are required for this sample.`);
    }

    const storage = new Storage({
        credentials: {
            client_email: clientEmail,
            private_key: process.env.NODE_ENV === 'production' ? privateKey.split(String.raw`\n`).join('\n') : privateKey,
        }
    });

    let uploadRes;

    if (mimetype) {
        uploadRes =  await storage.bucket(bucketName).upload(filePath, { destination: filename, metadata: { contentType: mimetype } });    
    } else {
        uploadRes =  await storage.bucket(bucketName).upload(filePath, { destination: filename });
    }
    
    await storage.bucket(bucketName).file(filename).makePublic();
    const url = `https://storage.googleapis.com/${bucketName}/${filename}`;
    const { name } = uploadRes[0].metadata;

    return { name, url };
};

export const deleteFile = async (filename: string) => {
    const clientEmail = process.env.GOOGLE_CLOUD_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY;
    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET!;

    if (!clientEmail || !privateKey) {
        throw new Error(`The CLIENT_EMAIL and PRIVATE_KEY environment variables are required for this sample.`);
    }

    const storage = new Storage({
        credentials: {
            client_email: clientEmail,
            private_key: process.env.NODE_ENV === 'production' ? privateKey.split(String.raw`\n`).join('\n') : privateKey,
        }
    });
    
    await storage.bucket(bucketName).file(filename).delete();
};