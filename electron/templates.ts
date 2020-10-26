const fs = require('fs');

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

export {getTemplates}
