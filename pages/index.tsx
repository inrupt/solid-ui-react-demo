import { useContext } from "react";
import { useSession, SessionContext } from "@inrupt/solid-ui-react/dist";
import LoginForm from "../components/loginForm";
import Profile from "../components/profile";

export default function Home() {
  const { session } = useSession();

  if (!session.info.isLoggedIn) {
    return <LoginForm />;
  }

  return <Profile />;
}
