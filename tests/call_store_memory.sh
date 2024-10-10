#!/bin/bash

# Canister ID
CANISTER_ID="a4tbr-q4aaa-aaaaa-qaafq-cai"

# # Hardcoded values for the Candid argument
# CONTENT="Sample text"
# DESCRIPTION="Sample description"
# DATE="2024-10-10"
# PLACE="Berlin"
# TAGS="opt vec {}"
# VISIBILITY="opt vec {}"
# PEOPLE="opt vec {}"

# # Construct the Candid argument using variables
# CANDID_ARGUMENT="(record { texts = vec { record { content = \"$CONTENT\"; metadata = opt record { description = opt \"$DESCRIPTION\"; date = opt \"$DATE\"; place = opt \"$PLACE\"; tags = $TAGS; visibility = $VISIBILITY; people = $PEOPLE; } } } }; images = vec {}; })"

# Hardcoded values for the Candid argument
CONTENT="Sample text"

# Construct the Candid argument using variables without optional fields
CANDID_ARGUMENT="(record { texts = vec { record { content = \"$CONTENT\"; } } }; images = vec {}; })"


# Call the canister with the constructed Candid argument
dfx canister call "$CANISTER_ID" store_memory "$CANDID_ARGUMENT"

