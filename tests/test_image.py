import base64
import subprocess
from ic.candid import Types, encode

# Paths for test image and output
image_path = "Futura.png"
output_image_path = "output_image.png"

# URL of the backend canister
backend_url = "http://127.0.0.1:4943/?canisterId=a4tbr-q4aaa-aaaaa-qaafq-cai"


def upload_image(image_path):
    # Read the image as binary
    with open(image_path, "rb") as image_file:
        image_binary = image_file.read()

    # Base64 encode the image to send as text
    encoded_image = base64.b64encode(image_binary).decode("utf-8")

    # Define metadata using ic-py
    metadata = Types.Record(
        {
            "description": Types.Opt("Sample Image"),  # Just pass the value directly
            "date": Types.Opt("2024-10-10"),
            "place": Types.Opt("Berlin"),
            "tags": Types.Opt(["test", "image"]),  # Pass list of strings directly
            "visibility": Types.Opt([]),  # Empty list for visibility
        }
    )

    # Define the image type
    image = Types.Record(
        {
            "data": Types.Vec([byte for byte in image_binary]),  # Pass bytes directly
            "metadata": Types.Opt(metadata),
        }
    )
    # Define the memory type with images and empty texts
    # Define the image record properly
    image = Types.Record(
        {
            "data": Types.Vec(
                image_binary
            ),  # No need to wrap bytes in anything special
            "metadata": Types.Opt(metadata),  # This should already be a dictionary
        }
    )
    # Serialize the memory using ic-py
    candid_args = encode(memory)

    # Create the dfx call command
    command = ["dfx", "canister", "call", "futura_backend", "store_memory", candid_args]

    # Run the command using subprocess
    result = subprocess.run(command, capture_output=True, text=True)

    # Check result
    if result.returncode == 0:
        print("Image uploaded successfully.")
    else:
        print(f"Failed to upload image: {result.stderr}")


# Function to retrieve image using dfx (no change required for retrieval in this step)
def retrieve_image(output_image_path):
    command = ["dfx", "canister", "call", "futura_backend", "retrieve_memory"]
    result = subprocess.run(command, capture_output=True, text=True)

    if result.returncode == 0:
        # Parse the response from dfx (expected as Candid encoded text)
        response_json = result.stdout.split("(", 1)[-1].rsplit(")", 1)[0]
        memory_data = json.loads(response_json)

        # Extract image content and decode
        encoded_image = memory_data["images"][0]["content"]
        image_binary = base64.b64decode(encoded_image)

        # Write the image to file
        with open(output_image_path, "wb") as image_file:
            image_file.write(image_binary)

        print(f"Image saved to {output_image_path}")
    else:
        print(f"Failed to retrieve image: {result.stderr}")


if __name__ == "__main__":
    # Step 1: Upload image
    upload_image(image_path)

    # Step 2: Retrieve the image and save it locally
    retrieve_image(output_image_path)
