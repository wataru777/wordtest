#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// package.jsonを読み込み
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

console.log('🚀 Starting deployment process...');
console.log(`Current version: ${packageJson.version}`);

try {
  // バージョンをパッチアップ
  console.log('📈 Bumping patch version...');
  execSync('npm version patch --no-git-tag-version', { stdio: 'inherit' });
  
  // 更新されたpackage.jsonを再読み込み
  const updatedPackageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const newVersion = updatedPackageJson.version;
  
  console.log(`✅ Version updated to: ${newVersion}`);
  
  // Gitステータスを確認
  console.log('📋 Checking git status...');
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  
  if (gitStatus.trim()) {
    console.log('📦 Staging changes...');
    execSync('git add .', { stdio: 'inherit' });
    
    console.log('💾 Creating commit...');
    const commitMessage = `Deploy v${newVersion}\n\n🤖 Generated with [Claude Code](https://claude.ai/code)\n\nCo-Authored-By: Claude <noreply@anthropic.com>`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  }
  
  console.log('🚀 Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('✨ Deployment completed successfully!');
  console.log(`🎉 Version ${newVersion} deployed!`);
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}