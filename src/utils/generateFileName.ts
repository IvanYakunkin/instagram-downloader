import { generateRandomString } from "./generateRandomString";

// Filename generates as {Channel Name}-{Date of post}-{Random String}
export const generateFileName = (containerTag: HTMLElement, extension: string = "jpg", randomLength: number = 4) => {
    const channelName = getChannelName(containerTag);
    const randomString = generateRandomString(randomLength);
    const postDate = getPostDate(containerTag);

    if(!channelName){
        console.log("Extenstion error: Channel name not found")
        return null;
    }
    else if(postDate){
        return `${channelName}-${postDate}-${randomString}.${extension}`;
    }

    return `${channelName}-${randomString}.${extension}`;
}

// Date format - MM-DD-YYYY
const getPostDate = (containerTag: HTMLElement) => {
    const timeTags = Array.from(containerTag.querySelectorAll("time"));
    const lastTimeTag = timeTags[timeTags.length - 1];
    const datetimeAttr = lastTimeTag.getAttribute("datetime");
    
    if(datetimeAttr){
        const date: Date = new Date(datetimeAttr);
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const year = date.getUTCFullYear();
        const postDate = `${month}-${day}-${year}`;

        return postDate;
    }

    return null;
}

const getChannelName = (conatinerTag: HTMLElement) => {
    const links = conatinerTag.querySelectorAll<HTMLAnchorElement>("a");
    let  channelNameLink: HTMLElement | null = null;

    // Channel link always has "tabIndex=0" attribute
    for(const link of Array.from(links)){
        if(link.tabIndex === 0){
            channelNameLink = link;
            break;
        }
    }

    if(channelNameLink){
        let channelName = channelNameLink.getAttribute("href");
        if(channelName){
            channelName = channelName.replace(/\//g, '');
            return channelName;
        }
    }
    
    console.log("Extenstion Error: Channel tag not found");

    return null;
}