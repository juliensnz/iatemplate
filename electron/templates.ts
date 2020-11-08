import {Template} from '../common/model/template';
import {getFoldersInFolder, getTxtData, openFile, writeTxtData} from './infrastructure/fs';

const FIELDS_FILE_NAME = 'fields.txt';

const getTemplates = (path: string) => {
  return getFoldersInFolder(path)
    .filter((folder: any) => folder.name !== 'renders')
    .map((folder: any) => {
      const templatePath = `${path}/${folder.name}`;
      const fields = getTxtData(`${templatePath}/${FIELDS_FILE_NAME}`);

      return {
        name: folder.name,
        path: templatePath,
        fields,
      };
    });
};

const openTemplate = (path: string, templateName: string) => openFile(`${path}/${templateName}`);

const writeTemplate = async (path: string, template: Template) =>
  writeTxtData(`${path}/${template.name}/${FIELDS_FILE_NAME}`, template.fields);

export {getTemplates, openTemplate, writeTemplate};
