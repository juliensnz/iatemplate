import React, {ChangeEvent, useEffect, useState} from 'react';
import {AddFilled32, Close32} from '@carbon/icons-react';
import styled from 'styled-components';
import {Form, FormGroup, FormInput, Card, CardHeader, CardBody, CardTitle, Button} from 'shards-react';
import {Template} from '../hooks/useTemplates';
import {Render} from '../hooks/useRenders';

const IconButton = styled.span`
  display: flex;
  align-items: center;
  margin: 0 5px;

  &:hover {
    cursor: pointer;
  }
`;

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
  transform: ${props => (props.isMounted ? 'translateY(0)' : 'translateY(-100vh)')};
  transition: transform 0.3s;
`;

const Title = styled(CardTitle)`
  font-weight: 100;
  font-size: 25px;
  line-height: 25px;
  margin-bottom: 0;
`;
const Header = styled(CardHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Container = styled(Card)`
  overflow: hidden;
  height: calc(100vh - 40px);
`;
const Body = styled(CardBody)`
  overflow: scroll;
`;

const Textarea = styled.textarea`
  display: block;
  width: 100%;
  height: 300px;
  border-radius: 10px;
  padding: 5px 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
`;
const Spacer = styled.div`
  flex: 1;
`;

const CreateRender = ({
  template,
  updateTemplate,
}: {
  template: Template;
  updateTemplate: (newTemplate: Template) => void;
  generateRender: (render: Render) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const doesNotHaveTemplateFields = 0 === template.fields.length;
  const [rawFields, setRawFields] = useState(doesNotHaveTemplateFields ? '' : template.fields.join('\n'));
  const fields = rawFields.trim().split('\n');
  const [data, setData] = useState({});

  useEffect(() => {
    if (!doesNotHaveTemplateFields) {
      setRawFields(template.fields.join('\n'));
      setData({});
    }
  }, [doesNotHaveTemplateFields, template]);

  return (
    <>
      <IconButton
        onClick={() => {
          setIsOpen(true);
          if (doesNotHaveTemplateFields) {
            setRawFields('');
          }
        }}
      >
        <AddFilled32 color="white" />
      </IconButton>
      {isOpen && (
        <CreateModal isMounted={isVisible || true}>
          <Container>
            <Header>
              <Title>Create a new render</Title>
              <IconButton
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <Close32 />
              </IconButton>
            </Header>
            <Body>
              {!doesNotHaveTemplateFields ? (
                <Form>
                  {fields.map((fieldName: string) => {
                    const niceName = fieldName.split('_').join(' ');

                    return (
                      <FormGroup key={fieldName}>
                        <label htmlFor={`field-${fieldName}`}>
                          {niceName} ({fieldName})
                        </label>
                        <FormInput
                          id={`field-${fieldName}`}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {}}
                          placeholder={niceName}
                        />
                      </FormGroup>
                    );
                  })}
                  <ButtonContainer>
                    <Spacer />
                    <Button onClick={() => {}} pill>
                      Confirm
                    </Button>
                  </ButtonContainer>
                </Form>
              ) : (
                <>
                  <Form>
                    <label htmlFor="rawFields">First let's define which fields are needed:</label>
                    <br />
                    <Textarea
                      id="rawFields"
                      value={rawFields}
                      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                        setRawFields(event.currentTarget.value);
                      }}
                    />
                    <br />
                    Generated fields:
                    {fields.join(', ')}
                    <ButtonContainer>
                      <Spacer />
                      <Button
                        pill
                        onClick={() => {
                          updateTemplate({...template, fields});
                        }}
                      >
                        Confirm
                      </Button>
                    </ButtonContainer>
                  </Form>
                </>
              )}
            </Body>
          </Container>
        </CreateModal>
      )}
    </>
  );
};

export {CreateRender};
