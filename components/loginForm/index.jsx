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

import { useState, useEffect } from "react";
import { LoginButton } from "@inrupt/solid-ui-react";
import {
  LinkButton,
  Input,
  makeStyles,
  createStyles,
} from "@inrupt/prism-react-components";
import { useBem } from "@solid/lit-prism-patterns";
import styles from "./styles";
import config from "../../config";

const useStyles = makeStyles((theme) => createStyles(styles(theme)));
const CONFIG = config();

export default function LoginForm() {
  const [idp, setIdp] = useState("https://broker.pod.inrupt.com");
  const [currentUrl, setCurrentUrl] = useState("https://localhost:3000");
  const bem = useBem(useStyles());
  const classes = useStyles();

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [setCurrentUrl]);

  return (
    <div className={classes.loginFormContainer}>
      <Input
        id="idp"
        label="IDP"
        placeholder="Identity Provider"
        defaultValue={idp}
        onChange={(e) => setIdp(e.target.value)}
      />
      <LoginButton
        authOptions={{ clientName: CONFIG.demoTitle }}
        oidcIssuer={idp}
        redirectUrl={currentUrl}
        onError={console.error}
      >
        <LinkButton
          variant="small"
          className={bem("user-menu__list-item-trigger")}
        >
          Log In
        </LinkButton>
      </LoginButton>
    </div>
  );
}
