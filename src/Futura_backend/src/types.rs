use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use serde::{Serialize, Deserialize as SerdeDeserialize};
use ic_stable_structures::{storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::{borrow::Cow, cell::RefCell};

// Define a struct for memory
#[derive(Clone, Serialize, SerdeDeserialize, CandidType, Debug)]
pub struct UserData {
    pub texts: Vec<Text>,  
    pub images: Vec<Image>,
}

// Define a struct for memory
#[derive(Clone, Serialize, SerdeDeserialize, CandidType, Debug)]
pub struct AddImages {
    pub images: Vec<Image>,
}

#[derive(Clone, Serialize, SerdeDeserialize, CandidType, Debug)]
pub struct Text {
    pub content: String,
    pub metadata: Option<Metadata>,
}

#[derive(Clone, Serialize, SerdeDeserialize, CandidType, Debug)]
pub struct Image {
    pub content: Vec<u8>,
    pub metadata: Option<Metadata>,
}

#[derive(Clone, Serialize, SerdeDeserialize, CandidType, Debug)]
pub struct Metadata {
    pub description: Option<String>, // Updated to Option
    pub date: Option<String>,        // Added date field
    pub place: Option<String>,
    pub tags: Option<Vec<String>>,
    pub people: Option<Vec<String>>,
    pub visibility: Option<Vec<Principal>>,
}

#[derive(CandidType)]
pub struct Statistics {
    pub total_users: u64,
    pub total_memory: u64,
}

const MAX_VALUE_SIZE: u32 = 1000000000;
impl Storable for UserData {
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
