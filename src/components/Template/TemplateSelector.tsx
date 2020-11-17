import React from 'react';
import {FormSelect} from 'shards-react';
import styled from 'styled-components';
import {Template} from '../../../common/model/template';

const Container = styled(FormSelect)`
  border-radius: 20px;
  border: none;
  text-transform: capitalize;
  padding: 0 40px 0 20px;
  margin: 0 10px;
`;
const Option = styled.option`
  text-transform: capitalize;
`;

const TemplateSelector = ({
  currentTemplate,
  templates,
  onChange,
}: {
  currentTemplate: Template;
  templates: Template[];
  onChange: (template: Template) => void;
}) => {
  return (
    <Container
      value={currentTemplate.name}
      onChange={(event: any) => {
        const selectedTemplate = templates.find(template => event.currentTarget.value === template.name);
        if (undefined === selectedTemplate) return;

        onChange(selectedTemplate);
      }}
    >
      {templates.map(template => (
        <Option key={template.name} value={template.name}>
          {template.name}
        </Option>
      ))}
    </Container>
  );
};

export {TemplateSelector};
