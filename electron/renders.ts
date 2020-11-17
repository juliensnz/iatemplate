import {Render} from '../common/model/render';
import {advanceProgress, createProgress, encounterError, finishProgress, Progress} from '../common/model/progress';
import {getFoldersInFolder, getJsonData, writeJsonData, openFile} from './infrastructure/fs';
import {launchExport, launchRenaming, packageTemplate, waitForFileToBeOpen} from './infrastructure/illustrator';
import {resolve} from 'dns';
import {notify} from './infrastructure/notification';

const childProcess = require('child_process');

const getRenders = (path: string, templateName: string) => {
  const renderFolder = `${path}/renders/${templateName}`;

  return getFoldersInFolder(renderFolder).map((folder: any) => {
    const render = getJsonData(`${renderFolder}/${folder.name}/data.json`);

    return {
      ...render,
      identifier: folder.name,
      template: templateName,
    };
  });
};

const openRender = (path: string, templateName: string, renderName: string) => {
  openFile(getRenderFolder(path, templateName, renderName));
};

const generateRender = async (path: string, render: Render, updateProgress: (progress: Progress) => void) => {
  let progress = createProgress(8);
  try {
    progress = advanceProgress(progress, 'Remove Previous render');
    updateProgress(progress);
    await wait(1000);
    // removePreviousRender(path, render);
    progress = advanceProgress(progress, 'Open template file');
    updateProgress(progress);
    await wait(1000);
    // await openTemplateFile(path, render);
    progress = advanceProgress(progress, 'Package template to create render structure');
    updateProgress(progress);
    await wait(1000);
    // await packageTemplate(path, render);
    progress = advanceProgress(progress, 'Dump render configuration');
    updateProgress(progress);
    await wait(1000);
    // dumpConfiguration(path, render);
    progress = advanceProgress(progress, 'Open Element file to prepare renaming');
    updateProgress(progress);
    await wait(1000);
    // await openRenderSourceFile(path, render);
    progress = advanceProgress(progress, 'Launch renaming');
    updateProgress(progress);
    await wait(1000);
    // launchRenaming(render.data);
    progress = advanceProgress(progress, 'Open variant file');
    updateProgress(progress);
    await wait(1000);
    // await openRenderVariantFile(path, render);
    progress = advanceProgress(progress, 'Launch export');
    updateProgress(progress);
    await wait(1000);
    // launchExport();
    updateProgress(finishProgress(progress));
  } catch (error) {
    updateProgress(encounterError(progress, error));
    return;
  }

  notify('New render', 'The rendering of your template is done, enjoy 🎉', () =>
    openRender(path, render.template, render.identifier)
  );
};

// Utilitary methods
const getRenderFolder = (path: string, templateName: string, renderIdentifier: string) =>
  `${path}/renders/${templateName}/${renderIdentifier}`;

const getTemplateFolder = (path: string, templateName: string) => `${path}/${templateName}`;

const openFileAndWait = async (path: string) => {
  openFile(path);

  return await waitForFileToBeOpen(path);
};

const dumpConfiguration = (path: string, render: Render) => {
  writeJsonData(`${getRenderFolder(path, render.template, render.identifier)}/data.json`, render);
};

const removePreviousRender = (path: string, render: Render) => {
  const renderFolder = getRenderFolder(path, render.template, render.identifier);

  childProcess.execSync(`rm -rf ${renderFolder}`);
  childProcess.execSync(`mkdir -p ${path}/renders/${render.template}/`);
};

const openTemplateFile = async (path: string, render: Render) => {
  await openFileAndWait(`${getTemplateFolder(path, render.template)}/declinaisons.ai`);
};
const openRenderSourceFile = async (path: string, render: Render) => {
  await openFileAndWait(`${getRenderFolder(path, render.template, render.identifier)}/Links/Elements.ai`);
};
const openRenderVariantFile = async (path: string, render: Render) => {
  await openFileAndWait(`${getRenderFolder(path, render.template, render.identifier)}/declinaisons.ai`);
};

const wait = async (time: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export {getRenders, openRender, generateRender};
