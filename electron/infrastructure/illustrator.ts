import {Render} from '../../common/model/render';

const childProcess = require('child_process');

const waitForFileToBeOpen = (path: string, timeout: number = 10000) => {
  let result = '';
  const endDate = new Date();
  endDate.setMilliseconds(endDate.getMilliseconds() + timeout);

  while (result.indexOf(`file://${path}`) !== 0 && new Date() < endDate) {
    try {
      result = childProcess.execSync(`osascript ./scripts/current_file.scpt`).toString();
    } catch (error) {
      console.error(`Error: ${error.getMessage()}`);
    }
  }

  if (result.indexOf(`file://${path}`) !== 0)
    throw new Error(`Illustrator was too long to open the file "${path}".\n Got "${result}" insted`);
};

const packageTemplate = (path: string, render: Render) => {
  childProcess.execSync(
    `osascript ./scripts/duplicate.scpt "${path}/renders/${render.template}/" "${render.identifier}"`
  );
};

const launchRenaming = (data: {[key: string]: string}) => {
  console.log(data);
  childProcess.execSync(`osascript ./scripts/launch_rename.scpt '${JSON.stringify(data)}'`);
};

const launchExport = () => {
  childProcess.execSync('osascript ./scripts/export.scpt');
};

export {waitForFileToBeOpen, packageTemplate, launchRenaming, launchExport};
