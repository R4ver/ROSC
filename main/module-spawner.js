"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const child_process_1 = require("child_process");
function SpawnModule(module, isExecuteable = false, customPath = null) {
    let child;
    console.log({ module, isExecuteable, customPath });
    switch (isExecuteable) {
        case true:
            child = (0, child_process_1.spawn)((0, path_1.resolve)(__dirname, `../modules/release/${module}.exe`));
            break;
        default:
            console.log((0, path_1.resolve)(__dirname, `${customPath ? customPath : `../modules/release/${module}.js`}`));
            child = (0, child_process_1.spawn)("node", ["-r", "esm", `${(0, path_1.resolve)(__dirname, `${customPath ? customPath : `../modules/release/${module}.js`}`)}`]);
            break;
    }
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", function (data) {
        //Here is where the output goes
        console.log("stdout: " + data);
        data = data.toString();
    });
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", function (data) {
        //Here is where the error output goes
        console.log("stderr: " + data);
        data = data.toString();
    });
    child.on("close", function (code) {
        //Here you can get the exit code of the script
        console.log("closing code: " + code);
    });
    return child;
}
exports.default = SpawnModule;
