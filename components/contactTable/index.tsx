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

import { RDF, VCARD } from "@inrupt/lit-generated-vocab-common";
import { getLocalStore, LitTermRegistry } from "@solid/lit-term";
import {
  getFetchedFrom,
  getThing,
  getUrlAll,
  removeUrl,
  saveSolidDatasetAt,
  setThing,
  Url,
  UrlString,
} from "@inrupt/solid-client";
import {
  Table,
  TableColumn,
  useDataset,
  useSession,
  useThing,
} from "@inrupt/solid-ui-react";
import { Button, Typography } from "@material-ui/core";
import styles from "./contactTable.module.css";

export default function ContactTable({
  property,
}: {
  property: Url | UrlString;
}): React.ReactElement {
  const { fetch } = useSession();
  const { dataset } = useDataset();
  const { thing: profile } = useThing();
  const contactDetailUrls = getUrlAll(profile, property);
  const contactDetailThings = contactDetailUrls.map((url) =>
    getThing(dataset, url)
  );

  const saveHandler = async (newThing) => {
    await saveSolidDatasetAt(
      getFetchedFrom(dataset),
      setThing(dataset, newThing),
      { fetch }
    );
  };

  const removePhone = async (index) => {
    const contactDetailUrl = contactDetailUrls[index];
    const newProfile = removeUrl(profile, property, contactDetailUrl);
    await saveHandler(newProfile);
    // TODO update local state or trigger re-fetching dataset
  };

  const DeleteButtonCell = ({ row: { index } }: { row: { index: number } }) => {
    return (
      <Button color="secondary" onClick={() => removePhone(index)}>
        Delete
      </Button>
    );
  };

  return (
    <Table things={contactDetailThings} className={styles.table}>
      <TableColumn
        property={RDF.type}
        body={({ value }) => {
          const termRegistry = new LitTermRegistry(getLocalStore());
          const label = termRegistry.lookupLabel(value, "en");
          const comment = termRegistry.lookupComment(value, "en");
          return <Typography title={comment}>{label || value}</Typography>;
        }}
        dataType="url"
        header={() => (
          <Typography>
            <b>Type</b>
          </Typography>
        )}
      />
      <TableColumn
        property={VCARD.value}
        body={({ value }) => <Typography>{value}</Typography>}
        dataType="url"
        header={() => (
          <Typography>
            <b>Number</b>
          </Typography>
        )}
      />
      <TableColumn
        property={VCARD.value}
        body={DeleteButtonCell}
        dataType="url"
        header=""
      />
    </Table>
  );
}
