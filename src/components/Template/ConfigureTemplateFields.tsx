import React, {ChangeEvent, useCallback, useContext, useState} from 'react';
import {Template} from '../../../common/model/template';
import {Form, Button} from 'shards-react';
import styled from 'styled-components';
import {ButtonContainer, Spacer} from '../UI';
import {ElectronContext} from '../../context/ElectronContext';

const Textarea = styled.textarea`
  display: block;
  width: 100%;
  height: 300px;
  border-radius: 10px;
  padding: 5px 10px;
`;

const ConfigureTemplateFields = ({
  template,
  updateTemplates,
}: {
  template: Template;
  updateTemplates: () => Promise<void>;
}) => {
  const doesNotHaveTemplateFields = 0 === template.fields.length;
  const [rawFields, setRawFields] = useState(doesNotHaveTemplateFields ? '' : template.fields.join('\n'));
  const fields = rawFields.split('\n');
  const {invoke} = useContext(ElectronContext);
  const updateTemplate = useCallback(
    async (template: Template) => {
      console.log(template);
      await invoke('template:write', template);
      updateTemplates();
    },
    [updateTemplates, invoke]
  );

  return (
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
  );
};

export {ConfigureTemplateFields};
