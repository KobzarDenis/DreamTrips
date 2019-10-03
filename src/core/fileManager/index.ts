import * as AWS from 'aws-sdk';
import {BucketName} from "aws-sdk/clients/s3";

export class FileManager {

    private static s3Client: AWS.S3;
    private static cache: Map<string, Buffer>;

    public static init(params: any) {
        const credentials = {
            accessKeyId: params.accessKeyID,
            secretAccessKey: params.accessKeySecret
        }
        FileManager.s3Client = new AWS.S3({
            credentials
        });

        FileManager.cache = new Map<string, Buffer>();
    }

    public static async getFile(key: string): Promise<Buffer> {
        if(FileManager.cache.has(key)) {
            return FileManager.getFromCache(key);
        } else {
            return new Promise<any>((resolve, reject) => {
                FileManager.s3Client.getObject({
                    Bucket: "dreamtrips-team",
                    Key: key
                }, (err, data) => {
                    if(err) {
                        reject(err);
                    } else {
                        FileManager.addToCache(key, data.Body);
                        resolve(data.Body);
                    }
                })
            });
        }
    }

    private static getFromCache(key: string): Buffer {
        return <Buffer> FileManager.cache.get(key);
    }

    private static addToCache(key: string, file: any) {
        FileManager.cache.set(key, file);
    }

}
