import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { acceptFriendRequest, getFriendRequests, getFriends, getOutgoingFriendReqs, getRecommendedUsers, rejectFriendrequest, sendFriendRequest } from '../controllers/user.controller.js';

const router = express.Router();

//apply auth middleware to all routes
router.use(protectRoute);

router.get('/', getRecommendedUsers);
router.get('/friends', getFriends);

router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
router.put('/friend-request/:id/reject', rejectFriendrequest);

router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendReqs);

export default router;