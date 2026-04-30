import { useState, useEffect, useRef, useCallback } from "react";
const generateTxnId = () => "RENO-TXN-" + Math.random().toString(36).substr(2, 8).toUpperCase();
const generateAccNo = () => "41110" + Math.floor(Math.random() * 9e6 + 1e6);
const DB = {
  users: {
    "uuid-u1": {
      user_id: "uuid-u1",
      full_name: "Rishabh Raj",
      phone_number: "9279228578",
      pin: "748804",
      kyc_status: "Verified",
      aadhaar_ref_id: "ADHR-REF-8578",
      avatar: null,
      created_at: Date.now() - 2592e6,
      trusted_devices: ["device-abc123"],
      last_location: { lat: 19.076, lng: 72.877, city: "Mumbai", ts: Date.now() - 36e5 }
    },
    "uuid-u2": {
      user_id: "uuid-u2",
      full_name: "Praveen Kumar",
      phone_number: "9279228575",
      pin: "851131",
      kyc_status: "Verified",
      aadhaar_ref_id: "ADHR-REF-8575",
      avatar: null,
      created_at: Date.now() - 1296e6,
      trusted_devices: ["device-xyz789"],
      last_location: { lat: 28.613, lng: 77.209, city: "Delhi", ts: Date.now() - 6e5 }
    }
  },
  accounts: {
    "acc-u1": {
      account_id: "acc-u1",
      user_id: "uuid-u1",
      virtual_acc_no: "4111000018450",
      ifsc_code: "RAZR0000001",
      current_balance: 18450,
      vpa: "rishabh@renopay",
      linked_bank: "HDFC Bank ****4521",
      digital_gold: 245.5,
      round_up_enabled: true,
      round_up_vault: 245.5,
      upi_lite_balance: 500
    },
    "acc-u2": {
      account_id: "acc-u2",
      user_id: "uuid-u2",
      virtual_acc_no: "4111000008200",
      ifsc_code: "RAZR0000001",
      current_balance: 8200,
      vpa: "praveen@renopay",
      linked_bank: "SBI ****9012",
      digital_gold: 0,
      round_up_enabled: false,
      round_up_vault: 0,
      upi_lite_balance: 0
    }
  },
  transactions: [
    { txn_id: "RENO-TXN-SAL001", sender_id: "uuid-ext", receiver_id: "uuid-u1", amount: 5e3, status: "Success", description: "Salary", category: "Income", trust_score: 98, type: "credit", vpa_from: "company@renopay", vpa_to: "rishabh@renopay", timestamp: Date.now() - 2592e5, location: { lat: 19.076, lng: 72.877, city: "Mumbai" } },
    { txn_id: "RENO-TXN-AMZ001", sender_id: "uuid-u1", receiver_id: "uuid-ext", amount: 1200, status: "Success", description: "Online Shopping", category: "Shopping", trust_score: 94, type: "debit", vpa_from: "rishabh@renopay", vpa_to: "amazon@renopay", timestamp: Date.now() - 1728e5, location: { lat: 19.076, lng: 72.877, city: "Mumbai" } },
    { txn_id: "RENO-TXN-UBR001", sender_id: "uuid-u1", receiver_id: "uuid-ext", amount: 800, status: "Success", description: "Cab Ride", category: "Transport", trust_score: 91, type: "debit", vpa_from: "rishabh@renopay", vpa_to: "uber@renopay", timestamp: Date.now() - 864e5, location: { lat: 19.076, lng: 72.877, city: "Mumbai" } },
    { txn_id: "RENO-TXN-LCH001", sender_id: "uuid-ext", receiver_id: "uuid-u1", amount: 500, status: "Success", description: "Lunch split", category: "Food", trust_score: 99, type: "credit", vpa_from: "sayan@renopay", vpa_to: "rishabh@renopay", timestamp: Date.now() - 72e5, location: { lat: 19.076, lng: 72.877, city: "Mumbai" } },
    { txn_id: "RENO-TXN-COF001", sender_id: "uuid-u1", receiver_id: "uuid-u2", amount: 185, status: "Success", description: "Coffee", category: "Food", trust_score: 97, type: "debit", vpa_from: "rishabh@renopay", vpa_to: "praveen@renopay", timestamp: Date.now() - 36e5, location: { lat: 19.076, lng: 72.877, city: "Mumbai" }, round_up: 15 },
    { txn_id: "RENO-TXN-GRC001", sender_id: "uuid-u1", receiver_id: "uuid-ext", amount: 3500, status: "Success", description: "Monthly Groceries", category: "Food", trust_score: 88, type: "debit", vpa_from: "rishabh@renopay", vpa_to: "zomato@renopay", timestamp: Date.now() - 432e6, location: { lat: 19.076, lng: 72.877, city: "Mumbai" } },
    { txn_id: "RENO-TXN-NFL001", sender_id: "uuid-u1", receiver_id: "uuid-ext", amount: 650, status: "Success", description: "Netflix Sub", category: "Entertainment", trust_score: 96, type: "debit", vpa_from: "rishabh@renopay", vpa_to: "netflix@renopay", timestamp: Date.now() - 5184e5, location: { lat: 19.076, lng: 72.877, city: "Mumbai" } }
  ],
  money_requests: [],
  subscriptions: [
    { id: "sub-1", user_id: "uuid-u1", name: "Netflix", icon: "\u{1F3AC}", vpa: "netflix@renopay", amount: 650, cycle: "monthly", next_due: Date.now() + 6048e5, active: true, category: "Entertainment" },
    { id: "sub-2", user_id: "uuid-u1", name: "Spotify", icon: "\u{1F3B5}", vpa: "spotify@renopay", amount: 119, cycle: "monthly", next_due: Date.now() + 12096e5, active: true, category: "Entertainment" },
    { id: "sub-3", user_id: "uuid-u1", name: "AWS", icon: "\u2601\uFE0F", vpa: "aws@renopay", amount: 2400, cycle: "monthly", next_due: Date.now() + 864e5, active: false, category: "Bills" }
  ],
  scratch_cards: [
    { id: "sc-1", user_id: "uuid-u1", scratched: false, reward_type: "cashback", reward_amount: 50, label: "\u20B950 Cashback", expires: Date.now() + 6048e5 },
    { id: "sc-2", user_id: "uuid-u1", scratched: false, reward_type: "gold", reward_amount: 5, label: "\u20B95 Digital Gold", expires: Date.now() + 12096e5 }
  ],
  savings_goals: [
    { id: "sg-1", user_id: "uuid-u1", name: "New iPhone", target: 8e4, saved: 24500, icon: "\u{1F4F1}", milestones: [1e4, 25e3, 4e4, 6e4, 8e4] }
  ],
  mandates: [
    { id: "man-1", user_id: "uuid-u1", name: "Netflix Premium", icon: "\u{1F3AC}", vpa: "netflix@upi", amount: 649, frequency: "monthly", limit: 1e3, next_payment: Date.now() + 864e6, status: "active", created_at: Date.now() - 2592e6 },
    { id: "man-2", user_id: "uuid-u1", name: "Zomato Gold", icon: "\u{1F355}", vpa: "zomato@upi", amount: 299, frequency: "quarterly", limit: 500, next_payment: Date.now() + 1728e6, status: "active", created_at: Date.now() - 5184e6 }
  ],
  _phoneToUserId: { "9279228578": "uuid-u1", "9279228575": "uuid-u2" },
  _userIdToAccId: { "uuid-u1": "acc-u1", "uuid-u2": "acc-u2" },
  _vpaToUserId: { "rishabh@renopay": "uuid-u1", "praveen@renopay": "uuid-u2" },
  shared_vaults: [
    { id: "vault-1", name: "Goa Trip Fund", target: 5e4, balance: 12500, members: ["uuid-u1", "uuid-u2"], icon: "\u{1F3D6}\uFE0F", creator: "uuid-u1", logs: [{ user: "Rishabh", amount: 1e4, type: "contribution", ts: Date.now() - 864e5 }, { user: "Praveen", amount: 2500, type: "contribution", ts: Date.now() - 432e5 }] }
  ]
};
const CURRENT_DEVICE_ID = "device-abc123";
const DatabaseService = {
  getUserByPhone: (p) => {
    const uid = DB._phoneToUserId[p];
    return uid ? DB.users[uid] : null;
  },
  getUserById: (id) => DB.users[id] || null,
  verifyPIN: (p, pin) => {
    const u = DatabaseService.getUserByPhone(p);
    return u && u.pin === pin;
  },
  getAccountByUserId: (uid) => {
    const accId = DB._userIdToAccId[uid];
    return accId ? DB.accounts[accId] : null;
  },
  getAccountByVPA: (vpa) => {
    const uid = DB._vpaToUserId[vpa];
    if (uid) return DatabaseService.getAccountByUserId(uid);
    if (vpa.includes("@renopay")) return { account_id: "acc-ext", user_id: "uuid-ext", vpa, linked_bank: "External Bank", current_balance: 15e3 };
    return null;
  },
  getUserByVPA: (vpa) => {
    const uid = DB._vpaToUserId[vpa];
    if (uid) return DB.users[uid];
    if (vpa.includes("@renopay")) {
      const name = vpa.split("@")[0].charAt(0).toUpperCase() + vpa.split("@")[0].slice(1);
      return { user_id: "uuid-ext", full_name: name, phone_number: "0000000000", avatar: null };
    }
    return null;
  },
  getTransactionsForUser: (uid) => {
    return DB.transactions.filter((t) => t.sender_id === uid || t.receiver_id === uid).map((t) => ({ ...t, type: t.receiver_id === uid ? "credit" : "debit", from: t.vpa_from, to: t.vpa_to })).sort((a, b) => b.timestamp - a.timestamp);
  },
  markKYCVerified: (phone, aadhaarRef) => {
    const uid = DB._phoneToUserId[phone];
    if (uid) {
      DB.users[uid].kyc_status = "Verified";
      DB.users[uid].aadhaar_ref_id = aadhaarRef;
    }
  },
  createVirtualAccount: (userId, name) => {
    const accId = "acc-" + userId;
    const accNo = generateAccNo();
    const vpa = name.toLowerCase().replace(/\s+/g, "") + "@renopay";
    const acc = { account_id: accId, user_id: userId, virtual_acc_no: accNo, ifsc_code: "RAZR0000001", current_balance: 15e3, vpa, linked_bank: "RenoPay Virtual Bank", digital_gold: 0, round_up_enabled: false, round_up_vault: 0, upi_lite_balance: 0 };
    DB.accounts[accId] = acc;
    DB._userIdToAccId[userId] = accId;
    DB._vpaToUserId[vpa] = userId;
    return { success: true, account: acc };
  },
  addMoney: (phone, amount, bankName) => {
    const uid = DB._phoneToUserId[phone];
    const acc = DatabaseService.getAccountByUserId(uid);
    if (!acc) return { success: false, error: "Account not found" };
    acc.current_balance += amount;
    const txn = { txn_id: generateTxnId(), sender_id: "uuid-gateway", receiver_id: uid, amount, status: "Success", description: `Added via ${bankName}`, category: "Income", trust_score: 99, type: "credit", vpa_from: "razorpay@gateway", vpa_to: acc.vpa, timestamp: Date.now(), location: { lat: 19.076, lng: 72.877, city: "Mumbai" } };
    DB.transactions.unshift(txn);
    return { success: true, txn, newBalance: acc.current_balance };
  },
  sendMoney({ fromPhone, toVPA, amount, sentinAI, desc, category, trustScore = 95 }) {
    const uid = DB._phoneToUserId[fromPhone];
    const senderAcc = DatabaseService.getAccountByUserId(uid);
    const receiverUser = DatabaseService.getUserByVPA(toVPA);
    const receiverAcc = DatabaseService.getAccountByVPA(toVPA);
    if (!senderAcc) return { success: false, error: "Sender account not found" };
    if (!receiverAcc) return { success: false, error: "VPA not found! Try: praveen@renopay" };
    if (senderAcc.current_balance < amount) return { success: false, error: "Insufficient balance!" };
    if (sentinAI?.blocked) return { success: false, error: "Blocked by SentinAI fraud detection!" };
    senderAcc.current_balance -= amount;
    receiverAcc.current_balance += amount;
    let roundUpAmt = 0;
    if (senderAcc.round_up_enabled) {
      const rounded = Math.ceil(amount / 10) * 10;
      roundUpAmt = rounded - amount;
      if (roundUpAmt > 0 && senderAcc.current_balance >= roundUpAmt) {
        senderAcc.current_balance -= roundUpAmt;
        senderAcc.digital_gold = (senderAcc.digital_gold || 0) + roundUpAmt;
        senderAcc.round_up_vault = (senderAcc.round_up_vault || 0) + roundUpAmt;
      }
    }
    const txn_id = generateTxnId();
    const loc = { lat: 19.076, lng: 72.877, city: "Mumbai" };
    const baseTxn = { txn_id, sender_id: uid, receiver_id: receiverUser?.user_id || "uuid-ext", amount, status: "Success", description: desc || "UPI Transfer", category: category || "Other", trust_score: trustScore, vpa_from: senderAcc.vpa, vpa_to: toVPA, timestamp: Date.now(), location: loc, round_up: roundUpAmt || void 0 };
    DB.transactions.unshift({ ...baseTxn, type: "debit" });
    if (receiverUser) DB.transactions.unshift({ ...baseTxn, txn_id: generateTxnId(), type: "credit", category: "Income", trust_score: 99 });
    DB.users[uid].last_location = { ...loc, ts: Date.now() };
    if (amount >= 500 && Math.random() > 0.6) {
      DB.scratch_cards.push({ id: "sc-" + Date.now(), user_id: uid, scratched: false, reward_type: "cashback", reward_amount: Math.floor(Math.random() * 100 + 10), label: "\u20B9" + Math.floor(Math.random() * 100 + 10) + " Cashback", expires: Date.now() + 6048e5 });
    }
    return { success: true, txn: { ...baseTxn, id: txn_id, round_up: roundUpAmt } };
  },
  registerUser: (phone, name, pin) => {
    const uid = "uuid-u" + Date.now();
    DB.users[uid] = { user_id: uid, full_name: name, phone_number: phone, pin, kyc_status: "Pending", aadhaar_ref_id: null, avatar: null, created_at: Date.now(), trusted_devices: [CURRENT_DEVICE_ID], last_location: { lat: 19.076, lng: 72.877, city: "Mumbai", ts: Date.now() } };
    DB._phoneToUserId[phone] = uid;
    return { uid };
  },
  isDeviceTrusted: (phone) => {
    const u = DatabaseService.getUserByPhone(phone);
    return u?.trusted_devices?.includes(CURRENT_DEVICE_ID) ?? false;
  },
  trustDevice: (phone) => {
    const uid = DB._phoneToUserId[phone];
    if (uid && !DB.users[uid].trusted_devices.includes(CURRENT_DEVICE_ID)) {
      DB.users[uid].trusted_devices.push(CURRENT_DEVICE_ID);
    }
  },
  createRequest: ({ fromVPA, toVPA, amount, note }) => {
    const req = { id: "REQ-" + Date.now(), from_vpa: fromVPA, to_vpa: toVPA, amount, note, status: "pending", created_at: Date.now() };
    DB.money_requests.push(req);
    return req;
  },
  getRequestsForUser: (uid) => {
    const acc = DatabaseService.getAccountByUserId(uid);
    if (!acc) return [];
    return DB.money_requests.filter((r) => r.from_vpa === acc.vpa || r.to_vpa === acc.vpa);
  },
  approveRequest: (reqId, phone) => {
    const req = DB.money_requests.find((r) => r.id === reqId);
    if (!req || req.status !== "pending") return { success: false, error: "Invalid request" };
    const res = DatabaseService.sendMoney({ fromPhone: phone, toVPA: req.from_vpa, amount: req.amount, desc: req.note || "Money Request", category: "Other", trustScore: 97 });
    if (res.success) req.status = "paid";
    return res;
  },
  getSubscriptions: (uid) => DB.subscriptions.filter((s) => s.user_id === uid),
  toggleSubscription: (subId) => {
    const s = DB.subscriptions.find((x) => x.id === subId);
    if (s) s.active = !s.active;
  },
  addSubscription: (uid, data) => {
    const sub = { id: "sub-" + Date.now(), user_id: uid, ...data, active: true };
    DB.subscriptions.push(sub);
    return sub;
  },
  getSavingsGoals: (uid) => DB.savings_goals.filter((g) => g.user_id === uid),
  addToSavings: (uid, goalId, amount) => {
    const acc = DatabaseService.getAccountByUserId(uid);
    if (!acc || acc.current_balance < amount) return { success: false, error: "Insufficient balance" };
    const goal = DB.savings_goals.find((g) => g.id === goalId);
    if (!goal) return { success: false, error: "Goal not found" };
    acc.current_balance -= amount;
    goal.saved += amount;
    const txn = { txn_id: generateTxnId(), sender_id: uid, receiver_id: "vault", amount, status: "Success", description: `Savings: ${goal.name}`, category: "Other", trust_score: 99, type: "debit", vpa_from: acc.vpa, vpa_to: "savings@vault", timestamp: Date.now(), location: { lat: 19.076, lng: 72.877, city: "Mumbai" } };
    DB.transactions.unshift(txn);
    return { success: true, newBalance: acc.current_balance, newSaved: goal.saved };
  },
  getScratchCards: (uid) => DB.scratch_cards.filter((s) => s.user_id === uid),
  scratchCard: (cardId, uid) => {
    const c = DB.scratch_cards.find((x) => x.id === cardId && x.user_id === uid);
    if (!c || c.scratched) return { success: false };
    c.scratched = true;
    const acc = DatabaseService.getAccountByUserId(uid);
    if (acc && c.reward_type === "cashback") acc.current_balance += c.reward_amount;
    if (acc && c.reward_type === "gold") acc.digital_gold = (acc.digital_gold || 0) + c.reward_amount;
    return { success: true, reward: c };
  },
  getUPILiteBalance: (uid) => {
    const acc = DatabaseService.getAccountByUserId(uid);
    return acc?.upi_lite_balance || 0;
  },
  topUpUPILite: (uid, amount) => {
    const acc = DatabaseService.getAccountByUserId(uid);
    if (!acc || acc.current_balance < amount) return { success: false, error: "Insufficient main balance" };
    if (acc.upi_lite_balance + amount > 2e3) return { success: false, error: "Lite limit (\u20B92,000) exceeded" };
    acc.current_balance -= amount;
    acc.upi_lite_balance += amount;
    return { success: true, newLiteBalance: acc.upi_lite_balance, newMainBalance: acc.current_balance };
  },
  sendMoneyLite: (uid, toVPA, amount) => {
    const acc = DatabaseService.getAccountByUserId(uid);
    if (!acc || acc.upi_lite_balance < amount) return { success: false, error: "Insufficient Lite balance" };
    acc.upi_lite_balance -= amount;
    const txn = { txn_id: generateTxnId() + "-LITE", sender_id: uid, receiver_id: "uuid-ext", amount, status: "Success", description: "UPI Lite Payment", category: "Other", trust_score: 99, type: "debit", vpa_from: acc.vpa, vpa_to: toVPA, timestamp: Date.now(), location: { lat: 19.076, lng: 72.877, city: "Mumbai" } };
    DB.transactions.unshift(txn);
    return { success: true, txn };
  },
  getMandates: (uid) => DB.mandates.filter((m) => m.user_id === uid),
  toggleMandate: (id) => {
    const m = DB.mandates.find((x) => x.id === id);
    if (m) m.status = m.status === "active" ? "paused" : "active";
  },
  addMandate: (uid, data) => {
    const man = { id: "man-" + Date.now(), user_id: uid, ...data, status: "active", created_at: Date.now() };
    DB.mandates.push(man);
    return man;
  }
};
const MockBackend = {
  sendOTP: () => ({ success: true }),
  verifyOTP: (_, o) => ({ success: o === "123456" }),
  getUser: (p) => {
    const u = DatabaseService.getUserByPhone(p);
    if (!u) return null;
    const acc = DatabaseService.getAccountByUserId(u.user_id);
    return { ...u, id: u.user_id, name: u.full_name, balance: acc?.current_balance || 0, vpa: acc?.vpa || "unknown@renopay", bank: acc?.linked_bank || "Unknown Bank", transactions: [] };
  },
  verifyPIN: DatabaseService.verifyPIN,
  resolveVPA: (v) => {
    const u = DatabaseService.getUserByVPA(v);
    if (!u) return null;
    const acc = DatabaseService.getAccountByVPA(v);
    return { ...u, id: u.user_id, name: u.full_name, balance: acc?.current_balance || 0, vpa: acc?.vpa || v };
  },
  sendMoney: DatabaseService.sendMoney.bind(DatabaseService)
};
const SentinAI = {
  analyze({ amount, slideTime, noteCount, tiltAngle, speed, phone, toVPA }) {
    const r = [];
    const explanations = [];
    if (amount > 2e3) {
      r.push("high_amount");
      explanations.push("High value transaction");
    }
    if (slideTime !== null && noteCount > 0 && slideTime / noteCount < 400) {
      r.push("bot_speed");
      explanations.push("Unusually fast note input detected");
    }
    if (tiltAngle !== null && Math.abs(tiltAngle) > 45) {
      r.push("unusual_tilt");
      explanations.push("Device tilt anomaly");
    }
    if (speed === "fast") {
      r.push("impulsive");
      explanations.push("Impulsive transaction speed");
    }
    const hour = (/* @__PURE__ */ new Date()).getHours();
    if (hour >= 1 && hour <= 4) {
      r.push("odd_hours");
      explanations.push(`Transaction at ${hour}:00 AM \u2014 odd hours`);
    }
    if (phone && !DatabaseService.isDeviceTrusted(phone)) {
      r.push("new_device");
      explanations.push("Unrecognized device \u2014 not in trusted list");
    }
    if (phone) {
      const uid = DB._phoneToUserId[phone];
      const user = uid ? DB.users[uid] : null;
      if (user?.last_location) {
        const last = user.last_location;
        const timeDiffHrs = (Date.now() - last.ts) / 36e5;
        const curLoc = amount > 5e3 ? { lat: 28.613, lng: 77.209, city: "Delhi" } : { lat: 19.076, lng: 72.877, city: "Mumbai" };
        const distKm = Math.sqrt(Math.pow((curLoc.lat - last.lat) * 111, 2) + Math.pow((curLoc.lng - last.lng) * 111, 2));
        if (distKm > 200 && timeDiffHrs < 2) {
          r.push("geo_velocity");
          explanations.push(`Impossible travel: ${Math.round(distKm)}km in ${(timeDiffHrs * 60).toFixed(0)}min (${last.city} \u2192 ${curLoc.city})`);
        }
      }
    }
    const blockedReasons = ["bot_speed", "geo_velocity"];
    const blocked = r.some((x) => blockedReasons.includes(x)) && r.length >= 2;
    const lvl = r.length === 0 ? "low" : r.length <= 1 ? "medium" : "high";
    const trust = lvl === "low" ? Math.floor(93 + Math.random() * 7) : lvl === "medium" ? Math.floor(75 + Math.random() * 15) : Math.floor(40 + Math.random() * 30);
    return { riskLevel: lvl, risks: r, blocked, trustScore: trust, explanations, newDevice: r.includes("new_device"), geoAlert: r.includes("geo_velocity") };
  },
  predictBudget(uid, balance) {
    const txns = DatabaseService.getTransactionsForUser(uid);
    const debits = txns.filter((t) => t.type === "debit" && t.timestamp > Date.now() - 2592e6);
    if (debits.length === 0) return { status: "safe", msg: "No recent spending detected." };
    const oldest = Math.min(...debits.map((t) => t.timestamp));
    const daysElapsed = Math.max(1, Math.ceil((Date.now() - oldest) / 864e5));
    const totalSpent = debits.reduce((s, t) => s + t.amount, 0);
    const dailyBurn = totalSpent / daysElapsed;
    const now = /* @__PURE__ */ new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemainingInMonth = daysInMonth - now.getDate();
    const daysRemainingInFunds = balance / (dailyBurn || 1);
    const diff = daysRemainingInFunds - daysRemainingInMonth;
    if (diff < -2) return { status: "critical", level: "High", msg: `Warning: At your current burn rate, you will run out of funds ${Math.abs(Math.round(diff))} days before the month ends.`, burnRate: dailyBurn, exhaustionDate: Date.now() + daysRemainingInFunds * 864e5 };
    else if (diff < 5) return { status: "caution", level: "Mid", msg: "Careful: Your spending rate is high. You might struggle by the last week.", burnRate: dailyBurn };
    return { status: "safe", level: "Stable", msg: "Financial heartbeat stable. You are on track for this month.", burnRate: dailyBurn };
  }
};
const fmt = (n) => "\u20B9" + Number(n).toLocaleString("en-IN");
const ago = (ts) => {
  const d = Date.now() - ts;
  return d < 6e4 ? "just now" : d < 36e5 ? Math.floor(d / 6e4) + "m ago" : d < 864e5 ? Math.floor(d / 36e5) + "h ago" : Math.floor(d / 864e5) + "d ago";
};
const fmtDate = (ts) => new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const maskAccNo = (n) => n ? n.replace(/(\d+)(\d{4})/, "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 $2") : "";
const CATS = [
  { id: "Food", icon: "\u{1F354}", color: "#ff6b6b" },
  { id: "Shopping", icon: "\u{1F6CD}\uFE0F", color: "#845ef7" },
  { id: "Transport", icon: "\u{1F697}", color: "#339af0" },
  { id: "Entertainment", icon: "\u{1F3AC}", color: "#f59f00" },
  { id: "Bills", icon: "\u{1F4A1}", color: "#20c997" },
  { id: "Health", icon: "\u{1F48A}", color: "#f06595" },
  { id: "Education", icon: "\u{1F4DA}", color: "#74c0fc" },
  { id: "Income", icon: "\u{1F4B0}", color: "#51cf66" },
  { id: "Other", icon: "\u{1F4E6}", color: "#868e96" }
];
const getCat = (c) => CATS.find((x) => x.id === c) || CATS[8];
const C = {
  bg: "#0a0608",
  surf: "#120810",
  card: "#160b12",
  border: "#2a0f1e",
  accent: "#e0294a",
  accent2: "#ff6b35",
  accentGlow: "rgba(224,41,74,0.3)",
  teal: "#00d9b4",
  gold: "#f0bb3c",
  danger: "#ff1744",
  warn: "#ff9f2e",
  text: "#f5e8ee",
  muted: "#6b3a4a",
  success: "#00d9b4",
  purple: "#9b3fd4"
};
const GS = () => /* @__PURE__ */ React.createElement("style", null, `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html,body{
  background:${C.bg};
  color:${C.text};
  font-family:'Outfit',sans-serif;
  min-height:100vh;
  overflow-x:hidden;
}
body::before{
  content:'';
  position:fixed;
  inset:0;
  background:
    radial-gradient(ellipse 80% 50% at 20% 10%, rgba(224,41,74,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(155,63,212,0.08) 0%, transparent 50%),
    radial-gradient(ellipse 100% 60% at 50% 50%, rgba(180,20,50,0.05) 0%, transparent 70%);
  pointer-events:none;
  z-index:0;
}
body > * { position: relative; z-index: 1; }
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${C.accent}55;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes heartbeat{0%,100%{transform:scale(1)}14%{transform:scale(1.12)}28%{transform:scale(1)}42%{transform:scale(1.08)}70%{transform:scale(1)}}
@keyframes voiceWave{0%,100%{height:4px}50%{height:16px}}
@keyframes arLock{0%,100%{border-color:${C.warn}}50%{border-color:${C.success};box-shadow:0 0 20px ${C.success}55}}
@keyframes goldShimmer{0%{background-position:0% 50%}100%{background-position:100% 50%}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 10px ${C.accent}44}50%{box-shadow:0 0 30px ${C.accent}88}}
@keyframes logoSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes liquidWave{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes noteFloat{0%,100%{transform:translateY(0) rotate(-0.5deg)}50%{transform:translateY(-3px) rotate(0.5deg)}}
@keyframes coinFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes arGrid{0%{opacity:0.6}100%{opacity:1}}
@keyframes arScan{0%{top:20%}50%{top:80%}100%{top:20%}}
@keyframes arCoin{0%{opacity:0;bottom:-20px}50%{opacity:0.7}100%{opacity:0;bottom:110%}}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
@keyframes crimsonPulse{0%,100%{box-shadow:0 0 20px rgba(224,41,74,0.4)}50%{box-shadow:0 0 40px rgba(224,41,74,0.8), 0 0 60px rgba(224,41,74,0.3)}}
@keyframes borderGlow{0%,100%{border-color:${C.accent}55}50%{border-color:${C.accent}cc}}
.fu{animation:fadeUp .38s ease both}
.fi{animation:fadeIn .3s ease both}
.btn{cursor:pointer;border:none;outline:none;transition:all .18s;font-family:'Outfit',sans-serif}
.btn:active{transform:scale(.94)}
.card{
  background:${C.card};
  border:1px solid ${C.border};
  border-radius:20px;
  position:relative;
}
.card::before{
  content:'';
  position:absolute;
  inset:0;
  border-radius:20px;
  background:linear-gradient(135deg,rgba(224,41,74,0.03) 0%,transparent 50%);
  pointer-events:none;
}
input{background:rgba(224,41,74,.06);border:1.5px solid ${C.border};color:${C.text};border-radius:13px;padding:13px 16px;font-size:15px;font-family:'Outfit',sans-serif;width:100%;outline:none;transition:border .2s,box-shadow .2s}
input:focus{border-color:${C.accent};box-shadow:0 0 0 3px ${C.accentGlow}}
input::placeholder{color:${C.muted}}
`);
const Btn = ({ children, onClick, variant = "primary", style = {}, disabled, type }) => {
  const v = {
    primary: { background: `linear-gradient(135deg,${C.accent},#c0143a)`, color: "#fff", boxShadow: `0 6px 22px ${C.accentGlow}` },
    ghost: { background: "transparent", color: C.accent, border: `1.5px solid ${C.accent}` },
    danger: { background: C.danger, color: "#fff", boxShadow: "0 6px 18px rgba(255,23,68,.35)" },
    teal: { background: `linear-gradient(135deg,${C.teal},#00a896)`, color: "#000" },
    dark: { background: C.surf, color: C.text, border: `1px solid ${C.border}` },
    gold: { background: `linear-gradient(135deg,${C.gold},#c8960a)`, color: "#000" }
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: type || "button",
      className: "btn",
      onClick,
      disabled,
      style: { ...v[variant], borderRadius: 13, padding: "13px 22px", fontSize: 15, fontWeight: 600, width: "100%", opacity: disabled ? 0.45 : 1, ...style }
    },
    children
  );
};
const Badge = ({ children, color = C.accent, size = 11 }) => /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 9px", borderRadius: 20, fontSize: size, fontWeight: 700, background: color + "22", color, border: `1px solid ${color}44` } }, children);
const TrustBadge = ({ score }) => {
  const col = score >= 90 ? C.success : score >= 70 ? C.warn : C.danger;
  const label = score >= 90 ? "Secure" : score >= 70 ? "Moderate" : "Flagged";
  return /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: col + "1a", color: col, border: `1px solid ${col}44` } }, "\u{1F6E1} ", score, "% ", label);
};
const RenoPayLogo = ({ size = 90, animate = true }) => /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: size, height: size, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: {
  position: "absolute",
  inset: -8,
  borderRadius: "50%",
  background: `conic-gradient(from 0deg, ${C.accent}, ${C.accent2}, #ff1744, ${C.purple}, ${C.accent})`,
  animation: animate ? "logoSpin 4s linear infinite" : "none",
  opacity: 0.7,
  filter: "blur(2px)"
} }), /* @__PURE__ */ React.createElement("div", { style: {
  position: "absolute",
  inset: -3,
  borderRadius: "50%",
  background: `conic-gradient(from 180deg, ${C.accent}88, transparent, ${C.accent2}88, transparent)`,
  animation: animate ? "logoSpin 3s linear infinite reverse" : "none"
} }), /* @__PURE__ */ React.createElement("div", { style: {
  position: "relative",
  width: size,
  height: size,
  borderRadius: "50%",
  background: `radial-gradient(circle at 35% 35%, #3d0618, #1a0208)`,
  border: `2px solid ${C.accent}88`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: `0 0 30px ${C.accent}66, inset 0 0 20px rgba(224,41,74,0.15)`,
  animation: animate ? "crimsonPulse 2s ease infinite" : "none",
  zIndex: 1
} }, /* @__PURE__ */ React.createElement("div", { style: {
  position: "absolute",
  top: "8%",
  left: "15%",
  width: "35%",
  height: "35%",
  background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
  borderRadius: "50%"
} }), /* @__PURE__ */ React.createElement("span", { style: {
  fontFamily: "'Space Mono', monospace",
  fontSize: size * 0.42,
  fontWeight: 700,
  color: "#fff",
  textShadow: `0 0 20px ${C.accent}, 0 2px 4px rgba(0,0,0,0.6)`,
  position: "relative",
  zIndex: 2
} }, "\u20B9")));
const LiquidCard = ({ balance, maxBalance = 25e3, vpa, bank, onToggle, show, phone }) => {
  const pct = Math.min(100, Math.max(5, balance / maxBalance * 100));
  const [animPct, setAnimPct] = useState(pct);
  useEffect(() => {
    setTimeout(() => setAnimPct(pct), 300);
  }, [pct]);
  const liquidColor = pct > 60 ? "rgba(224,41,74,.7)" : pct > 30 ? "rgba(255,165,0,.7)" : "rgba(255,60,80,.7)";
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    borderRadius: 22,
    overflow: "hidden",
    border: `1.5px solid ${C.accent}55`,
    height: 170,
    background: `linear-gradient(135deg, #1a0810, #0f0508)`,
    boxShadow: `0 8px 32px rgba(224,41,74,0.2), inset 0 1px 0 rgba(255,255,255,0.05)`
  } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, height: `${animPct}%`, background: liquidColor, transition: "height 1.2s cubic-bezier(.4,0,.2,1)", zIndex: 1 } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 400 24", preserveAspectRatio: "none", style: { position: "absolute", top: -23, left: 0, right: 0, width: "100%", height: 24 } }, /* @__PURE__ */ React.createElement("path", { d: "M0,12 C50,0 100,24 150,12 C200,0 250,24 300,12 C350,0 400,24 400,12 L400,24 L0,24 Z", fill: liquidColor }))), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg,rgba(224,41,74,0.04) 0px,transparent 1px,transparent 24px),repeating-linear-gradient(90deg,rgba(224,41,74,0.04) 0px,transparent 1px,transparent 24px)`, zIndex: 0 } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 2, padding: "18px 22px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "linear-gradient(180deg,rgba(10,6,8,.7) 0%,rgba(10,6,8,.1) 60%,transparent 100%)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { color: "rgba(245,232,238,.5)", fontSize: 10, letterSpacing: 2, fontWeight: 600 } }, "AVAILABLE BALANCE"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 4 } }, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontSize: 28, fontWeight: 700, textShadow: `0 2px 8px ${C.accent}66` } }, show ? fmt(balance) : "\u20B9 \u2022\u2022\u2022\u2022\u2022\u2022"), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onToggle, style: { background: "rgba(224,41,74,.2)", borderRadius: "50%", width: 28, height: 28, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" } }, show ? "\u{1F648}" : "\u{1F441}"))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 10, color: "rgba(255,255,255,.5)", marginBottom: 2 } }, pct.toFixed(0), "% full"), /* @__PURE__ */ React.createElement("div", { style: { width: 40, height: 6, background: "rgba(255,255,255,.15)", borderRadius: 3, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${C.accent},${C.accent2})`, borderRadius: 3, transition: "width 1s ease" } })))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { color: "rgba(245,232,238,.6)", fontSize: 11, fontWeight: 600 } }, vpa), /* @__PURE__ */ React.createElement("p", { style: { color: "rgba(245,232,238,.35)", fontSize: 10, marginTop: 1 } }, bank))));
};
const HeartbeatGauge = ({ spendScore }) => {
  const col = spendScore < 40 ? C.success : spendScore < 70 ? C.warn : C.danger;
  const msg = spendScore < 40 ? "Financial Heartbeat Stable \u{1F49A}" : spendScore < 70 ? "Moderate Spending \u26A0\uFE0F" : "High Spending Fever! \u{1F6A8}";
  const r = 54, cx = 80, cy = 72;
  const polar = (ang) => ({ x: cx + r * Math.cos(ang * Math.PI / 180), y: cy + r * Math.sin(ang * Math.PI / 180) });
  const arcPath = (startDeg, endDeg) => {
    const s = polar(startDeg), e = polar(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M${s.x},${s.y} A${r},${r} 0 ${large} 1 ${e.x},${e.y}`;
  };
  const needleDeg = -180 + spendScore * 1.8;
  const nx = cx + 46 * Math.cos(needleDeg * Math.PI / 180);
  const ny = cy + 46 * Math.sin(needleDeg * Math.PI / 180);
  return /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "16px 18px 12px", border: `1px solid ${col}33` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 1 } }, "SENTINAI HEARTBEAT"), /* @__PURE__ */ React.createElement(Badge, { color: col, size: 10 }, spendScore < 40 ? "STABLE" : spendScore < 70 ? "CAUTION" : "CRITICAL")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 12 } }, /* @__PURE__ */ React.createElement("svg", { width: "160", height: "82", viewBox: "0 0 160 82" }, /* @__PURE__ */ React.createElement("path", { d: arcPath(-180, 0), fill: "none", stroke: C.border, strokeWidth: "10", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: arcPath(-180, -108), fill: "none", stroke: C.success + "88", strokeWidth: "10", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: arcPath(-108, -54), fill: "none", stroke: C.warn + "88", strokeWidth: "10", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: arcPath(-54, 0), fill: "none", stroke: C.danger + "88", strokeWidth: "10", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: arcPath(-180, Math.min(0, -180 + spendScore * 1.8)), fill: "none", stroke: col, strokeWidth: "10", strokeLinecap: "round", style: { transition: "all 1s ease", filter: `drop-shadow(0 0 4px ${col})` } }), /* @__PURE__ */ React.createElement("line", { x1: cx, y1: cy, x2: nx, y2: ny, stroke: col, strokeWidth: "2.5", strokeLinecap: "round", style: { transition: "all 1s ease" } }), /* @__PURE__ */ React.createElement("circle", { cx, cy, r: "5", fill: col }), /* @__PURE__ */ React.createElement("text", { x: "14", y: "76", fontSize: "8", fill: C.success, fontFamily: "Outfit" }, "Safe"), /* @__PURE__ */ React.createElement("text", { x: "68", y: "20", fontSize: "8", fill: C.warn, fontFamily: "Outfit" }, "Mid"), /* @__PURE__ */ React.createElement("text", { x: "130", y: "76", fontSize: "8", fill: C.danger, fontFamily: "Outfit" }, "Risk")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, paddingBottom: 4 } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, fontWeight: 700, color: col, lineHeight: 1.3 } }, msg), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 10, color: C.muted, marginTop: 4 } }, "SentinAI emotional analysis"))));
};
const PINPad = ({ onComplete, label, accent = C.accent, shuffled = false }) => {
  const [pin, setPin] = useState("");
  const baseOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [order, setOrder] = useState(baseOrder);
  useEffect(() => {
    if (shuffled) setOrder([...baseOrder].sort(() => Math.random() - 0.5));
    else setOrder(baseOrder);
  }, [shuffled]);
  const add = (d) => {
    if (pin.length >= 6) return;
    const np = pin + d;
    setPin(np);
    if (np.length === 6) setTimeout(() => {
      onComplete(np);
      setPin("");
    }, 180);
  };
  const del = () => setPin((p) => p.slice(0, -1));
  return /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, shuffled && /* @__PURE__ */ React.createElement("p", { style: { color: C.warn, fontSize: 11, marginBottom: 8, animation: "pulse 1s ease infinite" } }, "\u26A0 Anti-peek mode: keypad shuffled"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, marginBottom: 16, fontSize: 13 } }, label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 10, marginBottom: 24 } }, [0, 1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { width: 13, height: 13, borderRadius: "50%", background: i < pin.length ? accent : "transparent", border: `2px solid ${i < pin.length ? accent : C.muted}`, transition: "all .2s" } }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, maxWidth: 270, margin: "0 auto" } }, order.map((d) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: d,
      className: "btn",
      onClick: () => add(String(d)),
      style: { padding: "15px 0", borderRadius: 13, background: C.surf, border: `1px solid ${C.border}`, color: C.text, fontSize: 20, fontFamily: "'Space Mono',monospace", fontWeight: 700 }
    },
    d
  )), /* @__PURE__ */ React.createElement("div", null), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => add("0"), style: { padding: "15px 0", borderRadius: 13, background: C.surf, border: `1px solid ${C.border}`, color: C.text, fontSize: 20, fontFamily: "'Space Mono',monospace", fontWeight: 700 } }, "0"), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: del, style: { padding: "15px 0", borderRadius: 13, background: C.surf, border: `1px solid ${C.border}`, color: C.warn, fontSize: 18 } }, "\u232B")));
};
const PrivacyModal = ({ onSuccess, onCancel }) => {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);
  const tap = (d) => {
    if (code.length < 4) setCode((c) => c + d);
  };
  const verify = () => {
    if (code === "7890") {
      onSuccess();
      return;
    }
    setErr("Wrong code! Demo: 7890");
    setShake(true);
    setTimeout(() => {
      setShake(false);
      setCode("");
      setErr("");
    }, 700);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.93)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24 } }, /* @__PURE__ */ React.createElement("div", { className: "card fu", style: { padding: 28, maxWidth: 320, width: "100%", border: `1.5px solid ${C.accent}55`, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 60, height: 60, borderRadius: "50%", background: `${C.accent}1a`, border: `2px solid ${C.accent}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 14px" } }, "\u{1F510}"), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 20, fontWeight: 800, color: C.accent } }, "SentinAI Privacy Pass"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12, margin: "6px 0 20px" } }, "High-value transaction detected.", /* @__PURE__ */ React.createElement("br", null), "Enter your 4-digit Privacy Code."), /* @__PURE__ */ React.createElement("div", { style: { animation: shake ? "shake .4s ease" : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 10, marginBottom: 18 } }, [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { width: 13, height: 13, borderRadius: "50%", background: i < code.length ? C.accent : "transparent", border: `2px solid ${i < code.length ? C.accent : C.muted}`, transition: "all .2s" } }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, maxWidth: 230, margin: "0 auto 12px" } }, [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => /* @__PURE__ */ React.createElement("button", { key: d, className: "btn", onClick: () => tap(String(d)), style: { padding: "12px 0", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 18, fontFamily: "'Space Mono',monospace" } }, d)), /* @__PURE__ */ React.createElement("div", null), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => tap("0"), style: { padding: "12px 0", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 18, fontFamily: "'Space Mono',monospace" } }, "0"), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => setCode((c) => c.slice(0, -1)), style: { padding: "12px 0", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, color: C.warn, fontSize: 16 } }, "\u232B"))), err && /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontSize: 12, marginBottom: 8 } }, err), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10, marginBottom: 12 } }, "Demo Privacy Code: 7890"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "dark", onClick: onCancel, style: { flex: 1 } }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { variant: "danger", onClick: verify, style: { flex: 1 }, disabled: code.length < 4 }, "Verify"))));
};
const Note500 = ({ fade }) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 340 160", xmlns: "http://www.w3.org/2000/svg", style: { width: "100%", borderRadius: 10, opacity: fade ? 0.45 : 1, transition: "opacity .8s ease" } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "g500a", x1: "0%", y1: "0%", x2: "100%", y2: "100%" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "#3e7a42" }), /* @__PURE__ */ React.createElement("stop", { offset: "50%", stopColor: "#5aad5e" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "#2e6032" })), /* @__PURE__ */ React.createElement("linearGradient", { id: "g500b", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "#e8c840" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "#b89c0a" }))), /* @__PURE__ */ React.createElement("rect", { width: "340", height: "160", rx: "9", fill: "url(#g500a)" }), /* @__PURE__ */ React.createElement("rect", { x: "0", y: "0", width: "52", height: "160", rx: "9", fill: "rgba(0,0,0,0.2)" }), /* @__PURE__ */ React.createElement("rect", { x: "52", y: "0", width: "6", height: "160", fill: "url(#g500b)", opacity: "0.9" }), /* @__PURE__ */ React.createElement("ellipse", { cx: "92", cy: "80", rx: "34", ry: "40", fill: "rgba(255,255,255,0.1)", stroke: "rgba(255,255,255,0.18)", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: "92", y: "72", textAnchor: "middle", fontSize: "30", fill: "rgba(255,255,255,0.65)" }, "\u{1F9D4}"), /* @__PURE__ */ React.createElement("text", { x: "92", y: "108", textAnchor: "middle", fontSize: "6.5", fill: "rgba(255,255,255,0.45)", fontFamily: "serif" }, "MAHATMA GANDHI"), /* @__PURE__ */ React.createElement("text", { x: "152", y: "66", textAnchor: "middle", fontSize: "28", fontWeight: "700", fill: "url(#g500b)", fontFamily: "serif" }, "\u20B9"), /* @__PURE__ */ React.createElement("text", { x: "228", y: "70", textAnchor: "middle", fontSize: "58", fontWeight: "900", fill: "rgba(255,255,255,0.95)", fontFamily: "serif" }, "500"), /* @__PURE__ */ React.createElement("text", { x: "228", y: "24", textAnchor: "middle", fontSize: "8.5", fill: "rgba(255,255,255,0.82)", fontFamily: "serif", letterSpacing: "2" }, "RESERVE BANK OF INDIA"), /* @__PURE__ */ React.createElement("text", { x: "228", y: "94", textAnchor: "middle", fontSize: "7", fill: "rgba(255,255,255,0.55)", fontFamily: "serif" }, "I promise to pay the bearer a sum of"), /* @__PURE__ */ React.createElement("text", { x: "228", y: "104", textAnchor: "middle", fontSize: "7.5", fontWeight: "600", fill: "rgba(255,255,255,0.65)", fontFamily: "serif" }, "Five Hundred Rupees"));
const NoteGeneric = ({ denom, color1, color2, accent, label, fade }) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 340 140", xmlns: "http://www.w3.org/2000/svg", style: { width: "100%", borderRadius: 10, opacity: fade ? 0.45 : 1, transition: "opacity .8s ease" } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: `g${denom}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: color1 }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: color2 }))), /* @__PURE__ */ React.createElement("rect", { width: "340", height: "140", rx: "9", fill: `url(#g${denom})` }), /* @__PURE__ */ React.createElement("rect", { x: "0", y: "0", width: "48", height: "140", rx: "9", fill: "rgba(0,0,0,0.2)" }), /* @__PURE__ */ React.createElement("rect", { x: "48", y: "0", width: "5", height: "140", fill: accent, opacity: "0.8" }), /* @__PURE__ */ React.createElement("ellipse", { cx: "86", cy: "70", rx: "30", ry: "34", fill: "rgba(255,255,255,0.1)", stroke: "rgba(255,255,255,0.2)", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: "86", y: "64", textAnchor: "middle", fontSize: "26", fill: "rgba(255,255,255,0.65)" }, "\u{1F9D4}"), /* @__PURE__ */ React.createElement("text", { x: "148", y: "58", textAnchor: "middle", fontSize: "22", fontWeight: "700", fill: accent, fontFamily: "serif" }, "\u20B9"), /* @__PURE__ */ React.createElement("text", { x: "220", y: "64", textAnchor: "middle", fontSize: "48", fontWeight: "900", fill: "rgba(255,255,255,0.95)", fontFamily: "serif" }, denom), /* @__PURE__ */ React.createElement("text", { x: "220", y: "20", textAnchor: "middle", fontSize: "8", fill: "rgba(255,255,255,0.75)", fontFamily: "serif", letterSpacing: "2" }, "RESERVE BANK OF INDIA"), /* @__PURE__ */ React.createElement("text", { x: "220", y: "84", textAnchor: "middle", fontSize: "7", fill: "rgba(255,255,255,0.5)", fontFamily: "serif" }, label));
const CoinSVG = ({ denom }) => {
  const cm = { 5: { c1: "#7ab840", c2: "#3a5a1a" }, 2: { c1: "#8888b0", c2: "#444468" }, 1: { c1: "#c0a030", c2: "#705808" } };
  const { c1, c2 } = cm[denom] || cm[1];
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 80 80", xmlns: "http://www.w3.org/2000/svg", style: { width: "100%", height: "100%" } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("radialGradient", { id: `cg${denom}`, cx: "35%", cy: "30%" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: c1 }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: c2 }))), /* @__PURE__ */ React.createElement("circle", { cx: "40", cy: "40", r: "37", fill: `url(#cg${denom})`, stroke: c1, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "40", cy: "40", r: "31", fill: "none", stroke: "rgba(255,255,255,0.18)", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "40", y: "28", textAnchor: "middle", fontSize: "7", fill: "rgba(255,255,255,0.65)", fontFamily: "serif" }, "\u092D\u093E\u0930\u0924"), /* @__PURE__ */ React.createElement("text", { x: "40", y: "47", textAnchor: "middle", fontSize: "20", fontWeight: "900", fill: "white", fontFamily: "serif" }, "\u20B9", denom), /* @__PURE__ */ React.createElement("text", { x: "40", y: "60", textAnchor: "middle", fontSize: "6.5", fill: "rgba(255,255,255,0.55)", fontFamily: "serif" }, "INDIA"));
};
const VoiceAuth = ({ name, onDone }) => {
  const [state, setState] = useState("idle");
  const start = () => {
    setState("listening");
    setTimeout(() => {
      setState("verified");
      setTimeout(onDone, 700);
    }, 2200);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "8px 0" } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12, marginBottom: 12 } }, "Say your name: ", /* @__PURE__ */ React.createElement("strong", { style: { color: C.accent } }, '"', name, '"')), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn",
      onClick: state === "idle" ? start : void 0,
      style: { width: 80, height: 80, borderRadius: "50%", background: state === "verified" ? `${C.success}22` : state === "listening" ? `${C.accent}30` : `${C.accent}18`, border: `2px solid ${state === "verified" ? C.success : C.accent}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto", gap: 4 }
    },
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 28 } }, state === "verified" ? "\u2705" : state === "listening" ? "\u{1F399}\uFE0F" : "\u{1F3A4}")
  ), state === "listening" && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 3, justifyContent: "center", marginTop: 10, height: 20, alignItems: "center" } }, [1, 2, 3, 4, 5, 6, 7].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { width: 3, background: C.accent, borderRadius: 2, animation: `voiceWave .8s ${i * 0.1}s ease-in-out infinite` } }))), /* @__PURE__ */ React.createElement("p", { style: { color: state === "verified" ? C.success : C.muted, fontSize: 12, marginTop: 8 } }, state === "idle" ? "Tap to speak" : state === "listening" ? "Listening..." : "Voice verified! \u2713"));
};
const BudgetPredictionCard = ({ data }) => {
  if (!data || data.status === "safe") return null;
  const isCritical = data.status === "critical";
  const col = isCritical ? C.danger : C.warn;
  return /* @__PURE__ */ React.createElement("div", { className: "fu card", style: { padding: 18, border: `1.5px solid ${col}66`, background: `${col}0a`, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, isCritical ? "\u{1F6A8}" : "\u26A0\uFE0F"), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 14, fontWeight: 800, color: col } }, "SENTINAI PREDICTION")), /* @__PURE__ */ React.createElement(Badge, { color: col, size: 9 }, data.level, " Risk")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, lineHeight: 1.5, color: C.text, fontWeight: 500 } }, data.msg), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10 } }, "Daily Burn Rate"), /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 14 } }, "\u20B9", Math.round(data.burnRate), "/day")), /* @__PURE__ */ React.createElement(Btn, { variant: "dark", style: { width: "auto", padding: "6px 14px", fontSize: 11 } }, "View Insights")));
};
const UPILiteCard = ({ balance, onNavigate }) => /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, border: `1px solid ${C.teal}44`, background: `${C.teal}05`, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 40, height: 40, borderRadius: 12, background: `${C.teal}1a`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 } }, "\u26A1"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 14 } }, "UPI Lite Wallet"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11 } }, "PIN-less for small payments"))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 18, color: C.teal } }, "\u20B9", balance), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onNavigate, style: { background: "transparent", color: C.accent, fontSize: 11, fontWeight: 700, padding: 0 } }, "Manage \u2192")));
const LedgerTxnCard = ({ txn, devMode }) => {
  const [expanded, setExpanded] = useState(false);
  const ci = getCat(txn.category);
  const isDebit = txn.type === "debit";
  return /* @__PURE__ */ React.createElement("div", { className: "card fu", style: { padding: 14, marginBottom: 10, border: `1px solid ${expanded && devMode ? C.teal + "55" : C.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 }, onClick: () => devMode && setExpanded((e) => !e) }, /* @__PURE__ */ React.createElement("div", { style: { width: 42, height: 42, borderRadius: 13, background: ci.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 } }, ci.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, txn.description), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(TrustBadge, { score: txn.trust_score || 95 }), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10 } }, ago(txn.timestamp)), txn.round_up && /* @__PURE__ */ React.createElement(Badge, { color: C.gold, size: 9 }, "+", fmt(txn.round_up), " gold"))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 13, color: isDebit ? C.danger : C.success } }, isDebit ? "-" : "+", fmt(txn.amount)), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10 } }, fmtDate(txn.timestamp)))), devMode && expanded && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, padding: 12, borderRadius: 10, background: `${C.teal}08`, border: `1px solid ${C.teal}33` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.teal, fontSize: 11, fontWeight: 700, marginBottom: 8 } }, "\u{1F4BB} T-Account Double Entry"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 } }, /* @__PURE__ */ React.createElement("div", { style: { borderRight: `1px solid ${C.border}`, paddingRight: 8 } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontWeight: 600, marginBottom: 4 } }, "DEBIT"), /* @__PURE__ */ React.createElement("p", { style: { color: C.text } }, isDebit ? txn.vpa_to : "Cash/Bank"), /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontFamily: "'Space Mono',monospace" } }, fmt(txn.amount))), /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 8 } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontWeight: 600, marginBottom: 4 } }, "CREDIT"), /* @__PURE__ */ React.createElement("p", { style: { color: C.text } }, isDebit ? txn.vpa_from : txn.vpa_from), /* @__PURE__ */ React.createElement("p", { style: { color: C.success, fontFamily: "'Space Mono',monospace" } }, fmt(txn.amount)))), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 9, marginTop: 6 } }, "TXN: ", txn.txn_id)));
};
const SplashScreen = ({ onNext }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(onNext, 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg, overflow: "hidden", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", width: 600, height: 600, borderRadius: "50%", border: `1px solid ${C.accent}15`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "pulse 3s ease infinite" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", width: 450, height: 450, borderRadius: "50%", border: `1px solid ${C.accent}25`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "pulse 2.5s .5s ease infinite" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", width: 300, height: 300, borderRadius: "50%", border: `1px solid ${C.accent}35`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "pulse 2s 1s ease infinite" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", textAlign: "center", opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(30px)", transition: "all .6s cubic-bezier(0.34, 1.56, 0.64, 1)" } }, /* @__PURE__ */ React.createElement(RenoPayLogo, { size: 100, animate: phase >= 1 }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24, opacity: phase >= 2 ? 1 : 0, transition: "opacity .5s ease .3s" } }, /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "'Outfit',sans-serif", fontSize: 54, fontWeight: 800, letterSpacing: -2, background: `linear-gradient(135deg,#fff 0%,${C.accent} 40%,${C.accent2} 70%,#ff8c69 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } }, "RenoPay"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, marginTop: 8, fontSize: 12, letterSpacing: 3, fontWeight: 600, textTransform: "uppercase" } }, "Feel Every Rupee You Spend"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 36, display: "flex", gap: 8, justifyContent: "center" } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { width: i === 0 ? 24 : 6, height: 6, borderRadius: 3, background: i === 0 ? C.accent : C.border, transition: "all .3s", animation: `pulse 1.3s ${i * 0.45}s ease infinite` } }))))));
};
const LoginScreen = ({ onLogin, onBack }) => {
  const [step, setStep] = useState("registration");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [formData, setFormData] = useState({ fullName: "", dob: "", email: "dummy@example.com", phone: "9876543210", address: "", city: "", state: "", pinCode: "", pan: "", aadhaar: "" });
  const [otp, setOtp] = useState("748804");
  const [upiPin, setUpiPin] = useState("");
  const [confirmUpiPin, setConfirmUpiPin] = useState("");
  const handleRegSubmit = (e) => {
    e.preventDefault();
    setStep("otp");
    window.scrollTo(0, 0);
  };
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setStep("upipin");
    window.scrollTo(0, 0);
  };
  const handleUpiSubmit = (e) => {
    e.preventDefault();
    if (upiPin.length !== 6) {
      setErr("PIN must be 6 digits");
      return;
    }
    if (upiPin !== confirmUpiPin) {
      setErr("PINs do not match!");
      return;
    }
    setErr("");
    setLoading(true);
    setTimeout(() => {
      const res = DatabaseService.registerUser(formData.phone, formData.fullName, upiPin);
      DatabaseService.createVirtualAccount(res.uid, formData.fullName);
      DatabaseService.markKYCVerified(formData.phone, "ADHR-REG-" + Date.now());
      const user = DatabaseService.getUserByPhone(formData.phone);
      const acc = DatabaseService.getAccountByUserId(user.user_id);
      onLogin({ ...user, id: user.user_id, name: user.full_name, balance: acc.current_balance, vpa: acc.vpa, bank: acc.linked_bank, avatar: null, transactions: [] }, formData.phone);
      setLoading(false);
    }, 1e3);
  };
  const sectionStyle = { color: C.accent, fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 12, marginTop: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 6 };
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, padding: "60px 24px 40px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement(RenoPayLogo, { size: 42, animate: false })), /* @__PURE__ */ React.createElement("h1", { className: "fu", style: { fontSize: 32, fontWeight: 800, color: C.text } }, "Welcome to RenoPay"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, marginTop: 6, fontSize: 13, marginBottom: 24 } }, "Create your account to continue"), step === "registration" && /* @__PURE__ */ React.createElement("form", { onSubmit: handleRegSubmit, className: "fu card", style: { padding: "0 20px 20px" } }, /* @__PURE__ */ React.createElement("h2", { style: { ...sectionStyle, marginTop: 20 } }, "1. PERSONAL INFORMATION"), /* @__PURE__ */ React.createElement("input", { required: true, placeholder: "Full Name", value: formData.fullName, onChange: (e) => setFormData({ ...formData, fullName: e.target.value }), style: { marginBottom: 10 } }), /* @__PURE__ */ React.createElement("input", { required: true, type: "date", value: formData.dob, onChange: (e) => setFormData({ ...formData, dob: e.target.value }), style: { marginBottom: 10, colorScheme: "dark" } }), /* @__PURE__ */ React.createElement("input", { required: true, type: "email", placeholder: "Email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), style: { marginBottom: 10 } }), /* @__PURE__ */ React.createElement("input", { required: true, type: "tel", placeholder: "Phone Number", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), style: { marginBottom: 10 } }), /* @__PURE__ */ React.createElement("h2", { style: sectionStyle }, "2. ADDRESS DETAILS"), /* @__PURE__ */ React.createElement("input", { required: true, placeholder: "Residential Address", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }), style: { marginBottom: 10 } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("input", { required: true, placeholder: "City", value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }) }), /* @__PURE__ */ React.createElement("input", { required: true, placeholder: "State", value: formData.state, onChange: (e) => setFormData({ ...formData, state: e.target.value }) })), /* @__PURE__ */ React.createElement("input", { required: true, placeholder: "Pin Code", value: formData.pinCode, onChange: (e) => setFormData({ ...formData, pinCode: e.target.value }), style: { marginBottom: 10 } }), /* @__PURE__ */ React.createElement("h2", { style: sectionStyle }, "3. IDENTITY DOCUMENT"), /* @__PURE__ */ React.createElement("input", { required: true, placeholder: "PAN Number (ABCDE1234F)", value: formData.pan, onChange: (e) => setFormData({ ...formData, pan: e.target.value }), style: { marginBottom: 10, textTransform: "uppercase" } }), /* @__PURE__ */ React.createElement("input", { required: true, placeholder: "Aadhaar Card Number", value: formData.aadhaar, onChange: (e) => setFormData({ ...formData, aadhaar: e.target.value }), style: { marginBottom: 10 } }), /* @__PURE__ */ React.createElement(Btn, { type: "submit", style: { marginTop: 15 } }, "Submit Details \u2192")), step === "otp" && /* @__PURE__ */ React.createElement("form", { onSubmit: handleOtpSubmit, className: "fu card", style: { padding: 20 } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12, marginBottom: 16 } }, "Enter OTP sent to ", formData.phone), /* @__PURE__ */ React.createElement("input", { required: true, type: "tel", maxLength: 6, value: otp, onChange: (e) => setOtp(e.target.value.replace(/\D/, "")), style: { letterSpacing: 14, fontSize: 26, textAlign: "center", marginBottom: 16 } }), /* @__PURE__ */ React.createElement(Btn, { type: "submit" }, "Verify OTP \u2192")), step === "upipin" && /* @__PURE__ */ React.createElement("form", { onSubmit: handleUpiSubmit, className: "fu card", style: { padding: 20 } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12, marginBottom: 12 } }, "Set a 6-digit UPI PIN"), /* @__PURE__ */ React.createElement("input", { required: true, type: "password", maxLength: 6, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022", value: upiPin, onChange: (e) => setUpiPin(e.target.value.replace(/\D/, "")), style: { letterSpacing: 14, fontSize: 26, textAlign: "center", marginBottom: 16 } }), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12, marginBottom: 12 } }, "Confirm UPI PIN"), /* @__PURE__ */ React.createElement("input", { required: true, type: "password", maxLength: 6, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022", value: confirmUpiPin, onChange: (e) => setConfirmUpiPin(e.target.value.replace(/\D/, "")), style: { letterSpacing: 14, fontSize: 26, textAlign: "center", marginBottom: 16 } }), err && /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontSize: 13, textAlign: "center", marginBottom: 14 } }, err), /* @__PURE__ */ React.createElement(Btn, { type: "submit", disabled: loading }, loading ? "Creating Account..." : "Set PIN & Enter App \u2192")));
};
const RequestScreen = ({ user, phone, onBack }) => {
  const [tab, setTab] = useState("send");
  const [toVPA, setToVPA] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const uid = DatabaseService.getUserByPhone(phone)?.user_id || "uuid-u1";
  const acc = DatabaseService.getAccountByUserId(uid);
  const requests = DatabaseService.getRequestsForUser(uid);
  const sent = requests.filter((r) => r.from_vpa === acc?.vpa);
  const inbox = requests.filter((r) => r.to_vpa === acc?.vpa);
  const sendRequest = () => {
    if (!toVPA.includes("@")) {
      setErr("Enter valid VPA");
      return;
    }
    if (!Number(amount) || Number(amount) < 1) {
      setErr("Enter valid amount");
      return;
    }
    const rec = DatabaseService.getUserByVPA(toVPA);
    if (!rec) {
      setErr("VPA not found");
      return;
    }
    DatabaseService.createRequest({ fromVPA: acc?.vpa, toVPA, amount: Number(amount), note });
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setToVPA("");
      setAmount("");
      setNote("");
    }, 1500);
  };
  const pay = (reqId) => {
    const res = DatabaseService.approveRequest(reqId, phone);
    if (!res.success) setErr(res.error || "Failed");
  };
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800 } }, "Request Money \u{1F48C}")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16 } }, [["send", "Send Request"], ["inbox", "Inbox"]].map(([v, l]) => /* @__PURE__ */ React.createElement("button", { key: v, className: "btn", onClick: () => setTab(v), style: { flex: 1, padding: "9px 0", borderRadius: 10, background: tab === v ? C.accent : C.card, color: tab === v ? "#fff" : C.muted, border: `1px solid ${tab === v ? C.accent : C.border}`, fontSize: 12, fontWeight: 600 } }, l, v === "inbox" && inbox.filter((r) => r.status === "pending").length > 0 && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 5, background: C.danger, color: "#fff", borderRadius: "50%", padding: "1px 5px", fontSize: 10 } }, inbox.filter((r) => r.status === "pending").length)))), tab === "send" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 20, marginBottom: 16, border: `1px solid ${C.accent}33` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 8 } }, "REQUEST FROM (UPI ID)"), /* @__PURE__ */ React.createElement("input", { placeholder: "praveen@renopay", value: toVPA, onChange: (e) => setToVPA(e.target.value) }), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 8, marginTop: 14 } }, "AMOUNT"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 22, color: C.accent } }, "\u20B9"), /* @__PURE__ */ React.createElement("input", { type: "number", placeholder: "0", value: amount, onChange: (e) => setAmount(e.target.value), style: { fontSize: 24, fontWeight: 700 } })), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 8, marginTop: 14 } }, "NOTE (OPTIONAL)"), /* @__PURE__ */ React.createElement("input", { placeholder: "Lunch, rent, etc.", value: note, onChange: (e) => setNote(e.target.value) })), err && /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontSize: 12, marginBottom: 12 } }, err), done && /* @__PURE__ */ React.createElement("p", { style: { color: C.success, fontSize: 13, textAlign: "center", marginBottom: 12, animation: "fadeIn .3s ease" } }, "\u2705 Request sent!"), /* @__PURE__ */ React.createElement(Btn, { onClick: sendRequest }, "Send Request \u2192"), sent.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 10, letterSpacing: 1 } }, "SENT"), sent.map((r) => /* @__PURE__ */ React.createElement("div", { key: r.id, className: "card", style: { padding: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 600, fontSize: 13 } }, r.to_vpa), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11 } }, r.note || "No note", " \xB7 ", ago(r.created_at))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 14, color: C.accent } }, fmt(r.amount)), /* @__PURE__ */ React.createElement(Badge, { color: r.status === "paid" ? C.success : C.warn, size: 9 }, r.status === "paid" ? "\u2705 Paid" : "\u23F3 Pending")))))), tab === "inbox" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, inbox.length === 0 && /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, textAlign: "center", padding: 40 } }, "No incoming requests"), inbox.map((r) => /* @__PURE__ */ React.createElement("div", { key: r.id, className: "card", style: { padding: 16, marginBottom: 10, border: `1px solid ${r.status === "pending" ? C.warn + "44" : C.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 14 } }, r.from_vpa), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11 } }, r.note || "No note", " \xB7 ", ago(r.created_at))), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 18, color: C.warn } }, fmt(r.amount))), r.status === "pending" ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "dark", onClick: () => {
    const idx = DB.money_requests.findIndex((x) => x.id === r.id);
    if (idx >= 0) DB.money_requests[idx].status = "declined";
  }, style: { flex: 1, padding: "9px" } }, "Decline"), /* @__PURE__ */ React.createElement(Btn, { onClick: () => pay(r.id), style: { flex: 1, padding: "9px" } }, "Pay ", fmt(r.amount))) : /* @__PURE__ */ React.createElement(Badge, { color: r.status === "paid" ? C.success : C.muted }, r.status === "paid" ? "\u2705 Paid" : "\u274C Declined"))))));
};
const SplitScreen = ({ phone, onBack }) => {
  const [totalBill, setTotalBill] = useState("");
  const [people, setPeople] = useState([{ name: "You", vpa: "", paid: true }, { name: "", vpa: "", paid: false }]);
  const [desc, setDesc] = useState("");
  const [sent, setSent] = useState(false);
  const [results, setResults] = useState([]);
  const uid = DatabaseService.getUserByPhone(phone)?.user_id || "uuid-u1";
  const acc = DatabaseService.getAccountByUserId(uid);
  const split = totalBill && people.filter((p) => p.name).length > 0 ? Math.ceil(Number(totalBill) / people.filter((p) => p.name).length) : 0;
  const addPerson = () => setPeople((p) => [...p, { name: "", vpa: "", paid: false }]);
  const removePerson = (i) => setPeople((p) => p.filter((_, idx) => idx !== i));
  const updatePerson = (i, k, v) => setPeople((p) => p.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const sendRequests = () => {
    if (!split || split <= 0) return;
    const res = [];
    people.forEach((p) => {
      if (p.paid || !p.vpa || !p.name) return;
      const req = DatabaseService.createRequest({ fromVPA: acc?.vpa, toVPA: p.vpa, amount: split, note: `${desc || "Bill split"} - \u20B9${split} each` });
      res.push({ ...p, req });
    });
    setResults(res);
    setSent(true);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800 } }, "Bill Splitter \u{1F355}")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px" } }, !sent ? /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 20, marginBottom: 16, border: `1px solid ${C.accent}33` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 8 } }, "TOTAL BILL"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 28, color: C.accent } }, "\u20B9"), /* @__PURE__ */ React.createElement("input", { type: "number", placeholder: "0", value: totalBill, onChange: (e) => setTotalBill(e.target.value), style: { fontSize: 32, fontWeight: 700, border: "none", borderBottom: `2px solid ${C.accent}`, borderRadius: 0, paddingLeft: 0, background: "transparent" } })), /* @__PURE__ */ React.createElement("input", { placeholder: "What's this for? (e.g. Dinner at Toit)", value: desc, onChange: (e) => setDesc(e.target.value) })), split > 0 && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 16, textAlign: "center", border: `1px solid ${C.teal}44`, background: `${C.teal}08` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12 } }, "Each person pays"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontSize: 36, fontWeight: 700, color: C.teal } }, fmt(split)), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11 } }, people.filter((p) => p.name).length, " people \xB7 equal split")), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 1, fontWeight: 600, marginBottom: 10 } }, "PEOPLE"), people.map((p, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "card", style: { padding: 14, marginBottom: 8, border: `1px solid ${p.paid ? C.success + "44" : C.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("input", { placeholder: `Name ${i + 1}`, value: p.name, onChange: (e) => updatePerson(i, "name", e.target.value), style: { flex: 1, padding: "9px 12px", fontSize: 13 } }), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => updatePerson(i, "paid", !p.paid), style: { padding: "9px 12px", borderRadius: 10, background: p.paid ? `${C.success}22` : C.surf, border: `1px solid ${p.paid ? C.success : C.border}`, color: p.paid ? C.success : C.muted, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" } }, p.paid ? "\u2705 Paid" : "Mark paid"), i > 0 && /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => removePerson(i), style: { padding: "9px 10px", borderRadius: 10, background: C.surf, border: `1px solid ${C.border}`, color: C.danger, fontSize: 14 } }, "\u2715")), !p.paid && /* @__PURE__ */ React.createElement("input", { placeholder: "their@upi (optional)", value: p.vpa, onChange: (e) => updatePerson(i, "vpa", e.target.value), style: { fontSize: 12, padding: "8px 12px" } }))), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: addPerson, style: { width: "100%", padding: "11px", borderRadius: 12, background: "transparent", border: `1.5px dashed ${C.border}`, color: C.muted, fontSize: 13, marginBottom: 16 } }, "+ Add Person"), /* @__PURE__ */ React.createElement(Btn, { onClick: sendRequests, disabled: !split }, "Send Split Requests \u2192")) : /* @__PURE__ */ React.createElement("div", { className: "fu", style: { textAlign: "center", paddingTop: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 80, height: 80, borderRadius: "50%", background: `${C.success}22`, border: `2px solid ${C.success}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 16px" } }, "\u{1F355}"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800, color: C.success } }, "Split Requests Sent!"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, marginTop: 6, fontSize: 13 } }, results.length, " requests sent \xB7 ", fmt(split), " each"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20 } }, results.map((r, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "card", style: { padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, fontWeight: 600 } }, r.name), /* @__PURE__ */ React.createElement(Badge, { color: C.warn, size: 10 }, "\u23F3 ", fmt(split))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement(Btn, { onClick: onBack }, "\u2190 Back")))));
};
const MandatesScreen = ({ phone, onBack }) => {
  const uid = DatabaseService.getUserByPhone(phone)?.user_id;
  const [mandates, setMandates] = useState(DatabaseService.getMandates(uid));
  const refresh = () => setMandates(DatabaseService.getMandates(uid));
  const toggle = (id) => {
    DatabaseService.toggleMandate(id);
    refresh();
  };
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 40 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800 } }, "Smart Mandates"), /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto" } }, /* @__PURE__ */ React.createElement(Badge, { color: C.accent, size: 10 }, "\u2713 AutoPay 2.0"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px" } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18, marginBottom: 20, background: `${C.accent}0a`, border: `1.5px solid ${C.accent}33` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1 } }, "ACTIVE MANDATES VALUE"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 32, fontWeight: 800, color: C.accent, marginTop: 4 } }, fmt(mandates.filter((m) => m.status === "active").reduce((s, m) => s + m.amount, 0))), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, marginTop: 4 } }, mandates.filter((m) => m.status === "active").length, " mandates currently authorized")), mandates.map((m) => /* @__PURE__ */ React.createElement("div", { key: m.id, className: "card", style: { padding: 18, marginBottom: 12, border: `1px solid ${m.status === "active" ? C.border : C.border + "55"}`, opacity: m.status === "active" ? 1 : 0.6 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 48, height: 48, borderRadius: 14, background: m.status === "active" ? `${C.accent}1a` : C.surf, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 } }, m.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 15 } }, m.name), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontWeight: 800, fontSize: 16 } }, fmt(m.amount))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 4 } }, /* @__PURE__ */ React.createElement(Badge, { color: C.muted, size: 9 }, m.frequency), /* @__PURE__ */ React.createElement(Badge, { color: m.status === "active" ? C.success : C.warn, size: 9 }, m.status.toUpperCase())), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10, marginTop: 8 } }, "VPA: ", m.vpa, " \u2022 Limit: ", fmt(m.limit)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` } }, /* @__PURE__ */ React.createElement(Btn, { variant: "dark", style: { flex: 1, padding: "8px", fontSize: 12 }, onClick: () => toggle(m.id) }, m.status === "active" ? "Pause Mandate" : "Resume Mandate"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", style: { flex: 1, padding: "8px", fontSize: 12 } }, "View Details")))), /* @__PURE__ */ React.createElement("button", { className: "btn", style: { width: "100%", padding: 15, borderRadius: 16, background: "transparent", border: `2px dashed ${C.accent}44`, color: C.accent, fontWeight: 700, marginTop: 10 } }, "+ Create New Mandate")));
};
const ScratchCard = ({ card, onScratch }) => {
  const [done, setDone] = useState(card.scratched);
  const canvasRef = useRef();
  const isDrawing = useRef(false);
  useEffect(() => {
    if (done || card.scratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#3d0618";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(224,41,74,${0.03 + Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 20 + 5, Math.random() * 20 + 5);
    }
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = "bold 13px Outfit";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH TO REVEAL", canvas.width / 2, canvas.height / 2 - 8);
    ctx.fillText("YOUR REWARD \u2192", canvas.width / 2, canvas.height / 2 + 12);
  }, [done]);
  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const cl = e.touches ? e.touches[0] : e;
    return { x: cl.clientX - r.left, y: cl.clientY - r.top };
  };
  const scratch = (e) => {
    if (done || !isDrawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const total = canvas.width * canvas.height;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] < 128) transparent++;
    if (transparent / total > 0.55 && !done) {
      setDone(true);
      onScratch(card.id);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 20, border: `1.5px solid ${done ? C.gold + "66" : C.accent + "44"}`, textAlign: "center", position: "relative", overflow: "hidden", marginBottom: 16 } }, done && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 8, right: 8 } }, /* @__PURE__ */ React.createElement(Badge, { color: C.gold, size: 9 }, "\u2713 Scratched")), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, fontWeight: 600, marginBottom: 8, letterSpacing: 1 } }, "SCRATCH CARD ", card.id), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", borderRadius: 12, overflow: "hidden", height: 100, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, border: `1px solid ${C.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 36 } }, card.reward_type === "cashback" ? "\u{1F4B0}" : "\u{1FA99}"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 20, color: C.gold } }, card.label)), !card.scratched && !done && /* @__PURE__ */ React.createElement(
    "canvas",
    {
      ref: canvasRef,
      width: 280,
      height: 100,
      style: { position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "crosshair", borderRadius: 12, touchAction: "none" },
      onMouseDown: (e) => {
        isDrawing.current = true;
        scratch(e);
      },
      onMouseMove: scratch,
      onMouseUp: () => isDrawing.current = false,
      onTouchStart: (e) => {
        isDrawing.current = true;
        scratch(e);
      },
      onTouchMove: scratch,
      onTouchEnd: () => isDrawing.current = false
    }
  ), (done || card.scratched) && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` } })), (done || card.scratched) && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.gold, fontWeight: 700, fontSize: 13 } }, card.reward_type === "cashback" ? "\u{1F4B0} Cashback added!" : "\u{1FA99} Gold deposited!")), !done && !card.scratched && /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, marginTop: 8 } }, "Drag to scratch!"));
};
const RewardsScreen = ({ phone, onBack }) => {
  const uid = DatabaseService.getUserByPhone(phone)?.user_id || "uuid-u1";
  const [cards, setCards] = useState(DatabaseService.getScratchCards(uid));
  const acc = DatabaseService.getAccountByUserId(uid);
  const doScratch = (cardId) => {
    const res = DatabaseService.scratchCard(cardId, uid);
    setCards(DatabaseService.getScratchCards(uid));
    return res;
  };
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800 } }, "Rewards \u{1F3B0}")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px" } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 16, border: `1px solid ${C.gold}44`, background: `${C.gold}08`, display: "flex", gap: 14, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 32 } }, "\u{1FA99}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 14, color: C.gold } }, "Digital Gold: ", fmt(acc?.digital_gold || 0)), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11 } }, "Earn more by scratching cards!"))), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 12 } }, "YOUR SCRATCH CARDS (", cards.filter((c) => !c.scratched).length, " unscratched)"), cards.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: 40 } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 40 } }, "\u{1F3B0}"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, marginTop: 10 } }, "No scratch cards yet")), cards.map((c) => /* @__PURE__ */ React.createElement(ScratchCard, { key: c.id, card: c, onScratch: doScratch }))));
};
const TreasureMap = ({ goal, onAddSavings }) => {
  const pct = Math.min(100, goal.saved / goal.target * 100);
  const [adding, setAdding] = useState(false);
  const [addAmt, setAddAmt] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const STEPS = 8;
  const avatarStep = Math.floor(pct / 100 * STEPS);
  const MAP_ITEMS = ["\u{1F33F}", "\u{1F3D5}\uFE0F", "\u{1F30A}", "\u{1F30B}", "\u{1F3D4}\uFE0F", "\u{1F308}", "\u2B50", "\u{1F48E}", "\u{1F4B0}"];
  const milestoneAmts = goal.milestones || [];
  const doAdd = () => {
    if (!Number(addAmt) || Number(addAmt) < 1) {
      setErr("Enter valid amount");
      return;
    }
    setAdding(false);
    setSuccess(true);
    onAddSavings(goal.id, Number(addAmt));
    setAddAmt("");
    setErr("");
    setTimeout(() => setSuccess(false), 2e3);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18, border: `1px solid ${C.gold}44`, overflow: "hidden", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 800, fontSize: 16 } }, goal.icon, " ", goal.name), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11 } }, fmt(goal.saved), " saved of ", fmt(goal.target))), /* @__PURE__ */ React.createElement(Badge, { color: C.gold, size: 10 }, pct.toFixed(0), "%")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", padding: "12px 0", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 4 } }, MAP_ITEMS.map((item, i) => {
    const reached = i <= avatarStep;
    const isCurrent = i === avatarStep;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 38, height: 38, borderRadius: "50%", background: reached ? `${C.gold}33` : "rgba(255,255,255,0.04)", border: `2px solid ${reached ? C.gold : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "all .4s", position: "relative", boxShadow: isCurrent ? `0 0 14px ${C.gold}66` : "none" } }, /* @__PURE__ */ React.createElement("span", { style: { filter: reached ? "none" : "grayscale(100%) opacity(0.3)" } }, item), isCurrent && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontSize: 18 } }, "\u{1F9D1}")), i < MAP_ITEMS.length - 1 && /* @__PURE__ */ React.createElement("div", { style: { width: 20, height: 3, background: reached ? C.gold : C.border, borderRadius: 2, transition: "background .4s" } }));
  }))), /* @__PURE__ */ React.createElement("div", { style: { background: C.bg, borderRadius: 8, height: 8, overflow: "hidden", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${C.gold},#ffd700)`, borderRadius: 8, transition: "width 1s ease", boxShadow: `0 0 8px ${C.gold}66` } })), milestoneAmts.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 } }, milestoneAmts.map((m, i) => /* @__PURE__ */ React.createElement(Badge, { key: i, color: goal.saved >= m ? C.gold : C.muted, size: 9 }, goal.saved >= m ? "\u2713" : "", " ", fmt(m)))), success && /* @__PURE__ */ React.createElement("p", { style: { color: C.success, fontSize: 12, textAlign: "center", marginBottom: 8, animation: "fadeIn .3s ease" } }, "\u2705 Added to vault!"), adding ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.gold, fontSize: 20 } }, "\u20B9"), /* @__PURE__ */ React.createElement("input", { type: "number", placeholder: "Amount to save", value: addAmt, onChange: (e) => setAddAmt(e.target.value), style: { flex: 1 } })), err && /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontSize: 11, marginBottom: 6 } }, err), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "dark", onClick: () => setAdding(false), style: { flex: 1, padding: "9px" } }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { variant: "gold", onClick: doAdd, style: { flex: 1, padding: "9px" } }, "Save \u2192"))) : /* @__PURE__ */ React.createElement(Btn, { variant: "gold", onClick: () => setAdding(true), style: { padding: "11px" } }, "+ Add Savings"));
};
const SavingsScreen = ({ phone, onBack }) => {
  const uid = DatabaseService.getUserByPhone(phone)?.user_id || "uuid-u1";
  const [goals, setGoals] = useState(DatabaseService.getSavingsGoals(uid));
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", target: "", icon: "\u{1F3AF}" });
  const [err, setErr] = useState("");
  const refresh = () => setGoals(DatabaseService.getSavingsGoals(uid));
  const ICONS2 = ["\u{1F4F1}", "\u2708\uFE0F", "\u{1F697}", "\u{1F3E0}", "\u{1F4BB}", "\u{1F4F7}", "\u{1F3B8}", "\u{1F393}", "\u{1F3CB}\uFE0F", "\u{1F30D}"];
  const addGoal = () => {
    if (!form.name || !Number(form.target)) {
      setErr("Fill all fields");
      return;
    }
    const g = { id: "sg-" + Date.now(), user_id: uid, name: form.name, target: Number(form.target), saved: 0, icon: form.icon, milestones: [Math.round(Number(form.target) * 0.25), Math.round(Number(form.target) * 0.5), Math.round(Number(form.target) * 0.75), Number(form.target)] };
    DB.savings_goals.push(g);
    refresh();
    setShowNew(false);
    setForm({ name: "", target: "", icon: "\u{1F3AF}" });
  };
  const handleAdd = (goalId, amount) => {
    DatabaseService.addToSavings(uid, goalId, amount);
    refresh();
  };
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800 } }, "Savings Goals \u{1F5FA}\uFE0F")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px" } }, goals.map((g) => /* @__PURE__ */ React.createElement(TreasureMap, { key: g.id, goal: g, onAddSavings: handleAdd })), showNew ? /* @__PURE__ */ React.createElement("div", { className: "card fu", style: { padding: 18, marginTop: 12, border: `1px solid ${C.gold}44` } }, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, color: C.gold, fontSize: 14, marginBottom: 14 } }, "\u{1F5FA}\uFE0F New Savings Goal"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 } }, ICONS2.map((ic) => /* @__PURE__ */ React.createElement("button", { key: ic, className: "btn", onClick: () => setForm((f) => ({ ...f, icon: ic })), style: { padding: "8px", borderRadius: 10, background: form.icon === ic ? `${C.gold}22` : C.surf, border: `1px solid ${form.icon === ic ? C.gold : C.border}`, fontSize: 18 } }, ic))), /* @__PURE__ */ React.createElement("input", { placeholder: "Goal name", value: form.name, onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })), style: { marginBottom: 10 } }), /* @__PURE__ */ React.createElement("input", { type: "number", placeholder: "Target amount (\u20B9)", value: form.target, onChange: (e) => setForm((f) => ({ ...f, target: e.target.value })), style: { marginBottom: 10 } }), err && /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontSize: 12, marginBottom: 8 } }, err), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "dark", onClick: () => setShowNew(false), style: { flex: 1 } }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { variant: "gold", onClick: addGoal, style: { flex: 1 } }, "Create Goal"))) : /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => setShowNew(true), style: { width: "100%", padding: "13px", borderRadius: 14, background: "transparent", border: `1.5px dashed ${C.gold}55`, color: C.gold, fontSize: 13, fontWeight: 600, marginTop: 12 } }, "+ New Savings Goal")));
};
const UPILiteScreen = ({ phone, onBack }) => {
  const uid = DatabaseService.getUserByPhone(phone)?.user_id;
  const [balance, setBalance] = useState(DatabaseService.getUPILiteBalance(uid));
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const topUp = () => {
    if (!amount || amount < 10) {
      setError("Min \u20B910");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = DatabaseService.topUpUPILite(uid, Number(amount));
      if (res.success) {
        setBalance(res.newLiteBalance);
        setAmount("");
        setError("");
      } else setError(res.error);
      setLoading(false);
    }, 1500);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 40 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800 } }, "UPI Lite Wallet"), /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto" } }, /* @__PURE__ */ React.createElement(Badge, { color: C.teal, size: 10 }, "\u26A1 On-Device"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px" } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 24, textAlign: "center", marginBottom: 20, border: `1.5px solid ${C.teal}33`, background: `${C.teal}0a` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 1, fontWeight: 700 } }, "AVAILABLE LITE BALANCE"), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 48, fontWeight: 800, color: C.teal, marginTop: 8, fontFamily: "'Space Mono',monospace" } }, fmt(balance)), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, marginTop: 4 } }, "Max limit: \u20B92,000")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 20, marginBottom: 20 } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 12 } }, "TOP UP WALLET"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 24, color: C.accent } }, "\u20B9"), /* @__PURE__ */ React.createElement("input", { type: "number", placeholder: "0", value: amount, onChange: (e) => setAmount(e.target.value), style: { fontSize: 24, fontWeight: 700, border: "none", borderBottom: `2px solid ${C.accent}`, borderRadius: 0, background: "transparent" } })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 } }, [100, 200, 500, 1e3].map((v) => /* @__PURE__ */ React.createElement("button", { key: v, className: "btn", onClick: () => setAmount(v), style: { padding: "6px 12px", borderRadius: 20, background: amount == v ? C.accent : C.surf, color: amount == v ? "#fff" : C.muted, fontSize: 12, border: `1px solid ${amount == v ? C.accent : C.border}` } }, "+\u20B9", v))), error && /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontSize: 12, marginBottom: 12 } }, error), /* @__PURE__ */ React.createElement(Btn, { onClick: topUp, disabled: loading }, loading ? "Processing..." : "Add to Lite Wallet \u2192")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18 } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 14, fontWeight: 700, marginBottom: 10 } }, "Why use UPI Lite? \u{1F4A1}"), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", color: C.muted, fontSize: 12, lineHeight: 1.6 } }, /* @__PURE__ */ React.createElement("li", null, "\u2022 Pay instantly without any UPI PIN"), /* @__PURE__ */ React.createElement("li", null, "\u2022 Supports transactions up to \u20B9500"), /* @__PURE__ */ React.createElement("li", null, "\u2022 Reduces server load on your bank"), /* @__PURE__ */ React.createElement("li", null, "\u2022 Less cluttered bank statement")))));
};
const QRScreen = ({ user, onBack }) => {
  const q = `upi://pay?pa=${user.vpa}&pn=${encodeURIComponent(user.name)}`;
  const h = (s) => s.split("").reduce((a, c) => (a << 5) - a + c.charCodeAt(0) | 0, 0);
  const cells = Array.from({ length: 21 * 21 }, (_, i) => Math.abs(h(q + i)) % 3 !== 0);
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 40 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800 } }, "My QR Code")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 28, display: "inline-block", border: `1.5px solid ${C.accent}44` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(21,11px)", gap: 1, margin: "0 auto" } }, cells.map((f, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { width: 11, height: 11, background: f ? C.text : "transparent", borderRadius: 1 } })))), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 20, fontWeight: 800, marginTop: 20 } }, user.name), /* @__PURE__ */ React.createElement("p", { style: { color: C.accent, marginTop: 4, fontSize: 14 } }, user.vpa), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12, marginTop: 4 } }, "Scan to pay via RenoPay / UPI"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 22 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: onBack }, "\u2190 Back"))));
};
const ScanScreen = ({ onBack, onSuccess }) => {
  const [vpa, setVpa] = useState("");
  const [err, setErr] = useState("");
  const [mode, setMode] = useState("ar");
  const [phoneInput, setPhoneInput] = useState("");
  const [arPhase, setArPhase] = useState("scanning");
  const [coins, setCoins] = useState([]);
  useEffect(() => {
    const c = Array.from({ length: 6 }, (_, i) => ({ id: i, x: Math.random() * 80 + 10, delay: i * 0.4, size: 16 + Math.random() * 10 }));
    setCoins(c);
    setTimeout(() => setArPhase("locked"), 2e3);
    setTimeout(() => setArPhase("confirmed"), 3800);
  }, []);
  const submit = () => {
    if (mode === "vpa") {
      if (!vpa.includes("@")) {
        setErr("Enter valid VPA");
        return;
      }
      onSuccess(vpa);
    } else if (mode === "phone") {
      const u = MockBackend.getUser(phoneInput);
      if (!u) {
        setErr("Phone not found");
        return;
      }
      onSuccess(u.vpa);
    } else {
      onSuccess("praveen@renopay");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 40 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800 } }, "Scan & Pay"), /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto" } }, /* @__PURE__ */ React.createElement(Badge, { color: C.teal, size: 10 }, "\u26A1 AR Mode"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 260, borderRadius: 20, overflow: "hidden", marginBottom: 16, background: "#050510", border: `2px solid ${arPhase === "confirmed" ? C.success : arPhase === "locked" ? C.warn : C.accent}55`, transition: "border-color .4s" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg,${C.accent}06 0px,transparent 1px,transparent 30px),repeating-linear-gradient(90deg,${C.accent}06 0px,transparent 1px,transparent 30px)` } }), coins.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.id, style: { position: "absolute", left: `${c.x}%`, bottom: -20, fontSize: c.size, animation: `arCoin 2s ${c.delay}s ease-in infinite`, opacity: 0.7 } }, "\u{1FA99}")), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg,transparent,${C.teal},transparent)`, animation: "arScan 2s ease-in-out infinite" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 120, height: 120, border: `2px solid ${arPhase === "confirmed" ? C.success : arPhase === "locked" ? C.warn : C.accent}`, borderRadius: 16, animation: "arLock 1.5s ease infinite", transition: "border-color .4s" } }, [{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 }].map((pos, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { position: "absolute", ...pos, width: 20, height: 20, borderTop: i < 2 ? `3px solid ${arPhase === "confirmed" ? C.success : C.accent}` : "none", borderBottom: i >= 2 ? `3px solid ${arPhase === "confirmed" ? C.success : C.accent}` : "none", borderLeft: i % 2 === 0 ? `3px solid ${arPhase === "confirmed" ? C.success : C.accent}` : "none", borderRight: i % 2 === 1 ? `3px solid ${arPhase === "confirmed" ? C.success : C.accent}` : "none", transition: "border-color .4s" } })), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 26 } }, arPhase === "confirmed" ? "\u2705" : arPhase === "locked" ? "\u{1F512}" : "\u{1F4F7}"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: 700, color: arPhase === "confirmed" ? C.success : arPhase === "locked" ? C.warn : C.accent } }, arPhase === "confirmed" ? "READY" : "SCANNING"))), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement(Badge, { color: arPhase === "confirmed" ? C.success : arPhase === "locked" ? C.warn : C.accent, size: 9 }, arPhase === "confirmed" ? "\u2713 QR LOCKED" : "\u2300 SCANNING"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: C.muted, fontFamily: "'Space Mono',monospace" } }, "RenoPay AR v2")), arPhase === "confirmed" && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center" } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.success, fontSize: 12, fontWeight: 700, animation: "fadeIn .3s ease" } }, "\u{1F3AF} praveen@renopay \xB7 Ready to Pay"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 14 } }, [["ar", "AR Scan"], ["vpa", "UPI ID"], ["phone", "Phone"]].map(([v, l]) => /* @__PURE__ */ React.createElement("button", { key: v, className: "btn", onClick: () => setMode(v), style: { flex: 1, padding: "8px 0", borderRadius: 10, background: mode === v ? C.accent : C.card, color: mode === v ? "#fff" : C.muted, border: `1px solid ${mode === v ? C.accent : C.border}`, fontSize: 11, fontWeight: 600 } }, l))), mode === "ar" && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 14, border: `1px solid ${C.teal}33`, textAlign: "center" } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12 } }, "AR Demo: Simulates scanning ", /* @__PURE__ */ React.createElement("strong", { style: { color: C.accent } }, "praveen@renopay"))), mode === "vpa" && /* @__PURE__ */ React.createElement("input", { placeholder: "praveen@renopay", value: vpa, onChange: (e) => setVpa(e.target.value), style: { marginBottom: 10 } }), mode === "phone" && /* @__PURE__ */ React.createElement("input", { type: "tel", maxLength: 10, placeholder: "9279228575", value: phoneInput, onChange: (e) => setPhoneInput(e.target.value.replace(/\D/, "")), style: { marginBottom: 10 } }), err && /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontSize: 12, marginBottom: 10 } }, err), /* @__PURE__ */ React.createElement(Btn, { onClick: submit, disabled: mode === "ar" && arPhase !== "confirmed" }, mode === "ar" && arPhase !== "confirmed" ? "Scanning..." : "Pay Now \u2192")));
};
const ExpensesScreen = ({ phone, onBack }) => {
  const [txns, setTxns] = useState([]);
  const [period, setPeriod] = useState("month");
  const [selCat, setSelCat] = useState(null);
  useEffect(() => {
    const uid = DatabaseService.getUserByPhone(phone)?.user_id;
    const iv = setInterval(() => setTxns(uid ? DatabaseService.getTransactionsForUser(uid) : []), 500);
    return () => clearInterval(iv);
  }, [phone]);
  const cutoff = period === "week" ? Date.now() - 6048e5 : period === "month" ? Date.now() - 2592e6 : 0;
  const debits = txns.filter((t) => t.type === "debit" && t.timestamp >= cutoff);
  const credits = txns.filter((t) => t.type === "credit" && t.timestamp >= cutoff);
  const totalSpent = debits.reduce((s, t) => s + t.amount, 0);
  const totalIn = credits.reduce((s, t) => s + t.amount, 0);
  const BUDGET = 15e3;
  const bpct = Math.min(100, totalSpent / BUDGET * 100);
  const catMap = {};
  debits.forEach((t) => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });
  const catList = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const maxAmt = catList[0]?.[1] || 1;
  const displayed = (selCat ? debits.filter((t) => t.category === selCat) : debits).slice(0, 25);
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800 } }, "Expense Tracker")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px", display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, [["week", "Week"], ["month", "Month"], ["all", "All"]].map(([v, l]) => /* @__PURE__ */ React.createElement("button", { key: v, className: "btn", onClick: () => setPeriod(v), style: { flex: 1, padding: "8px 0", borderRadius: 10, background: period === v ? C.accent : C.card, color: period === v ? "#fff" : C.muted, border: `1px solid ${period === v ? C.accent : C.border}`, fontSize: 12, fontWeight: 600 } }, l))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, border: `1px solid ${C.danger}33` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10, letterSpacing: 1, fontWeight: 600 } }, "TOTAL SPENT"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontSize: 20, fontWeight: 700, color: C.danger, marginTop: 6 } }, fmt(totalSpent)), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10, marginTop: 4 } }, debits.length, " txns")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, border: `1px solid ${C.success}33` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10, letterSpacing: 1, fontWeight: 600 } }, "INCOME"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontSize: 20, fontWeight: 700, color: C.success, marginTop: 6 } }, fmt(totalIn)), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10, marginTop: 4 } }, "Net: ", fmt(totalIn - totalSpent)))), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, fontWeight: 700 } }, "Monthly Budget"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontSize: 11, color: bpct > 80 ? C.danger : bpct > 60 ? C.warn : C.teal } }, fmt(totalSpent), " / ", fmt(BUDGET))), /* @__PURE__ */ React.createElement("div", { style: { background: C.bg, borderRadius: 8, height: 10, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: `${bpct}%`, borderRadius: 8, background: bpct > 80 ? C.danger : bpct > 60 ? C.warn : C.teal, transition: "width .7s ease" } })), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, marginTop: 8 } }, bpct > 80 ? "\u{1F6A8} Over budget soon!" : bpct > 60 ? "\u26A0 Moderate" : "\u2705 On track", " \xB7 ", (100 - bpct).toFixed(0), "% left")), catList.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18 } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, fontWeight: 700, marginBottom: 14 } }, "By Category ", /* @__PURE__ */ React.createElement("span", { style: { color: C.muted, fontSize: 11, fontWeight: 400 } }, "tap to filter")), catList.map(([cat, amt]) => {
    const ci = getCat(cat);
    const w = amt / maxAmt * 100;
    const p = totalSpent > 0 ? (amt / totalSpent * 100).toFixed(1) : 0;
    return /* @__PURE__ */ React.createElement("div", { key: cat, onClick: () => setSelCat(selCat === cat ? null : cat), style: { marginBottom: 14, cursor: "pointer", opacity: selCat && selCat !== cat ? 0.5 : 1 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16 } }, ci.icon), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600 } }, cat), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: C.muted } }, p, "%")), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "'Space Mono',monospace", fontSize: 11, color: ci.color, fontWeight: 700 } }, fmt(amt))), /* @__PURE__ */ React.createElement("div", { style: { background: C.bg, borderRadius: 6, height: 6, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: `${w}%`, borderRadius: 6, background: ci.color, transition: "width .6s ease" } })));
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, fontWeight: 700, marginBottom: 10 } }, selCat ? `${getCat(selCat).icon} ${selCat}` : "All Expenses"), displayed.length === 0 && /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, textAlign: "center", padding: 24 } }, "No expenses"), displayed.map((t, i) => {
    const ci = getCat(t.category);
    return /* @__PURE__ */ React.createElement("div", { key: t.txn_id, className: "card fu", style: { padding: 13, marginBottom: 8, display: "flex", alignItems: "center", gap: 11, animationDelay: `${i * 0.04}s` } }, /* @__PURE__ */ React.createElement("div", { style: { width: 38, height: 38, borderRadius: 12, background: ci.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 } }, ci.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.description), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5, marginTop: 2 } }, /* @__PURE__ */ React.createElement(TrustBadge, { score: t.trust_score || 95 }), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10 } }, ago(t.timestamp)))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 13, color: C.danger } }, "-", fmt(t.amount)), /* @__PURE__ */ React.createElement(Badge, { color: ci.color, size: 9 }, t.category)));
  }))));
};
const HistoryScreen = ({ phone, onBack, devMode }) => {
  const [txns, setTxns] = useState([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    const uid = DatabaseService.getUserByPhone(phone)?.user_id;
    const iv = setInterval(() => setTxns(uid ? DatabaseService.getTransactionsForUser(uid) : []), 500);
    return () => clearInterval(iv);
  }, [phone]);
  const shown = txns.filter((t) => filter === "all" || t.type === filter);
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800 } }, "Transactions"), devMode && /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto" } }, /* @__PURE__ */ React.createElement(Badge, { color: C.teal, size: 9 }, "\u{1F4BB} Dev Mode"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16 } }, [["all", "All"], ["debit", "Sent"], ["credit", "Received"]].map(([v, l]) => /* @__PURE__ */ React.createElement("button", { key: v, className: "btn", onClick: () => setFilter(v), style: { flex: 1, padding: "8px 0", borderRadius: 10, background: filter === v ? C.accent : C.card, color: filter === v ? "#fff" : C.muted, border: `1px solid ${filter === v ? C.accent : C.border}`, fontSize: 12, fontWeight: 600 } }, l))), devMode && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 12, marginBottom: 14, border: `1px solid ${C.teal}33`, background: `${C.teal}08` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.teal, fontSize: 12, fontWeight: 600 } }, "\u{1F4BB} Tap any transaction for T-account double entry view")), shown.length === 0 && /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, textAlign: "center", padding: 36 } }, "No transactions"), shown.map((t) => /* @__PURE__ */ React.createElement(LedgerTxnCard, { key: t.txn_id, txn: t, devMode }))));
};
const NOTES_LIST = [500, 200, 100, 50, 20, 10];
const COINS_LIST = [5, 2, 1];
const PayScreen = ({ user, phone, onBack, onSuccess, prefill }) => {
  const [step, setStep] = useState(prefill?.vpa ? "mode" : "vpa");
  const [vpa, setVpa] = useState(prefill?.vpa || "");
  const [resolvedUser, setResolvedUser] = useState(prefill?.vpa ? MockBackend.resolveVPA(prefill?.vpa) : null);
  const [payMode, setPayMode] = useState("normal");
  const [amount, setAmount] = useState(prefill?.amount?.toString() || "");
  const [desc, setDesc] = useState(prefill?.note || "");
  const [useLite, setUseLite] = useState(false);
  const [category, setCategory] = useState("Other");
  const [notes, setNotes] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [sentinResult, setSentinResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [fpState, setFpState] = useState("idle");
  const [voiceState, setVoiceState] = useState("pending");
  const [tilt, setTilt] = useState(false);
  const dragStart = useRef(null);
  const tempPin = useRef("");
  const totalNote = notes.reduce((s, n) => s + n.denom, 0);
  const finalAmt = () => payMode === "advanced" ? totalNote : Number(amount);
  useEffect(() => {
    if (prefill?.vpa && !resolvedUser) {
      const u = MockBackend.resolveVPA(prefill.vpa);
      if (u) {
        setResolvedUser(u);
        setStep(prefill.amount ? "normalAmount" : "normalAmount");
      }
    }
  }, [prefill]);
  useEffect(() => {
    if (step === "pin") {
      const h = (e) => {
        if (Math.abs(e.gamma || 0) > 25 || Math.abs(e.beta || 0) > 45) setTilt(true);
        else setTilt(false);
      };
      window.addEventListener("deviceorientation", h);
      return () => window.removeEventListener("deviceorientation", h);
    }
  }, [step]);
  useEffect(() => {
    const fa = finalAmt();
    if (fa > 2e3 && "vibrate" in navigator) {
      const interval = Math.max(200, 800 - fa / 5e3 * 400);
      const id = setInterval(() => {
        navigator.vibrate([80, 80, 80]);
      }, interval);
      return () => clearInterval(id);
    }
  }, [amount, totalNote, payMode]);
  const resolveVPAFn = () => {
    if (!vpa.includes("@")) {
      setErr("Enter valid VPA e.g. name@renopay");
      return;
    }
    const u = MockBackend.resolveVPA(vpa);
    if (!u) {
      setErr("Invalid VPA format! Use: name@renopay");
      return;
    }
    setResolvedUser(u);
    setErr("");
    setStep("mode");
  };
  const handleNoteSlide = (denom) => {
    if (!dragStart.current) dragStart.current = Date.now();
    const nn = [...notes, { denom, id: Date.now() + Math.random() }];
    setNotes(nn);
    const elapsed = Date.now() - dragStart.current;
    setSentinResult(SentinAI.analyze({ amount: nn.reduce((s, n) => s + n.denom, 0), slideTime: elapsed, noteCount: nn.length, tiltAngle: 0, phone, toVPA: vpa }));
    if ("vibrate" in navigator) navigator.vibrate(30);
  };
  const proceedToAuth = () => {
    const fa = finalAmt();
    if (!fa || fa <= 0) {
      setErr("Amount must be > 0");
      return;
    }
    setErr("");
    if (useLite && fa <= 500) {
      doPayLite();
      return;
    }
    const sr = SentinAI.analyze({ amount: fa, slideTime: null, noteCount: 0, tiltAngle: 0, phone, toVPA: vpa });
    setSentinResult(sr);
    if (fa <= 2e3 && !sr.newDevice) setStep("fingerprint");
    else {
      setVoiceState("pending");
      setStep("pin");
    }
  };
  const doPayLite = () => {
    setLoading(true);
    setTimeout(() => {
      const uid = DatabaseService.getUserByPhone(phone)?.user_id;
      const res = DatabaseService.sendMoneyLite(uid, vpa, finalAmt());
      setResult(res);
      setStep("result");
      setLoading(false);
    }, 1200);
  };
  const handleFP = () => {
    setFpState("scanning");
    if ("vibrate" in navigator) navigator.vibrate([100, 50, 200]);
    setTimeout(() => {
      setFpState("done");
      setTimeout(doPayNoPIN, 700);
    }, 1800);
  };
  const doPayNoPIN = () => {
    const fa = finalAmt();
    const sr = sentinResult || SentinAI.analyze({ amount: fa, slideTime: null, noteCount: 0, tiltAngle: 0, phone, toVPA: vpa });
    const res = MockBackend.sendMoney({ fromPhone: phone, toVPA: vpa, amount: fa, sentinAI: sr, desc: desc || "UPI Transfer", category, trustScore: sr.trustScore });
    setResult(res);
    setStep("result");
    if (res.success) onSuccess?.();
  };
  const executePay = (pin) => {
    const fa = finalAmt();
    if (fa > 2e3 && sentinResult?.riskLevel === "high") {
      tempPin.current = pin;
      setShowPrivacy(true);
      return;
    }
    doExec(pin);
  };
  const doExec = (pin) => {
    if (!MockBackend.verifyPIN(phone, pin)) {
      setErr("Wrong PIN!");
      return;
    }
    const sr = sentinResult || SentinAI.analyze({ amount: finalAmt(), slideTime: null, noteCount: 0, tiltAngle: 0, phone, toVPA: vpa });
    const res = MockBackend.sendMoney({ fromPhone: phone, toVPA: vpa, amount: finalAmt(), sentinAI: sr, desc: desc || "UPI Transfer", category, trustScore: sr.trustScore });
    setResult(res);
    setStep("result");
    if (res.success) onSuccess?.();
  };
  const fadeBig = finalAmt() >= 5e3;
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 40 } }, showPrivacy && /* @__PURE__ */ React.createElement(PrivacyModal, { onSuccess: () => {
    setShowPrivacy(false);
    doExec(tempPin.current);
  }, onCancel: () => setShowPrivacy(false) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800 } }, "Send Money"), finalAmt() > 2e3 && /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto" } }, /* @__PURE__ */ React.createElement(Badge, { color: C.warn, size: 10 }, "\u{1F493} High Value"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px" } }, step === "vpa" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 20, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 8 } }, "PAY TO (UPI ID)"), /* @__PURE__ */ React.createElement("input", { placeholder: "anyone@renopay", value: vpa, onChange: (e) => setVpa(e.target.value) }), err && /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontSize: 12, marginTop: 8 } }, err), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, marginTop: 8 } }, "Try: praveen@renopay")), /* @__PURE__ */ React.createElement(Btn, { onClick: resolveVPAFn }, "Find & Pay \u2192")), step === "mode" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 44, height: 44, borderRadius: 13, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 } }, "\u{1F464}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 15 } }, resolvedUser?.name), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12 } }, vpa))), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 8 } }, "NOTE"), /* @__PURE__ */ React.createElement("input", { placeholder: "What's this for?", value: desc, onChange: (e) => setDesc(e.target.value), style: { marginBottom: 12 } }), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 8 } }, "CATEGORY"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, CATS.filter((c) => c.id !== "Income").map((c) => /* @__PURE__ */ React.createElement("button", { key: c.id, className: "btn", onClick: () => setCategory(c.id), style: { padding: "5px 10px", borderRadius: 20, background: category === c.id ? c.color + "30" : C.bg, border: `1px solid ${category === c.id ? c.color : C.border}`, color: category === c.id ? c.color : C.muted, fontSize: 11, fontWeight: 600 } }, c.icon, " ", c.id)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn card", onClick: () => {
    setPayMode("normal");
    setStep("normalAmount");
  }, style: { padding: 20, textAlign: "left", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 28 } }, "\u26A1"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 16 } }, "Normal Pay"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12, marginTop: 3 } }, "Type amount, pay instantly"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6 } }, /* @__PURE__ */ React.createElement(Badge, { color: C.teal, size: 10 }, "\u{1F446} Fingerprint for \u20B9 \u2264 2000")))), /* @__PURE__ */ React.createElement("button", { className: "btn card", onClick: () => {
    setPayMode("advanced");
    dragStart.current = null;
    setStep("advancedPay");
  }, style: { padding: 20, textAlign: "left", border: `1.5px solid ${C.accent}55`, display: "flex", alignItems: "center", gap: 14, background: `${C.accent}0a` } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 28 } }, "\u{1F3E6}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 16, color: C.accent } }, "Advanced Pay"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12, marginTop: 3 } }, "Drag real notes & coins"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6 } }, /* @__PURE__ */ React.createElement(Badge, { color: C.accent, size: 10 }, "\u{1F6E1} SentinAI Protected")))))), step === "normalAmount" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 24, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 12 } }, "AMOUNT"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 32, color: C.accent, fontFamily: "'Space Mono',monospace" } }, "\u20B9"), /* @__PURE__ */ React.createElement("input", { type: "number", placeholder: "0", value: amount, onChange: (e) => setAmount(e.target.value), style: { fontSize: 36, fontWeight: 800, border: "none", borderBottom: `2px solid ${C.accent}`, borderRadius: 0, paddingLeft: 0, background: "transparent", fontFamily: "'Space Mono',monospace" } })), Number(amount) > 0 && Number(amount) <= 500 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 13, color: C.teal } }, "Use UPI Lite \u26A1"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10 } }, "No PIN required")), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => setUseLite(!useLite), style: { width: 44, height: 24, borderRadius: 20, background: useLite ? C.success : C.muted + "44", position: "relative", transition: ".3s" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 3, left: useLite ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: ".3s" } }))), Number(amount) > 0 && !useLite && /* @__PURE__ */ React.createElement("p", { style: { color: Number(amount) <= 2e3 ? C.teal : C.warn, fontSize: 12, marginTop: 10 } }, Number(amount) <= 2e3 ? "\u{1F446} Biometric auth" : "\u{1F510} PIN + Voice + SentinAI")), err && /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontSize: 12, marginBottom: 12 } }, err), /* @__PURE__ */ React.createElement(Btn, { onClick: proceedToAuth }, "Continue \u2192"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setStep("mode") }, "\u2190 Back"))), step === "advancedPay" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { onDragOver: (e) => {
    e.preventDefault();
    setDragOver(true);
  }, onDragLeave: () => setDragOver(false), onDrop: (e) => {
    e.preventDefault();
    setDragOver(false);
    const d = Number(e.dataTransfer.getData("denom"));
    if (d) handleNoteSlide(d);
  }, style: { marginBottom: 12, minHeight: 80, borderRadius: 16, border: `2px dashed ${dragOver ? C.accent : C.border}`, background: dragOver ? `${C.accent}10` : "transparent", padding: 14, transition: "all .2s" } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10, textAlign: "center", marginBottom: 8, letterSpacing: 1 } }, "\u2193 DROP NOTES / COINS HERE"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, minHeight: 36, alignItems: "center", justifyContent: "center" } }, notes.length === 0 && /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12 } }, "Drag from below to add"), notes.map((n) => {
    const isCoin = COINS_LIST.includes(n.denom);
    return /* @__PURE__ */ React.createElement("div", { key: n.id, onClick: () => setNotes((ns) => ns.filter((x) => x.id !== n.id)), style: { width: isCoin ? 38 : 62, height: isCoin ? 38 : 22, borderRadius: isCoin ? "50%" : 8, overflow: "hidden", cursor: "pointer", border: `1.5px solid ${C.accent}55`, display: "flex", alignItems: "center", justifyContent: "center" } }, isCoin ? /* @__PURE__ */ React.createElement(CoinSVG, { denom: n.denom }) : /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: 700, color: "#fff" } }, "\u20B9", n.denom));
  }))), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 12, textAlign: "center", border: `1px solid ${totalNote > 0 ? C.accent + "55" : C.border}` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10, letterSpacing: 1 } }, "TOTAL"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontSize: 36, fontWeight: 700, color: totalNote > 0 ? C.accent : C.muted } }, fmt(totalNote)), sentinResult && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Badge, { color: sentinResult.riskLevel === "low" ? C.success : sentinResult.riskLevel === "medium" ? C.warn : C.danger }, sentinResult.riskLevel === "low" ? "\u{1F6E1} Safe" : sentinResult.riskLevel === "medium" ? "\u26A0 Medium" : "\u{1F6A8} High Risk"), sentinResult.explanations?.length > 0 && /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 9, marginTop: 6 } }, sentinResult.explanations.join(" \xB7 ")))), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10, letterSpacing: 1, marginBottom: 8, fontWeight: 600 } }, "\u{1F4C4} NOTES \u2014 Tap or Drag"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 } }, NOTES_LIST.map((d) => /* @__PURE__ */ React.createElement("div", { key: d, draggable: true, onDragStart: (e) => {
    e.dataTransfer.setData("denom", d);
  }, onClick: () => handleNoteSlide(d), style: { animation: "noteFloat 3s ease infinite", animationDelay: `${d * 0.04}s`, cursor: "grab", userSelect: "none" } }, d === 500 ? /* @__PURE__ */ React.createElement(Note500, { fade: fadeBig && totalNote >= 5e3 }) : d === 200 ? /* @__PURE__ */ React.createElement(NoteGeneric, { denom: 200, color1: "#c07808", color2: "#805208", accent: "#ffd43b", label: "Two Hundred Rupees", fade: fadeBig && totalNote >= 5e3 }) : d === 100 ? /* @__PURE__ */ React.createElement(NoteGeneric, { denom: 100, color1: "#3a5a8a", color2: "#1e3a68", accent: "#74c0fc", label: "One Hundred Rupees", fade: fadeBig && totalNote >= 5e3 }) : d === 50 ? /* @__PURE__ */ React.createElement(NoteGeneric, { denom: 50, color1: "#b05a28", color2: "#804018", accent: "#ffa94d", label: "Fifty Rupees", fade: fadeBig && totalNote >= 5e3 }) : d === 20 ? /* @__PURE__ */ React.createElement(NoteGeneric, { denom: 20, color1: "#c02870", color2: "#801848", accent: "#f783ac", label: "Twenty Rupees", fade: fadeBig && totalNote >= 5e3 }) : /* @__PURE__ */ React.createElement(NoteGeneric, { denom: 10, color1: "#988020", color2: "#685810", accent: "#ffd43b", label: "Ten Rupees", fade: fadeBig && totalNote >= 5e3 })))), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10, letterSpacing: 1, marginBottom: 8, fontWeight: 600 } }, "\u{1FA99} COINS \u2014 Tap or Drag"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, marginBottom: 18, justifyContent: "center" } }, COINS_LIST.map((d) => /* @__PURE__ */ React.createElement("div", { key: d, draggable: true, onDragStart: (e) => {
    e.dataTransfer.setData("denom", d);
  }, onClick: () => handleNoteSlide(d), style: { width: 76, height: 76, cursor: "grab", userSelect: "none", animation: "coinFloat 2.5s ease infinite", animationDelay: `${d * 0.18}s` } }, /* @__PURE__ */ React.createElement(CoinSVG, { denom: d })))), sentinResult?.blocked && /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontSize: 12, textAlign: "center", marginBottom: 10 } }, "\u{1F6A8} SentinAI: Suspicious activity detected!"), /* @__PURE__ */ React.createElement(Btn, { onClick: proceedToAuth, disabled: totalNote <= 0 }, "Pay ", fmt(totalNote), " \u2192"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => {
    setNotes([]);
    setStep("mode");
  } }, "\u2190 Back"))), step === "fingerprint" && /* @__PURE__ */ React.createElement("div", { className: "fu", style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 20, marginBottom: 22, border: `1px solid ${C.accent}44` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12 } }, "Paying"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontSize: 32, fontWeight: 700, color: C.accent } }, fmt(finalAmt())), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12 } }, "to ", resolvedUser?.name, " \xB7 ", vpa)), /* @__PURE__ */ React.createElement(Badge, { color: C.teal }, "\u{1F6E1} Quick Pay \u2014 No PIN needed under \u20B92000"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 28, marginBottom: 22 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: handleFP, disabled: fpState !== "idle", style: { width: 110, height: 110, borderRadius: "50%", background: fpState === "done" ? `${C.success}28` : `${C.accent}20`, border: `3px solid ${fpState === "done" ? C.success : C.accent}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: 44, animation: fpState === "scanning" ? "glowPulse 1s ease infinite" : "none" } }, fpState === "done" ? "\u2705" : fpState === "scanning" ? "\u23F3" : "\u{1F446}")), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 13 } }, fpState === "done" ? "Authenticated!" : fpState === "scanning" ? "Scanning..." : "Tap fingerprint to pay"), fpState === "idle" && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20, display: "flex", flexDirection: "column", gap: 10 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setStep("pin") }, "Use UPI PIN instead \u2192"), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => setStep(payMode === "advanced" ? "advancedPay" : "normalAmount"), style: { background: "transparent", color: C.muted, fontSize: 12 } }, "\u2190 Back"))), step === "pin" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18, marginBottom: 20, textAlign: "center", border: `1px solid ${C.accent}44` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12 } }, "Paying"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontSize: 30, fontWeight: 700, color: C.accent } }, fmt(finalAmt())), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 12, marginTop: 2 } }, "to ", resolvedUser?.name, " \xB7 ", vpa), sentinResult && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement(Badge, { color: sentinResult.riskLevel === "low" ? C.success : sentinResult.riskLevel === "medium" ? C.warn : C.danger }, sentinResult.riskLevel === "low" ? "\u{1F6E1} Safe" : sentinResult.riskLevel === "medium" ? "\u26A0 Medium" : "\u{1F6A8} High Risk"), sentinResult.explanations?.map((e, i) => /* @__PURE__ */ React.createElement("p", { key: i, style: { color: C.muted, fontSize: 10, marginTop: 3 } }, e)))), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 16, border: `1px solid ${C.gold}33` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 10, fontWeight: 600 } }, "\u{1F3A4} VOICE BIOMETRICS"), voiceState === "pending" ? /* @__PURE__ */ React.createElement(VoiceAuth, { name: DatabaseService.getUserByPhone(phone)?.full_name?.split(" ")[0] || "your name", onDone: () => setVoiceState("done") }) : /* @__PURE__ */ React.createElement("p", { style: { color: C.success, textAlign: "center", fontSize: 13, padding: 8 } }, "\u2705 Voice verified")), err && /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontSize: 13, textAlign: "center", marginBottom: 12 } }, err), /* @__PURE__ */ React.createElement(PINPad, { onComplete: voiceState === "done" ? executePay : () => setErr("Please verify voice first"), label: `Enter UPI PIN \xB7 Demo: ${DatabaseService.getUserByPhone(phone)?.pin}`, shuffled: tilt }), finalAmt() <= 2e3 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20, textAlign: "center" } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => setStep("fingerprint"), style: { background: "transparent", color: C.teal, fontSize: 13, fontWeight: 600 } }, "\u{1F446} Use Fingerprint instead \u2192"))), step === "result" && result && /* @__PURE__ */ React.createElement("div", { className: "fu", style: { textAlign: "center", paddingTop: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 90, height: 90, borderRadius: "50%", background: result.success ? `${C.success}22` : `${C.danger}22`, border: `2px solid ${result.success ? C.success : C.danger}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 18px", animation: "heartbeat .6s ease" } }, result.success ? "\u2713" : "\u2717"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 26, fontWeight: 800, color: result.success ? C.success : C.danger } }, result.success ? "Payment Successful!" : "Payment Failed"), result.success ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, marginTop: 8 } }, fmt(result.txn.amount), " sent to ", resolvedUser?.name), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", color: C.muted, fontSize: 11, marginTop: 4 } }, "TXN: ", result.txn.id?.slice(-10) || "\u2014"), result.txn.round_up > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement(Badge, { color: C.gold }, "\u{1FA99} +", fmt(result.txn.round_up), " rounded up to Digital Gold!")), sentinResult && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement(TrustBadge, { score: sentinResult.trustScore || 95 }))) : /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, marginTop: 8 } }, result.error), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 28, display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "dark", onClick: onBack, style: { flex: 1 } }, "Home"), result.success && /* @__PURE__ */ React.createElement(Btn, { variant: "teal", onClick: () => {
    setStep("vpa");
    setNotes([]);
    setResult(null);
    setAmount("");
    setFpState("idle");
    setVoiceState("pending");
  }, style: { flex: 1 } }, "Pay Again")))));
};
const AddMoneyScreen = ({ phone, onBack, onSuccess }) => {
  const [step, setStep] = useState("amount");
  const [amount, setAmount] = useState("");
  const [selBank, setSelBank] = useState(null);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const DUMMY_BANKS = [{ id: "hdfc", name: "HDFC Bank", icon: "\u{1F3E6}", acc: "****4521" }, { id: "sbi", name: "State Bank of India", icon: "\u{1F3DB}", acc: "****9012" }, { id: "icici", name: "ICICI Bank", icon: "\u{1F3E2}", acc: "****7788" }, { id: "axis", name: "Axis Bank", icon: "\u{1F535}", acc: "****3344" }];
  const initiatePayment = () => {
    if (!Number(amount) || Number(amount) < 10) {
      setErr("Minimum \u20B910");
      return;
    }
    if (!selBank) {
      setErr("Select a bank");
      return;
    }
    setErr("");
    setStep("processing");
    setTimeout(() => {
      const success = Math.random() > 0.1;
      if (success) {
        const res = DatabaseService.addMoney(phone, Number(amount), selBank.name);
        setResult(res);
        setStep("done");
        onSuccess?.();
      } else {
        setStep("failed");
      }
    }, 2500);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 40 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800 } }, "Add Money"), /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto" } }, /* @__PURE__ */ React.createElement(Badge, { color: C.accent, size: 10 }, "\u{1F3E6} Razorpay"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px" } }, step === "amount" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 24, marginBottom: 20, border: `1px solid ${C.accent}33` } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 12 } }, "AMOUNT TO ADD"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 32, color: C.accent, fontFamily: "'Space Mono',monospace" } }, "\u20B9"), /* @__PURE__ */ React.createElement("input", { type: "number", placeholder: "0", value: amount, onChange: (e) => setAmount(e.target.value), style: { fontSize: 36, fontWeight: 800, border: "none", borderBottom: `2px solid ${C.accent}`, borderRadius: 0, paddingLeft: 0, background: "transparent", fontFamily: "'Space Mono',monospace" } })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" } }, [500, 1e3, 2e3, 5e3].map((v) => /* @__PURE__ */ React.createElement("button", { key: v, className: "btn", onClick: () => setAmount(String(v)), style: { padding: "6px 14px", borderRadius: 20, background: amount == String(v) ? C.accent : C.surf, color: amount == String(v) ? "#fff" : C.muted, border: `1px solid ${amount == String(v) ? C.accent : C.border}`, fontSize: 12, fontWeight: 600, flex: "none" } }, "\u20B9", v.toLocaleString("en-IN"))))), err && /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontSize: 12, marginBottom: 12 } }, err), /* @__PURE__ */ React.createElement(Btn, { onClick: () => {
    if (!Number(amount) || Number(amount) < 10) {
      setErr("Min \u20B910");
      return;
    }
    setErr("");
    setStep("bank");
  } }, "Select Bank \u2192")), step === "bank" && /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11 } }, "Adding ", /* @__PURE__ */ React.createElement("strong", { style: { color: C.accent } }, fmt(Number(amount))), " via Razorpay")), DUMMY_BANKS.map((b) => /* @__PURE__ */ React.createElement("div", { key: b.id, onClick: () => setSelBank(b), className: "card", style: { padding: 16, marginBottom: 10, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: `1.5px solid ${selBank?.id === b.id ? C.accent : C.border}`, background: selBank?.id === b.id ? `${C.accent}0a` : C.card } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 28 } }, b.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 14 } }, b.name), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11 } }, "A/c ", b.acc)), selBank?.id === b.id && /* @__PURE__ */ React.createElement("span", { style: { color: C.accent, fontSize: 18 } }, "\u2713"))), err && /* @__PURE__ */ React.createElement("p", { style: { color: C.danger, fontSize: 12, marginBottom: 12 } }, err), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, display: "flex", flexDirection: "column", gap: 10 } }, /* @__PURE__ */ React.createElement(Btn, { onClick: initiatePayment, disabled: !selBank }, "Pay ", fmt(Number(amount)), " \u2192"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setStep("amount") }, "\u2190 Change Amount"))), step === "processing" && /* @__PURE__ */ React.createElement("div", { className: "fu", style: { textAlign: "center", paddingTop: 40 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 90, height: 90, borderRadius: "50%", background: `${C.accent}18`, border: `2px solid ${C.accent}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, margin: "0 auto 20px", animation: "glowPulse 1s ease infinite" } }, "\u23F3"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800, color: C.accent } }, "Processing..."), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, marginTop: 8 } }, "Connecting to ", selBank?.name)), step === "done" && result && /* @__PURE__ */ React.createElement("div", { className: "fu", style: { textAlign: "center", paddingTop: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 90, height: 90, borderRadius: "50%", background: `${C.success}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, margin: "0 auto 20px", animation: "heartbeat .6s ease" } }, "\u2705"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 24, fontWeight: 800, color: C.success } }, "Money Added!"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, marginTop: 8 } }, fmt(Number(amount)), " via ", selBank?.name), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginTop: 20, marginBottom: 20, border: `1px solid ${C.success}33`, textAlign: "left" } }, [{ l: "Amount", v: fmt(Number(amount)), c: C.success }, { l: "New Balance", v: fmt(result.newBalance), c: C.teal }, { l: "Status", v: "\u2705 Success", c: C.success }].map((r) => /* @__PURE__ */ React.createElement("div", { key: r.l, style: { display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.muted, fontSize: 12 } }, r.l), /* @__PURE__ */ React.createElement("span", { style: { color: r.c, fontSize: 12, fontWeight: 600 } }, r.v)))), /* @__PURE__ */ React.createElement(Btn, { variant: "teal", onClick: onBack }, "\u2190 Back to Home")), step === "failed" && /* @__PURE__ */ React.createElement("div", { className: "fu", style: { textAlign: "center", paddingTop: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 90, height: 90, borderRadius: "50%", background: `${C.danger}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, margin: "0 auto 20px", animation: "shake .4s ease" } }, "\u274C"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800, color: C.danger } }, "Payment Failed"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, marginTop: 8 } }, "Bank declined. Try again!"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 20 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "dark", onClick: onBack, style: { flex: 1 } }, "Home"), /* @__PURE__ */ React.createElement(Btn, { onClick: () => setStep("bank"), style: { flex: 1 } }, "Try Again")))));
};
const ProfileScreen = ({ user, phone, onBack, onLogout, onAvatarChange, devMode, onToggleDevMode }) => {
  const getLive = () => {
    const u = DatabaseService.getUserByPhone(phone);
    const acc = u ? DatabaseService.getAccountByUserId(u.user_id) : null;
    return { ...u, name: u?.full_name || "User", vpa: acc?.vpa || "", bank: acc?.linked_bank || "", balance: acc?.current_balance || 0, virtual_acc_no: acc?.virtual_acc_no, ifsc_code: acc?.ifsc_code, avatar: u?.avatar, kyc_status: u?.kyc_status || "Pending", aadhaar_ref_id: u?.aadhaar_ref_id, digital_gold: acc?.digital_gold || 0, round_up_enabled: acc?.round_up_enabled || false };
  };
  const [live, setLive] = useState(getLive);
  const fileRef = useRef();
  useEffect(() => {
    const iv = setInterval(() => setLive(getLive()), 1e3);
    return () => clearInterval(iv);
  }, [phone]);
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const uid = DB._phoneToUserId[phone];
      if (uid) DB.users[uid].avatar = ev.target.result;
      setLive(getLive());
      onAvatarChange();
    };
    reader.readAsDataURL(file);
  };
  const toggleRoundUp = () => {
    const uid = DB._phoneToUserId[phone];
    const acc = DatabaseService.getAccountByUserId(uid);
    if (acc) acc.round_up_enabled = !acc.round_up_enabled;
    setLive(getLive());
  };
  const kycCol = live.kyc_status === "Verified" ? C.success : live.kyc_status === "Rejected" ? C.danger : C.warn;
  const isTrusted = DatabaseService.isDeviceTrusted(phone);
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onBack, style: { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "9px 14px", fontSize: 16 } }, "\u2190"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800 } }, "Profile")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px" } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 28, marginBottom: 14, textAlign: "center", border: `1.5px solid ${C.accent}33` } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 80, height: 80, margin: "0 auto 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: `2.5px solid ${C.accent}55`, cursor: "pointer" }, onClick: () => fileRef.current.click() }, live.avatar ? /* @__PURE__ */ React.createElement("img", { src: live.avatar, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("div", { style: { width: "100%", height: "100%", background: `linear-gradient(135deg,${C.accent},#c0143a)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800 } }, live.name[0])), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 0, right: -4, width: 26, height: 26, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer", border: `2px solid ${C.bg}` }, onClick: () => fileRef.current.click() }, "\u{1F4F7}")), /* @__PURE__ */ React.createElement("input", { ref: fileRef, type: "file", accept: "image/*", style: { display: "none" }, onChange: handlePhoto }), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 22, fontWeight: 800 } }, live.name), /* @__PURE__ */ React.createElement("p", { style: { color: C.accent, marginTop: 3, fontSize: 14 } }, live.vpa), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Badge, { color: C.success }, "\u{1F6E1} SentinAI Active"), /* @__PURE__ */ React.createElement(Badge, { color: kycCol }, live.kyc_status === "Verified" ? "\u2705" : "\u23F3", " KYC ", live.kyc_status), /* @__PURE__ */ React.createElement(Badge, { color: isTrusted ? C.teal : C.danger, size: 9 }, isTrusted ? "\u{1F512} Trusted Device" : "\u26A0 New Device"))), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 14, border: `1px solid ${devMode ? C.teal + "55" : C.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 14 } }, "\u{1F4BB} Developer Mode"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, marginTop: 2 } }, "Double-entry ledger \xB7 T-accounts view")), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: onToggleDevMode, style: { width: 52, height: 28, borderRadius: 14, background: devMode ? C.teal : `${C.muted}44`, border: "none", position: "relative", transition: "background .3s" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 3, left: devMode ? 26 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left .3s", boxShadow: "0 1px 4px rgba(0,0,0,.3)" } })))), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 14, border: `1px solid ${live.round_up_enabled ? C.gold + "55" : C.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 14 } }, "\u{1FA99} Round-Up to Digital Gold"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, marginTop: 2 } }, "Auto-invest spare change \xB7 Vault: ", fmt(live.digital_gold))), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: toggleRoundUp, style: { width: 52, height: 28, borderRadius: 14, background: live.round_up_enabled ? C.gold : `${C.muted}44`, border: "none", position: "relative", transition: "background .3s" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 3, left: live.round_up_enabled ? 26 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left .3s", boxShadow: "0 1px 4px rgba(0,0,0,.3)" } })))), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10, letterSpacing: 1, fontWeight: 600, marginBottom: 12 } }, "\u{1FAAA} KYC & VIRTUAL ACCOUNT"), [{ label: "KYC Status", value: `${live.kyc_status === "Verified" ? "\u2705" : "\u23F3"} ${live.kyc_status}`, col: kycCol }, { label: "Virtual A/c", value: live.virtual_acc_no ? maskAccNo(live.virtual_acc_no) : "\u2014", col: C.text }, { label: "IFSC", value: live.ifsc_code || "\u2014", col: C.text }, { label: "Device", value: isTrusted ? "\u{1F512} Trusted" : "\u26A0 New", col: isTrusted ? C.success : C.warn }].map((r) => /* @__PURE__ */ React.createElement("div", { key: r.label, style: { display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` } }, /* @__PURE__ */ React.createElement("span", { style: { color: C.muted, fontSize: 12 } }, r.label), /* @__PURE__ */ React.createElement("span", { style: { color: r.col, fontSize: 12, fontWeight: 600 } }, r.value)))), [{ label: "Mobile", value: "+91 " + phone }, { label: "Bank Account", value: live.bank }, { label: "Balance", value: fmt(live.balance) }, { label: "Digital Gold", value: fmt(live.digital_gold) }, { label: "Privacy Code", value: "\u2022\u2022\u2022\u2022 (Demo: 7890)" }].map((r) => /* @__PURE__ */ React.createElement("div", { key: r.label, className: "card", style: { padding: 15, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 13 } }, r.label), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, fontWeight: 600 } }, r.value))), !isTrusted && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "teal", onClick: () => {
    DatabaseService.trustDevice(phone);
    setLive(getLive());
  } }, "Trust This Device")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "danger", onClick: onLogout }, "Logout"))));
};
const HomeScreen = ({ user, phone, onNavigate }) => {
  const [show, setShow] = useState(false);
  const [live, setLive] = useState(null);
  const [prediction, setPrediction] = useState(null);
  if (!user) {
    return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", background: `linear-gradient(180deg,rgba(224,41,74,0.12) 0%,transparent 100%)` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 2, fontWeight: 600 } }, "WELCOME TO"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 26, fontWeight: 800, marginTop: 2 } }, "RenoPay \u{1F44B}")), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => onNavigate("login"), style: { width: 46, height: 46, borderRadius: "50%", background: `${C.accent}22`, border: `2px solid ${C.accent}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 } }, "\u{1F464}"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px" } }, /* @__PURE__ */ React.createElement("div", { className: "card fu", style: { padding: 30, textAlign: "center", border: `1.5px solid ${C.accent}55`, background: `linear-gradient(180deg, ${C.accent}11 0%, transparent 100%)`, marginTop: 20 } }, /* @__PURE__ */ React.createElement(RenoPayLogo, { size: 80, animate: true }), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 18, fontWeight: 700, marginBottom: 8, marginTop: 16 } }, "Unlock RenoPay"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 13, marginBottom: 20 } }, "Login to access your wallet, SentinAI security, and advanced payments."), /* @__PURE__ */ React.createElement(Btn, { onClick: () => onNavigate("login") }, "Login / Register \u2192")), /* @__PURE__ */ React.createElement("div", { style: { opacity: 0.4, pointerEvents: "none", filter: "grayscale(1)", marginTop: 20 } }, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 14, marginBottom: 10 } }, "Quick Actions (Locked)"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 } }, [{ icon: "\u{1F4B8}", l: "Pay" }, { icon: "\u{1F48C}", l: "Request" }, { icon: "\u2702\uFE0F", l: "Split" }, { icon: "\u{1F4CB}", l: "Subs" }, { icon: "\u{1F5FA}\uFE0F", l: "Goals" }].map((a, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "card", style: { padding: "12px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, a.icon), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: C.muted, fontWeight: 600 } }, a.l)))))));
  }
  const getLiveData = useCallback(() => {
    const u = DatabaseService.getUserByPhone(phone);
    const acc = u ? DatabaseService.getAccountByUserId(u.user_id) : null;
    const txns = u ? DatabaseService.getTransactionsForUser(u.user_id) : [];
    return { ...u, name: u?.full_name || "User", balance: acc?.current_balance || 0, vpa: acc?.vpa || "", bank: acc?.linked_bank || "", avatar: u?.avatar, transactions: txns, digital_gold: acc?.digital_gold || 0, round_up_vault: acc?.round_up_vault || 0, upi_lite_balance: acc?.upi_lite_balance || 0 };
  }, [phone]);
  useEffect(() => {
    setLive(getLiveData());
    const iv = setInterval(() => {
      const data = getLiveData();
      setLive(data);
      setPrediction(SentinAI.predictBudget(data.user_id, data.balance));
    }, 1e3);
    return () => clearInterval(iv);
  }, [getLiveData]);
  if (!live) return null;
  const debitTxns = (live.transactions || []).filter((t) => t.type === "debit" && Date.now() - t.timestamp < 2592e6);
  const spent = debitTxns.reduce((s, t) => s + t.amount, 0);
  const BUDGET = 15e3;
  const budgetPct = Math.min(100, spent / BUDGET * 100);
  const spendScore = Math.min(100, Math.floor(spent / BUDGET * 60 + debitTxns.length * 3));
  const recent = (live.transactions || []).slice(0, 3);
  const pendingRequests = DatabaseService.getRequestsForUser(live.user_id || "uuid-u1").filter((r) => r.status === "pending" && r.to_vpa === live.vpa).length;
  const unscratched = DatabaseService.getScratchCards(live.user_id || "uuid-u1").filter((c) => !c.scratched).length;
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: C.bg, paddingBottom: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 22px 18px", background: `linear-gradient(180deg,rgba(224,41,74,0.1) 0%,transparent 100%)` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, letterSpacing: 2, fontWeight: 600 } }, "GOOD DAY,"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 26, fontWeight: 800, marginTop: 2 } }, live.name.split(" ")[0], " \u{1F44B}")), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => onNavigate("profile"), style: { width: 46, height: 46, borderRadius: "50%", overflow: "hidden", border: `2px solid ${C.accent}55`, padding: 0 } }, live.avatar ? /* @__PURE__ */ React.createElement("img", { src: live.avatar, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("div", { style: { width: "100%", height: "100%", background: `linear-gradient(135deg,${C.accent},#c0143a)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 } }, live.name[0])))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px", display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(LiquidCard, { balance: live.balance, vpa: live.vpa, bank: live.bank, show, onToggle: () => setShow((s) => !s), phone }), /* @__PURE__ */ React.createElement(UPILiteCard, { balance: live.upi_lite_balance, onNavigate: () => onNavigate("upilite") }), /* @__PURE__ */ React.createElement(BudgetPredictionCard, { data: prediction }), live.digital_gold > 0 && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "12px 18px", border: `1px solid ${C.gold}44`, background: `${C.gold}08`, display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 22 } }, "\u{1FA99}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 700, fontSize: 13, color: C.gold } }, "Digital Gold Vault"), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10 } }, "Round-up savings"))), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontSize: 16, fontWeight: 700, color: C.gold } }, fmt(live.digital_gold))), /* @__PURE__ */ React.createElement(HeartbeatGauge, { spendScore }), (pendingRequests > 0 || unscratched > 0) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, pendingRequests > 0 && /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => onNavigate("requests"), style: { flex: 1, padding: "10px 14px", borderRadius: 12, background: `${C.warn}15`, border: `1px solid ${C.warn}44`, color: C.warn, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", null, "\u{1F48C}"), pendingRequests, " Money Request", pendingRequests > 1 ? "s" : ""), unscratched > 0 && /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => onNavigate("rewards"), style: { flex: 1, padding: "10px 14px", borderRadius: 12, background: `${C.gold}15`, border: `1px solid ${C.gold}44`, color: C.gold, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", null, "\u{1F3B0}"), unscratched, " Scratch Card", unscratched > 1 ? "s" : "")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 18, border: `1px solid ${budgetPct > 80 ? C.danger : C.border}33` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, fontWeight: 700 } }, "Monthly Budget"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontSize: 11, color: budgetPct > 80 ? C.danger : budgetPct > 60 ? C.warn : C.teal } }, fmt(spent), " / ", fmt(BUDGET))), /* @__PURE__ */ React.createElement("div", { style: { background: C.bg, borderRadius: 8, height: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: `${budgetPct}%`, borderRadius: 8, background: budgetPct > 80 ? C.danger : budgetPct > 60 ? C.warn : C.teal, transition: "width .8s ease" } })), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 11, marginTop: 7 } }, budgetPct > 80 ? "\u26A0 Approaching limit!" : budgetPct > 60 ? "\u{1F4CA} Moderate spending" : "\u2705 On track", " \xB7 ", (100 - budgetPct).toFixed(0), "% remaining")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 } }, [{ icon: "\u{1F4B8}", l: "Pay", s: "pay" }, { icon: "\u{1F48C}", l: "Request", s: "requests" }, { icon: "\u2702\uFE0F", l: "Split", s: "split" }, { icon: "\u{1F4CB}", l: "Subs", s: "subscriptions" }, { icon: "\u{1F5FA}\uFE0F", l: "Goals", s: "savings" }].map((a) => /* @__PURE__ */ React.createElement("button", { key: a.s, className: "btn card", onClick: () => onNavigate(a.s), style: { padding: "12px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, a.icon), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: C.muted, fontWeight: 600 } }, a.l)))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 } }, [{ icon: "\u{1F4F7}", l: "Scan", s: "scan" }, { icon: "\u2795", l: "Add \u20B9", s: "addmoney" }, { icon: "\u{1F4CA}", l: "Tracker", s: "expenses" }, { icon: "\u{1F3B0}", l: "Rewards", s: "rewards" }, { icon: "\u{1F4CB}", l: "History", s: "history" }].map((a) => /* @__PURE__ */ React.createElement("button", { key: a.s, className: "btn card", onClick: () => onNavigate(a.s), style: { padding: "12px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, a.icon), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: C.muted, fontWeight: 600 } }, a.l)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: 700 } }, "Recent"), /* @__PURE__ */ React.createElement("button", { className: "btn", onClick: () => onNavigate("history"), style: { color: C.accent, background: "transparent", fontSize: 12, fontWeight: 600 } }, "See all \u2192")), recent.map((t, i) => {
    const ci = getCat(t.category);
    return /* @__PURE__ */ React.createElement("div", { key: t.txn_id, className: "card fu", style: { padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12, animationDelay: `${i * 0.06}s` } }, /* @__PURE__ */ React.createElement("div", { style: { width: 42, height: 42, borderRadius: 13, background: ci.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 } }, ci.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("p", { style: { fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.description), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 3 } }, /* @__PURE__ */ React.createElement(TrustBadge, { score: t.trust_score || 95 }), /* @__PURE__ */ React.createElement("p", { style: { color: C.muted, fontSize: 10 } }, ago(t.timestamp)), t.round_up && /* @__PURE__ */ React.createElement(Badge, { color: C.gold, size: 9 }, "+", fmt(t.round_up), " gold"))), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 13, color: t.type === "credit" ? C.success : C.danger, flexShrink: 0 } }, t.type === "credit" ? "+" : "-", fmt(t.amount)));
  }))));
};
const Nav = ({ active, onNavigate }) => /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", bottom: 0, left: 0, right: 0, background: `rgba(22,11,18,0.95)`, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", padding: "10px 0 18px", zIndex: 100, backdropFilter: "blur(24px)" } }, [{ id: "home", icon: "\u{1F3E0}", l: "Home" }, { id: "pay", icon: "\u{1F4B8}", l: "Pay" }, { id: "expenses", icon: "\u{1F4CA}", l: "Tracker" }, { id: "history", icon: "\u{1F4CB}", l: "History" }, { id: "profile", icon: "\u{1F464}", l: "Profile" }].map((n) => /* @__PURE__ */ React.createElement("button", { key: n.id, className: "btn", onClick: () => onNavigate(n.id), style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "transparent", color: active === n.id ? C.accent : C.muted, minWidth: 54, position: "relative" } }, active === n.id && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", width: 26, height: 3, borderRadius: 2, background: C.accent, boxShadow: `0 0 8px ${C.accent}` } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: n.id === "pay" ? 26 : 20, filter: active === n.id ? `drop-shadow(0 0 8px ${C.accent})` : "none", transition: "filter .2s" } }, n.icon), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: active === n.id ? 700 : 400, letterSpacing: 0.4 } }, n.l))));
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState(null);
  const [payData, setPayData] = useState(null);
  const [tab, setTab] = useState("home");
  const [_refresh, setRefresh] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const login = (u, p) => {
    setUser(u);
    setPhone(p);
    setScreen("home");
  };
  const logout = () => {
    setUser(null);
    setPhone(null);
    setScreen("home");
  };
  const go = (s, data) => {
    if (!user && s !== "home" && s !== "login") {
      setScreen("login");
      return;
    }
    if (["home", "pay", "expenses", "history", "profile"].includes(s)) setTab(s);
    if (data) setPayData(data);
    else if (s !== "pay") setPayData(null);
    setScreen(s);
  };
  if (screen === "splash") return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(GS, null), /* @__PURE__ */ React.createElement(SplashScreen, { onNext: () => go("home") }));
  if (screen === "login") return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(GS, null), /* @__PURE__ */ React.createElement(LoginScreen, { onLogin: login, onBack: () => go("home") }));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(GS, null), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 430, margin: "0 auto", position: "relative" } }, screen === "home" && /* @__PURE__ */ React.createElement(HomeScreen, { user, phone, onNavigate: go }), screen === "pay" && /* @__PURE__ */ React.createElement(PayScreen, { user, phone, onBack: () => go("home"), onSuccess: () => {
  }, prefill: payData }), screen === "expenses" && /* @__PURE__ */ React.createElement(ExpensesScreen, { phone, onBack: () => go("home") }), screen === "history" && /* @__PURE__ */ React.createElement(HistoryScreen, { phone, onBack: () => go("home"), devMode }), screen === "addmoney" && /* @__PURE__ */ React.createElement(AddMoneyScreen, { phone, onBack: () => go("home"), onSuccess: () => {
  } }), screen === "qr" && /* @__PURE__ */ React.createElement(QRScreen, { user, onBack: () => go("home") }), screen === "scan" && /* @__PURE__ */ React.createElement(ScanScreen, { onBack: () => go("home"), onSuccess: (v) => go("pay", { vpa: v }) }), screen === "profile" && /* @__PURE__ */ React.createElement(ProfileScreen, { user, phone, onBack: () => go("home"), onLogout: logout, onAvatarChange: () => setRefresh((r) => r + 1), devMode, onToggleDevMode: () => setDevMode((d) => !d) }), screen === "requests" && /* @__PURE__ */ React.createElement(RequestScreen, { user, phone, onBack: () => go("home") }), screen === "split" && /* @__PURE__ */ React.createElement(SplitScreen, { phone, onBack: () => go("home") }), screen === "subscriptions" && /* @__PURE__ */ React.createElement(MandatesScreen, { phone, onBack: () => go("home") }), screen === "upilite" && /* @__PURE__ */ React.createElement(UPILiteScreen, { phone, onBack: () => go("home") }), screen === "rewards" && /* @__PURE__ */ React.createElement(RewardsScreen, { phone, onBack: () => go("home") }), screen === "savings" && /* @__PURE__ */ React.createElement(SavingsScreen, { phone, onBack: () => go("home") }), /* @__PURE__ */ React.createElement(Nav, { active: tab, onNavigate: go })));
}
