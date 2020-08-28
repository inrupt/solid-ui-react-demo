import { useState } from "react";
import { useRouter } from "next/router";
import { useSession, Text, CombinedDataProvider } from "@inrupt/solid-ui-react";
import { FOAF } from "@inrupt/lit-generated-vocab-common";

export default function LoginForm() {
  const { session } = useSession();
  const webId = session.info.webId;

  return (
    <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
      <Text property={FOAF.name.iri.value} />
    </CombinedDataProvider>
  );
}
