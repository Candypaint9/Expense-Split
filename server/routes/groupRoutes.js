import express from "express";
import { 
  createGroup,
  getUserGroups,
  getGroupDetails,
  addExpense,
  getSettlementPlan,
  settleUp,
  removeMember,
  deleteGroup
} from "../controllers/groupController.js";
import {authenticateToken} from "../middleware/authmiddleware.js";

const router = express.Router();

// All routes are protected with auth middleware
router.use(authenticateToken);

// Create a new group
router.post("/create", createGroup);

// Get single group details
router.get("/:groupId", getGroupDetails);

// Add an expense to a group
router.post("/:groupId/expense", addExpense);

// Get settlement plan for a group
router.get("/:groupId/settlement", getSettlementPlan);

// Settle up between two members
router.post("/:groupId/settle", settleUp);

// Remove a member from a group
router.put("/:groupId/remove-member", removeMember);

// Delete a group (only by creator)
router.delete("/:groupId", deleteGroup);

// Get all groups for the logged-in user
router.get("/", getUserGroups);

export default router;