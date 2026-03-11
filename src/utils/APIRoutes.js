// export const localdomain = "http://192.168.18.101:9010";
// export const domain = "http://192.168.18.214:9010";
export const domain = "https://dexon.global";
export const frontend = "https://dexon.global";

// const isProduction = process.env.NODE_ENV === "production";
// export const domain = isProduction ? livedomain : livedomain;
// export const frontend = isProduction ? livedomain : livedomain;

// console.log("NODE_ENV:", process.env.NODE_ENV);
// console.log("isProduction:", isProduction);
// console.log("domain:", domain);
// console.log("frontend:", frontend);

export const dollar = "$";
export const support_mail = "support@dexon.global";
// export const withdrawalAddress = "0xc50222c8aC657ff4203C306dD01ca3e3B90A451f"
export const withdrawalAddress = "0xa8656e6ae3b543129b614287cd2ebb687c28d8b6";
export const depositAddress = "0xE7eE24e4e544686b7474E50993447515bBE14004";

export const endpoint = {

  login_api: `${domain}/api/v9/member-login`,
  member_dapp_log_reg: `${domain}/api/v9/member-dapp-log-reg`,
  registration_api: `${domain}/api/v9/member-registration`,
  get_spon_name: `${domain}/api/v9/member-name-by-cust-id`,
  profile_api: `${domain}/api/v9/member-profile-details`,
  user_dashboard_api: `${domain}/api/v9/member-dashboard-details`,
  user_dashboard_business_api: `${domain}/api/v9/member-dashboard-business`,
  get_topup_qr: `${domain}/api/v9/get-topup-qr`,
  member_self_topup: `${domain}/api/v9/member-self-topup`,
  get_report_details: `${domain}/api/v9/get-report-details`,
  get_global_payout_history: `${domain}/api/v9/get-global-payout-history`,
  team_data_api: `${domain}/api/v9/get-member-downline`,
  member_fund_transfer: `${domain}/api/v9/member-fund-transfer-p2p`,
  get_wallet_transactions: `${domain}/api/v9/member-wallet-transactions`,
  member_claimed_pending_transaction: `${domain}/api/v9/member-claim-pending-transaction`,
  get_member_downline_tree: `${domain}/api/v9/get-member-downline-tree`,
  admin_login: `${domain}/api/v9/admin-login`,
  member_list: `${domain}/api/v9/member-details`,
  admin_dashboard: `${domain}/api/v9/get-admin-dashboard`,
  member_payout: `${domain}/api/v9/member-payout`,
  member_payout_report: `${domain}/api/v9/member-payout-report`,
  withdrawal_approval_from_admin: `${domain}/api/v9/withdrawal-approval-from-admin`,
  update_profile: `${domain}/api/v9/change-member-profile-by-user`,
  get_news_and_updates: `${domain}/api/v9/get-news-and-updates`,
  update_news_and_updates: `${domain}/api/v9/update-news-and-updates`,
  update_news_and_updates_status: `${domain}/api/v9/update-news-and-updates-status`,
  get_admin_dashboard: `${domain}/api/v9/get-admin-dashboard`,
  get_member_global_live_transaction_activity: `${domain}/api/v9/get-member-global-live-transaction-activity`,
  get_package_details: `${domain}/api/v9/get-package-details`,
  paying_dummy_api: `${domain}/api/v9/user-payin-dummy`,
  paying_api: `${domain}/api/v9/user-payin-req`,

  //////////////////////////////////////////////////

  update_popup_status: `${domain}/api/v9/udpate-popup-status`,

  general_contact_address_api: `${domain}/api/v9/get-api-general-data`,
  team_topup_data: `${domain}/api/v9/get-team-topup-details`,
  roi_income_api: `${domain}/api/v9/get-roi-income-details`,
  admin_roi_income_api: `${domain}/api/v9/admin-income-report`,
  admin_fund_memeber: `${domain}/api/v9/admin-fund-member-topup`,
  topup_report: `${domain}/api/v9/topup-report`,
  admin_topup_report: `${domain}/api/v9/admin-topup-report`,
  user_details: `${domain}/api/v9/user-invester-details`,
  admin_user_details: `${domain}/api/v9/admin-invester-details`,
  customer_api: `${domain}/api/v9/get-user-name-by-customer-id`,
  add_wallet_address: `${domain}/api/v9/add-user-wallet-address`,
  update_user_password: `${domain}/api/v9/update-user-password`,
  add_user_withdrawal: `${domain}/api/v9/user-withdrawal-request`,
  withdrawal_list: `${domain}/api/v9/get-withdrawal-details`,
  admin_withdrawal_list: `${domain}/api/v9/admin-withdrawal-report`,
  withdrawal_request: `${domain}/api/v9/withdrawal-request-approval`,
  admin_upload_qr: `${domain}/api/v9/admin-upload-qr`,
  get_admin_upload_qr: `${domain}/api/v9/get-admin-upload-qr`,
  get_user_upload_qr: `${domain}/api/v9/get-user-upload-qr`,
  add_user_fund_request: `${domain}/api/v9/add-user-fund-request`,
  get_user_fund_request: `${domain}/api/v9/get-user-fund-request`,
  admin_paying_report: `${domain}/api/v9/get-admin-fund-request`,
  withdrawal_api: `${domain}/api/v9/withdrawal-req`,
  wallet_user_data: `${domain}/api/v9/get-wallet-data-user`,

  change_status_fund: `${domain}/api/v9/change-fund-request_admin`,
  direct_referral_user: `${domain}/api/v9/user-direct-referral-details`,
  team_downline_user_filterwise: `${domain}/api/v9/user-team-downline-details-filterwise`,
  update_user_profile: `${domain}/api/v9/update-profile`,
  topup_team_id_by_leader: `${domain}/api/v9/topup-team-id-by-leader`,
  forgot_email: `${domain}/api/v9/password-on-mail`,
  check_real_transaction: `${domain}/api/v9/check-real-transactoin`,
  set_withdrawal_limit: `${domain}/api/v9/update-withdrawal-limit`,
  handle_cp_fun: `${domain}/api/v9/handle-cp-status`,
  compounding: `${domain}/api/v9/compound-wallet`,

  //admin
  create_trade_pair_api: `${domain}/api/v9/create-trade-pair`,
  get_trade_api: `${domain}/api/v9/get-trade-pair`,
  update_trade_pair_api: `${domain}/api/v9/update-trade-pair-status`,
  delete_trade_pair_api: `${domain}/api/v9//delete-trade-pair`,
  topup_api: `${domain}/api/v9/admin-topup-id`,
  cp_topup_api: `${domain}/api/v9/team-topup-fund-added-by-admin`,
  get_topup_api: `${domain}/api/v9/get-topup-details-admin`,
  change_topup_status: `${domain}/api/v9/change-topup-status`,
  user_data: `${domain}/api/v9/get-user-details-admin`,
  level_bonus_data: `${domain}/api/v9/get-roi-income-details-admin`,
  get_downline_team: `${domain}/api/v9/get-downline-team`,
  get_upline_team: `${domain}/api/v9/get-upline-team`,
  inr_payout_data: `${domain}/api/v9/get-withdrawal-details-admin`,
  update_trade_profit: `${domain}/api/v9/update-trade-profit`,
};
