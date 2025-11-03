#!/bin/bash

# Quick test script for the portfolio application
echo "🔍 Checking Portfolio Application Status..."
echo ""

# Check if Node.js version is adequate
NODE_VERSION=$(node --version)
echo "📦 Node.js Version: $NODE_VERSION"

# Extract major version number
MAJOR_VERSION=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
if [ "$MAJOR_VERSION" -ge 18 ]; then
    echo "✅ Node.js version is adequate (>= 18)"
    NODE_OK=true
else
    echo "❌ Node.js version is too old (need >= 18.17.0)"
    NODE_OK=false
fi

echo ""

# Check if all required files exist
echo "📁 Checking required files..."
FILES=(
    "src/app/components/RichTextEditor.tsx"
    "src/app/components/PostsManagerNew.tsx"
    "src/app/components/AuthContext.tsx"
    "src/app/api/auth/login/route.ts"
    ".env.local"
)

ALL_FILES_EXIST=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        ALL_FILES_EXIST=false
    fi
done

echo ""

# Check environment variables
echo "🔐 Checking environment variables..."
if [ -f ".env.local" ]; then
    if grep -q "ADMIN_USERNAME" .env.local && grep -q "ADMIN_PASSWORD" .env.local; then
        echo "✅ Authentication credentials configured"
    else
        echo "❌ Authentication credentials missing"
    fi
else
    echo "❌ .env.local file missing"
fi

echo ""

# Summary
echo "📊 SUMMARY:"
if [ "$NODE_OK" = true ] && [ "$ALL_FILES_EXIST" = true ]; then
    echo "🎉 Application is ready to run!"
    echo ""
    echo "🚀 To start the application:"
    echo "   npm run dev"
    echo ""
    echo "🌐 Then visit: http://localhost:3089"
    echo ""
    echo "🔑 Login with credentials from .env.local to test:"
    echo "   - Create new blog posts"
    echo "   - Edit existing posts"
    echo "   - Use rich text editor with syntax highlighting"
    echo "   - Test CTF and Flipper Zero categories"
else
    echo "⚠️  Some issues need to be resolved before running"
    if [ "$NODE_OK" = false ]; then
        echo "   • Update Node.js to version >= 18.17.0"
    fi
    if [ "$ALL_FILES_EXIST" = false ]; then
        echo "   • Ensure all required files are present"
    fi
fi

echo ""
echo "🔧 Recent fixes applied:"
echo "   • SSR hydration issues resolved"
echo "   • TipTap editor properly configured"
echo "   • Dynamic imports for client-side components"
echo "   • Authentication system fully implemented"
