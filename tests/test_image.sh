#!/bin/bash

IMAGE_PATH="Futura.png"
OUTPUT_IMAGE_PATH="output_image.png"
CANDID_LOG_FILE="test_image_candid.log"
ERROR_LOG_FILE="test_image_error.log"
CANISTER_ID="a4tbr-q4aaa-aaaaa-qaafq-cai"

echo "" > "$CANDID_LOG_FILE"
echo "" > "$ERROR_LOG_FILE"

# Read the image as raw binary and encode it as a hex string
# IMAGE_BINARY=$(xxd -p "$IMAGE_PATH" | tr -d '\n')
IMAGE_BINARY="89504e470d"  # This is a part of a PNG file header

# Constructing a sample text record
TEXT_RECORD="record { content = \"Sample text\"; metadata = opt record { description = opt \"Text description\"; } }"; 

# Construct the Candid argument
# CANDID_ARGUMENT="(record { texts = opt vec {}; images = opt vec { record { content = blob \"$IMAGE_BINARY\"; metadata = opt record { description = opt \"Sample Image\"; date = opt \"2024-10-10\"; place = opt \"Berlin\"; tags = opt vec { \"test\"; \"image\" }; visibility = opt vec {}; people = opt vec {}; } } } })"

# Construct empty Candid argument
CANDID_ARGUMENT="(record { texts = opt vec {}; images = opt vec {}; })"






# Log the Candid argument for review
echo "Constructed Candid Argument:" > "$CANDID_LOG_FILE"
echo "$CANDID_ARGUMENT" >> "$CANDID_LOG_FILE"

# Store the image and log errors
echo "Storing image to the canister..."
dfx canister call "$CANISTER_ID" store_memory "$CANDID_ARGUMENT" > store_output.log 2>> "$ERROR_LOG_FILE"

# Check if the store command was successful
if [ $? -ne 0 ]; then
  echo "Failed to store the image. See $ERROR_LOG_FILE for details."
  exit 1
fi

# Retrieve the stored memory and log errors
echo "Retrieving the image from the canister..."
MEMORY_OUTPUT=$(dfx canister call "$CANISTER_ID" retrieve_memory 2>> "$ERROR_LOG_FILE")

# Check if the retrieve command was successful
if [ $? -ne 0 ]; then
  echo "Failed to retrieve the image. See $ERROR_LOG_FILE for details."
  exit 1
fi

# Extract the blob image from the memory output (hex encoded)
IMAGE_BINARY=$(echo "$MEMORY_OUTPUT" | grep -oP '(?<=data = blob ").*?(?=";)')

if [ -z "$IMAGE_BINARY" ]; then
  echo "No image found in the retrieved memory."
  exit 1
fi

# Convert the hex-encoded image back to binary and save it
echo "$IMAGE_BINARY" | xxd -r -p > "$OUTPUT_IMAGE_PATH"

echo "Image saved as $OUTPUT_IMAGE_PATH."
