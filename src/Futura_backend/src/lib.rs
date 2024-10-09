use std::collections::HashMap;
use ic_cdk::storage;
use ic_cdk_macros::*;

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

// Define a struct for memory
#[derive(Clone)]
struct Memory {
	memory: String, 
}

// Storage for memories (map Principal -> Memory)
type MemoriesStorage = HashMap<ic_cdk::Principal, Memory>;

// Function to store a memory
#[ic_cdk::update]
fn store_memory(memory: String) {
	let caller = ic_cdk::caller();
	let memory = Memory { memory };

	let mut storage = storage::get_mut::<MemoriesStorage>();
	storage.insert(caller, memory);
}

// Function to retrieve a memory for the caller
#[ic_cdk::query]
fn retrieve_memory() -> Option<String> {
	let caller = ic_cdk::caller();
	let storage = storage::get::<MemoriesStorage>();
	storage.get(&caller).map(|memory| memory.memory.clone())
}
