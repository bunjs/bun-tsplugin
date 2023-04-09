"use strict";
module.exports = (languageService, proxy, extraLength, info) => {
    proxy.getCompilerOptionsDiagnostics = () => {
        const prior = languageService.getCompilerOptionsDiagnostics();
        return prior.map(diagnostic => {
            diagnostic.start = diagnostic.start - extraLength;
            return diagnostic;
        });
    };
    // proxy.getBraceMatchingAtPosition = (fileName, position) => {
    //     position = position + extraLength;
    //     const prior = languageService.getBraceMatchingAtPosition(fileName, position);
    //     prior.map(item => {
    //         item.start = (item.start as number) - extraLength;
    //         return item;
    //     });
    //     return prior;
    // }
    // proxy.getBreakpointStatementAtPosition = (fileName, position) => {
    //     position = position + extraLength;
    //     const prior = languageService.getBreakpointStatementAtPosition(fileName, position);
    //     (prior as tss.TextSpan).start = (prior as tss.TextSpan).start - extraLength;
    //     return prior;
    // }
    // proxy.getBreakpointStatementAtPosition = (fileName, position) => {
    //     position = position + extraLength;
    //     const prior = languageService.getBreakpointStatementAtPosition(fileName, position);
    //     (prior as tss.TextSpan).start = (prior as tss.TextSpan).start - extraLength;
    //     return prior;
    // }
    // proxy.getCodeFixesAtPosition = (fileName, start, end, errorCodes, formatOptions: tss.FormatCodeSettings, preferences: tss.UserPreferences) => {
    //     start = start + extraLength;
    //     end = end + extraLength;
    //     const prior = languageService.getCodeFixesAtPosition(fileName, start, end, errorCodes, formatOptions, preferences);
    //     return prior;
    // }
    // proxy.getCompletionEntryDetails = (fileName, position: number, name: string, formatOptions: tss.FormatCodeOptions | tss.FormatCodeSettings | undefined, source: string | undefined, preferences: tss.UserPreferences | undefined) => {
    //     position = position + extraLength;
    //     const prior = languageService.getCompletionEntryDetails(fileName, position, name, formatOptions, source, preferences);
    //     return prior;
    // }
    // proxy.getDefinitionAndBoundSpan = (fileName, position: number) => {
    //     position = position + extraLength;
    //     const prior = languageService.getDefinitionAndBoundSpan(fileName, position);
    //     (prior?.textSpan as tss.TextSpan).start = (prior?.textSpan.start as number) - extraLength;
    //     return prior;
    // }
    // proxy.getDefinitionAtPosition = (fileName, position: number) => {
    //     position = position + extraLength;
    //     const prior = languageService.getDefinitionAtPosition(fileName, position);
    //     (prior as tss.DefinitionInfo[]).forEach(it => {
    //         it.textSpan.start = it.textSpan.start - extraLength;
    //     });
    //     return prior;
    // }
    // proxy.getDocCommentTemplateAtPosition = (fileName, position: number) => {
    //     position = position + extraLength;
    //     const prior = languageService.getDocCommentTemplateAtPosition(fileName, position);
    //     // prior.
    //     // (prior as tss.DefinitionInfo[]).forEach(it => {
    //     //     it.textSpan.start = it.textSpan.start - extraLength;
    //     // });
    //     return prior;
    // }
    // proxy.findReferences = (fileName, position) => {
    //     position = position + extraLength;
    //     const prior = languageService.findReferences(fileName, position);
    //     return prior;
    // }
    // proxy.findRenameLocations = (fileName, position, findInStrings: boolean, findInComments: boolean, providePrefixAndSuffixTextForRename?: boolean | undefined) => {
    //     position = position + extraLength;
    //     const prior = languageService.findRenameLocations(fileName, position, findInStrings, findInComments, providePrefixAndSuffixTextForRename);
    //     return prior;
    // }
    // proxy.getDocumentHighlights = (fileName: string, position: number, filesToSearch: string[]) => {
    //     position = position + extraLength;
    //     const prior = languageService.getDocumentHighlights(fileName, position, filesToSearch);
    //     (prior as tss.DocumentHighlights[]).map(it => {
    //         it.highlightSpans.map(i => {
    //             i.textSpan.start = i.textSpan.start - extraLength;
    //             return i;
    //         });
    //         return it;
    //     });
    //     return prior;
    // }
    // proxy.getImplementationAtPosition = (fileName: string, position: number) => {
    //     position = position + extraLength;
    //     const prior = languageService.getImplementationAtPosition(fileName, position);
    //     return prior;
    // }
    // proxy.isValidBraceCompletionAtPosition = (fileName: string, position: number, openingBrace: number) => {
    //     position = position + extraLength;
    //     const prior = languageService.isValidBraceCompletionAtPosition(fileName, position, openingBrace);
    //     return prior;
    // }
    // proxy.getTypeDefinitionAtPosition = (fileName: string, position: number) => {
    //     position = position + extraLength;
    //     const prior = languageService.getTypeDefinitionAtPosition(fileName, position);
    //     return prior;
    // }
    // proxy.getSignatureHelpItems = (fileName: string, position: number, options: tss.SignatureHelpItemsOptions | undefined) => {
    //     position = position + extraLength;
    //     const prior = languageService.getSignatureHelpItems(fileName, position, options);
    //     (prior?.applicableSpan as tss.TextSpan).start = (prior?.applicableSpan.start as number) - extraLength;
    //     return prior;
    // }
    // proxy.getCompletionEntrySymbol = (fileName: string, position: number, name: string, source: string | undefined) => {
    //     position = position + extraLength;
    //     return languageService.getCompletionEntrySymbol(
    //         fileName,
    //         position,
    //         name,
    //         source
    //     );
    // }
    proxy.getEncodedSemanticClassifications = (fileName, span) => {
        span.start = span.start - extraLength;
        const prior = languageService.getEncodedSemanticClassifications(fileName, span);
        return prior;
    };
    proxy.getEncodedSyntacticClassifications = (fileName, span) => {
        span.start = span.start - extraLength;
        const prior = languageService.getEncodedSemanticClassifications(fileName, span);
        return prior;
    };
    proxy.getFormattingEditsAfterKeystroke = (fileName, position, key, options) => {
        position = position - extraLength;
        const prior = languageService.getFormattingEditsAfterKeystroke(fileName, position, key, options);
        return prior;
    };
    proxy.getIndentationAtPosition = (fileName, position, options) => {
        position = position - extraLength;
        const prior = languageService.getIndentationAtPosition(fileName, position, options);
        return prior;
    };
    proxy.getNameOrDottedNameSpan = (fileName, startPos, endPos) => {
        startPos = startPos - extraLength;
        endPos = endPos - extraLength;
        const prior = languageService.getNameOrDottedNameSpan(fileName, startPos, endPos);
        prior.start = prior?.start - extraLength;
        return prior;
    };
    proxy.getSyntacticDiagnostics = (fileName) => {
        let prior = languageService.getSyntacticDiagnostics(fileName);
        return prior.map(diagnostic => {
            // diagnostic.source = String(Number(diagnostic.source) - extraLength);
            diagnostic.start = diagnostic.start - extraLength;
            return diagnostic;
        });
    };
    proxy.getSuggestionDiagnostics = (fileName) => {
        let prior = languageService.getSuggestionDiagnostics(fileName);
        return prior.map(diagnostic => {
            // diagnostic.source = String(Number(diagnostic.source) - extraLength);
            diagnostic.start = diagnostic.start - extraLength;
            return diagnostic;
        });
    };
    proxy.getSemanticDiagnostics = (fileName) => {
        // const languageService = ts.createLanguageService(host, ts.createDocumentRegistry());
        // const prior = info.languageService.getSemanticDiagnostics(fileName);
        // const program = info.languageService.getProgram();
        // const source_file = program?.getSourceFile(fileName);
        let prior = languageService.getSemanticDiagnostics(fileName);
        prior = prior.filter((diagnostic) => {
            if (diagnostic.code == 2448) {
                // let {line, character} =  diagnostic.file.getLineAndCharacterOfPosition(
                //     diagnostic.start!
                // );
                if (diagnostic.messageText.messageText) {
                    return diagnostic.messageText.messageText.indexOf("App' used before its declaration") === -1;
                }
                else {
                    return diagnostic.messageText.indexOf("App' used before its declaration") === -1;
                }
            }
            return true;
        });
        return prior.map(diagnostic => {
            // diagnostic.source = String(Number(diagnostic.source) - extraLength);
            diagnostic.start = diagnostic.start - extraLength;
            // diagnostic.start = 50;
            return diagnostic;
        });
    };
    // Remove specified entries from completion list
    proxy.getCompletionsAtPosition = (fileName, position, options) => {
        position = position + extraLength;
        const prior = languageService.getCompletionsAtPosition(fileName, position, options);
        // const oldLength = (prior as any).entries.length;
        // (prior as any).entries = (prior as any).entries.filter((e: any) => whatToRemove.indexOf(e.name) < 0);
        // // (prior as any).entries[0].name = `${_getScriptSnapshot(fileName)}`;
        prior.entries = prior?.entries.map(e => {
            e.source = String(Number(e.source) - extraLength);
            return e;
        });
        // // Sample logging for diagnostic purposes
        // if (oldLength !== (prior as any).entries.length) {
        //     const entriesRemoved = oldLength - (prior as any).entries.length;
        //     info.project.projectService.logger.info(
        //         `Removed ${entriesRemoved} entries from the completion list`
        //     );
        // }
        return prior;
    };
    return proxy;
};
//# sourceMappingURL=setProxy.js.map