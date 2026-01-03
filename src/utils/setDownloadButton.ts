import { IStyles } from "../types/global";
import { downloadResource } from "./downloadMedia";

// Find a container where a download button needs to be added
const findPostTools = (containerTag: HTMLElement, toolsTagClass: string, toolsCss: Record<string, string>) => {
    const toolsTag = containerTag.querySelector(toolsTagClass) as HTMLElement | null;
    if(!toolsTag){
        console.log("Extension Error: Unable to find tools tag element");
        return null;
    }

    for(const [key, value] of Object.entries(toolsCss)){
        (toolsTag.style as any)[key] = value;
    }

    return toolsTag;
}

const generateDownloadBtn = (containerTag: HTMLElement, buttonStyles?: IStyles) => {
    const icon = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"/></svg>`
    const downloadButton = document.createElement('div');

    downloadButton.innerHTML = icon;
    downloadButton.style.cursor = "pointer";
    downloadButton.style.transition = ".2s ease-out";
    downloadButton.title = "Download";
    downloadButton.onclick = () => downloadResource(containerTag);
    if(buttonStyles){
        for(const [key, value] of Object.entries(buttonStyles)){
            (downloadButton.style as any)[key] = value;
        }
    }

    downloadButton.onmouseenter = () => {
        downloadButton.style.transform = "scale(1.1)";
    }

    downloadButton.onmouseleave = () => {
        downloadButton.style.transform = "scale(1)";
    }
    
    return downloadButton;
}

const insertAtIndex = (parent: HTMLElement, newElement: HTMLElement, index: number) => {
  const children = parent.children;
  if (index >= children.length) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, children[index]);
  }
}

export const setDownloadButton = (
    containerTag: HTMLElement,
    toolsTagClass: string,
    toolsCss: Record<string, string>,
    buttonStyles?: IStyles,
    insertIndex?: number
) => {
    const postTools = findPostTools(containerTag, toolsTagClass, toolsCss);
    if(postTools){
        const downloadBtn = generateDownloadBtn(containerTag, buttonStyles);
        if(insertIndex){
            insertAtIndex(postTools, downloadBtn, insertIndex);
        }else{
            postTools.appendChild(downloadBtn);
        }
    }
}