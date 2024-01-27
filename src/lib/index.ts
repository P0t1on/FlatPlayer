// place files you want to import through the `$lib` alias in this folder.
import { createKeyPressEvent } from "./Input";
import { getJson, getSource } from "./Curl";
import { hasFlags, removeFlag, containFlags } from "./Bitwise";

export { 
    createKeyPressEvent, 
    getJson, getSource,
    hasFlags, removeFlag, containFlags
};
