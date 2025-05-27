// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as image from './image2webp';

let logger: vscode.OutputChannel;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	logger = vscode.window.createOutputChannel('Image to WebP');
	logger.appendLine('Image to WebP extension is activated.');
	console.log('Congratulations, your extension "Image to WebP" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const isSupportedImage = (filePath: string) => {
		return /\.(jpe?g|png)$/i.test(filePath);
	};

	context.subscriptions.push(
		vscode.commands.registerCommand('image-to-webp.convert', (uri?: vscode.Uri) => {
			let filePath = uri?.fsPath;
			if (!filePath && vscode.window.activeTextEditor) {
				filePath = vscode.window.activeTextEditor.document.uri.fsPath;
			}
			if (filePath && isSupportedImage(filePath)) {
				const outputPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp');
				image
					.convertToWebp(filePath, outputPath)
					.then(() => {
						vscode.window.showInformationMessage(`Converted ${filePath} to ${outputPath}`);
					})
					.catch((err) => {
						vscode.window.showErrorMessage(`Error converting image: ${err.message}`);
					});
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('image-to-webp.convert-replace', (uri?: vscode.Uri) => {
			let filePath = uri?.fsPath;
			if (!filePath && vscode.window.activeTextEditor) {
				filePath = vscode.window.activeTextEditor.document.uri.fsPath;
			}
			if (filePath && isSupportedImage(filePath)) {
				const sourcePath = filePath;
				const outputPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp');
				image
					.convertToWebp(sourcePath, outputPath)
					.then(() => {
						vscode.workspace.fs.delete(vscode.Uri.file(sourcePath), { recursive: true, useTrash: false });
						vscode.window.showInformationMessage(`Converted and replaced ${sourcePath} with ${outputPath}`);
					})
					.catch((err) => {
						vscode.window.showErrorMessage(`Error converting image: ${err.message}`);
					});
			}
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
