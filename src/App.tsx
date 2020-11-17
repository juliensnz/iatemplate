import React from 'react';
import styled from 'styled-components';
import {PreferenceContext} from './context/PreferenceContext';
import {useTemplates} from './hooks/useTemplates';
import {Render, useRenders} from './hooks/useRenders';
import {RequestQuote20, AddFilled24} from '@carbon/icons-react';
import {Navbar, NavbarBrand, ListGroup, ListGroupItem} from 'shards-react';
import {CreateRender} from './components/Render/CreateRender';
import {usePreferences} from './hooks/usePreferences';
import {RefreshState} from './components/RefreshState';
import {IconButton} from './components/UI';
import {RegenerateRender} from './components/Render/RegenerateRender';
import {OpenTemplate} from './components/Template/OpenTemplate';
import {OpenRender} from './components/Render/OpenRender';
import {ConfigureTemplateFields} from './components/Template/ConfigureTemplateFields';
import {Template} from '../common/model/template';
import {TemplateSelector} from './components/Template/TemplateSelector';
import {DuplicateTemplate} from './components/Template/DuplicateTemplate';
import {ChangeTemplateDirectory} from './components/ChangeTemplateDirectory';

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
  align-items: center;
  color: white;
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
  const [templates, currentTemplate, setCurrentTemplate, updateTemplates] = useTemplates(preferences);
  const [renders] = useRenders(preferences, currentTemplate);

  return (
    <PreferenceContext.Provider value={preferences}>
      <Container>
        <Header type="dark" theme="primary">
          <NavbarBrand>Jade's Factory</NavbarBrand>
          <Spacer />
          <ButtonContainer>
            {currentTemplate && (
              <>
                Template:
                <TemplateSelector
                  currentTemplate={currentTemplate}
                  templates={templates}
                  onChange={(template: Template) => {
                    setCurrentTemplate(template.name);
                  }}
                />
                <DuplicateTemplate template={currentTemplate} />
                <OpenTemplate template={currentTemplate} />
                {0 < currentTemplate.fields.length && <CreateRender template={currentTemplate} />}
              </>
            )}
          </ButtonContainer>
        </Header>
        <RenderList>
          {currentTemplate && 0 === currentTemplate.fields.length && (
            <ConfigureTemplateFields template={currentTemplate} updateTemplates={updateTemplates} />
          )}
          {currentTemplate && currentTemplate.fields.length > 0 && 0 === renders.length && (
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
              <RegenerateRender render={render} />
              <IconButton
                onClick={() => {
                  // ipcRenderer.invoke('render:generate', render);
                }}
              >
                <RequestQuote20 />
              </IconButton>
              <OpenRender render={render} />
            </RenderItem>
          ))}
        </RenderList>
        <Footer>
          <ChangeTemplateDirectory />
          <Spacer />
          <RefreshState onRefresh={updateTemplates} />
        </Footer>
      </Container>
    </PreferenceContext.Provider>
  );
};

export {App};
