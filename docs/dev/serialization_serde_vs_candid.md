# Serialization (and Deserialization) with Serde and Candid

## TL;DR - Background on Serialization with Serde and Candid

In our initial implementation, we used **Serde** for internal data serialization, primarily to save the state before and after canister upgrades, ensuring that in-memory data (like memories) persists. On the other hand, **Candid** was responsible for handling the communication between the frontend and the backend canister, translating inputs/outputs between the two.

Now, as we transition to implementing image uploads, understanding **Serde** and **Candid** is crucial because Serde helps with internal data management (like storing complex structures such as images), while Candid ensures data is correctly transferred across the frontend-backend boundary.

This document expands on their use, focusing on how these tools facilitate handling different types of data (like strings and images) in a decentralized environment.

**Serde** (short for **Serializing and Deserializing**) is a powerful Rust library that facilitates converting Rust data structures into and from various data formats, such as JSON, MessagePack, or binary. It's the core serialization/deserialization framework in Rust, commonly used to make Rust types compatible with formats that can be transmitted or stored.

### Why Use Serde?

- **Serialization**: The process of converting a Rust struct or enum into a format that can be stored or transmitted (e.g., JSON, or binary data).
- **Deserialization**: The opposite—converting that format back into Rust structs or enums.

#### Example:

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct MyStruct {
    name: String,
    value: i32,
}

fn main() {
    let my_data = MyStruct { name: "example".into(), value: 10 };

    // Serialize the data to JSON
    let serialized = serde_json::to_string(&my_data).unwrap();

    // Deserialize back to the original structure
    let deserialized: MyStruct = serde_json::from_str(&serialized).unwrap();
}
```

### Why Serde and Candid?

You are correct in saying that before we were using **Candid** for sending and receiving data between the frontend and the backend canister. The reason for using **Serde** alongside Candid is because **Candid is used for inter-canister communication and frontend-backend communication**, while **Serde is generally used for internal persistence, serialization to/from stable storage, or when you want to use formats like JSON**.

### Difference Between Serde and Candid

1. **Candid**:

   - Designed specifically for **Internet Computer** (IC) communication.
   - Provides an interface description language (IDL) that helps in exchanging data between canisters and frontends.
   - Used for defining services and data types in a cross-language format that allows interoperability between different languages on the IC.

2. **Serde**:
   - Used for **serialization and deserialization** between Rust data types and formats like JSON, YAML, and binary.
   - Ideal for **stable memory** management, saving data between canister upgrades, or sending data to external services that don’t use Candid.

### Why Didn't We Use Serde Before?

We didn't use **Serde** before because:

- **Candid** was handling all the frontend-backend communication.
- The need for **Serde** arises mainly when you need **persistent storage** (like serializing data into a stable memory for upgrade compatibility). It's used here for storing and retrieving data in a stable way between canister upgrades.
- **Candid** is automatically used for inter-canister and frontend-backend communication, so we didn't need Serde there.

### Where is Serde Used in Your Code?

In your current code, **Serde** is being used for:

- **Pre-upgrade and post-upgrade hooks**: We serialize the in-memory data (`HashMap<Principal, Memory>`) using Serde to save it in stable storage before an upgrade (`pre_upgrade`) and deserialize it after the upgrade (`post_upgrade`) to restore the state.

Without Serde, if you upgrade your canister, all in-memory data would be lost, but Serde ensures that you can store and retrieve that data in a stable way.

### Candid in Your Code

In your `Futura_backend.did` file, **Candid** is defining the interface (the service) and the types that the frontend and the backend canister use to communicate:

```did
service : {
    "greet": (text) -> (text) query;
    "store_memory": (text) -> ();
    "retrieve_memory": () -> (opt text) query;
}
```

- This defines three methods (`greet`, `store_memory`, and `retrieve_memory`) and the types of inputs/outputs each method accepts and returns.
- **Candid** is responsible for making sure that when the frontend sends data like text to your canister, it is properly serialized in a way that the IC understands, and the same goes for returning data from the backend.

### Conclusion:

- **Serde** is used primarily for **internal data persistence**, particularly during canister upgrades and when saving data locally within a canister.
- **Candid** is the primary interface between the **frontend** and the **backend**, managing communication and data transfer between them.
- You can think of Candid as managing the external API, while Serde manages internal data storage and retrieval.
