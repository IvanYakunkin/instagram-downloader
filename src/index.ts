import { useMainPageObserver } from "./observers/mainPageObserver";
import { usePostPageObserver } from "./observers/postPageObserver";
import { useReelPageObserver } from "./observers/reelPageObserver";
import { useReelsPageObserver } from "./observers/reelsPageObserver";
import { findCurrentRoute, useRouterObserver } from "./observers/routerObserver";
import { useStoriesPageObserver } from "./observers/storiesPageObserver";
import { pageSelectors } from "./selectors/pageSelectors";
import { setVideoLinks } from "./states/videoLinks";
import { IRouter } from "./types/global";
import { injectProgressContainer } from "./utils/progressPopup";

const router: IRouter[] = [
    {path: "", targetSelector: pageSelectors.main.container, callback: useMainPageObserver},
    {path: "p", targetSelector: pageSelectors.post.container, callback: usePostPageObserver},
    {path: "stories", targetSelector: pageSelectors.stories.container, callback: useStoriesPageObserver},
    {path: "reels", targetSelector: pageSelectors.reels.container, callback: useReelsPageObserver},
    {path: "reel", targetSelector: pageSelectors.reel.container, callback: useReelPageObserver},
];

// Inject scripts that modify some built-in methods
(function() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injectedScripts.js');
    script.type = 'text/javascript';

    (document.head || document.documentElement).appendChild(script);
}());

// Use observer when navigating
window.addEventListener('pushstate', () => {
    const currentRoute = findCurrentRoute(router);
    if(currentRoute) useRouterObserver(currentRoute);
});

window.addEventListener('popstate', () => {
    const currentRoute = findCurrentRoute(router);
    if(currentRoute) useRouterObserver(currentRoute);
});

// Initial page loading
window.addEventListener("DOMContentLoaded", () => {
    injectProgressContainer();
    const currentRoute = findCurrentRoute(router);
    if(currentRoute) useRouterObserver(currentRoute);
});

// Receive videos
window.addEventListener('message', (event) => {
    if (
        event.source !== window ||
        event.data?.source !== 'EXT_FETCH_INTERCEPT'
    ) {
        return;
    }
    setVideoLinks(event.data.links);
});



