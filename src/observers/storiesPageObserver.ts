import { pageSelectors } from "../selectors/pageSelectors";
import { IStyles } from "../types/global";
import { setDownloadButton } from "../utils/setDownloadButton";

export const useStoriesPageObserver = () => {
    const localStyles: IStyles = {
        color: "white",
        "padding-left": "5px",
    }
    const container: HTMLElement | null = document.querySelector(pageSelectors.stories.container);

    if(container){
        const containerElement: HTMLElement | null = container.querySelector('[class="x5yr21d"]');
        if(containerElement && containerElement.children.length === 3){
            setDownloadButton(container, pageSelectors.stories.tools, pageSelectors.stories.toolsCss, localStyles);
        }
    }

    return new MutationObserver((mutation) => {             
        for(let i = 0; i < mutation.length; i++){
            const addedElements = mutation[i].addedNodes;
            if (addedElements.length) {
                const addedElement = addedElements[0] as HTMLElement;
                const containerElement: HTMLElement | null = addedElement.querySelector('[class="x5yr21d"]');
                if(containerElement && containerElement.children.length === 3){
                    setDownloadButton(containerElement, pageSelectors.stories.tools, pageSelectors.stories.toolsCss, localStyles);
                }   
            }
        }
    });
}