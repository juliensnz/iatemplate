import React, {ChangeEvent, useCallback, useState} from 'react';
import {AddFilled32, Close32} from '@carbon/icons-react';
import styled from 'styled-components';
import {Form, FormGroup, FormInput, FormTextarea, Card, CardHeader, CardBody, CardTitle, Button} from 'shards-react';
import {Render, useGenerateRender} from '../../hooks/useRenders';
import {Template} from '../../../common/model/template';
import {IconButton} from '../UI';

const CreateModal = styled.div`
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
`;

const Title = styled(CardTitle)`
  font-weight: 100;
  font-size: 25px;
  line-height: 35px;
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

const Input = styled(FormInput)`
  &:invalid {
    border-color: tomato;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
`;
const Spacer = styled.div`
  flex: 1;
`;

const CreateRender = ({template}: {template: Template}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<{[key: string]: string}>({});
  const [renderName, setRenderName] = useState<string>('');
  const generateRender = useGenerateRender();

  const validateRender = useCallback(
    (render: Render): boolean =>
      typeof render.name !== 'string' ||
      0 === render.name.length ||
      undefined === render.template ||
      undefined === render.data ||
      template.fields.some((field: string) => render.data[field] === undefined),
    [template.fields]
  );

  const resetForm = useCallback(() => {
    setData({});
    setRenderName('');
  }, []);

  return (
    <>
      <IconButton
        title="Generate a new render"
        onClick={() => {
          setIsOpen(true);
          resetForm();
        }}
      >
        <AddFilled32 color="white" />
      </IconButton>
      {isOpen && (
        <CreateModal>
          <Container>
            <Header>
              <Title>Create a new render for "{template.name}" template</Title>
              <IconButton
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <Close32 color="black" />
              </IconButton>
            </Header>
            <Body>
              <Form>
                <FormGroup>
                  <label htmlFor={`field-render-name`}>Client identifier</label>
                  <Input
                    id={`field-render-name`}
                    required
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setRenderName(event.currentTarget.value);
                    }}
                    value={renderName}
                    placeholder="Michel Drucker"
                  />
                </FormGroup>
                {template.fields.map((fieldName: string) => {
                  const niceName = fieldName.split('_').join(' ');

                  return (
                    <FormGroup key={fieldName}>
                      <label htmlFor={`field-${fieldName}`}>
                        {niceName} ({fieldName})
                      </label>
                      <FormTextarea
                        id={`field-${fieldName}`}
                        required
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                          setData({...data, [fieldName]: event.currentTarget.value});
                        }}
                        value={data[fieldName]}
                        placeholder={niceName}
                      />
                    </FormGroup>
                  );
                })}
                <ButtonContainer>
                  <Spacer />
                  <Button
                    onClick={() => {
                      const newRender = {
                        identifier: renderName.split(' ').join('_').toLowerCase(),
                        name: renderName,
                        template: template.name,
                        data,
                      };
                      if (validateRender(newRender)) {
                        alert('render not valid');
                      }

                      setIsOpen(false);
                      generateRender(newRender);
                    }}
                    pill
                  >
                    Confirm
                  </Button>
                </ButtonContainer>
              </Form>
            </Body>
          </Container>
        </CreateModal>
      )}
    </>
  );
};

export {CreateRender};
