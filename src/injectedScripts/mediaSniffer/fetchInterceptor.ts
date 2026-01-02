import { bufferUrlPairs } from "./bufferStore";
import { extractUrl, removeBytes } from "./utils";

export const overrideFetch = () => {
    const origFetch = window.fetch;
    
    window.fetch = async (...args) => {
        const fetchResponse = await origFetch(...args);
        const cloneRes = fetchResponse.clone();
        const fullUrl = extractUrl(args[0]);

        if(fullUrl){
            const realUrl = removeBytes(fullUrl);
            if(!bufferUrlPairs.some(b => b.realUrl === realUrl)){
                const buffer = await cloneRes.arrayBuffer();
                bufferUrlPairs.push({buffer, realUrl});
            }
        }

        return fetchResponse;
    }
}