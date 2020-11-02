const fs = require('fs');
const childProcess = require('child_process');

type Template = {
  name: string;
  path: string;
  data: string[]
}

const getTemplates = (path: string) => {
  return fs.readdirSync(path, { withFileTypes: true })
    .filter((dirent: any) => dirent.isDirectory() && dirent.name !== 'renders')
    .map((dirent: any) => {
      const templatePath = `${path}/${dirent.name}`;
      const data = getData(`${templatePath}/data.txt`);

      return {
        name: dirent.name,
        path: templatePath,
        data
      }
    });
}

const getData = (path: string): string[] => {
  try {
    const file = fs.readFileSync(path, 'utf8');
    return (new String(file)).trim().split('\n');
  } catch (e) {
    return [];
  }
}

const openTemplate = (path: string, templateName: string) => {
  childProcess.execSync(`open ${path}/${templateName}`);
}

const writeTemplate = async (path: string, template: Template) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${path}/${template.name}/data.txt`, template.data.join('\n'), function (error: Error) {
      if (error) reject(error);

      resolve();
    });
  })
}

export {getTemplates, openTemplate, writeTemplate}
