/**
 * Copyright 2021 Inrupt Inc.
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

// Set up common Inrupt styling via Prism
import CssBaseline from "@material-ui/core/CssBaseline";

import { create } from "jss";
import preset from "jss-preset-default";

import { appLayout, useBem } from "@solid/lit-prism-patterns";

import {
  createStyles,
  makeStyles,
  StylesProvider,
  ThemeProvider,
  PageHeader,
  Container,
} from "@inrupt/prism-react-components";

import { SessionProvider } from "@inrupt/solid-ui-react";

import Header from "../header";
import Nav from "../nav";
import Footer from "../footer";

import config from "../../config";
import theme from "../../src/theme";

const CONFIG = config();

const jss = create(preset());
const useStyles = makeStyles(() => createStyles(appLayout.styles(theme)));

/* eslint react/prop-types: 0 */
function AppContainer({ children }) {
  const bem = useBem(useStyles());

  return (
    <SessionProvider>
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <div className={bem("app-layout")}>
            <Header />
            <Nav />

            <main className={bem("app-layout__main")}>
              <PageHeader title={CONFIG.demoTitle} actions={[]}>
                {CONFIG.demoDescription}
              </PageHeader>

              <Container>{children}</Container>
            </main>

            <Footer />

            <div className={bem("app-layout__mobile-nav-push")} />
          </div>
        </ThemeProvider>
      </StylesProvider>
    </SessionProvider>
  );
}

export default AppContainer;
