import {Render} from '../common/model/render';
import {getFoldersInFolder, getJsonData, writeJsonData, openFile} from './infrastructure/fs';
import {launchExport, launchRenaming, packageTemplate, waitForFileToBeOpen} from './infrastructure/illustrator';

const childProcess = require('child_process');

const getRenders = (options: {path: string; templateName: string}) => {
  const renderFolder = getRenderFolder(options.path, options.templateName);

  return getFoldersInFolder(renderFolder).map((folder: any) => {
    const render = getJsonData(`${renderFolder}/${folder.name}/data.json`);

    return {
      ...render,
      identifier: folder.name,
      template: options.templateName,
    };
  });
};

const openRender = (path: string, templateName: string, renderName: string) => {
  openFile(`${getRenderFolder(path, templateName)}/${renderName}`);
};

const generateRender = async (path: string, render: Render) => {
  removePreviousRender(path, render);
  await openTemplateFile(path, render);
  await packageTemplate(path, render);
  dumpConfiguration(path, render);
  await openRenderSourceFile(path, render);
  launchRenaming(render.data);
  await openRenderVariantFile(path, render);
  launchExport();
};

// Utilitary methods
const getRenderFolder = (path: string, templateName: string) => `${path}/renders/${templateName}`;
const getTemplateFolder = (path: string, templateName: string) => `${path}/${templateName}`;

const openFileAndWait = async (path: string) => {
  openFile(path);
  return await waitForFileToBeOpen(path);
};

const dumpConfiguration = (path: string, render: Render) => {
  writeJsonData(`${getRenderFolder(path, render.template)}/${render.identifier}/data.json`, render);
};

const removePreviousRender = (path: string, render: Render) => {
  const renderFolder = getRenderFolder(path, render.template);

  childProcess.execSync(`rm -rf ${renderFolder}`);
  childProcess.execSync(`mkdir -p ${path}/renders/${render.template}/`);
};

const openTemplateFile = async (path: string, render: Render) => {
  await openFileAndWait(`${getTemplateFolder(path, render.template)}/declinaisons.ai`);
};
const openRenderSourceFile = async (path: string, render: Render) => {
  await openFileAndWait(`${getRenderFolder(path, render.template)}/Links/Elements.ai"`);
};
const openRenderVariantFile = async (path: string, render: Render) => {
  await openFileAndWait(`${getRenderFolder(path, render.template)}/declinaisons.ai`);
};

export {getRenders, openRender, generateRender};
