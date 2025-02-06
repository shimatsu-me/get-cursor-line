"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
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
            }
            else {
                // spec/が見つからない場合
                console.log(`spec/ folder not found in the file path.`);
            }
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map