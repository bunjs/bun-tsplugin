"use strict";
const setProxy = require("./setProxy");
const util_1 = require("./util");
module.exports = (modules) => {
    const ts = modules.typescript;
    function create(info) {
        const whatToRemove = info.config.remove || ["caller"];
        const appconfPath = info.config.appPath;
        const isSingle = info.config.isSingle;
        // Diagnostic logging
        info.project.projectService.logger.msg("I'm getting set up now! Check the log for this message.");
        let _getScriptSnapshot = info.languageServiceHost.getScriptSnapshot;
        let extraLength = 0;
        info.languageServiceHost.getScriptSnapshot = function (fileName) {
            // return _getScriptSnapshot.call(info.languageServiceHost, fileName);
            let snap = _getScriptSnapshot.call(info.languageServiceHost, fileName);
            // let body = fs.readFileSync(fileName).toString();
            let body = snap?.getText(0, snap.getLength());
            if (fileName.indexOf('node_modules') !== -1) {
                return ts.ScriptSnapshot.fromString(body);
            }
            let projectPath = (0, util_1.getProjectPath)(fileName);
            if (!projectPath) {
                return ts.ScriptSnapshot.fromString(body);
            }
            let appPath = (0, util_1.getAppPath)(projectPath, appconfPath, fileName);
            if (fileName.indexOf(appPath) === -1) {
                return ts.ScriptSnapshot.fromString(body);
            }
            let appName = (0, util_1.getAppName)(projectPath, appconfPath, fileName, isSingle);
            const globalModule = (0, util_1.getGlobalModule)(appconfPath, fileName);
            let currentKey = (0, util_1.getFuncName)(fileName, appPath);
            let str = '';
            Object.entries(globalModule).forEach(([key, value]) => {
                // 过滤自身名字、已require引入的名字 以及 未引用的名字
                const regExp = new RegExp('(\?\<\!\\/\\/[\\s]*)import[\\s]+' + key);
                if (key === currentKey || body.indexOf(key) === -1 || body.match(regExp)) {
                    return;
                }
                str += 'import ' + key + ' = require("' + value + '");\n';
            });
            if (body.indexOf('extends App') !== -1) {
                str += 'var App = bun.app' + (appName ? '.' + appName : '') + '.class;\n';
            }
            // info.project.projectService.logger.msg("2233333333333"+str);
            // extraLength = str.length;
            // str = "import Common_BasePage = require('../../common/BasePage.ts');";
            body = body + str;
            return ts.ScriptSnapshot.fromString(body);
        };
        // const languageService = ts.createLanguageService(info.languageServiceHost, ts.createDocumentRegistry());
        const languageService = info.languageService;
        // Set up decorator
        let proxy = Object.create(null);
        for (let k of Object.keys(languageService)) {
            const x = languageService[k];
            proxy[k] = (...args) => x.apply(languageService, args);
        }
        proxy = setProxy(languageService, proxy, extraLength, info);
        return proxy;
    }
    return { create };
};
//# sourceMappingURL=index.js.map