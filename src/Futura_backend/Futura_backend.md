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
