import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const versionConfigPath = path.join(projectRoot, 'version.config.json');
const packageJsonPath = path.join(projectRoot, 'package.json');
const serverJsonPath = path.join(projectRoot, 'server.json');

try {
  // Read version config
  const versionConfig = JSON.parse(fs.readFileSync(versionConfigPath, 'utf8'));

  // Update package.json version
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = versionConfig.version;
  packageJson.name = versionConfig.name;

  // Write back to package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`✅ Synced version ${versionConfig.version} to package.json`);

  // Update server.json version and name
  const serverJson = JSON.parse(fs.readFileSync(serverJsonPath, 'utf8'));
  serverJson.version = versionConfig.version;
  serverJson.packages[0].identifier = versionConfig.name;
  serverJson.packages[0].version = versionConfig.version;

  // Write back to server.json
  fs.writeFileSync(serverJsonPath, JSON.stringify(serverJson, null, 2) + '\n');
  console.log(`✅ Synced version ${versionConfig.version} to server.json`);
} catch (error) {
  console.error('❌ Error syncing version:', error);
  process.exit(1);
}
