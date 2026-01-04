import { pageSelectors } from "../selectors/pageSelectors";
import { setDownloadButton } from "../utils/setDownloadButton";

export const usePostPageObserver = (parentTag?: HTMLElement | null) => {
    const localCss = {"padding-left": "10px", "padding-right": "5px"};
    if(parentTag){
        const target: HTMLElement | null = parentTag.querySelector("article[role='presentation']");
        if(target && target.role === "presentation") setDownloadButton(target, pageSelectors.post.tools, pageSelectors.post.toolsCss, localCss);
    }

    return new MutationObserver((mutation) => {             
        for(let i = 0; i < mutation.length; i++){
            const addedElements = mutation[i].addedNodes;
            if (addedElements.length) {
                const addedElement = addedElements[0] as HTMLElement;
                if(addedElement.nodeName === "ARTICLE" && addedElement.role === "presentation"){
                    setDownloadButton(addedElement, pageSelectors.post.tools, pageSelectors.post.toolsCss, localCss);
                }
            }
        }
    });

}