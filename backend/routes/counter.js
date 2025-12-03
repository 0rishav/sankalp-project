import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createCounter,
  getCounterById,
  getCounterCategories,
  getCounters,
  hardDeleteCounter,
  restoreCounter,
  softDeleteCounter,
  toggleCounterActive,
  updateCounter,
  updateCounterCategories,
  updateCounterStatus,
} from "../controllers/counter.js";

const counterRouter = express.Router();

counterRouter.post("/create", isAuthenticated, createCounter);

counterRouter.get("/all-counter", isAuthenticated, getCounters);

counterRouter.get("/:id", isAuthenticated, getCounterById);

counterRouter.put("/update/:id", isAuthenticated, updateCounter);

counterRouter.patch("/status/:id", isAuthenticated, updateCounterStatus);

counterRouter.patch("/toggle/:id", isAuthenticated, toggleCounterActive);

counterRouter.patch(
  "/categories/:id",
  isAuthenticated,
  updateCounterCategories
);

counterRouter.patch("/restore/:id", isAuthenticated, restoreCounter);

counterRouter.get(
  "/counter-wise-cat/:id",
  isAuthenticated,
  getCounterCategories
);

counterRouter.delete("/soft-delete/:id", isAuthenticated, softDeleteCounter);

counterRouter.delete("/hard-delete/:id", isAuthenticated, hardDeleteCounter);

export default counterRouter;
