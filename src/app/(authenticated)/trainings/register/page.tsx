"use client";

import { ReorderTest } from "@/modules/trainings/reorder-test";
import TrainingRegisterForm from "@/modules/trainings/training-register-form";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function TrainingRegister() {
  return <TrainingRegisterForm />;
}
