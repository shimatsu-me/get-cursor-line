import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // "extension.getCursorLine" コマンドを登録
    let disposable = vscode.commands.registerCommand('extension.getCursorLine', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = editor.selection.active; // カーソルの位置
            const line = position.line + 1; // 行番号は0始まりなので+1

            // 現在開いているファイルの絶対パスを取得
            const fullPath = editor.document.fileName;

            // "spec/" から始まるパスを取得
            const relativePath = fullPath.split('spec/')[1];

            if (relativePath) {
                // spec/以降のパスをそのまま使用
                const pathFromSpec = 'spec/' + relativePath;
                console.log(`Cursor is at line: ${line} in file: ${pathFromSpec}`);

                // ターミナルに出力
                const terminal = vscode.window.createTerminal();
                terminal.show();

                // コマンドを組み立てて実行
                const command = `
                    docker compose exec -e RACK_ENV=test web bundle exec rake db:migrate[0] &&
                    docker compose exec -e RACK_ENV=test web bundle exec rake db:migrate &&
                    docker compose exec -e RACK_ENV=test web bundle exec rspec ${pathFromSpec}:${line}
                `;
                terminal.sendText(command);
            } else {
                // spec/が見つからない場合
                console.log(`spec/ folder not found in the file path.`);
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
