import * as vscode from 'vscode';
import { expand, validate } from './core';
import { CompletionProvider } from './completion';
import { triggers } from './core/constants';

const language = 'dart';

function widgetsFromAbbr() {
	let editor = vscode.window.activeTextEditor;

	if (!editor) {
		vscode.window.showInformationMessage('No editor');
		return;
	}

	vscode.window.showInputBox({
		prompt: 'Enter Abbreviation', placeHolder: 'Container>Center'
	}).then(abbr => {
		if (editor) {
			let expandText = abbr || '';
			if (validate(expandText)) {
				editor.insertSnippet(new vscode.SnippetString(expand(expandText)));
			} else {
				vscode.window.showWarningMessage('Invalid syntax');
			}
		}
	});
}

function widgetsFromSelection() {
	vscode.window.showInformationMessage('This feature is not available now');	
}

export function activate(context: vscode.ExtensionContext) {

	registerCompletionProviders(context);

	context.subscriptions.push(vscode.commands.registerCommand('extension.fromAbbr', () => {
		widgetsFromAbbr();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.fromSelection', () => {
		widgetsFromSelection();
	}));

}

function registerCompletionProviders(context: vscode.ExtensionContext) {
	let completionProvider = new CompletionProvider();

	const provider = vscode.languages.registerCompletionItemProvider(
		[{ language, scheme: 'file' }, { language, scheme: 'untitled' }],
		completionProvider,
		...triggers
	);
	context.subscriptions.push(provider);
}

export function deactivate() { }
