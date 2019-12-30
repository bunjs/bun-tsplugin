"use strict";
const tss = require("typescript/lib/tsserverlibrary");
class MyLanguageServiceHost {
    constructor() {
        this.files = {};
        this.log = () => { };
        this.trace = () => { };
        this.error = () => { };
        this.getCompilationSettings = tss.getDefaultCompilerOptions;
        this.getScriptIsOpen = () => true;
        this.getCurrentDirectory = () => "";
        this.getDefaultLibFileName = () => "lib";
        this.extraLength = 0;
        this.getScriptVersion = (fileName) => this.files[fileName].ver.toString();
        this.getScriptSnapshot = (fileName) => {
            return this.files[fileName].file;
        };
    }
    getScriptFileNames() {
        var names = [];
        for (var name in this.files) {
            if (this.files.hasOwnProperty(name)) {
                names.push(name);
            }
        }
        return names;
    }
    addFile(fileName, body) {
        var snap = tss.ScriptSnapshot.fromString(body);
        snap.getChangeRange = _ => undefined;
        var existing = this.files[fileName];
        if (existing) {
            this.files[fileName].ver++;
            this.files[fileName].file = snap;
        }
        else {
            this.files[fileName] = { ver: 1, file: snap };
        }
    }
}
module.exports = MyLanguageServiceHost;
//# sourceMappingURL=Service.js.map