use std::collections::HashMap;
use candid::Principal; // Use Principal from candid crate
use lazy_static::lazy_static; // For creating a static, global storage
use std::sync::Mutex; // Mutex for thread safety in global storage


lazy_static! {
    static ref MEMORY_STORAGE: Mutex<HashMap<Principal, Memory>> = Mutex::new(HashMap::new());
}


#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

// Define a struct for memory
#[derive(Clone)]
struct Memory {
	memory: String, 
}



// Function to store a memory
#[ic_cdk::update]
fn store_memory(memory: String) {
	let caller = ic_cdk::caller();
	let memory = Memory { memory };

	// let mut storage = storage::get_mut::<MemoriesStorage>();
	let mut storage = MEMORY_STORAGE.lock().unwrap();
	storage.insert(caller, memory);
}

// Function to retrieve a memory for the caller
#[ic_cdk::query]
fn retrieve_memory() -> Option<String> {
	let caller = ic_cdk::caller();
	// let storage = storage::get::<MemoriesStorage>();
	let storage = MEMORY_STORAGE.lock().unwrap();
	storage.get(&caller).map(|memory| memory.memory.clone())
}
