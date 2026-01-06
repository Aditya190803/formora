#!/bin/bash

# Formora - Appwrite Setup Script (CLI version)
# Make sure you're logged in: appwrite login

PROJECT_ID="formora"
DATABASE_ID="formora-db"
FORMS_COLLECTION_ID="forms"
RESPONSES_COLLECTION_ID="responses"

echo "Formora - Appwrite CLI Setup"
echo "============================"
echo ""

# Helper function to check if resource exists
check_database() {
    appwrite databases get --database-id "$DATABASE_ID" >/dev/null 2>&1
    return $?
}

check_collection() {
    appwrite databases get-collection --database-id "$DATABASE_ID" --collection-id "$1" >/dev/null 2>&1
    return $?
}

check_attribute() {
    appwrite databases get-attribute --database-id "$DATABASE_ID" --collection-id "$1" --key "$2" >/dev/null 2>&1
    return $?
}

check_index() {
    appwrite databases get-index --database-id "$DATABASE_ID" --collection-id "$1" --key "$2" >/dev/null 2>&1
    return $?
}

# Create or update database
echo "Checking database..."
if check_database; then
    echo "✓ Database '$DATABASE_ID' already exists"
else
    echo "Creating database..."
    appwrite databases create --database-id "$DATABASE_ID" --name "formora"
    echo "✓ Database created"
fi

# Create or update forms collection
echo ""
echo "Checking forms collection..."
if check_collection "$FORMS_COLLECTION_ID"; then
    echo "✓ Collection '$FORMS_COLLECTION_ID' already exists"
else
    echo "Creating forms collection..."
    appwrite databases create-collection \
        --database-id "$DATABASE_ID" \
        --collection-id "$FORMS_COLLECTION_ID" \
        --name "forms" \
        --permissions 'create("users")' 'read("any")' 'update("users")' 'delete("users")'
    echo "✓ Collection created"
fi

# Forms attributes
echo "Checking forms attributes..."

if check_attribute "$FORMS_COLLECTION_ID" "userId"; then
    echo "  ✓ userId exists"
else
    echo "  Creating userId..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "userId" --size 255 --required true
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "title"; then
    echo "  ✓ title exists"
else
    echo "  Creating title..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "title" --size 255 --required true
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "description"; then
    echo "  ✓ description exists"
else
    echo "  Creating description..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "description" --size 1000 --required false
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "style"; then
    echo "  ✓ style exists"
else
    echo "  Creating style..."
    appwrite databases create-enum-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "style" --elements classic conversational marketing neo_brutalism minimal --required false --xdefault conversational
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "primaryColor"; then
    echo "  ✓ primaryColor exists"
else
    echo "  Creating primaryColor..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "primaryColor" --size 7 --required false --xdefault "#3b82f6"
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "backgroundColor"; then
    echo "  ✓ backgroundColor exists"
else
    echo "  Creating backgroundColor..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "backgroundColor" --size 7 --required false --xdefault "#ffffff"
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "textColor"; then
    echo "  ✓ textColor exists"
else
    echo "  Creating textColor..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "textColor" --size 7 --required false --xdefault "#000000"
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "fontFamily"; then
    echo "  ✓ fontFamily exists"
else
    echo "  Creating fontFamily..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "fontFamily" --size 20 --required false --xdefault "sans"
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "buttonText"; then
    echo "  ✓ buttonText exists"
else
    echo "  Creating buttonText..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "buttonText" --size 50 --required false --xdefault "Submit"
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "backgroundImage"; then
    echo "  ✓ backgroundImage exists"
else
    echo "  Creating backgroundImage..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "backgroundImage" --size 1000 --required false
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "animationSpeed"; then
    echo "  ✓ animationSpeed exists"
else
    echo "  Creating animationSpeed..."
    appwrite databases create-float-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "animationSpeed" --min 0.1 --max 2.0 --required false --xdefault 0.4
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "slug"; then
    echo "  ✓ slug exists"
else
    echo "  Creating slug..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "slug" --size 255 --required false
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "limitOneResponse"; then
    echo "  ✓ limitOneResponse exists"
else
    echo "  Creating limitOneResponse..."
    appwrite databases create-boolean-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "limitOneResponse" --required false --xdefault false
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "collaborators"; then
    echo "  ✓ collaborators exists"
else
    echo "  Creating collaborators..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "collaborators" --size 255 --required false --array true
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "questions"; then
    echo "  ✓ questions exists"
else
    echo "  Creating questions..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "questions" --size 100000 --required true
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "isPublished"; then
    echo "  ✓ isPublished exists"
else
    echo "  Creating isPublished..."
    appwrite databases create-boolean-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "isPublished" --required false --xdefault false
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "createdAt"; then
    echo "  ✓ createdAt exists"
else
    echo "  Creating createdAt..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "createdAt" --size 30 --required true
    sleep 2
fi

if check_attribute "$FORMS_COLLECTION_ID" "updatedAt"; then
    echo "  ✓ updatedAt exists"
else
    echo "  Creating updatedAt..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "updatedAt" --size 30 --required true
    sleep 2
fi

# Forms indexes
echo "Checking forms indexes..."

if check_index "$FORMS_COLLECTION_ID" "userId_idx"; then
    echo "  ✓ userId_idx exists"
else
    echo "  Creating userId_idx..."
    appwrite databases create-index --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "userId_idx" --type key --attributes userId
    sleep 2
fi

if check_index "$FORMS_COLLECTION_ID" "createdAt_idx"; then
    echo "  ✓ createdAt_idx exists"
else
    echo "  Creating createdAt_idx..."
    appwrite databases create-index --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "createdAt_idx" --type key --attributes createdAt
    sleep 2
fi

if check_index "$FORMS_COLLECTION_ID" "slug_idx"; then
    echo "  ✓ slug_idx exists"
else
    echo "  Creating slug_idx..."
    appwrite databases create-index --database-id "$DATABASE_ID" --collection-id "$FORMS_COLLECTION_ID" --key "slug_idx" --type unique --attributes slug
    sleep 2
fi

# Create or update responses collection
echo ""
echo "Checking responses collection..."
if check_collection "$RESPONSES_COLLECTION_ID"; then
    echo "✓ Collection '$RESPONSES_COLLECTION_ID' already exists"
else
    echo "Creating responses collection..."
    appwrite databases create-collection \
        --database-id "$DATABASE_ID" \
        --collection-id "$RESPONSES_COLLECTION_ID" \
        --name "responses" \
        --permissions 'create("any")' 'read("users")' 'delete("users")'
    echo "✓ Collection created"
fi

# Responses attributes
echo "Checking responses attributes..."

if check_attribute "$RESPONSES_COLLECTION_ID" "formId"; then
    echo "  ✓ formId exists"
else
    echo "  Creating formId..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$RESPONSES_COLLECTION_ID" --key "formId" --size 255 --required true
    sleep 2
fi

if check_attribute "$RESPONSES_COLLECTION_ID" "answers"; then
    echo "  ✓ answers exists"
else
    echo "  Creating answers..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$RESPONSES_COLLECTION_ID" --key "answers" --size 100000 --required true
    sleep 2
fi

if check_attribute "$RESPONSES_COLLECTION_ID" "ipAddress"; then
    echo "  ✓ ipAddress exists"
else
    echo "  Creating ipAddress..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$RESPONSES_COLLECTION_ID" --key "ipAddress" --size 255 --required false
    sleep 2
fi

if check_attribute "$RESPONSES_COLLECTION_ID" "submittedAt"; then
    echo "  ✓ submittedAt exists"
else
    echo "  Creating submittedAt..."
    appwrite databases create-string-attribute --database-id "$DATABASE_ID" --collection-id "$RESPONSES_COLLECTION_ID" --key "submittedAt" --size 30 --required true
    sleep 2
fi

# Responses indexes
echo "Checking responses indexes..."

if check_index "$RESPONSES_COLLECTION_ID" "formId_idx"; then
    echo "  ✓ formId_idx exists"
else
    echo "  Creating formId_idx..."
    appwrite databases create-index --database-id "$DATABASE_ID" --collection-id "$RESPONSES_COLLECTION_ID" --key "formId_idx" --type key --attributes formId
    sleep 2
fi

if check_index "$RESPONSES_COLLECTION_ID" "submittedAt_idx"; then
    echo "  ✓ submittedAt_idx exists"
else
    echo "  Creating submittedAt_idx..."
    appwrite databases create-index --database-id "$DATABASE_ID" --collection-id "$RESPONSES_COLLECTION_ID" --key "submittedAt_idx" --type key --attributes submittedAt
    sleep 2
fi

echo ""
echo "============================"
echo "✓ Setup complete!"
echo ""
echo "Add these to your .env.local file:"
echo "============================"
echo "NEXT_PUBLIC_APPWRITE_DATABASE_ID=$DATABASE_ID"
echo "NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID=$FORMS_COLLECTION_ID"
echo "NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID=$RESPONSES_COLLECTION_ID"
echo ""
