import fs from 'node:fs';
import path from 'node:path';
import { BlobServiceClient } from '@azure/storage-blob';
import mime from 'mime-types';
import { CONFIG } from '../config';

const blobService = BlobServiceClient.fromConnectionString(
    CONFIG.azure.azureStorageConnectionString,
);

export namespace AzureService {
    export function getContainerClient(containerName: string) {
        return blobService.getContainerClient(containerName);
    }
}
