import { Project, SyntaxKind } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

const project = new Project();
const sourceFile = project.addSourceFileAtPath('src/App.tsx');

const screensDir = path.join(process.cwd(), 'src', 'screens');
const componentsDir = path.join(process.cwd(), 'src', 'components');
const typesDir = path.join(process.cwd(), 'src', 'types');

[screensDir, componentsDir, typesDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Extract types
const typeAliases = sourceFile.getTypeAliases();
let typesContent = '';
typeAliases.forEach(typeAlias => {
  typesContent += 'export ' + typeAlias.getText() + '\n\n';
});
fs.writeFileSync(path.join(typesDir, 'index.ts'), typesContent);

// Get imports
const imports = sourceFile.getImportDeclarations().map(imp => imp.getText()).join('\n');

// Extract ExploreIcon
const variableStatements = sourceFile.getVariableStatements();
const exploreIconVar = variableStatements.find(v => v.getDeclarations().some(d => d.getName() === 'ExploreIcon'));
if (exploreIconVar) {
  let content = `import React from 'react';\n\n`;
  content += `export const ExploreIcon = ${exploreIconVar.getDeclarations()[0].getInitializer()?.getText()};\n`;
  fs.writeFileSync(path.join(componentsDir, 'ExploreIcon.tsx'), content);
}

// Extract functions
const functions = sourceFile.getFunctions();
const appFunction = functions.find(f => f.getName() === 'App');
const otherFunctions = functions.filter(f => f.getName() !== 'App');

otherFunctions.forEach(func => {
  const name = func.getName();
  if (!name) return;
  
  let content = `${imports}\n\n`;
  content += `import { Screen, Tab } from '../types';\n`;
  content += `import { ExploreIcon } from '../components/ExploreIcon';\n\n`;
  
  content += `export default ${func.getText()}\n`;
  
  const dir = name.includes('Screen') || name.includes('Layout') ? screensDir : componentsDir;
  fs.writeFileSync(path.join(dir, `${name}.tsx`), content);
});

// Now rewrite App.tsx
let newAppContent = `${imports}\n\n`;
newAppContent += `import { Screen, Tab } from './types';\n`;
newAppContent += `import { ExploreIcon } from './components/ExploreIcon';\n`;

otherFunctions.forEach(func => {
  const name = func.getName();
  if (!name) return;
  const dir = name.includes('Screen') || name.includes('Layout') ? 'screens' : 'components';
  newAppContent += `import ${name} from './${dir}/${name}';\n`;
});

if (appFunction) {
  newAppContent += `\nexport default ${appFunction.getText()}\n`;
}

fs.writeFileSync('src/App.tsx', newAppContent);

console.log('Split complete!');
