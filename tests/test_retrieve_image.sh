#!/bin/bash

OUTPUT_IMAGE_PATH="retrieved_image.png"
ERROR_LOG_FILE="test_retrieve_image_error.log"

env_file="../.env"

> "$ERROR_LOG_FILE"

get_canister_id_futura_backend() {
    grep "^CANISTER_ID_FUTURA_BACKEND=" "$env_file" | cut -d '=' -f2 | tr -d '"' | tr -d "'"
}

CANDID_ARGUMENT=$(construct_retrieve_images_candid_argument)

# Function to construct Candid argument
construct_retrieve_images_candid_argument() {
    echo "(opt vec { 1: nat64 })"
}

CANISTER_ID_FUTURA_BACKEND=$(get_canister_id_futura_backend)

if [ -z "$CANISTER_ID_FUTURA_BACKEND" ]; then
    echo "CANISTER_ID_FUTURA_BACKEND is not set in .env file"
    exit 1
fi

DFX_CANISTER_ID=$(dfx canister id futura_backend 2>/dev/null)

if [ "$CANISTER_ID_FUTURA_BACKEND" != "$DFX_CANISTER_ID" ]; then
    echo "Mismatch between .env CANISTER_ID_FUTURA_BACKEND and 'dfx canister id futura_backend'"
    exit 1
else
    echo "CANISTER_ID_FUTURA_BACKEND matches the 'dfx canister id futura_backend' output."
fi

echo "Retrieving the image from the canister..."
MEMORY_OUTPUT=$(dfx canister call "$CANISTER_ID_FUTURA_BACKEND" retrieve_images $CANDID_ARGUMENT 2> "$ERROR_LOG_FILE")

if [ $? -ne 0 ]; then
    echo "Failed to retrieve the image. See $ERROR_LOG_FILE for details."
    exit 1
fi

# Extract the blob image from the memory output (macOS compatible)
IMAGE_BINARY=$(echo "$MEMORY_OUTPUT" | sed -n 's/.*content = blob "\([^"]*\)".*/\1/p')

if [ -z "$IMAGE_BINARY" ]; then
    echo "No image found in the retrieved memory."
    exit 1
fi

# Convert the hex-encoded image back to binary and save it
echo "$IMAGE_BINARY" | xxd -r -p > "$OUTPUT_IMAGE_PATH"
echo "Image saved as $OUTPUT_IMAGE_PATH."

# Display success message
echo "Image retrieval completed successfully!"