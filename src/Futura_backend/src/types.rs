use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use serde::{Serialize, Deserialize as SerdeDeserialize};
use ic_stable_structures::{storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::{borrow::Cow, cell::RefCell};

// Define a struct for memory
#[derive(Clone, Serialize, SerdeDeserialize, CandidType, Debug)]
pub struct Capsule{
    pub texts: Vec<Text>,  
    pub images: Vec<Image>,
    pub settings: Settings,
    pub metadata: CapsuleMetadata,
}

#[derive(Clone, Serialize, SerdeDeserialize, CandidType, Debug)]
pub struct Text {
    pub id: u64,
    pub content: String,
    pub metadata: Metadata,
}

#[derive(Clone, Serialize, SerdeDeserialize, CandidType, Debug, Default)]
pub struct Settings {
    pub language:  Option<String>, // TODO: enum
    pub visibility: Vec<Principal>
    // TODO: add more
}

#[derive(Clone, Serialize, SerdeDeserialize, CandidType, Debug, Default)]
pub struct CapsuleMetadata {
    pub description: Option<String> ,
    pub creation_date: Option<String>,
    pub name: String,
    pub id_generator: u64,
    // TODO: add more
}

#[derive(Clone, Serialize, SerdeDeserialize, CandidType, Debug)]
pub struct Image {
    pub id: u64,
    pub content: Vec<u8>,
    pub metadata: Metadata,
}

#[derive(Clone, Serialize, SerdeDeserialize, CandidType, Debug)]
pub struct Metadata {
    pub file_name: String,
    pub file_type: String,
    pub file_size: u64,
    pub description: Option<String>, // Updated to Option
    pub date: Option<String>,        // Added date field
    pub place: Option<String>,
    pub tags: Option<Vec<String>>,
    pub people: Option<Vec<String>>,
    pub visibility: Option<Vec<Principal>>,
    pub preview: Option<Vec<u8>>, // compressed image
}

#[derive(CandidType)]
pub struct Statistics {
    pub total_users: u64,
    pub total_memory: u64,
}

#[derive(CandidType)]
pub struct CapsuleStats {
    pub total_images: u64,
    pub total_texts: u64,
}

const MAX_VALUE_SIZE: u32 = 1000000000;
impl Storable for Capsule {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_VALUE_SIZE,
        is_fixed_size: false,
    };
}
