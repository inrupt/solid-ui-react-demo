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
import { useState, useContext } from "react";
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
  setDatetime,
  setThing,
} from "@inrupt/solid-client";
import { VCARD } from "@inrupt/lit-generated-vocab-common";
import styles from "./birthdateRow.module.css";
import { useEffect } from "react";

export default function BirthdateRow({ edit, setEdit }) {
  const { solidDataset: dataset, setDataset } = useContext(DatasetContext);
  const datasetUrl = getSourceUrl(dataset);
  const { fetch } = useSession();
  const { thing } = useThing(`${datasetUrl}#me`);
  const birthdate = thing && getDatetime(thing, VCARD.bday);
  const [dateValue, setDateValue] = useState(
    birthdate?.toISOString().slice(0, -8)
  );
  const [dateType, setDateType] = useState(true);
  const [invalidForm, setInvalidForm] = useState(false);

  useEffect(() => {
    // checking that input type 'datetime-local' is supported
    const test = document.createElement("input");
    test.type = "datetime-local";
    if (test.type === "text") {
      setDateType(false);
    }
  });

  async function handleSaveDate() {
    const dateTimeRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/;
    if (!dateTimeRegex.test(dateValue)) {
      setInvalidForm(true);
    } else {
      setInvalidForm(false);
      await addBirthdate(dateValue);
    }
  }

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

  async function addBirthdate(date) {
    const newProfile = setThing(
      dataset,
      setDatetime(thing, VCARD.bday, new Date(date))
    );
    const savedDataset = await saveSolidDatasetAt(datasetUrl, newProfile, {
      fetch,
    });
    setDataset(savedDataset);
  }

  return edit || birthdate ? (
    <span className={styles.birthdateRowWrapper}>
      {(dateType || (!dateType && !edit)) && (
        <Value
          property={VCARD.bday}
          dataType="datetime"
          inputProps={{ name: "birthdate-input" }}
          edit={edit}
          autosave
        />
      )}
      {edit && !dateType && (
        // in case input type 'datetime-local' is not supported by the browser
        <>
          <input
            name="birthdate-input"
            type="text"
            value={dateValue}
            pattern={"[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"}
            onChange={(e) => setDateValue(e.target.value)}
            onBlur={handleSaveDate}
          />
          {invalidForm && (
            <span className={styles.alert}>
              Please enter a date with the following format: yyyy-mm-ddThh:hh.
            </span>
          )}
        </>
      )}
      {birthdate && !edit && (
        <Button
          color={"secondary"}
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
