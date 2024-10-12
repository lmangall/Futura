```rust
// BAD: stable structures do not support nesting.
type BalanceMap = StableBTreeMap<Principal, StableBTreeMap<Subaccount, Tokens>>;

// GOOD: use a composite key (a tuple) to avoid nesting.
// Use a range scan to find all subaccounts of a principal.
type BalanceMap = StableBTreeMap<(Principal, Subaccount), Tokens>;

// BAD: stable structures do not support nesting.
type TxIndex = StableBTreeMap<Principal, StableVector<Transaction>>;

// GOOD: use a composite key to avoid nesting.
// Use a range scan to find all transactions of a principal.
type TxIndex = StableBTreeMap<(Principal, TxId), Transaction>;
```

The standard IC canister organization forces developers to use a mutable global state. Rust intentionally makes using global mutable variables hard, giving you a few options for organizing your code. Which option is the best?

Use thread_local! with Cell/RefCell for state variables.

This option is the safest. It will help you avoid memory corruption and issues with asynchrony.

```rust
thread_local! {
    static NEXT_USER_ID: Cell<u64> = Cell::new(0);
    static ACTIVE_USERS: RefCell<UserMap> = RefCell::new(UserMap::new());
}
```

For a type to be used in a `StableBTreeMap`, it needs to implement the `Storable` trait, which specifies how the type can be serialized/deserialized. In this example, we're using candid to serialize/deserialize the struct, but you can use anything as long as you're maintaining backward-compatibility. The backward-compatibility allows you to change your struct over time (e.g. adding new fields). The `Storable` trait is already implemented for several common types (e.g. u64),
so you can use those directly without implementing the `Storable` trait for them struct MyString(String);