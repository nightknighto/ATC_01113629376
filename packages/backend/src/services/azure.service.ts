import fs from 'node:fs';
import path from 'node:path';
import { BlobServiceClient } from '@azure/storage-blob';
import mime from 'mime-types';
import { CONFIG } from '../config';

const blobService = BlobServiceClient.fromConnectionString(
    CONFIG.azure.azureStorageConnectionString,
);

export namespace AzureService {
    async function createContainer(containerName: string) {
        const containerClient = blobService.getContainerClient(containerName);

        const createContainerResponse = await containerClient.create({
            access: 'container',
        });

        console.log(
            `Create container ${containerName} successfully`,
            createContainerResponse.requestId,
        );
    }

    async function doesContainerExist(containerName: string) {
        const containerClient = blobService.getContainerClient(containerName);

        return await containerClient.exists();
    }

    async function emptyContainer(containerName: string) {
        const containerClient = blobService.getContainerClient(containerName);

        for await (const blob of containerClient.listBlobsFlat()) {
            await containerClient.deleteBlob(blob.name);
        }

        console.log(`Emptied container ${containerName}`);
    }

    export async function deleteContainer(containerName: string) {
        const containerClient = blobService.getContainerClient(containerName);

        await containerClient.delete();
        console.log(`Container ${containerName} deleted successfully`);
    }

    async function uploadFilesFromDirectory(
        containerName: string,
        directoryPath: string,
        basePath: string,
    ) {
        const files = fs
            .readdirSync(directoryPath, {
                // TODO: dont use sync
                withFileTypes: true,
                recursive: true,
            })
            .filter((item) => item.isFile());

        for (const file of files) {
            const filePath = path.join(file.parentPath, file.name);
            const relativePath = path.relative(basePath, filePath);
            const blobName = relativePath;
            await uploadFileToContainer(containerName, blobName, filePath);
        }
        console.log('Files uploaded successfully!');
    }

    async function uploadFileToContainer(
        containerName: string,
        blobName: string,
        filePath: string,
    ) {
        const containerClient = blobService.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const mimeType = mime.lookup(blobName) || 'application/octet-stream'; // Default if MIME type is not found
        const uploadBlobResponse = await blockBlobClient.uploadFile(filePath, {
            blobHTTPHeaders: {
                blobContentType: mimeType,
            },
        });

        console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    }

    export async function upload(containerName: string, directoryPath: string) {
        console.log('Checking if container exists...');

        if (await doesContainerExist(containerName)) {
            console.log('Container already exists');
            await emptyContainer(containerName);
            console.log('Container emptied');
        } else {
            console.log('Creating container...');
            await createContainer(containerName);
        }
        console.log('Starting uploading files...');
        await uploadFilesFromDirectory(containerName, directoryPath, directoryPath);
        console.log(`Uploaded files to ${containerName}!`);
    }

    export async function makeContainerPublic(containerName: string) {
        const containerClient = blobService.getContainerClient(containerName);
        await containerClient.setAccessPolicy('container');
    }

    export function getContainerClient(containerName: string) {
        return blobService.getContainerClient(containerName);
    }
}
