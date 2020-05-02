import fs from 'fs';
import path from 'path';
 
try {
  const packagesListPath = path.join(__dirname, '../packagesList');
  const file = fs.readFileSync(packagesListPath);

  if (file) {
    const fileContent = file.toString();
    const fileLines = fileContent.split(/\r?\n/);
    const packages = [];
    fileLines.forEach((projectPath) => {
      const packagePath = path.join(__dirname, '..', projectPath, 'package.json');
      const file = fs.readFileSync(packagePath);
      const packageJsonContent = file.toString();
      const packageJson = JSON.parse(packageJsonContent);
      packages.push({
        name: packageJson.name,
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {}
      });
    });
    const allPackages = [];
    const allPackagesCount = {};
    packages.forEach((pack) => {
      const dependencies = Object.keys(pack.dependencies);
      const devDependencies = Object.keys(pack.devDependencies);
      dependencies.forEach((dependency) => {
        allPackages.push(dependency);
      });
      devDependencies.forEach((dependency) => {
        allPackages.push(dependency);
      });
    });
    allPackages.forEach((pack) => {
      if (allPackagesCount[pack]) {
        allPackagesCount[pack].count += 1;
      } else {
        allPackagesCount[pack] = {
          name: pack,
          count: 1
        };
      }
    });
    const packagesValues = Object.values(allPackagesCount);
    packagesValues.sort((p, q) => q.count - p.count);
    console.log(packagesValues);
  } else {
    console.log('no content');
  }
} catch (err) {
  console.log(err);
}
