import { pageSelectors } from "../selectors/pageSelectors";
import { IStyles } from "../types/global";
import { setDownloadButton } from "../utils/setDownloadButton";

export const useReelPageObserver = (parentTag?: HTMLElement | null) => {
    const buttonCss: IStyles = {
        "padding-left": "10px",
    }
    if(parentTag){
        const target: HTMLElement | null = parentTag.querySelector("article");
        if(target) {
            setDownloadButton(target, pageSelectors.reel.tools, pageSelectors.reel.toolsCss, buttonCss);
        }
    }

   return new MutationObserver((mutation) => {             
        for(let i = 0; i < mutation.length; i++){
            const addedElements = mutation[i].addedNodes;
            if (addedElements.length) {
                const addedElement = addedElements[0] as HTMLElement;
                if(addedElement.nodeName === "ARTICLE"){
                    setDownloadButton(addedElement as HTMLElement, pageSelectors.reel.tools, pageSelectors.reel.toolsCss, buttonCss);
                }
            }
        }
    });
}