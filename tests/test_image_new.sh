#!/bin/bash

IMAGE_PATH="Futura.png"
OUTPUT_IMAGE_PATH="output_image.png"
CANDID_LOG_FILE="test_image_candid.log"
ERROR_LOG_FILE="test_image_error.log"
CANISTER_ID="a4tbr-q4aaa-aaaaa-qaafq-cai"

# Function to encode image as hex string
encode_image() {
    xxd -p "$1" | tr -d '\n'
}

# Function to construct Candid argument
construct_candid_argument() {
    local image_content="$1"
    echo "(record { 
        texts = opt vec { 
            record { 
                content = \"Sample text\"; 
                metadata = opt record { 
                    description = opt \"Text description\";
                    date = opt \"2024-10-10\";
                    place = opt \"Test Location\";
                    tags = opt vec { \"test\"; \"text\" };
                    visibility = opt vec {};
                    people = opt vec {};
                }
            } 
        }; 
        images = opt vec { 
            record { 
                content = blob \"$image_content\"; 
                metadata = opt record { 
                    description = opt \"Sample Image\"; 
                    date = opt \"2024-10-10\"; 
                    place = opt \"Berlin\"; 
                    tags = opt vec { \"test\"; \"image\" }; 
                    visibility = opt vec {}; 
                    people = opt vec {}; 
                } 
            } 
        } 
    })"
}

# Clear log files
> "$CANDID_LOG_FILE"
> "$ERROR_LOG_FILE"

# Prompt user for test type
echo "Select test type:"
echo "1) Test with real image"
echo "2) Test with fake image (few bytes)"
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo "Testing with real image..."
        IMAGE_BINARY=$(encode_image "$IMAGE_PATH")
        ;;
    2)
        echo "Testing with fake image..."
        IMAGE_BINARY="89504e470d"  # Part of a PNG file header
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

# Construct Candid argument
CANDID_ARGUMENT=$(construct_candid_argument "$IMAGE_BINARY")

# Log the Candid argument
echo "Constructed Candid Argument:" > "$CANDID_LOG_FILE"
echo "$CANDID_ARGUMENT" >> "$CANDID_LOG_FILE"

# Store the image
echo "Storing image to the canister..."
dfx canister call "$CANISTER_ID" store_memory "$CANDID_ARGUMENT" > store_output.log 2>> "$ERROR_LOG_FILE"

if [ $? -ne 0 ]; then
    echo "Failed to store the image. See $ERROR_LOG_FILE for details."
    exit 1
fi

# Retrieve the stored memory
echo "Retrieving the image from the canister..."
MEMORY_OUTPUT=$(dfx canister call "$CANISTER_ID" retrieve_memory 2>> "$ERROR_LOG_FILE")

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
echo "Test completed successfully!"