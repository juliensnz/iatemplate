import React, {ChangeEvent, useEffect, useState} from "react";
import {AddFilled32, Close32} from '@carbon/icons-react';
import styled from 'styled-components';
import {Form, FormGroup, FormInput, Card, CardHeader, CardBody, CardTitle, Button} from 'shards-react';
import {Template} from '../hooks/useTemplates';

const IconButton = styled.span`
  display: flex;
  align-items:center;
  margin: 0 5px;

  &:hover {
    cursor: pointer;
  }
`

const CreateModal = styled.div<{isMounted: boolean}>`
  width: 100vw;
  max-height: 100vh;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 1;
  box-shadow: 0 30px 30px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow: scroll;
  transform: ${(props) => props.isMounted ? 'translateY(0)' : 'translateY(-100vh)'};
  transition: transform .3s;
`

const Title = styled(CardTitle)`
  font-weight: 100;
  font-size: 25px;
  line-height: 25px;
  margin-bottom: 0;
`
const Header = styled(CardHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Container = styled(Card)`
  overflow: hidden;
  height: calc(100vh - 40px);
`
const Body = styled(CardBody)`
  overflow: scroll;
`

const Textarea = styled.textarea`
  display: block;
  width: 100%;
  height: 300px;
  border-radius: 10px;
  padding: 5px 10px;
`



const ButtonContainer = styled.div`
  display: flex;
`
const Spacer = styled.div`
  flex: 1;
`

const CreateRender = ({template, updateTemplate}: {template: Template, updateTemplate: (newTemplate: Template) => void}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const doesNotHaveTemplateData = 0 === template.data.length;
  const [rawData, setRawData] = useState(doesNotHaveTemplateData ? '' : template.data.join('\n'))
  const variables = rawData.trim().split('\n');

  return (
    <>
      <IconButton onClick={() => {
        setIsOpen(true);
      }}><AddFilled32 color="white" /></IconButton>
      {isOpen && (
        <CreateModal isMounted={isVisible || true}>
          <Container>
            <Header>
              <Title>Create a new render</Title>
              <IconButton onClick={() => {
                setIsOpen(false);
              }}><Close32 /></IconButton>
            </Header>
            <Body>
              {!doesNotHaveTemplateData ? (
                <Form>
                  {variables.map((fieldName: string) => {
                    const niceName = fieldName.split('_').join(' ');

                    return (<FormGroup key={fieldName}>
                      <label htmlFor={`field-${fieldName}`}>{niceName.toUpperCase()} ({fieldName})</label>
                      <FormInput id={`field-${fieldName}`} placeholder={niceName} />
                    </FormGroup>)
                  })}
                  <ButtonContainer><Spacer /><Button pill>Confirm</Button></ButtonContainer>
                </Form>
              ) : (
                <>
                  <Form>
                    <label htmlFor="rawData">First let's define which variables are needed:</label><br/>
                    <Textarea id="rawData" value={rawData} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                      setRawData(event.currentTarget.value);
                    }}/>
                    <br/>
                    Generated variables:
                    {variables.join(', ')}
                    <ButtonContainer><Spacer /><Button pill onClick={() => {
                      updateTemplate({...template, data: variables})
                    }}>Confirm</Button></ButtonContainer>
                  </Form>
                </>
              )}
            </Body>
          </Container>
        </CreateModal>
      )}
    </>
  );
}

export {CreateRender};
