import * as tss from 'typescript/lib/tsserverlibrary';
import fs = require('fs');
import setProxy = require('./setProxy');
import {fsExistsSync, getGlobalModule, getFuncName, getAppPath, getProjectPath, getAppName} from './util';
export = (modules: { typescript: typeof tss }) => {
    const ts = modules.typescript;
    

    function create(info: tss.server.PluginCreateInfo) {
        const whatToRemove: string[] = info.config.remove || ["caller"];
        const appconfPath = info.config.appPath;
        const isSingle = info.config.isSingle;
        // Diagnostic logging
        info.project.projectService.logger.msg(
            "I'm getting set up now! Check the log for this message."
        );
        let _getScriptSnapshot = info.languageServiceHost.getScriptSnapshot;
        let extraLength = 0;
        info.languageServiceHost.getScriptSnapshot = function (fileName: string) {
            // return _getScriptSnapshot.call(info.languageServiceHost, fileName);
            let snap = _getScriptSnapshot.call(info.languageServiceHost, fileName);
            // let body = fs.readFileSync(fileName).toString();

            let body = snap?.getText(0, snap.getLength());
            if (fileName.indexOf('node_modules') !== -1) {
                return ts.ScriptSnapshot.fromString((body as string));
            }
            let projectPath = getProjectPath(fileName);
            if (!projectPath) {
                return ts.ScriptSnapshot.fromString((body as string));
            }
            let appPath = getAppPath(projectPath, appconfPath, fileName);
            if (fileName.indexOf(appPath) === -1) {
                return ts.ScriptSnapshot.fromString((body as string));
            }
            let appName = getAppName(projectPath, appconfPath, fileName, isSingle);
            
            const globalModule = getGlobalModule(appconfPath, fileName);
            let currentKey = getFuncName(fileName, appPath);
            let str = '';
            Object.entries(globalModule).forEach(([key, value]) => {
                // 过滤自身名字、已require引入的名字 以及 未引用的名字
                const regExp = new RegExp('(\?\<\!\\/\\/[\\s]*)import[\\s]+' + key);
                if (key === currentKey || (body as string).indexOf(key) === -1 || (body as string).match(regExp)) {
                    return;
                }
                str += 'import ' + key + ' = require("'+ value + '");\n';
            });
            if((body as string).indexOf('extends App') !== -1) {
                str += 'var App = bun.app'+ (appName ? '.' + appName : '') + '.class;\n';
            }
            // info.project.projectService.logger.msg("2233333333333"+str);
            
            // extraLength = str.length;
            // str = "import Common_BasePage = require('../../common/BasePage.ts');";
            body = body + str;
            return ts.ScriptSnapshot.fromString((body as string));
        };
        // const languageService = ts.createLanguageService(info.languageServiceHost, ts.createDocumentRegistry());
        const languageService = info.languageService;
        // Set up decorator
        let proxy: tss.LanguageService = Object.create(null);
        for (let k of Object.keys(languageService) as Array<
            keyof tss.LanguageService
        >) {
            const x = languageService[k];
            proxy[k] = (...args: any) => (x as any).apply(languageService, args);
        }
        proxy = setProxy(languageService, proxy, extraLength, info);
        return proxy;
    }

    return { create };
}