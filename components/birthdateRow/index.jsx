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
import { useContext } from "react";
import {
  useThing,
  useSession,
  Value,
  DatasetContext,
} from "@inrupt/solid-ui-react";
import { Button } from "@material-ui/core";
import {
  getDatetime,
  getSourceUrl,
  removeDatetime,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import { VCARD } from "@inrupt/lit-generated-vocab-common";
import styles from "./birthdateRow.module.css";

export default function BirthdateRow({ edit, setEdit }) {
  const { solidDataset: dataset, setDataset } = useContext(DatasetContext);
  const datasetUrl = getSourceUrl(dataset);
  const { fetch } = useSession();
  const { thing } = useThing(datasetUrl);
  const birthdate = thing && getDatetime(thing, VCARD.bday);

  async function removeBirthdate() {
    const newProfile = setThing(
      dataset,
      removeDatetime(thing, VCARD.bday, birthdate)
    );
    const savedDataset = await saveSolidDatasetAt(datasetUrl, newProfile, {
      fetch,
    });
    setDataset(savedDataset);
  }

  return edit || birthdate ? (
    <span className={styles.birthdateRowWrapper}>
      <Value
        property={VCARD.bday}
        dataType="datetime"
        inputProps={{ name: "birthdate-input" }}
        edit={edit}
        autosave
      />
      {birthdate && !edit && (
        <Button
          color="secondary"
          onClick={() => removeBirthdate()}
          className={styles.deleteButton}
        >
          Delete
        </Button>
      )}
    </span>
  ) : (
    <Button color="primary" onClick={() => setEdit(true)}>
      Add
    </Button>
  );
}
BirthdateRow.propTypes = {
  edit: null,
  setEdit: null,
};
BirthdateRow.defaultProps = {
  edit: null,
  setEdit: null,
};
