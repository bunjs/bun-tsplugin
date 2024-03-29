import * as tss from 'typescript/lib/tsserverlibrary';
import fs = require('fs');
class MyLanguageServiceHost implements tss.LanguageServiceHost {
    files: { [fileName: string]: { file: tss.IScriptSnapshot; ver: number } } = {}

    log = () => { };
    trace = () => { };
    error = () => { };
    getCompilationSettings = tss.getDefaultCompilerOptions;
    getScriptIsOpen = () => true;
    getCurrentDirectory = () => "";
    getDefaultLibFileName = () => "lib";
    extraLength = 0;
    getScriptVersion = (fileName: string) => this.files[fileName].ver.toString();
    getScriptSnapshot = (fileName: string) => {
        
        return this.files[fileName].file;
    };

    getScriptFileNames(): string[] {
        var names: string[] = [];
        for (var name in this.files) {
            if (this.files.hasOwnProperty(name)) {
                names.push(name);
            }
        }
        return names;
    }
    fileExists(path: string): boolean {
        return fs.existsSync(path);
    }
    readFile(path: string, encoding?: string) {
        if (fs.existsSync(path)) {
            return fs.readFileSync(path, { encoding: encoding || 'utf8' });
        }
    }
    addFile(fileName: string, body: string) {
        var snap = tss.ScriptSnapshot.fromString(body);
        snap.getChangeRange = _ => undefined;
        var existing = this.files[fileName];
        if (existing) {
            this.files[fileName].ver++;
            this.files[fileName].file = snap
          } else {
            this.files[fileName] = { ver: 1, file: snap };
        }
    }
}
export = MyLanguageServiceHost