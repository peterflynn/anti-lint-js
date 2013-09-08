/*
 * Copyright (c) 2013 Peter Flynn.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */


/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global define, brackets */

/**
 * Replaces the default JS linter with a simpler syntax-only checker
 */
define(function (require, exports, module) {
    "use strict";
    
    // Brackets modules
    var CodeInspection = brackets.getModule("language/CodeInspection"),
        AppInit        = brackets.getModule("utils/AppInit");
    
    
    // Load Esprima parser
    var esprima        = require("thirdparty/esprima");
    
    
    // TODO FUTURE: check JSON syntax too, via jsonlint
    
    
    function esprimaChecker(text, fullPath) {
        try {
            esprima.parse(text);
            return null;  // no syntax errors
            
        } catch (ex) {
            // Extract a user-visible error string from the exception Esprima threw
            var message = ex.toString();
            var colon = message.indexOf(": ", message.indexOf(": ") + 1);
            if (colon !== -1) {
                message = message.substr(colon + 2);
            }
            
            var syntaxError = { pos: {line: ex.lineNumber - 1, ch: ex.column - 1}, message: message, type: CodeInspection.Type.ERROR };
            
            return {
                aborted: true,
                errors: [
                    syntaxError,
                    { pos: syntaxError.pos, message: "Unable to parse further", type: CodeInspection.Type.META }
                ]
            };
        }
    }
    
    AppInit.appReady(function () {
        CodeInspection.register("javascript", {
            name: "JavaScript Syntax",
            scanFile: esprimaChecker
        });
    });
});