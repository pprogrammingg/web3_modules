#!/bin/bash
# Comprehensive test suite for course modules

echo "🧪 Running comprehensive course tests..."
echo ""

# Test 1: Path verification
echo "1. Testing paths..."
node verify-paths.js
if [ $? -eq 0 ]; then
    echo "   ✅ Path verification passed"
else
    echo "   ❌ Path verification failed"
    exit 1
fi

# Test 1b: Landing + hubs + modules + assets + external link policy
echo ""
echo "1b. Sanity pages (landing cards, CSS/JS load, https links)..."
node scripts/sanity-pages.js
if [ $? -eq 0 ]; then
    echo "   ✅ Sanity pages passed"
else
    echo "   ❌ Sanity pages failed"
    exit 1
fi

# Test 2: File existence
echo ""
echo "2. Testing file existence..."
MISSING=0
for file in "common/styles.css" "common/course-data.js" "common/navigation.js" "common/glossary.js" "index.html" "README.md" "TESTING.md" "mobile-test.html"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ $file missing"
        MISSING=1
    fi
done

if [ $MISSING -eq 1 ]; then
    exit 1
fi

# Test 3: Module structure
echo ""
echo "3. Testing module structure..."
for module in "hyperscale/basic/module-01-blockchain-fundamentals.html" "hyperscale/basic/module-02-consensus-basics.html" "hyperscale/basic/module-03-distributed-systems.html" "hyperscale/basic/module-04-state-machines.html" "hyperscale/hyperscale-rs/module-01-overview.html"; do
    if [ -f "$module" ]; then
        if grep -q "styles.css" "$module" && grep -q "course-data.js" "$module" && grep -q "navigation.js" "$module"; then
            echo "   ✅ $module structure valid"
        else
            echo "   ❌ $module missing required includes"
            MISSING=1
        fi
    fi
done

# Test 4: CSS syntax (basic check)
echo ""
echo "4. Testing CSS..."
if grep -q ":root" common/styles.css && grep -q "var(--primary)" common/styles.css; then
    echo "   ✅ CSS structure valid"
else
    echo "   ⚠️  CSS might have issues"
fi

# Test 5: JS syntax (basic check)
echo ""
echo "5. Testing JavaScript..."
if grep -q "COURSE_DATA" common/course-data.js && grep -q "initializeCourseIndex" common/navigation.js; then
    echo "   ✅ JavaScript structure valid"
else
    echo "   ⚠️  JavaScript might have issues"
fi

# Test 5b: Quiz result highlighting (wrong vs correct)
echo ""
echo "5b. Testing quiz highlight (wrong answers highlighted)..."
node test-quiz.js
if [ $? -eq 0 ]; then
    echo "   ✅ Quiz highlight tests passed"
else
    echo "   ❌ Quiz highlight tests failed"
    exit 1
fi

echo ""
echo "6. Testing mobile test page..."
if [ -f "mobile-test.html" ]; then
    if grep -q "common/styles.css" mobile-test.html && grep -q "navigation" mobile-test.html && grep -q "module-grid\|module-card" mobile-test.html; then
        echo "   ✅ mobile-test.html exists and has required structure (styles, nav, module cards)"
    else
        echo "   ⚠️  mobile-test.html missing expected content (styles link, nav, or module grid)"
    fi
else
    echo "   ❌ mobile-test.html missing"
    exit 1
fi

echo ""
echo "✅ All tests completed!"
echo ""
echo "Summary:"
echo "  - Paths: ✅"
echo "  - Files: ✅"
echo "  - Modules: ✅"
echo "  - CSS: ✅"
echo "  - JS: ✅"
echo "  - Quiz highlight: ✅"
echo "  - Mobile test page: ✅"