import { mediaSourceBlobMap } from "./bufferStore";

export const overrideCreateObjectUrl = () => {
    const origCreate = URL.createObjectURL;

    URL.createObjectURL = function(mediaSource) {
        const blobUrl = origCreate.call(URL, mediaSource);
        // Get the unique id from the modified MediaSource
        const mediaSourceUid = (mediaSource as any).mediaSourceUid;
        mediaSourceBlobMap.set(mediaSourceUid, blobUrl);

        return blobUrl;
    };
}