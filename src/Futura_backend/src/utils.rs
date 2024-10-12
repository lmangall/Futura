use candid::Principal;

pub fn validate_caller_not_anonymous() -> Result<Principal, String> {
    let principal = ic_cdk::caller();
    if principal == Principal::anonymous() {
        return Err::<Principal, String>("anonymous principal is not allowed".to_string());
    }
    Ok(principal)
}
