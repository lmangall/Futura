# Futura Backend Documentation

This file explains how the `Futura_backend` canister works, focusing on the Rust code that handles storing and retrieving memories on the Internet Computer (ICP).

### 1. **Imports and Dependencies**

```rust
use std::collections::HashMap;
use ic_cdk::storage;
use ic_cdk_macros::*;
```

- **`use`**: In Rust, `use` is similar to `#include` in C/C++. It imports libraries and modules so they can be used in this file.
  - `std::collections::HashMap`: This imports the `HashMap` data structure from Rust's standard library. A `HashMap` is a key-value store, similar to a dictionary in Python or an object in JS.
  - `ic_cdk::storage`: This imports functionality from the Internet Computer’s **CDK** (Canister Development Kit). The **CDK** is like an SDK, providing the tools to interact with the ICP environment, such as saving and accessing data.
  - `ic_cdk_macros::*`: This imports macros (like `#[ic_cdk::query]` and `#[ic_cdk::update]`) that define how functions interact with the ICP system. They tell ICP that a function is either reading data (`query`) or modifying state (`update`).

### 2. **Greet Function**

```rust
#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}
```

- **`#[ic_cdk::query]`**: This macro tells the Internet Computer that `greet` is a **query function**. Query functions **read** data but do not modify it. They are fast and do not require consensus across the network, meaning they don’t cost cycles (ICP's version of gas fees) for state changes.

### 3. **Memory Struct and `#[derive(Clone)]`**

```rust
#[derive(Clone)]
struct Memory {
    memory: String,
}
```

- **`#[derive(Clone)]`**: This macro automatically provides a **clone** method for the `Memory` struct, meaning instances of `Memory` can be easily copied. In C++, this would be equivalent to having a copy constructor. Without `Clone`, Rust would prevent us from copying the struct.
- **`struct Memory`**: This defines a struct, similar to a class in C++ or an object in JS. It has one field, `memory`, which is a string. This struct will hold the memories users want to store.

### 4. **Type Alias for Storage**

```rust
type MemoriesStorage = HashMap<ic_cdk::Principal, Memory>;
```

- **`type`**: This defines a **type alias**. Here, `MemoriesStorage` is just an alias for a `HashMap` that maps a `Principal` to a `Memory`.
- **`HashMap<ic_cdk::Principal, Memory>`**: This `HashMap` stores each user's memory, where:

  - **`ic_cdk::Principal`**: A **Principal** is a unique identifier for each user on the Internet Computer, similar to a user ID.
  - **`Memory`**: This is the struct we defined earlier. So, each principal will have a memory stored.

  Note: This line **only defines the alias**. The actual storage is handled later in the code using `storage::get_mut()`.

### 5. **Store Memory Function**

```rust
#[ic_cdk::update]
fn store_memory(memory: String) {
    let caller = ic_cdk::caller();  // Get the caller's Principal ID
    let memory = Memory { memory }; // Wrap the memory in a Memory struct

    let mut storage = storage::get_mut::<MemoriesStorage>(); // Get mutable access to storage
    storage.insert(caller, memory); // Insert the memory into storage
}
```

- **`#[ic_cdk::update]`**: This macro tells the Internet Computer that `store_memory` is an **update function**. Update functions **modify the state** of the canister. Since this function stores data, it needs to be an update function. Update functions are slower than query functions and require network consensus, which means they incur cycle costs.
- **`let caller = ic_cdk::caller();`**: This line retrieves the **Principal ID** of the user making the request. Think of this as getting the "current user" or "user ID". It identifies who is storing the memory.
- **`let memory = Memory { memory };`**: This line creates a new `Memory` struct from the input string.

- **`let mut storage = storage::get_mut::<MemoriesStorage>();`**: Here, we get **mutable access** to the canister’s storage. `get_mut()` retrieves the data storage from the canister so that we can modify it.
- **`storage.insert(caller, memory);`**: This inserts the memory into the storage. The `caller` (Principal ID) is used as the key, and the `memory` (wrapped in the `Memory` struct) is the value.

### 6. **Retrieve Memory Function**

```rust
#[ic_cdk::query]
fn retrieve_memory() -> Option<String> {
    let caller = ic_cdk::caller();  // Get the caller's Principal ID
    let storage = storage::get::<MemoriesStorage>();  // Get access to storage
    storage.get(&caller).map(|memory| memory.memory.clone())  // Retrieve and return the memory
}
```

- **`#[ic_cdk::query]`**: Since this function only **retrieves** data, it is a query function. It does not modify the state of the canister, which is why it’s faster and cheaper than an update function.

- **`let caller = ic_cdk::caller();`**: Again, we retrieve the **Principal ID** of the user making the request, to identify who is trying to retrieve their memory.

- **`let storage = storage::get::<MemoriesStorage>();`**: This gets **read-only access** to the canister’s storage, using `get()` instead of `get_mut()` since we aren’t modifying the data.

- **`storage.get(&caller).map(|memory| memory.memory.clone())`**: This line retrieves the memory associated with the `caller`'s **Principal ID** from the `HashMap`. It uses `.map()` to handle the case where no memory exists for the caller:
  - If the memory exists, it is returned.
  - If it doesn't exist, `None` is returned (hence the return type `Option<String>`).

### Summary:

- **Query Functions** (`#[ic_cdk::query]`): These read data and are fast, but they cannot modify state.
- **Update Functions** (`#[ic_cdk::update]`): These modify state but are slower and cost cycles.
- **Principal IDs**: Each user is identified by a **Principal**, which is like a unique user ID in ICP.
- **Storage**: The data (memories) are stored in a `HashMap`, where each user's memory is mapped to their Principal ID.

### Futura_backend.did

The `Futura_backend.did` file defines the Candid interface for the `futura_backend` canister. Candid is a serialization format developed for the Internet Computer that allows different programs, potentially written in different languages, to interact with canisters in a standardized manner. This interface is crucial because it specifies the types and methods available in the `futura_backend` canister, enabling clients to send correctly formatted requests and interpret responses.

In our project, the `.did` file exposes the methods such as `store_memory` and `retrieve_memory`, defining their input and output types. This ensures that external services or command-line tools (like `dfx canister call`) can properly interact with the canister's functionality. The absence of this file earlier caused issues when trying to call the canister functions, as the system could not infer the types of the inputs without a defined interface. Once the `Futura_backend.did` file was created, it provided the necessary service description to make calls to the canister correctly, facilitating operations like memory storage and retrieval.

The `.did` file acts as a formal contract between the canister and its clients, ensuring compatibility and smooth interaction.

### Q&A about adding images

### 1. Why use both `candid::Deserialize` and `serde::Deserialize`?

Background: In our codebase we had already the serde Deserialize method for the upgrades hook.

You can use **either** `serde::Deserialize` or `candid::Deserialize`, but they serve slightly different purposes:

- **`serde::Deserialize`** is used for serializing and deserializing Rust data types into formats like JSON, which is useful when you're working with storage mechanisms that need data persistence.
- **`candid::Deserialize`** (from the `Candid` library) is used for serializing/deserializing data in the **Candid** format. This is critical when communicating with the **Internet Computer** (IC), where Candid is used as the interface description language between canisters and frontends.

If you only need to serialize for storage and not use the Candid interface, you can stick to `serde::Deserialize`. However, since you’re working with the IC and using Candid to expose your service, you should ensure your structs are compatible with Candid. You can likely use both `Serialize` and `Deserialize` from Serde for stable memory and Candid for inter-canister or frontend communication.

### 2. Why use `ic_cdk::Principal`?

`Principal` represents an identity on the IC, meaning **every user or canister** has a unique Principal. This is how you identify which user is interacting with your canister and store data specific to that user. When storing or retrieving memories (or any personalized data), you can use the `Principal` to know **which user owns** which piece of data.

In your case:

- When a user stores a memory, it is tied to their `Principal`.
- When they retrieve a memory, you use their `Principal` to fetch their specific data.

### 3. Should memory hold an array of images or just one image?

It depends on the use case:

- **Array of images**: If you expect a memory to potentially have multiple images (like a photo album or collection), then it makes sense to store an array of `Image` structs inside each `Memory`. This gives flexibility and scalability.

  For example:

  ```rust
  struct Memory {
      memory: Option<String>,
      images: Vec<Image>, // Holds multiple images
  }
  ```

- **Single image**: If a memory is generally expected to hold just one image, then you can start with a single image field. You can always change this later if needed, but starting simple is often best.

### 4. Metadata: What other fields could be useful?

For **metadata**, you can add fields that describe the context around the image and enrich the memory. Some potential fields are:

- **Description**: A text field that gives details about the image.
- **Date/Time**: When the image was taken or uploaded.
- **Location**: Where the image was taken (either as a string or coordinates).
- **Tags**: Custom tags that users might want to add for categorization or easy retrieval later.
- **Device Info**: Information about the camera or device that captured the image (optional).

For example:

```rust
struct Metadata {
    description: Option<String>, // Optional description for the image
    date: Option<String>,        // When the image was captured
    place: Option<String>,       // Location data, either as a string or coordinates
    tags: Option<Vec<String>>,   // Tags for easy search or filtering
}
```

You can start with simple fields like `description`, `date`, and `place` and then expand later as your service grows.

### Updated Code Example:

Here’s an updated structure reflecting the idea of holding multiple images with metadata:

```rust
use std::collections::HashMap;
use candid::Principal;
use lazy_static::lazy_static;
use std::sync::Mutex;
use serde::{Deserialize, Serialize};

lazy_static! {
    static ref MEMORY_STORAGE: Mutex<HashMap<Principal, Vec<Memory>>> = Mutex::new(HashMap::new());
}

#[derive(Clone, Serialize, Deserialize)]
struct Memory {
    memory: Option<String>,
    images: Vec<Image>, // Store multiple images
}

#[derive(Clone, Serialize, Deserialize)]
struct Image {
    data: Vec<u8>,         // Binary data for the image
    metadata: Metadata,    // Associated metadata
}

#[derive(Clone, Serialize, Deserialize)]
struct Metadata {
    description: Option<String>, // Image description
    date: Option<String>,        // Date when the image was captured
    place: Option<String>,       // Location information
    tags: Option<Vec<String>>,   // Tags for categorization
}

// Serialize and store the state before upgrading
#[pre_upgrade]
fn pre_upgrade() {
    let storage = MEMORY_STORAGE.lock().unwrap();
    let serialized_data = serde_json::to_vec(&*storage).expect("Failed to serialize memory storage");
    ic_cdk::storage::stable_save((serialized_data,)).expect("Failed to save to stable memory");
}

// Deserialize and restore the state after upgrading
#[post_upgrade]
fn post_upgrade() {
    let (serialized_data,): (Vec<u8>,) = ic_cdk::storage::stable_restore().expect("Failed to restore from stable memory");
    let deserialized_storage: HashMap<Principal, Vec<Memory>> = serde_json::from_slice(&serialized_data).expect("Failed to deserialize memory storage");
    let mut storage = MEMORY_STORAGE.lock().unwrap();
    *storage = deserialized_storage;
}

#[ic_cdk::update]
fn store_memory(text: Option<String>, image_data: Option<Vec<u8>>, metadata: Option<Metadata>) {
    let caller = ic_cdk::caller();

    let new_memory = Memory {
        memory: text,
        images: vec![Image {
            data: image_data.unwrap_or_default(),
            metadata: metadata.unwrap_or_default(),
        }],
    };

    let mut storage = MEMORY_STORAGE.lock().unwrap();
    storage.entry(caller).or_insert(Vec::new()).push(new_memory);
}

#[ic_cdk::query]
fn retrieve_memory() -> Option<Vec<Memory>> {
    let caller = ic_cdk::caller();
    let storage = MEMORY_STORAGE.lock().unwrap();
    storage.get(&caller).cloned()
}
```

This updated code allows you to store multiple images in a memory, each with associated metadata.

### Next Steps:

1. **Implement Frontend**: You will need to adjust the frontend to upload images and send them in the appropriate format to the backend.
2. **Testing**: Run tests on the backend to ensure the memory storage and retrieval are working, especially with images.
3. **Future Considerations**: Depending on feedback and usage, you can further extend the metadata fields or the image storage mechanism.

Let me know if you want to dive into specific details, such as file uploads or storage mechanisms!
