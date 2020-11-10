const fs = require('fs');
const childProcess = require('child_process');

const getFoldersInFolder = (path: string): string[] => {
  if (!fs.existsSync(path)) return [];

  return fs.readdirSync(path, {withFileTypes: true}).filter((folder: any) => folder.isDirectory());
};

const getJsonData = (path: string): {[key: string]: string} => {
  try {
    const file = fs.readFileSync(path, 'utf8');
    return JSON.parse(file);
  } catch (e) {
    return {};
  }
};

const writeJsonData = (path: string, data: any): void => {
  fs.writeFileSync(path, JSON.stringify(data));
};

const openFile = (path: string): void => childProcess.execSync(`open "${path}"`);

const getTxtData = (path: string): string[] => {
  try {
    const file = fs.readFileSync(path, 'utf8');

    return new String(file).trim().split('\n');
  } catch (e) {
    return [];
  }
};

const writeTxtData = (path: string, data: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data.join('\n'), function (error: Error) {
      if (error) reject(error);

      resolve();
    });
  });
};

export {getFoldersInFolder, getJsonData, writeJsonData, openFile, getTxtData, writeTxtData};
