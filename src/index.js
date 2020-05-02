import fs from 'fs';
import path from 'path';

const getProjectsList = () => {
  const projectsListPath = path.join(__dirname, '../packagesList');
  const file = fs.readFileSync(projectsListPath);
  if (file) {
    const fileContent = file.toString();
    const fileLines = fileContent.split(/\r?\n/);
    return fileLines;
  }
  return null;
};

const getJsonPackages = (projectsList) => {
  return projectsList.map((projectPath) => {
    const packagePath = path.join(__dirname, '..', projectPath, 'package.json');
    const file = fs.readFileSync(packagePath);
    const packageJsonContent = file.toString();
    const packageJson = JSON.parse(packageJsonContent);
    return {
      name: packageJson.name,
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {}
    };
  });
};

const getAllPackages = (packages) => {
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
  return allPackages;
};

const getPackagesCount = (allPackages) => {
  const allPackagesCount = {};
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
  return Object.values(allPackagesCount);
};

const createCsv = (packagesCount) => {
  try {
    const csvPath = path.join(__dirname, '..', 'allPackages.csv');
    let fileContent = 'name,count';
    packagesCount.forEach((pack) => {
      fileContent += `\n${pack.name},${pack.count}`;
    });
    fs.writeFileSync(csvPath, fileContent);
  } catch (err) {
    console.error(err)
  }
}
 
try {
  const projectsList = getProjectsList();

  if (projectsList) {
    const packages = getJsonPackages(projectsList);
    const allPackages = getAllPackages(packages);
    const packagesCount = getPackagesCount(allPackages)
    packagesCount.sort((p, q) => q.count - p.count);
    console.log(packagesCount);
    createCsv(packagesCount);
  } else {
    console.log('no content');
  }
} catch (err) {
  console.log(err);
}
