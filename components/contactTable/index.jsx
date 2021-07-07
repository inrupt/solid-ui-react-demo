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

import { useContext, useState } from "react";
import { RDF, VCARD } from "@inrupt/lit-generated-vocab-common";
import { getLocalStore, LitTermRegistry } from "@solid/lit-term";
import {
  addUrl,
  asUrl,
  createThing,
  getSourceUrl,
  getThing,
  getUrlAll,
  removeUrl,
  saveSolidDatasetAt,
  setThing,
  setUrl,
} from "@inrupt/solid-client";
import {
  DatasetContext,
  Table,
  TableColumn,
  useSession,
  useThing,
  Value,
} from "@inrupt/solid-ui-react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@inrupt/prism-react-components";

import styles from "./styles";

const useStyles = makeStyles((theme) => createStyles(styles(theme)));

export default function ContactTable({ edit, property }) {
  const [newContactType, setNewContactType] = useState(VCARD.Home.value);
  const [newContactValue, setNewContactValue] = useState("");
  const { fetchSession } = useSession();
  const { solidDataset: dataset, setDataset } = useContext(DatasetContext);
  const { thing: profile } = useThing();
  const contactDetailUrls = getUrlAll(profile, property);
  const contactDetailThings = contactDetailUrls.map((url) => ({
    dataset,
    thing: getThing(dataset, url),
  }));
  const classes = useStyles();

  const saveHandler = async (newThing, datasetToUpdate) => {
    const savedDataset = await saveSolidDatasetAt(
      getSourceUrl(datasetToUpdate),
      setThing(datasetToUpdate, newThing),
      { fetchSession }
    );
    setDataset(savedDataset);
  };

  const addContactDetail = async () => {
    const prefix = property === VCARD.hasTelephone.value ? "tel:" : "mailto:";
    const newContactDetail = setUrl(createThing(), RDF.type, newContactType);
    const newContactDetailWithValue = setUrl(
      newContactDetail,
      VCARD.value,
      `${prefix}${newContactValue}`
    );
    const datasetWithContactDetail = setThing(
      dataset,
      newContactDetailWithValue
    );
    const newProfile = addUrl(
      profile,
      property,
      asUrl(newContactDetailWithValue, getSourceUrl(dataset))
    );
    await saveHandler(newProfile, datasetWithContactDetail);
  };

  const removeRow = async (rowThing) => {
    const contactDetailUrl = asUrl(rowThing);
    const newProfile = removeUrl(profile, property, contactDetailUrl);
    await saveHandler(newProfile, dataset);
  };

  const DeleteButtonCell = () => {
    const { thing: rowThing } = useThing();
    return (
      <Button color="secondary" onClick={() => removeRow(rowThing)}>
        Delete
      </Button>
    );
  };

  const contactTypes = [
    {
      value: VCARD.Home.value,
      label: VCARD.Home.label,
    },
    {
      value: VCARD.Work.value,
      label: VCARD.Work.label,
    },
  ];

  return (
    <>
      <Table things={contactDetailThings} className={classes.table}>
        <TableColumn
          property={RDF.type.value}
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
          property={VCARD.value.value}
          body={() => (
            <Typography>
              <Value
                edit={edit}
                autosave
                dataType="url"
                property={VCARD.value.value}
                onSave={(savedDataset) => {
                  setDataset(savedDataset);
                }}
              />
            </Typography>
          )}
          dataType="url"
          header={() => (
            <Typography>
              <b>Value</b>
            </Typography>
          )}
        />
        <TableColumn
          property={VCARD.value.value}
          body={DeleteButtonCell}
          dataType="url"
          header=""
        />
      </Table>
      {edit && (
        <>
          <Typography gutterBottom>Add new contact</Typography>
          <Box className={classes.newContactFields}>
            <TextField
              select
              label="Type"
              value={newContactType}
              onChange={(e) => setNewContactType(e.target.value)}
            >
              {contactTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Value"
              value={newContactValue}
              onChange={(e) => setNewContactValue(e.target.value)}
            />
            <Button color="primary" onClick={addContactDetail}>
              Add
            </Button>
          </Box>
        </>
      )}
    </>
  );
}

ContactTable.propTypes = {
  edit: null,
  property: null,
};
ContactTable.defaultProps = {
  edit: null,
  property: null,
};
