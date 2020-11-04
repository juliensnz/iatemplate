import React from 'react';
import styled from 'styled-components';
import {PreferenceContext} from './context/PreferenceContext';
import {useTemplates} from './hooks/useTemplates';
import {Render, useRenders} from './hooks/useRenders';
import {Renew20, Restart20, RequestQuote20, Launch20, AddFilled24} from '@carbon/icons-react';
import {FormSelect, Navbar, NavbarBrand, ListGroup, ListGroupItem} from 'shards-react';
import {CreateRender} from './components/CreateRender';
import {usePreferences} from './hooks/usePreferences';

const {ipcRenderer} = window.require('electron');
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Header = styled(Navbar)`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 2;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const IconButton = styled.span`
  display: flex;
  align-items: center;
  margin: 0 5px;

  &:hover {
    cursor: pointer;
  }
`;

const TemplateSelector = styled(FormSelect)`
  border-radius: 20px;
  border: none;
  text-transform: capitalize;
  padding: 0 40px 0 20px;
  margin-right: 10px;
`;

const Option = styled.option`
  text-transform: capitalize;
`;

const RenderList = styled(ListGroup)`
  margin: 10px;
`;

const RenderItem = styled(ListGroupItem)`
  display: flex;
`;
const App = () => {
  const preferences = usePreferences();
  const [templates, currentTemplate, setCurrentTemplate, reload, updateTemplate, generateRender] = useTemplates(
    preferences
  );
  const [renders] = useRenders(preferences, currentTemplate);

  return (
    <PreferenceContext.Provider value={preferences}>
      <Container>
        <Header type="dark" theme="primary">
          <NavbarBrand>Jade's Factory</NavbarBrand>
          <Spacer />
          <ButtonContainer>
            {currentTemplate && (
              <TemplateSelector
                id="template-selector"
                value={currentTemplate.name}
                onChange={(event: any) => {
                  setCurrentTemplate(event.currentTarget.value);
                }}
              >
                {templates.map(template => (
                  <Option key={template.name} value={template.name}>
                    {template.name}
                  </Option>
                ))}
              </TemplateSelector>
            )}
            <IconButton onClick={reload}>
              <Renew20 color="white" />
            </IconButton>
            {currentTemplate && (
              <IconButton
                onClick={() => {
                  ipcRenderer.invoke('templates:open', {templateName: currentTemplate.name});
                }}
              >
                <Launch20 color="white" />
              </IconButton>
            )}
            {currentTemplate && (
              <CreateRender
                template={currentTemplate}
                updateTemplate={template => {
                  updateTemplate(template);
                  reload();
                }}
                generateRender={generateRender}
              />
            )}
          </ButtonContainer>
        </Header>
        <RenderList>
          {0 === renders.length && (
            <RenderItem>
              There is no render for now. To create a new render from this template click on the &nbsp;{' '}
              <AddFilled24 color="#007bff" />
              &nbsp; button
            </RenderItem>
          )}
          {renders.map((render: Render) => (
            <RenderItem key={render.name}>
              {render.name}
              <Spacer />
              <IconButton
                onClick={() => {
                  if (undefined === currentTemplate) return;
                  // generateRender(currentTemplate);
                }}
              >
                <Restart20 />
              </IconButton>
              <IconButton onClick={reload}>
                <RequestQuote20 />
              </IconButton>
              <IconButton
                onClick={() => {
                  ipcRenderer.invoke('renders:open', {templateName: render.template, renderName: render.name});
                }}
              >
                <Launch20 />
              </IconButton>
            </RenderItem>
          ))}
        </RenderList>
      </Container>
    </PreferenceContext.Provider>
  );
};

export {App};
