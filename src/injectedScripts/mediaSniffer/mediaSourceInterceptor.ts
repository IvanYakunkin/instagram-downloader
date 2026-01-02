import { generateRandomString } from "../../utils/generateRandomString";
import { bufferUrlPairs, links, mediaSourceBlobMap } from "./bufferStore";
import { findUrlByBuffer } from "./utils";

export const overrideMediaSource = () => {
    const originalMediaSourceConstructor = window.MediaSource;

    window.MediaSource = new Proxy(originalMediaSourceConstructor, {
        construct(target, args, newTarget) {
            const instance = Reflect.construct(target, args, newTarget);
            const originalAddSourceBuffer = instance.addSourceBuffer;

            instance.mediaSourceUid = generateRandomString();

            instance.addSourceBuffer = function(mimeType: string) {
                const sourceBuffer = originalAddSourceBuffer.call(this, mimeType);
                const mediaSourceUid = this.mediaSourceUid;
                const originalAppendBuffer = sourceBuffer.appendBuffer;

                sourceBuffer.appendBuffer = function(data: ArrayBuffer | ArrayBufferView) {
                    if (ArrayBuffer.isView(data)) {
                        const realUrl = findUrlByBuffer(bufferUrlPairs, new Uint8Array(data.buffer));
                        if(realUrl){
                            if(!links.some(l => l.blobUrl === mediaSourceBlobMap.get(mediaSourceUid) && l.realUrl === realUrl)){
                                const blobUrl = mediaSourceBlobMap.get(mediaSourceUid);
                                if(blobUrl) {
                                    links.push({realUrl, blobUrl});
                                    window.postMessage({source: 'EXT_FETCH_INTERCEPT', links: links, }, '*');
                                }
                            }
                        }   
                    }
                    return originalAppendBuffer.call(this, data);
                };
                return sourceBuffer;
            };

            return instance;
        },
    });
}