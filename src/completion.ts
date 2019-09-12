import * as vscode from 'vscode';
import { expand, validate } from './core';

export class CompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext):
        Thenable<vscode.CompletionList> {

        let expandedAbbr = getExpandedAbbreviation(document, position);
        let completionItems = expandedAbbr ? [expandedAbbr] : [];

        return Promise.resolve(new vscode.CompletionList(completionItems, true));
    }
}

function extractAbbreviation(document: vscode.TextDocument, position: vscode.Position): [vscode.Range, string] {
    let lineText = document.lineAt(position.line).text;
    let lineSplit = lineText.split(' ');
    let abbreviation = lineSplit[lineSplit.length - 1];

    let start = new vscode.Position(position.line, lineText.length - abbreviation.length);
    let end = new vscode.Position(position.line, lineText.length);

    return [new vscode.Range(start, end), abbreviation];
}

function getExpandedAbbreviation(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem {
    let [rangeToReplace, wordToExpand] = extractAbbreviation(document, position);
    let valid = validate(wordToExpand);

    let completionItem = new vscode.CompletionItem(wordToExpand);
    completionItem.detail = 'Flutter Tree';

    if (valid) {
        let expandedWord = expand(wordToExpand);
        completionItem.insertText = new vscode.SnippetString(expandedWord);
        completionItem.documentation = removeTabStops(expandedWord);
        completionItem.range = rangeToReplace;
    } else {
        completionItem.documentation = 'Invalid syntax';
        completionItem.insertText = new vscode.SnippetString();
    }

    return completionItem;
}

function removeTabStops(expandedWord: string): string {
    return expandedWord.replace(/[(]+[$]+[0-9]+[)]/g, '()');
}
