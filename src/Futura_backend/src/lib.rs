mod types;
mod utils;

use candid::Principal;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;
// full:
// use crate::types::{Statistics, Capsule, Image, CapsuleStats, Text};
//partial:
use crate::types::{Capsule, Image, CapsuleStats, Text};

use crate::utils::validate_caller_not_anonymous;
type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    // The memory manager is used for simulating multiple memories. Given a `MemoryId` it can
    // return a memory that can be used by stable structures.
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
    
    static CAPSULES: RefCell<StableBTreeMap<Principal, Capsule, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::query]
fn retrieve_images(ids: Option<Vec<u64>>) -> Result<Vec<Image>, String> {
    let key = validate_caller_not_anonymous()
        .map_err(|e| format!("Error: {}", e)).unwrap();

    CAPSULES.with(|capsules| {
        if let Some(capsule) = capsules.borrow().get(&key) {
            if capsule.images.is_empty() {
                return Err("No images found".to_string());
            }
            
            // if id is provided, return only the images with the specified ids
            if let Some(unwrapped_ids) = ids {
                let mut images = vec![];
                for image in capsule.images.iter() {
                    if unwrapped_ids.contains(&image.id) {
                        images.push(image.clone());
                    }
                }
                return Ok(images);
            }

            // return all images if id is not provided
            return Ok(capsule.images.clone());
        } else {
            return Err("No data found".to_string());
        }
    })
}

#[ic_cdk::query]
fn retrieve_texts(ids: Option<Vec<u64>>) -> Result<Vec<Text>, String> {
    let key = validate_caller_not_anonymous()
        .map_err(|e| format!("Error: {}", e)).unwrap();

    CAPSULES.with(|capsules| {
        if let Some(capsule) = capsules.borrow().get(&key) {
            if capsule.texts.is_empty() {
                return Err("No texts found".to_string());
            }
            
            // if id is provided, return only the texts with the specified ids
            if let Some(unwrapped_ids) = ids {
                let mut texts = vec![];
                for text in capsule.texts.iter() {
                    if unwrapped_ids.contains(&text.id) {
                        texts.push(text.clone());
                    }
                }
                return Ok(texts);
            }

            // return all texts if id is not provided
            return Ok(capsule.texts.clone());
        } else {
            return Err("No data found".to_string());
        }
    })
}

#[ic_cdk::update]
fn store_images(images: Vec<Image>) -> Result<String, String> {
    let user_principal = validate_caller_not_anonymous()
        .map_err(|e| format!("Error: {}", e)).unwrap();
    
    CAPSULES.with(|capsules| {
        let mut borrowed_capsules = capsules.borrow_mut();

        // check if the user already has memory
        if let Some(mut capsule) = borrowed_capsules.get(&user_principal) {
            capsule.images.extend(images);
            // TODO: is it efficient?
            borrowed_capsules.insert(user_principal, Capsule {
                texts: capsule.texts,
                images: capsule.images,
                metadata: capsule.metadata,
                settings: capsule.settings,
            });
        } else {
            borrowed_capsules.insert(user_principal, Capsule {
                texts: vec![],
                images: images,
                metadata: Default::default(),
                settings: Default::default(),
            });
        }
    });
    Ok("Images stored successfully".to_string())
}

#[ic_cdk::update]
fn store_texts(texts: Vec<Text>) -> Result<String, String> {
    let user_principal = validate_caller_not_anonymous()
        .map_err(|e| format!("Error: {}", e)).unwrap();
    
    CAPSULES.with(|capsules| {
        let mut borrowed_capsules = capsules.borrow_mut();

        // check if the user already has memory
        if let Some(mut capsule) = borrowed_capsules.get(&user_principal) {
            capsule.texts.extend(texts);
            borrowed_capsules.insert(user_principal, Capsule {
                texts: capsule.texts,
                images: capsule.images,
                metadata: capsule.metadata,
                settings: capsule.settings,
            });
        } else {
            borrowed_capsules.insert(user_principal, Capsule {
                texts,
                images: vec![],
                metadata: Default::default(),
                settings: Default::default(),
            });
        }
    });
    Ok("Texts stored successfully".to_string())
}

#[ic_cdk::query]
fn retrieve_capsule_stats() -> CapsuleStats {
    let key = ic_cdk::caller();
    let (total_images, total_texts) = CAPSULES.with(|p| {
        if let Some(data) = p.borrow().get(&key) {
            (data.images.len() as u64, data.texts.len() as u64)
        } else {
            (0, 0)
        }
    });
    
    CapsuleStats {
        total_images,
        total_texts,
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
