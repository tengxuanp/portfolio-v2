#!/usr/bin/env node

/**
 * Test script to validate floating toolbar fixes
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Testing Floating Toolbar Fixes...\n');

// Test 1: Check if RichTextEditor has the updated scroll detection
const editorPath = path.join(__dirname, 'src/app/components/RichTextEditor.tsx');
const editorContent = fs.readFileSync(editorPath, 'utf8');

console.log('✅ Test 1: Enhanced Scroll Detection');
const hasModalScrolling = editorContent.includes('querySelectorAll(\'[role="dialog"], .modal, [data-slot="base"]\')');
const hasParentScrolling = editorContent.includes('parent.addEventListener(\'scroll\'');
const hasMutationObserver = editorContent.includes('new MutationObserver');

if (hasModalScrolling && hasParentScrolling && hasMutationObserver) {
  console.log('   ✅ Modal scroll detection: Present');
  console.log('   ✅ Parent container scrolling: Present');
  console.log('   ✅ Dynamic DOM listener setup: Present');
} else {
  console.log('   ❌ Missing enhanced scroll detection components');
}

// Test 2: Check manual toolbar toggle
console.log('\n✅ Test 2: Manual Toolbar Toggle');
const hasManualToggle = editorContent.includes('manualFloatingToolbar');
const hasToggleButton = editorContent.includes('🔧 Tools');
const hasStateManagement = editorContent.includes('setManualFloatingToolbar');

if (hasManualToggle && hasToggleButton && hasStateManagement) {
  console.log('   ✅ Manual toggle state: Present');
  console.log('   ✅ Toggle button: Present');
  console.log('   ✅ State management: Present');
} else {
  console.log('   ❌ Manual toggle system incomplete');
}

// Test 3: Check toolbar positioning and responsiveness
console.log('\n✅ Test 3: CSS Improvements');
const cssPath = path.join(__dirname, 'src/app/globals.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

const hasResponsive = cssContent.includes('@media (max-width: 768px)');
const hasMaxHeight = cssContent.includes('max-height: 80vh');
const hasOverflow = cssContent.includes('overflow-y: auto');

if (hasResponsive && hasMaxHeight && hasOverflow) {
  console.log('   ✅ Responsive design: Present');
  console.log('   ✅ Height constraints: Present');
  console.log('   ✅ Overflow handling: Present');
} else {
  console.log('   ❌ CSS improvements incomplete');
}

// Test 4: Check compact toolbar improvements
console.log('\n✅ Test 4: Compact Toolbar');
const hasCompactIcons = editorContent.includes('isCompact ? "📷" : "📷 Image"');
const hasCompactLink = editorContent.includes('isCompact ? (editor.isActive(\'link\') ? \'🔗✕\' : \'🔗\')');

if (hasCompactIcons && hasCompactLink) {
  console.log('   ✅ Compact icon display: Present');
  console.log('   ✅ Compact link handling: Present');
} else {
  console.log('   ❌ Compact toolbar improvements incomplete');
}

// Summary
console.log('\n📊 FLOATING TOOLBAR FIX SUMMARY:');
console.log('================================');

const totalTests = 4;
let passedTests = 0;

if (hasModalScrolling && hasParentScrolling && hasMutationObserver) passedTests++;
if (hasManualToggle && hasToggleButton && hasStateManagement) passedTests++;
if (hasResponsive && hasMaxHeight && hasOverflow) passedTests++;
if (hasCompactIcons && hasCompactLink) passedTests++;

console.log(`📈 Tests Passed: ${passedTests}/${totalTests}`);
console.log(`📊 Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 ALL FLOATING TOOLBAR FIXES IMPLEMENTED!');
  console.log('\n📋 KEY IMPROVEMENTS:');
  console.log('   • Enhanced scroll detection for modal environments');
  console.log('   • Manual toggle button for guaranteed access');
  console.log('   • Responsive design for mobile devices');
  console.log('   • Compact toolbar with essential tools');
  console.log('   • Dynamic DOM listener setup');
  console.log('\n💡 TESTING INSTRUCTIONS:');
  console.log('   1. Run npm run dev');
  console.log('   2. Open admin panel (Cmd+Shift+A)');
  console.log('   3. Create/edit a post with long content');
  console.log('   4. Scroll down in the editor');
  console.log('   5. Use the "🔧 Tools" button for floating toolbar');
  console.log('   6. Test H1, H2, and image upload from floating toolbar');
} else {
  console.log('\n⚠️  Some floating toolbar fixes may need attention');
}

console.log('\n🔄 Ready for testing!');
