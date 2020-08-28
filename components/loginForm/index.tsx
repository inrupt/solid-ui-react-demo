import { useState } from "react";
import { useRouter } from "next/router";
import { LoginButton } from "@inrupt/solid-ui-react";

export default function LoginForm() {
  const [idp, setIdp] = useState("https://inrupt.net");

  return (
    <div>
      <input
        placeholder="Identity Provider"
        type="url"
        value={idp}
        onChange={(e) => setIdp(e.target.value)}
      />

      <LoginButton
        oidcIssuer={idp}
        redirectUrl="https://localhost:3000"
      />
    </div>
  );
}
