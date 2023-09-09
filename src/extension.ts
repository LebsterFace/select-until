import type { ExtensionContext } from 'vscode';
import { window, Selection, commands } from "vscode";

type IndexProvider = (active: number, pattern: string, text: string) => number;

const selectUntil = async (indexProvider: IndexProvider) => {
	const editor = window.activeTextEditor;
	if (!editor) return window.showErrorMessage("Select Until: No active editor");

	const pattern = await window.showInputBox({
		title: "String to select until"
	});

	if (pattern === undefined) return; // User cancelled the selection.

	const text = editor.document.getText();
	editor.selections = editor.selections.map((selection): Selection => {
		const result = indexProvider(editor.document.offsetAt(selection.active), pattern, text);
		if (result > 0) return new Selection(selection.anchor, editor.document.positionAt(result));
		return selection;
	});
};

export const activate = (context: ExtensionContext) => {
	context.subscriptions.push(
		commands.registerCommand('select-until.select-util', () => selectUntil((cur, S, txt) => txt.indexOf(S, cur))),
		commands.registerCommand('select-until.select-backwards-util', () => selectUntil((cur, S, txt) => txt.slice(0, cur).lastIndexOf(S)))
	);
};

export const deactivate = () => { };
