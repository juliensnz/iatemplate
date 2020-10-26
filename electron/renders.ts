const fs = require('fs');

const getRenders = (options: {path: string, templateName: string}) => {
  return fs.readdirSync(`${options.path}/renders/${options.templateName}`, { withFileTypes: true })
    .filter((dirent: any) => dirent.isDirectory())
    .map((dirent: any) => {
      const renderPath = `${options.path}/${dirent.name}`;
      // const data = getData(`${renderPath}/data.txt`);

      return {
        name: dirent.name,
        path: renderPath,
        // data
      }
    });
}

// const getData = (path: string): {[key: string]: string} => {
//   try {
//     const file = fs.readFileSync(path, 'utf8');
//     return (new String(file)).trim().split('\n');
//   } catch (e) {
//     return [];
//   }
// }

export {getRenders}
