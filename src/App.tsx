import React from 'react';
import styled from 'styled-components';
import {PreferenceContext} from './context/PreferenceContext';
import {useTemplates} from './hooks/useTemplates';
import {Render, useRenders} from './hooks/useRenders';
import {Restart20, RequestQuote20, Launch20, AddFilled24} from '@carbon/icons-react';
import {FormSelect, Navbar, NavbarBrand, ListGroup, ListGroupItem} from 'shards-react';
import {CreateRender} from './components/CreateRender';
import {usePreferences} from './hooks/usePreferences';
import {RefreshState} from './components/RefreshState';
import {IconButton} from './components/UI';
import {RegenerateRender} from './components/RegenerateRender';

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
  margin-bottom: 50px;
`;

const RenderItem = styled(ListGroupItem)`
  display: flex;
`;

const Footer = styled.div`
  width: 100vw;
  bottom: 0;
  position: fixed;
  height: 50px;
  display: flex;
  padding: 0 10px;
  border-top: 1px solid #ccc;
  background-color: #f5f5f5;
`;

const App = () => {
  const preferences = usePreferences();
  const [
    templates,
    currentTemplate,
    setCurrentTemplate,
    updateTemplates,
    updateTemplate,
    generateRender,
  ] = useTemplates(preferences);
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
                updateTemplate={async template => {
                  await updateTemplate(template);
                  updateTemplates();
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
            <RenderItem key={render.identifier}>
              {render.name ?? render.identifier}
              <Spacer />
              <RegenerateRender
                onRegenerate={() => {
                  ipcRenderer.invoke('renders:generate', render);
                }}
              />
              <IconButton
                onClick={() => {
                  // ipcRenderer.invoke('renders:generate', render);
                }}
              >
                <RequestQuote20 />
              </IconButton>
              <IconButton
                onClick={() => {
                  ipcRenderer.invoke('renders:open', render);
                }}
              >
                <Launch20 />
              </IconButton>
            </RenderItem>
          ))}
        </RenderList>
        <Footer>
          <Spacer />
          <RefreshState onRefresh={updateTemplates} />
        </Footer>
      </Container>
    </PreferenceContext.Provider>
  );
};

export {App};
