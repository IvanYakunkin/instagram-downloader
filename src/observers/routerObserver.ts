import { IRouter } from "../types/global";

let lastRegisteredObserver: MutationObserver | null = null;
let lastUrl: string | null = window.location.pathname;

export const findCurrentRoute = (router: IRouter[]) => {
    const segments = window.location.pathname.split('/').filter(segment => segment !== '');
    if(segments.length === 0) segments[0] = "";
    const currentRouter = router.find(route => route.path === segments[0]);
    // Disconnect the last observer
    if(segments[0] !== lastUrl && lastRegisteredObserver){
        lastRegisteredObserver.disconnect();
    }

    lastUrl = segments[0];

    return currentRouter;
}

export const useRouterObserver = (currentRouter: IRouter) => {
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const searchParentElement: HTMLElement | null = document.querySelector(currentRouter.targetSelector);
                if(searchParentElement){
                    observer.disconnect();
                    registerPageObserver(() => currentRouter.callback(searchParentElement), searchParentElement);                    
                    break;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Get elements through the observer or one element directly through the selector
export const registerPageObserver = (callback: (element: HTMLElement | null) => 
    MutationObserver | boolean | void, searchParentElement: HTMLElement | null) => {

    if(!searchParentElement){
        console.log("Extension Error: searchParentElement not found");
        return;
    }

    const clb = callback(searchParentElement);
    if(clb === false) return false;
    if(clb instanceof MutationObserver){
        lastRegisteredObserver = clb;
        clb.observe(searchParentElement, {
            subtree: true,
            childList: true,
        });
    }

    return clb;
}