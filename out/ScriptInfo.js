"use strict";
// import TextStorage = require('./TextStorage');
// import {isDynamicFileName} from './util';
// import * as ts from 'typescript/lib/tsserverlibrary';
// const ScriptInfo = (function () {
//     class ScriptInfo {
//         public host: any;
//         public fileName: any;
//         public scriptKind: any;
//         public hasMixedContent: any;
//         public path: any;
//         public containingProjects: any;
//         public isDynamic: any;
//         public textStorage: any;
//         public realpath: any;
//         constructor(host, fileName, scriptKind, hasMixedContent, path, initialVersion) {
//             this.host = host;
//             this.fileName = fileName;
//             this.scriptKind = scriptKind;
//             this.hasMixedContent = hasMixedContent;
//             this.path = path;
//             /**
//                 * All projects that include this file
//                 */
//             this.containingProjects = [];
//             this.isDynamic = isDynamicFileName(fileName);
//             this.textStorage = new TextStorage(host, fileName, initialVersion, this);
//             if (hasMixedContent || this.isDynamic) {
//                 this.textStorage.reload("");
//                 this.realpath = this.path;
//             }
//             this.scriptKind = scriptKind
//                 ? scriptKind
//                 : ts.getScriptKindFromFileName(fileName);
//         }
//     /*@internal*/
//     ScriptInfo.prototype.getVersion = function () {
//         return this.textStorage.version;
//     };
//     /*@internal*/
//     ScriptInfo.prototype.getTelemetryFileSize = function () {
//         return this.textStorage.getTelemetryFileSize();
//     };
//     /*@internal*/
//     ScriptInfo.prototype.isDynamicOrHasMixedContent = function () {
//         return this.hasMixedContent || this.isDynamic;
//     };
//     ScriptInfo.prototype.isScriptOpen = function () {
//         return this.textStorage.isOpen;
//     };
//     ScriptInfo.prototype.open = function (newText) {
//         this.textStorage.isOpen = true;
//         if (newText !== undefined &&
//             this.textStorage.reload(newText)) {
//             // reload new contents only if the existing contents changed
//             this.markContainingProjectsAsDirty();
//         }
//     };
//     ScriptInfo.prototype.close = function (fileExists) {
//         if (fileExists === void 0) { fileExists = true; }
//         this.textStorage.isOpen = false;
//         if (this.isDynamicOrHasMixedContent() || !fileExists) {
//             if (this.textStorage.reload("")) {
//                 this.markContainingProjectsAsDirty();
//             }
//         }
//         else if (this.textStorage.reloadFromDisk()) {
//             this.markContainingProjectsAsDirty();
//         }
//     };
//     ScriptInfo.prototype.getSnapshot = function () {
//         return this.textStorage.getSnapshot();
//     };
//     ScriptInfo.prototype.ensureRealPath = function () {
//         if (this.realpath === undefined) {
//             // Default is just the path
//             this.realpath = this.path;
//             if (this.host.realpath) {
//                 ts.Debug.assert(!!this.containingProjects.length);
//                 var project = this.containingProjects[0];
//                 var realpath = this.host.realpath(this.path);
//                 if (realpath) {
//                     this.realpath = project.toPath(realpath);
//                     // If it is different from this.path, add to the map
//                     if (this.realpath !== this.path) {
//                         project.projectService.realpathToScriptInfos.add(this.realpath, this); // TODO: GH#18217
//                     }
//                 }
//             }
//         }
//     };
//     /*@internal*/
//     ScriptInfo.prototype.getRealpathIfDifferent = function () {
//         return this.realpath && this.realpath !== this.path ? this.realpath : undefined;
//     };
//     ScriptInfo.prototype.getFormatCodeSettings = function () { return this.formatSettings; };
//     ScriptInfo.prototype.getPreferences = function () { return this.preferences; };
//     ScriptInfo.prototype.attachToProject = function (project) {
//         var isNew = !this.isAttached(project);
//         if (isNew) {
//             this.containingProjects.push(project);
//             project.onFileAddedOrRemoved();
//             if (!project.getCompilerOptions().preserveSymlinks) {
//                 this.ensureRealPath();
//             }
//         }
//         return isNew;
//     };
//     ScriptInfo.prototype.isAttached = function (project) {
//         // unrolled for common cases
//         switch (this.containingProjects.length) {
//             case 0: return false;
//             case 1: return this.containingProjects[0] === project;
//             case 2: return this.containingProjects[0] === project || this.containingProjects[1] === project;
//             default: return ts.contains(this.containingProjects, project);
//         }
//     };
//     ScriptInfo.prototype.detachFromProject = function (project) {
//         // unrolled for common cases
//         switch (this.containingProjects.length) {
//             case 0:
//                 return;
//             case 1:
//                 if (this.containingProjects[0] === project) {
//                     project.onFileAddedOrRemoved();
//                     this.containingProjects.pop();
//                 }
//                 break;
//             case 2:
//                 if (this.containingProjects[0] === project) {
//                     project.onFileAddedOrRemoved();
//                     this.containingProjects[0] = this.containingProjects.pop();
//                 }
//                 else if (this.containingProjects[1] === project) {
//                     project.onFileAddedOrRemoved();
//                     this.containingProjects.pop();
//                 }
//                 break;
//             default:
//                 if (ts.unorderedRemoveItem(this.containingProjects, project)) {
//                     project.onFileAddedOrRemoved();
//                 }
//                 break;
//         }
//     };
//     ScriptInfo.prototype.detachAllProjects = function () {
//         for (var _i = 0, _a = this.containingProjects; _i < _a.length; _i++) {
//             var p = _a[_i];
//             if (p.projectKind === server.ProjectKind.Configured) {
//                 p.getCachedDirectoryStructureHost().addOrDeleteFile(this.fileName, this.path, ts.FileWatcherEventKind.Deleted);
//             }
//             var isInfoRoot = p.isRoot(this);
//             // detach is unnecessary since we'll clean the list of containing projects anyways
//             p.removeFile(this, /*fileExists*/ false, /*detachFromProjects*/ false);
//             // If the info was for the external or configured project's root,
//             // add missing file as the root
//             if (isInfoRoot && p.projectKind !== server.ProjectKind.Inferred) {
//                 p.addMissingFileRoot(this.fileName);
//             }
//         }
//         ts.clear(this.containingProjects);
//     };
//     ScriptInfo.prototype.getDefaultProject = function () {
//         switch (this.containingProjects.length) {
//             case 0:
//                 return server.Errors.ThrowNoProject();
//             case 1:
//                 return this.containingProjects[0];
//             default:
//                 // If this file belongs to multiple projects, below is the order in which default project is used
//                 // - for open script info, its default configured project during opening is default if info is part of it
//                 // - first configured project of which script info is not a source of project reference redirect
//                 // - first configured project
//                 // - first external project
//                 // - first inferred project
//                 var firstExternalProject = void 0;
//                 var firstConfiguredProject = void 0;
//                 var firstNonSourceOfProjectReferenceRedirect = void 0;
//                 var defaultConfiguredProject = void 0;
//                 for (var index = 0; index < this.containingProjects.length; index++) {
//                     var project = this.containingProjects[index];
//                     if (project.projectKind === server.ProjectKind.Configured) {
//                         if (!project.isSourceOfProjectReferenceRedirect(this.fileName)) {
//                             // If we havent found default configuredProject and
//                             // its not the last one, find it and use that one if there
//                             if (defaultConfiguredProject === undefined &&
//                                 index !== this.containingProjects.length - 1) {
//                                 defaultConfiguredProject = project.projectService.findDefaultConfiguredProject(this) || false;
//                             }
//                             if (defaultConfiguredProject === project)
//                                 return project;
//                             if (!firstNonSourceOfProjectReferenceRedirect)
//                                 firstNonSourceOfProjectReferenceRedirect = project;
//                         }
//                         if (!firstConfiguredProject)
//                             firstConfiguredProject = project;
//                     }
//                     else if (project.projectKind === server.ProjectKind.External && !firstExternalProject) {
//                         firstExternalProject = project;
//                     }
//                 }
//                 return defaultConfiguredProject ||
//                     firstNonSourceOfProjectReferenceRedirect ||
//                     firstConfiguredProject ||
//                     firstExternalProject ||
//                     this.containingProjects[0];
//         }
//     };
//     ScriptInfo.prototype.registerFileUpdate = function () {
//         for (var _i = 0, _a = this.containingProjects; _i < _a.length; _i++) {
//             var p = _a[_i];
//             p.registerFileUpdate(this.path);
//         }
//     };
//     ScriptInfo.prototype.setOptions = function (formatSettings, preferences) {
//         if (formatSettings) {
//             if (!this.formatSettings) {
//                 this.formatSettings = ts.getDefaultFormatCodeSettings(this.host.newLine);
//                 ts.assign(this.formatSettings, formatSettings);
//             }
//             else {
//                 this.formatSettings = __assign(__assign({}, this.formatSettings), formatSettings);
//             }
//         }
//         if (preferences) {
//             if (!this.preferences) {
//                 this.preferences = ts.emptyOptions;
//             }
//             this.preferences = __assign(__assign({}, this.preferences), preferences);
//         }
//     };
//     ScriptInfo.prototype.getLatestVersion = function () {
//         return this.textStorage.getVersion();
//     };
//     ScriptInfo.prototype.saveTo = function (fileName) {
//         this.host.writeFile(fileName, ts.getSnapshotText(this.textStorage.getSnapshot()));
//     };
//     /*@internal*/
//     ScriptInfo.prototype.delayReloadNonMixedContentFile = function () {
//         ts.Debug.assert(!this.isDynamicOrHasMixedContent());
//         this.textStorage.delayReloadFromFileIntoText();
//         this.markContainingProjectsAsDirty();
//     };
//     ScriptInfo.prototype.reloadFromFile = function (tempFileName) {
//         if (this.isDynamicOrHasMixedContent()) {
//             this.textStorage.reload("");
//             this.markContainingProjectsAsDirty();
//             return true;
//         }
//         else {
//             if (this.textStorage.reloadWithFileText(tempFileName)) {
//                 this.markContainingProjectsAsDirty();
//                 return true;
//             }
//         }
//         return false;
//     };
//     /*@internal*/
//     ScriptInfo.prototype.getAbsolutePositionAndLineText = function (line) {
//         return this.textStorage.getAbsolutePositionAndLineText(line);
//     };
//     ScriptInfo.prototype.editContent = function (start, end, newText) {
//         this.textStorage.edit(start, end, newText);
//         this.markContainingProjectsAsDirty();
//     };
//     ScriptInfo.prototype.markContainingProjectsAsDirty = function () {
//         for (var _i = 0, _a = this.containingProjects; _i < _a.length; _i++) {
//             var p = _a[_i];
//             p.markFileAsDirty(this.path);
//         }
//     };
//     ScriptInfo.prototype.isOrphan = function () {
//         return !ts.forEach(this.containingProjects, function (p) { return !p.isOrphan(); });
//     };
//     /**
//         *  @param line 1 based index
//         */
//     ScriptInfo.prototype.lineToTextSpan = function (line) {
//         return this.textStorage.lineToTextSpan(line);
//     };
//     ScriptInfo.prototype.lineOffsetToPosition = function (line, offset, allowEdits) {
//         return this.textStorage.lineOffsetToPosition(line, offset, allowEdits);
//     };
//     ScriptInfo.prototype.positionToLineOffset = function (position) {
//         return this.textStorage.positionToLineOffset(position);
//     };
//     ScriptInfo.prototype.isJavaScript = function () {
//         return this.scriptKind === 1 /* JS */ || this.scriptKind === 2 /* JSX */;
//     };
//     /*@internal*/
//     ScriptInfo.prototype.getLineInfo = function () {
//         return this.textStorage.getLineInfo();
//     };
//     /*@internal*/
//     ScriptInfo.prototype.closeSourceMapFileWatcher = function () {
//         if (this.sourceMapFilePath && !ts.isString(this.sourceMapFilePath)) {
//             ts.closeFileWatcherOf(this.sourceMapFilePath);
//             this.sourceMapFilePath = undefined;
//         }
//     };
//     return ScriptInfo;
// }());
//# sourceMappingURL=ScriptInfo.js.map