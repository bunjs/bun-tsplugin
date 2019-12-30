"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function getProjectPath(fileName) {
    let pathArr = fileName.split("/");
    let i = pathArr.length - 1;
    let path = _check();
    return path ? path : "";
    function _check() {
        if (i <= 0) {
            console.log("不存在相关package.json" + fileName);
            return "";
        }
        let res = pathArr.slice(0, i).join("/");
        if (exports.fsExistsSync(res + "/package.json")) {
            return res;
        }
        else {
            i--;
            return _check();
        }
    }
}
exports.getProjectPath = getProjectPath;
// todo: 针对tsconfig放在server目录下的，appconfPath要重新计算为server/appconfPath
function getAppName(projectPath, appconfPath, fileName, isSingle) {
    if (isSingle) {
        return "";
    }
    // 多应用目录结构有两种情况：
    // 1./appname/server/app
    // 2./pro/src/app/appname
    if (appconfPath.indexOf("$_appname") !== -1) {
        let apppath = path.resolve(projectPath, appconfPath.replace("$_appname", ""));
        const regExp = new RegExp(apppath.replace(/\//g, "\\/") + "\\/(.*?)\\/.*");
        if (fileName.match(regExp)) {
            return RegExp.$1;
        }
        else {
            return "";
        }
    }
    else {
        let pathArr = projectPath.split("/");
        return pathArr[pathArr.length - 1];
    }
}
exports.getAppName = getAppName;
function getAppPath(projectPath, appconfPath, fileName) {
    if (appconfPath.indexOf("$_appname") !== -1) {
        let apppath = path.resolve(projectPath, appconfPath.replace("$_appname", ""));
        const regExp = new RegExp(apppath.replace(/\//g, "\\/") + "\\/(.*?)\\/.*");
        if (fileName.match(regExp)) {
            return apppath + "/" + RegExp.$1;
        }
        else {
            console.log("不存在相关app" + fileName);
            return "";
        }
    }
    else {
        return path.resolve(projectPath, appconfPath);
    }
}
exports.getAppPath = getAppPath;
/**
 * 拼接方法名
 *
 * 规则：文件全路径-keypath
 * 如：path:app/example/action/api/home, keypath: app/example/
 * 则拼出来的方法名为：BUN_Action_Api_Home
 * @return string
 */
exports.getFuncName = (path, keypath) => {
    let newpath = path.replace(".ts", "");
    if (keypath === newpath) {
        newpath = "";
    }
    else {
        newpath = newpath.replace(keypath + "/", "");
    }
    const patharr = newpath.split("/");
    const arr = [];
    for (const item of patharr) {
        if (!item) {
            continue;
        }
        // 首字母大写
        arr.push(item.replace(/^\S/g, s => {
            return s.toUpperCase();
        }));
    }
    return arr.join("_");
};
function getModuleList(path, keyPath, context, fileName) {
    let key = "";
    if (!exports.fsExistsSync(path)) {
        // 如果必要且找不到对应目录，则报警
        return;
    }
    // const fstat = fs.lstatSync(path);
    // if (fstat.isFile()) {
    //     // 对文件进行直接引入操作
    //     key = getFuncName(path, keyPath);
    //     if (key.split("_").length > 1) {
    //         context[key] = path;
    //     }
    //     // context[key] = path;
    //     return;
    // }
    const files = fs.readdirSync(path);
    files.forEach(filename => {
        const stat = fs.lstatSync(path + "/" + filename);
        if (stat.isDirectory()) {
            // 是文件夹继续循环
            getModuleList(path + "/" + filename, keyPath, context, fileName);
            return;
        }
        // 判断文件后缀
        if (!exports.ists(filename)) {
            return;
        }
        key = exports.getFuncName(path + "/" + filename, keyPath);
        if (key.split("_").length <= 1)
            return;
        filename = filename.split(".")[0];
        function getRelativePath(path, currentPath) {
            const pathArr = path.split("/");
            const currentPathArr = currentPath.split("/");
            let pathArrRes = [...pathArr];
            let currentPathArrRes = [...currentPathArr];
            for (let index = 0; index < currentPathArr.length; index++) {
                if (currentPathArr[index] === pathArr[index]) {
                    pathArrRes[index] = "";
                    currentPathArrRes[index] = "";
                }
                else {
                    break;
                }
            }
            pathArrRes = pathArrRes.filter(item => !!item);
            currentPathArrRes = currentPathArrRes.filter(item => !!item);
            currentPathArrRes.splice(0, 1);
            currentPathArrRes = currentPathArrRes.map(item => "..");
            // 如果没有值，说明是当前目录
            if (currentPathArrRes.length === 0) {
                currentPathArrRes.push(".");
            }
            return currentPathArrRes.join("/") + "/" + pathArrRes.join("/");
        }
        const relativePath = getRelativePath(path + "/" + filename, fileName);
        context[key] = relativePath;
    });
}
function getGlobalModule(appconfPath, fileName) {
    const projectPath = getProjectPath(fileName);
    const appPath = getAppPath(projectPath, appconfPath, fileName);
    let res = {};
    getModuleList(appPath, appPath, res, fileName);
    return res;
}
exports.getGlobalModule = getGlobalModule;
// export function selectWords(body: string) {
//     let regExp = /BUN_[A-Za-z_]+/g;
//     let res = body.match(regExp);
//     return res ? res : [];
// }
// export function getDestPath(appPath: string, word: string) {
//     if (/BUN_.*/.test(word)) {
//         let pathArr = word.replace('BUN_', '').split('_');
//         const destPath = appPath + '/' + pathArr.map((it: any, idx: number) => {
//             if (idx === pathArr.length - 1) {
//                 return it.replace(/^\S/g, (s: string) => {
//                     return s.toUpperCase();
//                 });
//             }
//             return it.replace(/^\S/g, (s: string) => {
//                 return s.toLowerCase();
//             });
//         }).join('/') + '.ts';
//         return destPath;
//     }
//     return '';
// }
exports.fsExistsSync = (path) => {
    try {
        fs.accessSync(path, fs.constants.F_OK);
    }
    catch (e) {
        return false;
    }
    return true;
};
exports.ists = (filename) => {
    // 判断文件后缀
    const pos = filename.lastIndexOf(".");
    if (pos === -1) {
        return false;
    }
    const filePrefix = filename.substr(0, pos);
    const filePostfix = filename.substr(pos + 1);
    if (filePrefix.length < 1 ||
        filePostfix.length < 1 ||
        filePostfix !== "ts") {
        return false;
    }
    return true;
};
//# sourceMappingURL=util.js.map