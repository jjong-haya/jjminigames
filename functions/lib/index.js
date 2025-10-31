"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserBestOnCreate = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const logger = __importStar(require("firebase-functions/logger"));
const firestore_2 = require("firebase-functions/v2/firestore");
(0, app_1.initializeApp)();
// reaction_results 에 새 기록이 생기면, user_bests/{userId} 를 갱신한다.
exports.updateUserBestOnCreate = (0, firestore_2.onDocumentCreated)('reaction_results/{docId}', async (event) => {
    const snap = event.data;
    if (!snap)
        return; // 타입 시그니처상 undefined 가능 → 가드
    const data = snap.data();
    const { userId, ms } = data;
    if (!userId || typeof ms !== 'number') {
        logger.warn('Invalid payload on reaction_results create', { userId, ms });
        return;
    }
    const db = (0, firestore_1.getFirestore)();
    // 닉네임 가져오기 (없으면 빈 문자열)
    let username = '';
    try {
        const profileSnap = await db.collection('profiles').doc(userId).get();
        if (profileSnap.exists) {
            username = profileSnap.get('username') || '';
        }
    }
    catch (e) {
        logger.error('Failed to read profile', { userId, error: e.message });
    }
    const bestRef = db.collection('user_bests').doc(userId);
    const bestSnap = await bestRef.get();
    if (!bestSnap.exists) {
        await bestRef.set({
            userId,
            best_ms: ms,
            username,
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        logger.info('Created user_bests', { userId, best_ms: ms, username });
        return;
    }
    const currentBest = bestSnap.get('best_ms');
    if (typeof currentBest !== 'number' || ms < currentBest) {
        await bestRef.update({
            best_ms: ms,
            username,
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        logger.info('Updated user_bests(best_ms improved)', { userId, best_ms: ms, username });
    }
    else if (username && bestSnap.get('username') !== username) {
        await bestRef.update({
            username,
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        logger.info('Synced username in user_bests', { userId, username });
    }
});
