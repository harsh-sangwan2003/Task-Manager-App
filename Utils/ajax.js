import { CONFIG } from "./constants.js";

export function doAjax() {


    const promise = fetch(CONFIG.URL);
    return promise;
}