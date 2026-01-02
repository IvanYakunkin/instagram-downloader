import { videoLinks } from "../states/videoLinks";
import { generateFileName } from "./generateFileName";
import { addProgressBar, progressPanelTag } from "./progressPopup";

const fillChunks = async(response: Response, uniqueProgressId?: string) => {
    let receivedLength = 0;
    let progressContainer: HTMLElement | null;
    let progressFill: HTMLElement | null | undefined;
    let progressPercent: HTMLElement | null | undefined;

    const chunks = [];

    if(uniqueProgressId){
        progressContainer = document.getElementById(uniqueProgressId);
        progressFill = progressContainer?.querySelector("#progressFill");
        progressPercent = progressContainer?.querySelector("#progressPercent");
    }

    const reader = response.body!.getReader();
    const contentLength = response.headers.get('Content-Length');
    const total = contentLength ? parseInt(contentLength, 10) : null;


    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;

        if (total && progressFill && progressPercent) {
            const percent = (receivedLength / total) * 100;
            const percentLabel = Math.ceil(percent);
            progressFill.style.width = percentLabel + "%";
            progressPercent.innerHTML = percentLabel + " %";
            if(percent === 100){
                // Hide progress bar if there are no loadings
                setTimeout(() => {
                    progressContainer?.remove();
                    const progressBars = document.getElementById("progress-bars");
                    if(progressBars?.children.length === 0 && progressPanelTag){
                        progressPanelTag.style.visibility = "hidden";
                    }   
               }, 1000);
            }
        }
    }

    return chunks;
}


const downloadBlob = (blob: Blob, filename: string) => {
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = downloadUrl;
    a.download = filename;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
}

const startDownloading = async(url: string, filename: string, uniqueProgressId?: string) => {
    const photoResponse = await fetch(url);
    if(!photoResponse.ok || !photoResponse.body){
        throw new Error("Extension Error: Response was not ok");
    }

    const chunks = await fillChunks(photoResponse, uniqueProgressId);
    const blob = new Blob(chunks);
    
    downloadBlob(blob, filename);
}

export const downloadResource = (containerTag: HTMLElement) => {
    // The container in whose child elements the image will be searched
    let currentItem;
    const imagesList = containerTag.querySelector("ul._acay");
    if(imagesList){
        const firstItemIdx = 1;
        // Means that either the last or the first photo is active
        if(imagesList.children.length === 3){
            // Check if there are only two photos
            const imagePointer = imagesList.children[0] as HTMLElement;
            const imagePointerTransform = imagePointer.style.transform;
            const match = imagePointerTransform.match(/translateX\((\d+(\.\d+)?)px\)/);
            if (match) {
                const translateXInt = parseInt(match[1], 10);
                // TODO: make a more reliable check
                // TranslateX < 1000 when there are only two photos
                if(translateXInt < 1000){
                    currentItem = imagesList.children[1];
                    if(imagesList.children[2].getBoundingClientRect().x > 500 && imagesList.children[2].getBoundingClientRect().x < 700){
                        currentItem = imagesList.children[2];
                    }
                }else{
                    currentItem = imagesList.children[firstItemIdx] as HTMLElement;
                    if(currentItem.style.transform !== "translateX(0px)"){
                        currentItem = imagesList.children[imagesList.children.length - 1];
                    }
                }
            }
        }else{
            currentItem = imagesList.children[firstItemIdx+1];
        }
    }

    if(!currentItem){
        currentItem = containerTag;
    }

    let postImage: HTMLImageElement | null = null;
    const postVideo = currentItem.querySelector<HTMLVideoElement>("video");
    const allImages = Array.from(currentItem.querySelectorAll("img"));

    for(const image of allImages){
        if(image.clientWidth > 100){
            postImage = image;
        }
    }

    if(postVideo){
        const blobUrl = postVideo.src;
        const filename = generateFileName(containerTag, "mp4") || "video.mp4";    
        const uniqueProgressId = addProgressBar(filename);
        const realUrl = videoLinks.find(l => {
            if(l.blobUrl === blobUrl){
                const url = new URL(l.realUrl);
                if(url.pathname.includes("/t2/")) return true;
            }

            return false;

        })?.realUrl;

        if (!realUrl) {
            console.log("Extension Error: Video was not found");
            return;
        }
        startDownloading(realUrl, filename, uniqueProgressId);
    }else if (postImage){
        const imageUrl = postImage.src;
        const filename = generateFileName(containerTag, "jpg") || "image.jpg";
        const uniqueProgressId = addProgressBar(filename);
        startDownloading(imageUrl, filename, uniqueProgressId);
    }else{
        console.log("Extension error: Resource was not found");
    }
}