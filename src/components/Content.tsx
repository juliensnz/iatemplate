import React, {useContext} from 'react'
import styled from 'styled-components'
import {PreferenceContext} from '../context/PreferenceContext'
import {useTemplates} from '../hooks/useTemplates'
import {Render, useRenders} from '../hooks/useRenders'
import {Button, Toolbar, AppBar, FormControl, Select, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import ReplayIcon from '@material-ui/icons/Replay';
const { ipcRenderer } = window.require('electron');

const Container = styled.div`
display: flex;
flex-direction: column;
width: 100vw;
`

const Header = styled.div`
height: 100px;
`

const Content = () => {
  const preferences = useContext(PreferenceContext);
  const [templates, currentTemplate, setCurrentTemplate, reload] = useTemplates(preferences);
  const [renders] = useRenders(preferences, currentTemplate);

  return (
    <Container>
      <AppBar position="static" variant='elevation'>
        <Toolbar>
          {currentTemplate && (
            <>
              <FormControl>
                <Select
                  value={currentTemplate.name}
                  onChange={(event: any) => {
                    setCurrentTemplate(event.currentTarget.dataset.value)
                  }}
                >
                  {templates.map(template => <MenuItem key={template.name} value={template.name}>{template.name}</MenuItem>)}
                </Select>
              </FormControl>
              <ReplayIcon onClick={reload} />
            </>
          )}

          <Button onClick={() => {
            if (undefined === currentTemplate) return;
            ipcRenderer.invoke('templates:generate', {
              template: currentTemplate,
              target: `${preferences.logoDirectory}/renders`,
              name: 'claudie_piol',
              data: {
                company_name: 'Claudie Piol',
                city: 'Guidel',
                address_street_postcode: '2 Kergaher 56520',
                phone_number: '0647172103',
                email_address: 'claudie.piol@gmail.com',
                website: 'claudiepiol.com'
              }
            });
          }}>generate</Button>
        </Toolbar>
      </AppBar>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renders.map((render: Render) => (
              <TableRow key={render.name}>
                <TableCell>
                  {render.name}
                </TableCell>
                <TableCell align="right">yolo</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export {Content};
