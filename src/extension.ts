import * as vscode from 'vscode';
import { createFolder, createFile } from './file';
import { typescriptComponentTemplate, typescriptTestTemplate } from './template/typescriptTemplate';
import { javascriptComponentTemplate, javascriptTestTemplate } from './template/javascriptTemplate';
import { indexTemplate } from './template/indexTemplate';
import { TestLibrary } from './template/templateOptions';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.createReactComponent', async (uri: vscode.Uri) => {
        const componentName = await vscode.window.showInputBox({
            prompt: `Create component in ${uri.path}`,
            placeHolder: 'MyComponent',
        });

        if (componentName !== undefined && componentName.length > 0) {
            const config = vscode.workspace.getConfiguration('createReactComponent');
            const isTypescript = config.get('language') === 'typescript';

            const options = {
                name: componentName,
                testLibrary: config.get('testingLibrary') as TestLibrary,
                cleanup: config.get('testingLibrary.cleanup') as boolean,
            };

            const createModule = config.get('createModule') as boolean;
            const dir = createModule ? `${uri.path}/${componentName}` : uri.path;

            if (createModule) {
                createFolder(dir, vscode.window);
                createFile(`${dir}/index.${isTypescript ? 'ts' : 'js'}`, indexTemplate(options), vscode.window);
            }

            createFile(
                `${dir}/${componentName}.${isTypescript ? 'tsx' : 'jsx'}`,
                isTypescript ? typescriptComponentTemplate(options) : javascriptComponentTemplate(options),
                vscode.window,
            );
            createFile(
                `${dir}/${componentName}.test.${isTypescript ? 'tsx' : 'jsx'}`,
                isTypescript ? typescriptTestTemplate(options) : javascriptTestTemplate(options),
                vscode.window,
            );
        } else {
            vscode.window.showErrorMessage('Must provide component name');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
