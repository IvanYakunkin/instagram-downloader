import { pageSelectors } from "../selectors/pageSelectors";
import { IStyles } from "../types/global";
import { setDownloadButton } from "../utils/setDownloadButton";

export const useReelsPageObserver = (parentTag?: HTMLElement | null) => {
    const buttonCss: IStyles = 
    {
        "margin-bottom": "28px", 
        position: "relative", 
        top: "-5px"
    }

    // Load server-rendered reels (usually 2 elements)
    if(parentTag){
        const initializedReels = parentTag.children;
        for(const reel of Array.from(initializedReels)){
            setDownloadButton(reel as HTMLElement, pageSelectors.reels.tools, pageSelectors.reels.toolsCss, buttonCss, 4);
        }
    }

    return new MutationObserver((mutation) => {             
        for(let i = 0; i < mutation.length; i++){
            const addedElements = mutation[i].addedNodes;
            if (addedElements.length) {
                const addedElement = addedElements[0] as HTMLElement;
                // Button also adds to mutation, so need to check if it is the corrcect element
                if(addedElement.classList.contains("x1qjc9v5")){
                    setDownloadButton(addedElement, pageSelectors.reels.tools, pageSelectors.reels.toolsCss, buttonCss, 4);
                }
            }
        }
    });
}