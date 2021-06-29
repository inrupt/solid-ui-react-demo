/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

export const ralewayMedium = (path: string): string => `
@font-face {
  font-family: "Raleway-Medium";
  src: url("${path}.eot"); /* IE9 Compat Modes */
  src: url("${path}.eot?#iefix") format("embedded-opentype"), /* IE6-IE8 */
    url("${path}.otf") format("opentype"), /* Open Type Font */
    url("${path}.svg") format("svg"), /* Legacy iOS */
    url("${path}.woff") format("woff"), /* Modern Browsers */
    url("${path}.woff2") format("woff2"); /* Modern Browsers */
  font-weight: normal;
  font-style: normal;
}`;
