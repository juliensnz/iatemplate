const fs = require('fs');
const childProcess = require('child_process');

const getRenders = (options: {path: string, templateName: string}) => {
  const renderFolder = `${options.path}/renders/${options.templateName}`;

  if (!fs.existsSync(renderFolder)) return [];

  return fs.readdirSync(renderFolder, { withFileTypes: true })
    .filter((dirent: any) => dirent.isDirectory())
    .map((dirent: any) => {
      const renderPath = `${options.path}/${dirent.name}`;
      const data = getData(`${renderPath}/data.json`);

      return {
        name: dirent.name,
        path: renderPath,
        template: options.templateName,
        data
      }
    });
}

const openRender = (path: string, templateName: string, renderName: string) => {
  childProcess.execSync(`open ${path}/renders/${templateName}/${renderName}`);
}

const getData = (path: string): {[key: string]: string} => {
  try {
    const file = fs.readFileSync(path, 'utf8');
    return JSON.parse(file);
  } catch (e) {
    return {};
  }
}

export {getRenders, openRender}
