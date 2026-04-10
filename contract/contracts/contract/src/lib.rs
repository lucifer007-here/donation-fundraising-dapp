#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Env, Address, Map
};

#[contract]
pub struct FundraisingContract;

#[contracttype]
#[derive(Clone)]
pub struct Campaign {
    pub id: u32,
    pub owner: Address,
    pub goal: i128,
    pub raised: i128,
    pub active: bool,
}

fn get_campaigns(env: &Env) -> Map<u32, Campaign> {
    env.storage()
        .instance()
        .get(&symbol_short!("CAMP"))
        .unwrap_or(Map::new(env))
}

fn save_campaigns(env: &Env, campaigns: &Map<u32, Campaign>) {
    env.storage().instance().set(&symbol_short!("CAMP"), campaigns);
}

#[contractimpl]
impl FundraisingContract {

    // 🏁 Create campaign
    pub fn create_campaign(env: Env, id: u32, owner: Address, goal: i128) {
        owner.require_auth();

        if goal <= 0 {
            panic!("Invalid goal");
        }

        let mut campaigns = get_campaigns(&env);

        if campaigns.contains_key(id) {
            panic!("Campaign already exists");
        }

        let campaign = Campaign {
            id,
            owner: owner.clone(),
            goal,
            raised: 0,
            active: true,
        };

        campaigns.set(id, campaign);
        save_campaigns(&env, &campaigns);
    }

    // 💸 Donate
    pub fn donate(env: Env, id: u32, donor: Address, amount: i128) {
        donor.require_auth();

        if amount <= 0 {
            panic!("Invalid donation");
        }

        let mut campaigns = get_campaigns(&env);

        if !campaigns.contains_key(id) {
            panic!("Campaign not found");
        }

        let mut campaign = campaigns.get(id).unwrap();

        if !campaign.active {
            panic!("Campaign inactive");
        }

        campaign.raised += amount;

        campaigns.set(id, campaign);
        save_campaigns(&env, &campaigns);
    }

    // 🏦 Withdraw
    pub fn withdraw(env: Env, id: u32, owner: Address) {
        owner.require_auth();

        let mut campaigns = get_campaigns(&env);

        if !campaigns.contains_key(id) {
            panic!("Campaign not found");
        }

        let mut campaign = campaigns.get(id).unwrap();

        if campaign.owner != owner {
            panic!("Unauthorized");
        }

        if !campaign.active {
            panic!("Already withdrawn");
        }

        if campaign.raised < campaign.goal {
            panic!("Goal not reached");
        }

        campaign.active = false;

        campaigns.set(id, campaign);
        save_campaigns(&env, &campaigns);
    }

    // 🔍 Get campaign
    pub fn get_campaign(env: Env, id: u32) -> Campaign {
        let campaigns = get_campaigns(&env);

        if !campaigns.contains_key(id) {
            panic!("Campaign not found");
        }

        campaigns.get(id).unwrap()
    }
}