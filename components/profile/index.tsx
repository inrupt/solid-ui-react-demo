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

import { useState } from "react";

import {
  useSession,
  CombinedDataProvider,
  Image,
  LogoutButton,
  Text,
  Value,
} from "@inrupt/solid-ui-react";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@material-ui/core";

import BusinessIcon from "@material-ui/icons/Business";

import { FOAF, VCARD } from "@inrupt/lit-generated-vocab-common";

import ContactTable from "../contactTable";

export default function LoginForm(): React.ReactElement {
  const { session } = useSession();
  const { webId } = session.info;
  const [editing, setEditing] = useState(false);

  return (
    <Container fixed>
      <Box style={{ marginBottom: 16, textAlign: "right" }}>
        <LogoutButton>
          <Button variant="contained" color="primary">
            Log&nbsp;out
          </Button>
        </LogoutButton>
      </Box>
      <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
        <Card style={{ maxWidth: 480 }}>
          <CardActionArea
            style={{
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Image property={VCARD.hasPhoto.iri.value} width={480} />
          </CardActionArea>

          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              <Text property={FOAF.name.iri.value} edit={editing} autosave />
            </Typography>

            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <BusinessIcon />

              <Text
                property={VCARD.organization_name.iri.value}
                edit={editing}
                autosave
              />
            </Typography>

            <Typography variant="body2" color="textSecondary" component="p">
              {"Born: "}
              <Value
                property={VCARD.bday.iri.value}
                dataType="datetime"
                edit={editing}
                autosave
              />
            </Typography>
          </CardContent>

          <CardContent>
            <Typography gutterBottom variant="h6" component="h3">
              Email Addresses
            </Typography>

            <ContactTable property={VCARD.hasEmail.value} edit={editing} />
          </CardContent>

          <CardContent>
            <Typography gutterBottom variant="h6" component="h3">
              Phone Numbers
            </Typography>

            <ContactTable property={VCARD.hasTelephone.value} edit={editing} />
          </CardContent>

          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => setEditing(!editing)}
            >
              Toggle Edit
            </Button>
          </CardActions>
        </Card>
      </CombinedDataProvider>
    </Container>
  );
}
