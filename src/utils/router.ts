import { registerRouterObserver } from "../observers/routerObserver";
import { IRouter } from "../types/global";

let lastRegisteredObserver: MutationObserver | null = null;
let lastUrl: string | null = null;

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
                    const receivedObserver = registerRouterObserver(() => currentRouter.callback(searchParentElement), searchParentElement);                    
                    if(receivedObserver instanceof MutationObserver) lastRegisteredObserver = receivedObserver;
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