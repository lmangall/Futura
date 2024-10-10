use std::collections::HashMap;
use candid::Principal; // Use Principal from candid crate
use lazy_static::lazy_static; // For creating a static, global storage
use std::sync::Mutex; // Mutex for thread safety in global storage
use ic_cdk::storage; // Storage for the canister
use ic_cdk_macros::{pre_upgrade, post_upgrade}; // Macros for upgrade functions
use serde::{Deserialize, Serialize}; // For serializing and deserializing data


lazy_static! {
    static ref MEMORY_STORAGE: Mutex<HashMap<Principal, Memory>> = Mutex::new(HashMap::new());
}


#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

// Define a struct for memory
#[derive(Clone, Serialize, Deserialize)]
struct Memory {
    text: Vec<Text>,    
    images: Vec<Image>, 
}

#[derive(Clone, Serialize, Deserialize)]
struct Text {
	content: String,
	metadata: Option<Metadata>,
}

#[derive(Clone, Serialize, Deserialize)]
struct Image {
	content: Vec<u8>,
	metadata: Option<Metadata>,
}

#[derive(Clone, Serialize, Deserialize)]
struct Metadata {
	created_at: String,
	updated_at: String,
	description: String,
	place: Option<String>,
	tags: Option<Vec<String>>,
	people: Option<Vec<String>>,
	visibility: Option<Vec<Principal>>.
}

	  /* TODO: Consider size limitations for large image data. Since images can be large,
     we may need to implement chunking or compression to ensure the serialized data
     fits within the limits of stable memory.
*/

// Serialize and store the state before upgrading
#[pre_upgrade]
fn pre_upgrade() {
    let storage = MEMORY_STORAGE.lock().unwrap();
    let serialized_data = serde_json::to_vec(&*storage).expect("Failed to serialize memory storage");
    storage::stable_save((serialized_data,)).expect("Failed to save to stable memory");
}

// Deserialize and restore the state after upgrading
#[post_upgrade]
fn post_upgrade() {
    let (serialized_data,): (Vec<u8>,) = ic_cdk::storage::stable_restore().expect("Failed to restore from stable memory");
    let deserialized_storage: HashMap<Principal, Memory> = serde_json::from_slice(&serialized_data).expect("Failed to deserialize memory storage");
    let mut storage = MEMORY_STORAGE.lock().unwrap();
    *storage = deserialized_storage;
}

/*
TODO: Consider handling large images more efficiently.
For example, add image compression or splitting large images into chunks.
This will help prevent issues with memory usage or storage limitations, especially as images could be large.
*/

// Function to store a memory
#[ic_cdk::update]
fn store_memory(memory: String) {
	let caller = ic_cdk::caller();
	let memory = Memory { text, images };
	let mut storage = MEMORY_STORAGE.lock().unwrap();
	storage.insert(caller, memory);
}

// Function to retrieve a memory for the caller
#[ic_cdk::query]
fn retrieve_memory() -> Option<String> {
	let caller = ic_cdk::caller();
	let storage = MEMORY_STORAGE.lock().unwrap();
	storage.get(&caller).cloned()
}
