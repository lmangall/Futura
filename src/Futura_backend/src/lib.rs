mod types;
mod utils;

use candid::Principal;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;
use crate::types::{Statistics, UserData, Image};
// use crate::utils::validate_caller_not_anonymous;
type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    // The memory manager is used for simulating multiple memories. Given a `MemoryId` it can
    // return a memory that can be used by stable structures.
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
    
    static ASSETS: RefCell<StableBTreeMap<Principal, UserData, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );
}

// TODO: #[ic_cdk_macros::query] vs #[ic_cdk::query] - the same?

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk_macros::query]
fn retrieve_memory() -> Option<UserData> {
    // let key = validate_caller_not_anonymous(); TODO: Result instead of Option
    let key = ic_cdk::caller();
    ASSETS.with(|p| p.borrow().get(&key))
}

#[ic_cdk_macros::update]
fn store_image(images: Vec<Image>) -> Option<String> {
    // let key = validate_caller_not_anonymous(); TODO: Result instead of Option
    let key = ic_cdk::caller();
    ASSETS.with(|assets| {
        let mut map = assets.borrow_mut();

        // check if the user already has memory
        if let Some(mut data) = map.get(&key) {
            data.images.extend(images);
        } else {
            map.insert(key, UserData {
                texts: vec![],
                images: images,
            });
        }
    });
    Some("Inserted".to_string())
}

#[ic_cdk_macros::query]
fn get_statistics() -> Statistics {
    let total_users = ASSETS.with(|p| p.borrow().len() as u64);
    let total_memory = ASSETS.with(|p| p.borrow().iter().map(|(_, m)| m).count() as u64);
    Statistics {
        total_users,
        total_memory,
    }
}

/* TODO: Consider size limitations for large image data. Since images can be large,
     we may need to implement chunking or compression to ensure the serialized data
     fits within the limits of stable memory.
*/

/*
TODO: Consider handling large images more efficiently.
For example, add image compression or splitting large images into chunks.
This will help prevent issues with memory usage or storage limitations, especially as images could be large.
*/
