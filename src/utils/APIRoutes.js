// export const domain = "http://192.168.18.121:9036";
export const domain = "https://dexon.global";

export const frontend = "https://dexon.global";

export const dollar = "$";
export const support_mail = "support@dexon.global";
// export const withdrawalAddress = "0xc50222c8aC657ff4203C306dD01ca3e3B90A451f"
export const withdrawalAddress = "0xa8656e6ae3b543129b614287cd2ebb687c28d8b6";
export const depositAddress = "0xE7eE24e4e544686b7474E50993447515bBE14004";

const with_ver = domain + "/api/v9/sadjkbdsajfhlsjkdf";

export const endpoint = {
  login_api: `${with_ver}/member-login`,
  member_dapp_log_reg: `${with_ver}/member-dapp-log-reg-with-dapp`,
  registration_api: `${with_ver}/member-registration`,
  get_spon_name: `${with_ver}/member-name-by-cust-id`,
  profile_api: `${with_ver}/member-profile-details`,
  user_dashboard_api: `${with_ver}/member-dashboard-details`,
  user_dashboard_business_api: `${with_ver}/member-dashboard-business`,
  get_topup_qr: `${with_ver}/user-payin-crypto-fit`,
  member_self_topup: `${with_ver}/member-self-topup`,
  get_report_details: `${with_ver}/get-report-details`,
  get_global_payout_history: `${with_ver}/get-global-payout-history`,
  team_data_api: `${with_ver}/get-member-downline`,
  member_fund_transfer: `${with_ver}/member-fund-transfer-p2p`,
  member_fund_transfer_user: `${with_ver}/member-fund-transfer-p2p-access-to-user`,
  get_wallet_transactions: `${with_ver}/member-wallet-transactions`,
  member_claimed_pending_transaction: `${with_ver}/member-claim-pending-transaction`,
  get_member_downline_tree: `${with_ver}/get-member-downline-tree`,
  admin_login: `${with_ver}/admin-login`,
  member_list: `${with_ver}/member-details`,
  admin_dashboard: `${with_ver}/get-admin-dashboard`,
  member_payout: `${with_ver}/member-payout`,
  member_payout_report: `${with_ver}/member-payout-report`,
  withdrawal_approval_from_admin: `${with_ver}/withdrawal-approval-from-admin`,
  update_profile: `${with_ver}/change-member-profile-by-user`,
  update_member_max_payout: `${with_ver}/update-member-max-payout`,

  get_news_and_updates: `${with_ver}/get-news-and-updates`,
  update_news_and_updates: `${with_ver}/update-news-and-updates`,
  update_news_and_updates_status: `${with_ver}/update-news-and-updates-status`,
  get_admin_dashboard: `${with_ver}/get-admin-dashboard`,
  get_member_global_live_transaction_activity: `${with_ver}/get-member-global-live-transaction-activity`,
  get_package_details: `${with_ver}/get-package-details`,
  paying_dummy_api: `${with_ver}/user-payin-dummy`,
  paying_api: `${with_ver}/user-payin-req`,

  //////////////////////////////////////////////////

  update_popup_status: `${with_ver}/udpate-popup-status`,

  general_contact_address_api: `${with_ver}/get-api-general-data`,
  team_topup_data: `${with_ver}/get-team-topup-details`,
  roi_income_api: `${with_ver}/get-roi-income-details`,
  admin_roi_income_api: `${with_ver}/admin-income-report`,
  admin_fund_memeber: `${with_ver}/admin-fund-member-topup`,
  topup_report: `${with_ver}/topup-report`,
  admin_topup_report: `${with_ver}/admin-topup-report`,
  user_details: `${with_ver}/user-invester-details`,
  admin_user_details: `${with_ver}/admin-invester-details`,
  customer_api: `${with_ver}/get-user-name-by-customer-id`,
  add_wallet_address: `${with_ver}/add-user-wallet-address`,
  update_user_password: `${with_ver}/update-user-password`,
  add_user_withdrawal: `${with_ver}/user-withdrawal-request`,
  withdrawal_list: `${with_ver}/get-withdrawal-details`,
  admin_withdrawal_list: `${with_ver}/admin-withdrawal-report`,
  withdrawal_request: `${with_ver}/withdrawal-request-approval`,
  admin_upload_qr: `${with_ver}/admin-upload-qr`,
  get_admin_upload_qr: `${with_ver}/get-admin-upload-qr`,
  get_user_upload_qr: `${with_ver}/get-user-upload-qr`,
  add_user_fund_request: `${with_ver}/add-user-fund-request`,
  get_user_fund_request: `${with_ver}/get-user-fund-request`,
  admin_paying_report: `${with_ver}/get-admin-fund-request`,
  withdrawal_api: `${with_ver}/withdrawal-req`,
  wallet_user_data: `${with_ver}/get-wallet-data-user`,

  change_status_fund: `${with_ver}/change-fund-request_admin`,
  direct_referral_user: `${with_ver}/user-direct-referral-details`,
  team_downline_user_filterwise: `${with_ver}/user-team-downline-details-filterwise`,
  update_user_profile: `${with_ver}/update-profile`,
  topup_team_id_by_leader: `${with_ver}/topup-team-id-by-leader`,
  forgot_email: `${with_ver}/password-on-mail`,
  check_real_transaction: `${with_ver}/check-real-transactoin`,
  set_withdrawal_limit: `${with_ver}/update-withdrawal-limit`,
  handle_cp_fun: `${with_ver}/handle-cp-status`,
  compounding: `${with_ver}/compound-wallet`,

  //admin
  create_trade_pair_api: `${with_ver}/create-trade-pair`,
  get_trade_api: `${with_ver}/get-trade-pair`,
  update_trade_pair_api: `${with_ver}/update-trade-pair-status`,
  delete_trade_pair_api: `${with_ver}/delete-trade-pair`,
  topup_api: `${with_ver}/admin-topup-id`,
  cp_topup_api: `${with_ver}/team-topup-fund-added-by-admin`,
  get_topup_api: `${with_ver}/get-topup-details-admin`,
  change_topup_status: `${with_ver}/change-topup-status`,
  user_data: `${with_ver}/get-user-details-admin`,
  level_bonus_data: `${with_ver}/get-roi-income-details-admin`,
  get_downline_team: `${with_ver}/get-downline-team`,
  get_upline_team: `${with_ver}/get-upline-team`,
  inr_payout_data: `${with_ver}/get-withdrawal-details-admin`,
  update_trade_profit: `${with_ver}/update-trade-profit`,
  verify_totp: `${with_ver}/verify_totp`,
  send_otp_topup: `${with_ver}/send-otp-topup`,
  verify_otp_topup: `${with_ver}/verify-otp-topup`,
  send_otp: `${with_ver}/send-otp`,
  verify_otp: `${with_ver}/verify-otp`,
  get_master_data: `${with_ver}/get-master-data`,
  get_master_config: `${with_ver}/get-master-config`,
  update_master_config: `${with_ver}/update-master-config`,
  verify_admin_totp: `${with_ver}/verify-admin-totp`,

  user_message: `${with_ver}/user-message`,
  admin_reply: `${with_ver}/admin-reply`,
  get_user_message: `${with_ver}/get-user-messages`,

  member_withdrawal_permission: `${with_ver}/member-withd-perm`,
  member_trade_permission: `${with_ver}/member-trade-perm`,

  // ── Sub-Admin management (Admin only) ────────────────────────────────────────
  get_subadmins: `${with_ver}/get-subadmins`,
  update_subadmin_permissions: `${with_ver}/update-subadmin-permissions`,
  toggle_subadmin_status: `${with_ver}/toggle-subadmin-status`,

  // ── Sub-Admin self (called after SubAdmin login) ─────────────────────────────
  toggle_subadmin_access: `${with_ver}/toggle-subadmin-access`,

  // ── Sub-Admin 2FA login ───────────────────────────────────────────────────
  sub_admin_login: `${with_ver}/sub-admin-login`,
  sub_admin_verify_2fa: `${with_ver}/sub-admin-verify-2fa`,
  toggle_subadmin_2fa: `${with_ver}/toggle-subadmin-2fa`,

  get_all_web_popup_api: `${with_ver}/web-popup/all`,
  create_web_popup_api: `${with_ver}/web-popup/create`,
  delete_web_popup_api: `${with_ver}/web-popup/delete`,

  get_all_social_media_api: `${with_ver}/social-media/all`,
  create_social_media_api: `${with_ver}/social-media/create`,
  update_social_media_api: `${with_ver}/social-media/update`,
  delete_social_media_api: `${with_ver}/social-media/delete`,
};
