"use strict";
const tss = require("typescript/lib/tsserverlibrary");
const fs = require("fs");
class MyLanguageServiceHost {
    files = {};
    log = () => { };
    trace = () => { };
    error = () => { };
    getCompilationSettings = tss.getDefaultCompilerOptions;
    getScriptIsOpen = () => true;
    getCurrentDirectory = () => "";
    getDefaultLibFileName = () => "lib";
    extraLength = 0;
    getScriptVersion = (fileName) => this.files[fileName].ver.toString();
    getScriptSnapshot = (fileName) => {
        return this.files[fileName].file;
    };
    getScriptFileNames() {
        var names = [];
        for (var name in this.files) {
            if (this.files.hasOwnProperty(name)) {
                names.push(name);
            }
        }
        return names;
    }
    fileExists(path) {
        return fs.existsSync(path);
    }
    readFile(path, encoding) {
        if (fs.existsSync(path)) {
            return fs.readFileSync(path, { encoding: encoding || 'utf8' });
        }
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