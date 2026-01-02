import { BufferInfo, ILinks } from "../../types/global";

// The array contains objects that map real URLs to Blob URLs
export const links: ILinks[] = [];
// Stores the unique mediaSource identifier as a key and the blob-url as a value.
export const mediaSourceBlobMap = new Map<string, string>();

export const bufferUrlPairs: BufferInfo[] = [];